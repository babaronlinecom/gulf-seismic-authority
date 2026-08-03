# Gulf Seismic — Component Inventory

> Location: `src/components/gulf/`
> All components are production-grade, consume the typed seed/CMS data layer, and use the asphalt-charcoal + thermoplastic-amber design system.

This document inventories every React component, its props, where it is used, and its rendering mode (Server / Client).

---

## 1. Component Catalogue

| # | Component | File | Mode | Purpose |
|---|---|---|---|---|
| 1 | `Header` | `header.tsx` | Client | Sticky top navigation with services/UAE/Saudi mega-menus + mobile sheet |
| 2 | `Footer` | `footer.tsx` | Client | Site footer with services, regions, contact, certifications, city strip |
| 3 | `Hero` | `hero.tsx` | Client | Homepage hero with headline, CTA, stats card, mini authority graph |
| 4 | `PageHero` | `page-hero.tsx` | Client | Reusable page hero with eyebrow, title, description, breadcrumbs |
| 5 | `Breadcrumbs` | `breadcrumbs.tsx` | Client | Breadcrumb navigation (visible + feeds `BreadcrumbList` schema) |
| 6 | `ServicesGrid` | `services-grid.tsx` | Client | 8-service responsive grid with icon, name, short description |
| 7 | `CitiesSection` | `cities-section.tsx` | Client | Country-grouped city list with cards |
| 8 | `IndustriesGrid` | `industries-grid.tsx` | Client | 7-industry icon grid |
| 9 | `ProjectsShowcase` | `projects-showcase.tsx` | Client | Featured projects grid (6 cards) with visual header |
| 10 | `CaseStudiesSection` | `case-studies-section.tsx` | Client | 3 case study cards with quote, summary, outcomes badges |
| 11 | `FaqSection` | `faq-section.tsx` | Client | Accordion FAQ section |
| 12 | `ProcessSection` | `process-section.tsx` | Client | 5-step delivery process with icons |
| 13 | `AuthorityGraph` | `authority-graph.tsx` | Client | Visual authority graph with node counts + 128-page callout |
| 14 | `LeadForm` | `lead-form.tsx` | Client | RFQ form with Zod validation + react-hook-form |
| 15 | `LeadCtaSection` | `lead-cta-section.tsx` | Client | RFQ + WhatsApp + Call + Email + Tender funnel grid + form |
| 16 | `WhatsAppFab` | `whatsapp-fab.tsx` | Client | Floating WhatsApp button + expandable chat panel |
| 17 | `JsonLd` | `json-ld.tsx` | Server | Renders JSON-LD `<script>` tags for SEO schema |

---

## 2. Component Specifications

### 2.1 `Header`
```tsx
// No props — uses company, services, cities from gulf-data
<Header />
```

**Features:**
- Sticky top with backdrop blur
- Logo (GS monogram with road stripe accent)
- Desktop `NavigationMenu` with mega-menus:
  - Services (8 links, 2-column grid)
  - 🇦🇪 UAE (8 cities + "All UAE")
  - 🇸🇦 Saudi Arabia (8 cities + "All Saudi")
  - Projects, Industries, About
- Right actions: Call button + Get a Quote button
- Mobile `Sheet` with collapsible groups (Services, UAE, Saudi, Projects, Industries, About, Contact)

**Used in:** Root layout (every page).

---

### 2.2 `Footer`
```tsx
// No props
<Footer />
```

**Sections:**
1. Brand block: logo, description, certifications, LinkedIn + Instagram
2. Services list (8 links)
3. Regions list (2 countries + Projects/Industries/About/Contact)
4. Contact block: phone, email, address, Request a Quote CTA
5. City strip (all 16 cities linked)
6. Bottom bar: copyright, Privacy, Terms, Sitemap

**Used in:** Root layout (every page).

---

### 2.3 `Hero`
```tsx
// No props — uses company from gulf-data
<Hero />
```

**Sections:**
- Status pill ("Serving 16 cities across UAE & Saudi Arabia")
- H1 with amber accent
- Description (max ~280 chars)
- CTA buttons: "Get a Free Quote" + phone
- Trust badges: ISO 9001, 850+ Projects, UAE & Saudi
- Stats card: 4 company stats + mini authority graph preview

**Used in:** Homepage.

---

### 2.4 `PageHero`
```tsx
interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  crumbs?: Crumb[];       // from breadcrumbs.tsx
  children?: ReactNode;   // additional content (e.g. CTA buttons)
}
<PageHero eyebrow="UAE" title="Road Marking in Abu Dhabi" description="..." crumbs={[...]} />
```

**Used in:** Country, city, service, service-city, industry, project, case-study, blog, about, contact pages.

---

### 2.5 `Breadcrumbs`
```tsx
interface Crumb { name: string; url?: string; }
<Breadcrumbs items={[
  { name: "Home", url: "/" },
  { name: "UAE", url: "/uae" },
  { name: "Abu Dhabi", url: "/uae/abu-dhabi" },
  { name: "Thermoplastic Road Marking" },  // current page (no url)
]} />
```

**Used in:** Inside `PageHero`, but also usable standalone.

---

### 2.6 `ServicesGrid`
```tsx
// No props — uses services from gulf-data
<ServicesGrid />
```

Renders 8 service cards in a responsive 1/2/4-column grid. Each card has icon, name, short description, "Learn more" link.

**Used in:** Homepage.

---

### 2.7 `CitiesSection`
```tsx
// No props — uses countries + cities from gulf-data
<CitiesSection />
```

Renders two country cards (UAE + Saudi), each with 8 city links.

**Used in:** Homepage.

---

### 2.8 `IndustriesGrid`
```tsx
// No props — uses industries from gulf-data
<IndustriesGrid />
```

7 industries in a 2/3/5-column grid with icon + name + description.

**Used in:** Homepage.

---

### 2.9 `ProjectsShowcase`
```tsx
// No props — uses projects.slice(0,6)
<ProjectsShowcase />
```

6 featured projects in a 1/2/3-column grid. Each card shows:
- Visual header (road stripe + service icon + year + country flag)
- Project title
- City, duration, area (with icons)
- Challenge excerpt
- "View case study" link

**Used in:** Homepage. Will be reused on `/projects` index.

---

### 2.10 `CaseStudiesSection`
```tsx
// No props — uses caseStudies from gulf-data
<CaseStudiesSection />
```

3 case study cards. Each card shows:
- Quote icon
- Case study title
- Summary
- Testimonial block (quote, author, role)
- Outcome badges (first 2)

**Used in:** Homepage.

---

### 2.11 `FaqSection`
```tsx
interface FaqItem { question: string; answer: string; }
<FaqSection faqs={service.faqs} title="Frequently Asked Questions" />
```

Accordion with one item per FAQ. Returns `null` if `faqs.length === 0`.

**Used in:** Service detail, service-city pages.

---

### 2.12 `ProcessSection`
```tsx
// No props — uses internal STEPS array
<ProcessSection />
```

5-step process: Consult → Design → Mobilise → Execute → QC.

**Used in:** Homepage. Service-specific process is rendered inline (uses `service.process`).

---

### 2.13 `AuthorityGraph`
```tsx
// No props
<AuthorityGraph />
```

Visual representation of the authority graph with node counts:
```
2 Countries → 16 Cities → 8 Services → 7 Industries → 6 Projects → 3 Case Studies → 6 Blogs
```
Plus a 128-page callout CTA linking to `/uae/abu-dhabi/thermoplastic-road-marking`.

**Used in:** Homepage.

---

### 2.14 `LeadForm`
```tsx
interface LeadFormProps {
  defaultService?: string;
  defaultCountry?: CountrySlug;  // default "uae"
  defaultCity?: string;
  source?: string;               // default "website-rfq"
  variant?: "card" | "plain";    // default "card"
}
<LeadForm defaultService="thermoplastic-road-marking" defaultCountry="uae" defaultCity="abu-dhabi" source="service-city-cta" />
```

**Fields:** name*, company, email*, phone*, country, city, service, message*.

**Validation:** Zod schema (name ≥2, email valid, phone ≥6, message ≥10).

**Submit:** POST `/api/leads` with `{ ...values, source }`. On success → confirmation screen. On error → toast.

**Used in:** Homepage (via `LeadCtaSection`), contact page, service-city pages, project pages.

---

### 2.15 `LeadCtaSection`
```tsx
// No props — renders LeadForm with source="homepage-cta"
<LeadCtaSection />
```

Two-column section:
- Left: 4 funnel cards (WhatsApp, Call, Email, Tender) + "Why Gulf Seismic?" trust block
- Right: `<LeadForm source="homepage-cta" />`

**Used in:** Homepage. Will be reused on city, service pages.

---

### 2.16 `WhatsAppFab`
```tsx
// No props — uses company.whatsapp
<WhatsAppFab />
```

Floating button (bottom-right) that appears after 400px scroll. Expands to a chat panel with:
- WhatsApp link (prefilled message)
- Call link

**Used in:** Root layout (every page).

---

### 2.17 `JsonLd`
```tsx
// Server component
interface JsonLdProps { data: object | object[]; }
<JsonLd data={[organizationSchema(), websiteSchema()]} />
```

Renders one `<script type="application/ld+json">` per object in `data`. Must be used in Server Components only.

**Used in:** Root layout (org + website), and every dynamic page (page-specific schema).

---

## 3. Planned Components

| Component | Purpose | Status |
|---|---|---|
| `RelatedProjects` | 3 related project cards on project detail | Planned |
| `RelatedServices` | Related service cards on industry / project | Planned |
| `LocalProjects` | 1–3 city-filtered projects on service-city | Planned |
| `CitiesOfferingService` | 16 city links on service detail | Planned |
| `ServicesInCity` | 8 service-city links on city hub | Planned |
| `RelatedCaseStudies` | 3 case study cards on project / service | Planned |
| `RelatedBlogs` | 3 blog cards on service / industry / city | Planned |
| `ProjectDetail` | Full project detail body (challenge/solution/etc.) | Planned |
| `ServiceDetail` | Full service detail body | Planned |
| `CityDetail` | Full city hub body | Planned |
| `IndustryDetail` | Full industry detail body | Planned |
| `CaseStudyDetail` | Full case study body | Planned |
| `BlogCard` | Blog post card for grids | Planned |
| `BlogDetail` | Full blog post body | Planned |
| `StatsStrip` | Inline company stats row | Planned |
| `CertificationsBadges` | ISO / ICAO / OSHA badge row | Planned |

---

## 4. UI Primitives (shadcn/ui)

Located in `src/components/ui/`. Used by Gulf components:

| Primitive | Used by |
|---|---|
| `Button` | Header, Hero, LeadForm, LeadCtaSection, WhatsAppFab |
| `Input`, `Textarea`, `Label` | LeadForm |
| `Select` | LeadForm (country, city, service) |
| `Card` | ServicesGrid, ProjectsShowcase, CaseStudiesSection, IndustriesGrid, CitiesSection, ProcessSection |
| `Badge` | ProjectsShowcase, CaseStudiesSection |
| `Accordion` | FaqSection |
| `NavigationMenu` | Header |
| `Sheet` | Header (mobile) |
| `Tooltip`, `HoverCard` | (planned for various) |
| `Skeleton` | Loading states (planned) |
| `Sonner` / `Toaster` | LeadForm toast notifications |

---

## 5. Design System

| Token | Value | Usage |
|---|---|---|
| `--background` | white | Page background |
| `--foreground` | asphalt charcoal | Default text |
| `--primary` | asphalt charcoal | Header background, hero |
| `--primary-foreground` | white | Text on primary |
| `--amber-brand` | thermoplastic amber | CTAs, accents, links |
| `--amber-foreground` | asphalt charcoal | Text on amber |
| `--secondary` | light gray | Section backgrounds |
| `--muted-foreground` | gray | Captions, meta text |
| `--border` | light gray | Card borders, dividers |
| `road-stripe-h` | CSS class | Horizontal road stripe accent |

All tokens defined in `src/app/globals.css`.

---

## 6. Iconography

Gulf components use Lucide icons via `src/lib/icons.ts`:

```ts
import { PaintBucket, Plane, Factory, ShieldAlert, Layers, Building2, Road, ShoppingCart, Truck, Plane, Zap, ShoppingBag } from "lucide-react";

export function getIcon(name: string) {
  const map: Record<string, LucideIcon> = { PaintBucket, Plane, Factory, /* ... */ };
  return map[name] ?? PaintBucket;
}
```

Service `icon` field stores the Lucide component name (e.g. `"PaintBucket"`, `"Plane"`, `"Factory"`, `"ShieldAlert"`, `"Layers"`).

---

## 7. Animation

Gulf components use Framer Motion for `whileInView` reveal animations:

```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.4, delay: i * 0.05 }}
>
```

This is why most grid components are client components. Animations are subtle (fade + slight Y movement) and respect `prefers-reduced-motion` (planned enhancement).

---

## 8. Related Documents

- `NEXT_ARCHITECTURE.md` — App Router composition
- `SEO_AUDIT.md` — performance budget
- `LEAD_SYSTEM.md` — LeadForm + LeadCtaSection deep dive
- `INTERNAL_LINKING.md` — link rendering in components
