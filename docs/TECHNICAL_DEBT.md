# Gulf Seismic — Technical Debt Register

> This document tracks every known piece of technical debt in the Gulf Seismic codebase. Each item includes severity, owner, remediation plan, and target phase.

---

## 1. Debt Inventory

| # | Item | Severity | Status | Owner | Target Phase |
|---|---|---|---|---|---|
| TD1 | WordPress GraphQL response → typed entity mappers not implemented | 🔴 Critical | Stubbed | CMS / Backend | Phase 1 |
| TD2 | `/api/leads` endpoint not implemented | 🔴 Critical | Missing | Backend | Phase 1 |
| TD3 | Prisma `Lead` model missing | 🔴 Critical | Missing | Backend | Phase 1 |
| TD4 | Root `layout.tsx` ships Z.ai default metadata | 🔴 Critical | Live | Frontend | Phase 1 |
| TD5 | `src/app/page.tsx` is the Z.ai scaffold, not Gulf Seismic homepage | 🔴 Critical | Live | Frontend | Phase 1 |
| TD6 | CMS credentials not provisioned (`cms.gulfseismic.com`) | 🟠 High | Pending | DevOps | Phase 1 |
| TD7 | WordPress CPTs + ACF field groups not registered on CMS | 🟠 High | Pending | CMS | Phase 1 |
| TD8 | Authority graph route tree not created (`/uae`, `/saudi-arabia`, etc.) | 🟠 High | Missing | Frontend | Phase 1 |
| TD9 | `sitemap.xml` route not created | 🟠 High | Missing | Frontend | Phase 1 |
| TD10 | `robots.txt` route not created | 🟠 High | Missing | Frontend | Phase 1 |
| TD11 | Project gallery images are stubs (no real photos) | 🟡 Medium | Pending | Content | Phase 2 |
| TD12 | Blog post body content not seeded (only excerpt + metadata) | 🟡 Medium | Pending | Content | Phase 2 |
| TD13 | CRM webhook integration not implemented | 🟡 Medium | Pending | Backend | Phase 2 |
| TD14 | Open Graph default images not generated | 🟡 Medium | Pending | Design | Phase 2 |
| TD15 | Vercel project + production env vars not configured | 🟡 Medium | Pending | DevOps | Phase 1 |
| TD16 | `next/image` not used in ProjectsShowcase (uses `<img>` for hero) | 🟡 Medium | Live | Frontend | Phase 1 |
| TD17 | No `error.tsx` / `not-found.tsx` / `loading.tsx` | 🟡 Medium | Missing | Frontend | Phase 1 |
| TD18 | No `hreflang` annotations (English-only) | 🟢 Low | Planned | Frontend | Phase 2 |
| TD19 | No `prefers-reduced-motion` support | 🟢 Low | Planned | Frontend | Phase 2 |
| TD20 | No CSP / security headers in `next.config.ts` | 🟢 Low | Planned | DevOps | Phase 1 |
| TD21 | Prisma datasource is SQLite (must be PostgreSQL for prod) | 🟠 High | Live | Backend | Phase 1 |
| TD22 | No on-demand ISR revalidation webhook endpoint | 🟢 Low | Planned | Backend | Phase 2 |
| TD23 | No sitemap submission automation (GSC API) | 🟢 Low | Planned | SEO | Phase 2 |
| TD24 | No reCAPTCHA / honeypot on LeadForm | 🟢 Low | Planned | Backend | Phase 2 |
| TD25 | No admin dashboard for leads | 🟢 Low | Planned | Frontend | Phase 3 |
| TD26 | No Arabic translation (i18n) | 🟢 Low | Planned | Frontend | Phase 2 |
| TD27 | No Google Business Profile per-city listings | 🟢 Low | Planned | SEO | Phase 2 |
| TD28 | No tender auto-import from Etimad | 🟢 Low | Planned | Backend | Phase 3 |
| TD29 | No resource / whitepaper CPT content | 🟢 Low | Planned | Content | Phase 3 |
| TD30 | No A/B testing framework | 🟢 Low | Planned | Frontend | Phase 3 |

---

## 2. Critical Debt — Detailed

### TD1 — WordPress GraphQL mappers not implemented

**Location:** `src/lib/wordpress.ts` (every public API function).

**Current state:**
```ts
export async function getCountries(): Promise<Country[]> {
  const data = await fetchGraphQL<{ countries: { nodes: unknown[] } }>(QUERIES.GetCountries);
  if (data?.countries?.nodes?.length) {
    // Map CMS shape → Country[] (left to migration; fall through to seed for now)
  }
  return countries; // always returns seed data
}
```

**Why critical:** The site currently always renders seed data — the CMS has zero effect. Without this mapper, no CMS-published content will appear.

**Remediation:**
1. Implement `mapCountries(nodes)`, `mapCities(nodes)`, `mapServices(nodes)`, `mapProjects(nodes)`, `mapCaseStudies(nodes)`, `mapBlogs(nodes)`, `mapFaqs(nodes)`.
2. Each mapper takes the WPGraphQL node shape (with `countryFields`, `cityFields`, etc.) and returns the typed entity from `gulf-data.ts`.
3. Add unit tests for each mapper.

**Target:** Phase 1, Step 3 of `MIGRATION_PLAN.md`.

---

### TD2 — `/api/leads` endpoint missing

**Location:** Should be `src/app/api/leads/route.ts`.

**Current state:** `src/app/api/route.ts` returns `{ message: "Hello, world!" }`. The `LeadForm` component `fetch("/api/leads")` will 404.

**Remediation:** Implement per `LEAD_SYSTEM.md` §3.

---

### TD3 — Prisma `Lead` model missing

**Location:** `prisma/schema.prisma`.

**Current state:** Schema defines `User` and `Post` (the original Z.ai template models).

**Remediation:**
1. Remove `User` and `Post`.
2. Add `Lead`, `LeadEvent`, `LeadStatus` enum per `LEAD_SYSTEM.md` §4.
3. Run `prisma migrate dev --name add-lead-model`.
4. Migrate `datasource` from `sqlite` to `postgresql` (see TD21).

---

### TD4 — Root `layout.tsx` ships Z.ai default metadata

**Current state:** `src/app/layout.tsx` lines 16–36 hardcode:
- `title: "Z.ai Code Scaffold - AI-Powered Development"`
- `description: "...Z.ai..."` 
- `keywords: ["Z.ai", "Next.js", "TypeScript", ...]`
- `icons.icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg"`
- `openGraph.url: "https://chat.z.ai"`

**Remediation:** Replace with Gulf Seismic org metadata per `SEO_AUDIT.md` §2.1.

---

### TD5 — `src/app/page.tsx` is Z.ai scaffold

**Current state:** Renders the Z.ai logo centred on a flex column.

**Remediation:** Compose the homepage:
```tsx
import { Hero } from "@/components/gulf/hero";
import { ServicesGrid } from "@/components/gulf/services-grid";
import { CitiesSection } from "@/components/gulf/cities-section";
import { IndustriesGrid } from "@/components/gulf/industries-grid";
import { ProjectsShowcase } from "@/components/gulf/projects-showcase";
import { AuthorityGraph } from "@/components/gulf/authority-graph";
import { ProcessSection } from "@/components/gulf/process-section";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <CitiesSection />
      <IndustriesGrid />
      <ProjectsShowcase />
      <AuthorityGraph />
      <ProcessSection />
      <LeadCtaSection />
    </>
  );
}
```

---

## 3. High-Severity Debt — Detailed

### TD6 — CMS credentials not provisioned

**Current state:** `company.graphqlEndpoint = "https://cms.gulfseismic.com/graphql"` is hard-coded, but the CMS host is not provisioned. The fetch will fail and the site will silently fall back to seed data.

**Remediation:**
1. Provision WordPress host (Kinsta / WP Engine / self-hosted VPS).
2. Point `cms.gulfseismic.com` DNS A record to host IP.
3. Install WordPress + WPGraphQL + WPGraphQL for ACF + ACF Pro + CPT UI + Yoast.
4. Generate Application Password for the API user.
5. Store credentials in Vercel env vars: `CMS_API_URL`, `CMS_API_USER`, `CMS_API_PASSWORD`.

---

### TD7 — WordPress CPTs + ACF field groups not registered

**Current state:** All registration code is documented in `WORDPRESS_DATA_MODEL.md` and `ACF_BLUEPRINT.md` but not yet applied to the live CMS.

**Remediation:**
1. Install CPT UI plugin.
2. Paste CPT registration snippets (from `WORDPRESS_DATA_MODEL.md` §3) into `functions.php` or as an MU plugin.
3. Import ACF field group JSON (from `db/acf/*.json` once exported).
4. Verify GraphQL exposure via GraphiQL at `https://cms.gulfseismic.com/graphql`.

---

### TD8 — Authority graph route tree missing

**Current state:** `src/app/` contains only `page.tsx`, `layout.tsx`, `globals.css`, and `api/route.ts`. None of the routes documented in `ROUTES.md` exist.

**Remediation:** Create all route files per `ROUTES.md` §3.

---

### TD21 — Prisma datasource is SQLite

**Current state:** `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

SQLite is fine for development but unsuitable for production (no concurrent writes, no Vercel serverless compatibility).

**Remediation:**
1. Provision Vercel Postgres (or Neon, or Supabase).
2. Update `datasource` to `postgresql`.
3. Set `DATABASE_URL` env var to the Postgres connection string.
4. Run `prisma migrate dev --name init-postgres`.
5. Run `prisma db seed` to populate any seed data.

---

## 4. Medium-Severity Debt — Detailed

### TD11 — Project gallery images are stubs

**Current state:** `Project.gallery` is an array of `{ alt, caption }` — no actual image URLs.

**Remediation:**
1. Upload real project photos to WP media library.
2. Update ACF `gallery` field to reference the uploaded images.
3. Update the GraphQL `ProjectFields.gallery` fragment to return `sourceUrl` + `altText`.
4. Update `ProjectDetail` component to render via `next/image`.

---

### TD13 — CRM webhook integration not implemented

**Current state:** `triggerCrmWebhook()` is referenced in `LEAD_SYSTEM.md` §9 but not implemented.

**Remediation:**
1. Choose CRM (HubSpot / Zoho / Salesforce).
2. Create webhook receiver in CRM.
3. Implement `src/lib/crm-webhook.ts` with HMAC signing.
4. Add `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_SECRET` env vars.

---

### TD16 — `next/image` not used in `ProjectsShowcase`

**Current state:** The hero strip in `ProjectsShowcase` uses CSS background and the `road-stripe-h` class — no `<img>` is used, but the actual project gallery is not rendered in the showcase. When the gallery is added, it must use `next/image`.

**Remediation:** Replace any future `<img>` usage with:
```tsx
import Image from "next/image";
<Image src={photo.sourceUrl} alt={photo.alt} width={800} height={450} priority={i === 0} />
```

---

## 5. Low-Severity Debt — Detailed

### TD18 — No `hreflang` annotations

**Current state:** Site is English-only.

**Remediation (Phase 2):** When Arabic translations exist, add `hreflang` alternates per `SAUDI_EXPANSION.md` §5.

### TD19 — No `prefers-reduced-motion` support

**Current state:** Framer Motion animations always run.

**Remediation:**
```tsx
import { useReducedMotion } from "framer-motion";
const reduce = useReducedMotion();
<motion.div initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} />
```

### TD20 — No CSP / security headers

**Current state:** `next.config.ts` does not set security headers.

**Remediation:**
```ts
// next.config.ts
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## 6. Remediation Sequencing

Debt items are remediated in this order (matches `MIGRATION_PLAN.md`):

| Step | Debt items | Owner |
|---|---|---|
| 1 (Prisma) | TD3, TD21 | Backend |
| 2 (Layout) | TD4, TD5 | Frontend |
| 3 (CMS) | TD6, TD7 | CMS |
| 4 (Mapper) | TD1 | Backend |
| 5 (Routes) | TD8, TD9, TD10, TD17 | Frontend |
| 6 (API) | TD2 | Backend |
| 7 (Images) | TD11, TD16 | Content / Frontend |
| 8 (Blog) | TD12 | Content |
| 9 (CRM) | TD13 | Backend |
| 10 (OG) | TD14 | Design |
| 11 (Headers) | TD20 | DevOps |
| 12 (Polish) | TD18, TD19, TD22–TD30 | Various |

---

## 7. Debt Tracking

- This file is the canonical debt register.
- Each PR that closes a debt item updates the row's Status to `Resolved` and adds a PR link.
- Quarterly review to re-prioritise items based on business impact.

---

## 8. Related Documents

- `PROJECT_AUDIT.md` — gap analysis (overlaps with this register)
- `MIGRATION_PLAN.md` — remediation sequence
- `LEAD_SYSTEM.md` — TD2, TD3, TD13 details
- `GRAPHQL_ARCHITECTURE.md` — TD1 details
