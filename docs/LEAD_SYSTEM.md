# Gulf Seismic — Lead Generation System

> The lead system captures, qualifies, routes and tracks every inbound enquiry across five funnels. Every lead is persisted to a Prisma `Lead` model with full source/campaign/city/service attribution, scored, and synced to the CRM.

This document defines the funnel architecture, the `/api/leads` endpoint, the Prisma data model, lead scoring rules, and the CRM integration path.

---

## 1. Funnel Architecture

| Funnel | Entry point | Source code | Tracking | Response SLA |
|---|---|---|---|---|
| **RFQ Funnel** | On-page `<LeadForm>` | `source=website-rfq` | Form submit → `/api/leads` → Prisma → email | 1 business hour |
| **WhatsApp Funnel** | WhatsApp FAB + CTAs | `source=whatsapp` | `wa.me` link with prefilled message + UTM | Real-time |
| **Call Funnel** | "Call" buttons in header/hero/footer | `source=phone-call` | tel: link; call tracking via Twilio (Phase 2) | Real-time |
| **Email Funnel** | "Email" CTA in `LeadCtaSection` | `source=email` | `mailto:` link; Phase 2: Gmail/Outlook tracking pixel | 2 business hours |
| **Tender Funnel** | "Tender Funnel" CTA → RFQ form | `source=tender-rfq` | Same as RFQ, but flagged `is_tender=true` | 4 business hours |

Every funnel carries forward the user's current context (country, city, service) so the lead record is fully attributed.

---

## 2. Lead Form Component

`src/components/gulf/lead-form.tsx` is a client component using `react-hook-form` + Zod:

```tsx
const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Valid phone required"),
  country: z.string(),
  city: z.string(),
  service: z.string(),
  message: z.string().min(10, "Please describe your requirement"),
});
```

### Props
```ts
interface LeadFormProps {
  defaultService?: string;       // pre-fill from page context
  defaultCountry?: CountrySlug;  // pre-fill from page context
  defaultCity?: string;          // pre-fill from page context
  source?: string;               // e.g. "homepage-cta", "service-city-cta"
  variant?: "card" | "plain";
}
```

### Submit flow
1. Client-side Zod validation.
2. `POST /api/leads` with `{ ...values, source }`.
3. On 201 → success state; on error → toast + retry.
4. The form resets after success.

---

## 3. `/api/leads` Endpoint

```ts
// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendLeadNotificationEmail } from "@/lib/email";
import { scoreLead } from "@/lib/lead-scoring";

export const dynamic = "force-dynamic";

const leadSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string(),
  city: z.string(),
  service: z.string(),
  message: z.string().min(10),
  source: z.string(),
  isTender: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 req / IP / min
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Parse + validate
  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }
  const data = parsed.data;

  // Score
  const score = scoreLead(data);

  // Persist
  const lead = await prisma.lead.create({
    data: {
      ...data,
      score,
      status: "NEW",
      clientIp: ip,
      userAgent: req.headers.get("user-agent") ?? null,
      referrer: req.headers.get("referer") ?? null,
    },
  });

  // Side-effects (fire-and-forget)
  sendLeadNotificationEmail(lead).catch(console.error);
  triggerCrmWebhook(lead).catch(console.error);

  return NextResponse.json(
    { id: lead.id, status: lead.status, expectedResponseAt: lead.expectedResponseAt },
    { status: 201 }
  );
}

// Auth-gated list endpoint (admin only)
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ leads });
}
```

---

## 4. Prisma Lead Model

```prisma
// prisma/schema.prisma
model Lead {
  id              String   @id @default(cuid())
  name            String
  company         String?
  email           String
  phone           String
  country         String   // uae | saudi-arabia
  city            String   // city slug
  service         String   // service slug
  message         String
  source          String   // website-rfq | whatsapp | phone-call | email | tender-rfq
  isTender        Boolean  @default(false)
  score           Int      @default(0)        // 0–100
  status          LeadStatus @default(NEW)
  clientIp        String?
  userAgent       String?
  referrer        String?
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?
  expectedResponseAt DateTime?
  respondedAt     DateTime?
  convertedToCustomerId String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  events          LeadEvent[]

  @@index([status, createdAt])
  @@index([city, service])
  @@index([source])
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  QUOTED
  WON
  LOST
  SPAM
}

model LeadEvent {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id], onDelete: Cascade)
  type      String   // created | called | emailed | quoted | status-changed | note
  note      String?
  actor     String?  // user email or "system"
  createdAt DateTime @default(now())

  @@index([leadId, createdAt])
}
```

---

## 5. Lead Scoring

`src/lib/lead-scoring.ts` assigns a 0–100 score based on intent signals:

| Signal | Points |
|---|---|
| `service` is high-value (airport-marking, industrial-marking) | +20 |
| `service` is medium-value (thermoplastic-road-marking, epoxy-flooring) | +15 |
| `service` is low-value (road-marking, safety-signage) | +10 |
| `city` is high-volume (Abu Dhabi, Dubai, Riyadh, Jeddah) | +15 |
| `city` is medium-volume (Sharjah, Dammam, Khobar, Jubail) | +10 |
| `city` is low-volume (Ajman, Umm Al Quwain, Yanbu) | +5 |
| `message` mentions specific area (m² or km) | +15 |
| `message` mentions specific timeline ("urgent", "this month") | +10 |
| `message` mentions tender or RFQ | +20 |
| `company` provided (not blank) | +5 |
| `email` is a business domain (not gmail/yahoo) | +10 |
| `isTender=true` | +25 |
| Source = `tender-rfq` | +10 |
| Source = `whatsapp` (high intent) | +10 |
| Source = `phone-call` (very high intent) | +15 |

**Score thresholds:**
- ≥75 → Hot (status: NEW → CONTACTED within 1 hour)
- 50–74 → Warm (status: NEW → CONTACTED within 4 hours)
- 25–49 → Cool (status: NEW → CONTACTED within 1 business day)
- <25 → Cold (status: NEW → CONTACTED within 3 business days)

---

## 6. Attribution Tracking

Every lead captures:

| Field | Source |
|---|---|
| `source` | Hard-coded per funnel (website-rfq, whatsapp, etc.) |
| `country`, `city`, `service` | From page context (form defaults) or user-selected in form |
| `utmSource`, `utmMedium`, `utmCampaign` | From URL query params (read client-side, sent in form body) |
| `referrer` | From HTTP `Referer` header |
| `clientIp` | From `x-forwarded-for` header (Vercel sets this) |
| `userAgent` | From HTTP `User-Agent` header |

### UTM capture (client-side)
```ts
// src/lib/utm.ts
export function getUtmParams() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}
```

The `LeadForm` component injects UTM params into the form body before submit.

---

## 7. WhatsApp Funnel Deep-Dive

The WhatsApp FAB (`src/components/gulf/whatsapp-fab.tsx`) opens a prefilled message:

```ts
const url = `https://wa.me/${company.whatsapp}?text=Hello%20Gulf%20Seismic,%20I%20would%20like%20a%20quote%20for%20road%20marking.`;
```

### Attribution
Because WhatsApp links open externally, we cannot capture form-submitted attribution. Instead:

1. The link URL includes UTM-like query params: `?text=...&source=whatsapp-fab&page={currentPath}`.
2. The WhatsApp Business API webhook (Phase 2) receives the inbound message and matches `source` to a lead record.
3. For Phase 1, WhatsApp leads are tracked only as aggregate conversions (click count).

### Page-specific WhatsApp links
Service-city pages pass city + service in the prefilled message:
```ts
const text = `Hello Gulf Seismic, I'd like a quote for ${serviceName} in ${cityName}.`;
const url = `https://wa.me/${country.whatsapp}?text=${encodeURIComponent(text)}`;
```

---

## 8. Email Notification

On lead creation, `sendLeadNotificationEmail(lead)` sends an HTML email to `info@gulfseismic.com`:

```
Subject: [Lead #{id}] {service} in {city} — score {score}

From: {name} <{email}>
Phone: {phone}
Company: {company}

Message:
{message}

---
Source: {source}
Page: {referrer}
UTM: {utmSource} / {utmMedium} / {utmCampaign}
Score: {score} ({hot|warm|cool|cold})
Expected response: {expectedResponseAt}

View in admin: https://gulfseismic.com/admin/leads/{id}
```

Implementation via Resend (or AWS SES):
```ts
// src/lib/email.ts
import Resend from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadNotificationEmail(lead: Lead) {
  await resend.emails.send({
    from: "Gulf Seismic Leads <leads@gulfseismic.com>",
    to: "info@gulfseismic.com",
    subject: `[Lead #${lead.id}] ${lead.service} in ${lead.city} — score ${lead.score}`,
    html: renderLeadEmailHtml(lead),
  });
}
```

---

## 9. CRM Integration

### Phase 1: Email + Manual
- Email notification → sales rep creates contact in CRM (HubSpot / Zoho) manually.
- Daily CSV export of new leads from `/api/leads?format=csv` (admin-gated).

### Phase 2: Webhook to CRM
```ts
// src/lib/crm-webhook.ts
export async function triggerCrmWebhook(lead: Lead) {
  await fetch(process.env.CRM_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": sign(lead.id, process.env.CRM_WEBHOOK_SECRET!),
    },
    body: JSON.stringify({
      event: "lead.created",
      data: {
        ...lead,
        // Map to CRM field names
        firstName: lead.name.split(" ")[0],
        lastName: lead.name.split(" ").slice(1).join(" "),
        countryCode: lead.country === "uae" ? "AE" : "SA",
      },
    }),
  });
}
```

### Phase 3: Bidirectional sync
- CRM updates `Lead.status` back to Gulf Seismic via reverse webhook.
- CRM-quoted leads sync `expectedResponseAt` and `respondedAt`.

---

## 10. Rate Limiting & Spam Protection

| Protection | Implementation |
|---|---|
| Rate limit | In-memory token bucket: 5 req / IP / min |
| Honeypot | Hidden `website` field; reject if non-empty |
| reCAPTCHA v3 (Phase 2) | Score < 0.5 → mark as `SPAM` |
| Email validation | Zod regex + MX record check (Phase 2) |
| Phone validation | E.164 normalisation (Phase 2) |

---

## 11. Admin Dashboard (Phase 2)

`/admin/leads` (auth-gated):
- List of leads with filters (status, source, city, service, score).
- Detail view with timeline of `LeadEvent` entries.
- Bulk actions: mark contacted, mark qualified, assign to rep.
- CSV export.

---

## 12. KPIs

| KPI | Target (monthly) |
|---|---|
| Total leads | ≥ 80 |
| Hot leads (score ≥75) | ≥ 20 |
| Lead → SQL conversion | ≥ 35% |
| Lead → won deal | ≥ 12% |
| Avg response time (hot) | < 1 hour |
| Avg response time (all) | < 4 hours |
| Source breakdown | RFQ 50%, WhatsApp 25%, Call 15%, Email 10% |

---

## 13. Related Documents

- `PROJECT_AUDIT.md` — gap analysis (G3, G4)
- `MIGRATION_PLAN.md` — step 1 (Prisma schema push)
- `COMPONENT_INVENTORY.md` — `LeadForm`, `LeadCtaSection`, `WhatsAppFab`
- `TECHNICAL_DEBT.md` — CRM webhook stub
