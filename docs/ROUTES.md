# Gulf Seismic — Next.js App Router Route Inventory

> Reference: Next.js 16 App Router
> Frontend repo: `/home/z/my-project`
> All routes live under `src/app/`. Each route is a Server Component unless marked `(client)`.

---

## 1. Rendering Strategy Conventions

| Tag | Meaning |
|---|---|
| **SSG** | Static Site Generation at build time via `generateStaticParams`. |
| **ISR-300** | Static with revalidation every 300 s (`export const revalidate = 300`). |
| **ISR-3600** | Static with revalidation every hour (used for `sitemap.xml`, `robots.txt`). |
| **DYNAMIC** | Never cached (`export const dynamic = 'force-dynamic'`). Used by API endpoints. |

All data-fetching routes call into `src/lib/wordpress.ts`, which itself sets `next: { revalidate: 300 }` on the upstream WordPress fetch. CMS downtime falls back to seed data in `src/lib/gulf-data.ts`.

---

## 2. Route Inventory

### 2.1 Homepage — `/`

| Field | Value |
|---|---|
| File | `src/app/page.tsx` |
| Rendering | SSG + ISR-300 |
| Data | `getCountries()`, `getServicesList()`, `getProjectsList()` |
| Title | "Road Marking UAE & Saudi Arabia \| Gulf Seismic Authority" |
| Canonical | `https://gulfseismic.com/` |
| Schema | `Organization` + `WebSite` + `BreadcrumbList` (single crumb: Home) |
| Body | `Hero` → `ServicesGrid` → `CitiesSection` → `IndustriesGrid` → `ProjectsShowcase` → `AuthorityGraph` → `ProcessSection` → `LeadCtaSection` |
| Notes | Homepage must declare `export const revalidate = 300`. |

### 2.2 Country Hubs — `/uae`, `/saudi-arabia`

| Field | Value |
|---|---|
| File | `src/app/[country]/page.tsx` where `[country] ∈ {uae, saudi-arabia}` |
| Rendering | SSG via `generateStaticParams` returning both country slugs + ISR-300 |
| Data | `getCountries()` filtered; `getCitiesList(country)`; `getProjectsList({ country })` |
| Title | `country.seoTitle` (e.g. "Road Marking UAE \| Thermoplastic & Industrial Marking Contractors") |
| Canonical | `https://gulfseismic.com/{country}` |
| Schema | `Organization` + `BreadcrumbList` + `ItemList` of cities |
| Body | `PageHero` → city grid → featured projects → services grid → `LeadCtaSection` |
| `generateStaticParams` | `return [{ country: 'uae' }, { country: 'saudi-arabia' }]` |

### 2.3 City Hubs — `/uae/[city]`, `/saudi-arabia/[city]`

| Field | Value |
|---|---|
| File | `src/app/[country]/[city]/page.tsx` |
| Rendering | SSG (16 paths) + ISR-300 |
| Data | `getCitiesList(country)` filtered by city slug; `getProjectsList({ city })`; `getServicesList()` |
| Title | `city.seoTitle` (e.g. "Road Marking Abu Dhabi \| Thermoplastic & Parking Marking") |
| Canonical | `https://gulfseismic.com/{country}/{city}` |
| Schema | `Organization` + `LocalBusiness` (with `geo`) + `BreadcrumbList` + `ItemList` of services |
| Body | `PageHero` (with breadcrumbs) → city intro → services-in-this-city grid → featured local projects → FAQ → `LeadCtaSection` |
| `generateStaticParams` | Iterate `countries × cities` → 16 entries |

### 2.4 Service-City Pages — `/uae/[city]/[service]`, `/saudi-arabia/[city]/[service]`

| Field | Value |
|---|---|
| File | `src/app/[country]/[city]/[service]/page.tsx` |
| Rendering | SSG (**128 paths**) + ISR-300 |
| Data | `getServicesList()` lookup; `getProjectsList({ city, service })`; `getCaseStudiesList()` filtered by project service; `getFaqs(service)` |
| Title | "{Service} {City} — {tagline}" (e.g. "Thermoplastic Road Marking Abu Dhabi") |
| Canonical | `https://gulfseismic.com/{country}/{city}/{service}` |
| Schema | `Organization` + `Service` (with `areaServed` = city) + `LocalBusiness` + `BreadcrumbList` + `FAQPage` |
| Body | Hero (city+service) → local-context section (climate, traffic, regulations) → process → materials → local projects → case studies → FAQ → lead form pre-filled with city+service |
| `generateStaticParams` | `getServiceCityPages()` from `gulf-data.ts` — returns 128 entries |
| Uniqueness | Hero, intro, local stats, local projects, FAQ all city-specific. See `PROGRAMMATIC_SEO.md`. |

### 2.5 Service Pages — `/services/[slug]`

| Field | Value |
|---|---|
| File | `src/app/services/[slug]/page.tsx` |
| Rendering | SSG (8 paths) + ISR-300 |
| Data | `getServicesList()` lookup; `getIndustriesList()` filtered by `industriesServed`; `getProjectsList({ service })` |
| Title | `service.seoTitle` (e.g. "Thermoplastic Road Marking \| Gulf Seismic") |
| Canonical | `https://gulfseismic.com/services/{slug}` |
| Schema | `Organization` + `Service` (with `areaServed` = both countries) + `BreadcrumbList` + `FAQPage` |
| Body | Hero → long description → benefits → materials & equipment → process → industries served → related projects → cities offering this service → FAQ → lead CTA |
| `generateStaticParams` | 8 service slugs |

### 2.6 Projects Index — `/projects`

| Field | Value |
|---|---|
| File | `src/app/projects/page.tsx` |
| Rendering | SSG + ISR-300 |
| Data | `getProjectsList()` (all) |
| Title | "Marking Projects \| Gulf Seismic Portfolio" |
| Canonical | `https://gulfseismic.com/projects` |
| Schema | `Organization` + `BreadcrumbList` + `CollectionPage` |
| Body | Hero → filter chips (country, service, industry) → project grid → `LeadCtaSection` |

### 2.7 Project Detail — `/projects/[slug]`

| Field | Value |
|---|---|
| File | `src/app/projects/[slug]/page.tsx` |
| Rendering | SSG (N paths) + ISR-300 |
| Data | `getProjectsList()` lookup by slug; linked `CaseStudy`; related projects (same city OR service) |
| Title | "{project.title} \| Gulf Seismic Project" |
| Canonical | `https://gulfseismic.com/projects/{slug}` |
| Schema | `Organization` + `CreativeWork` (Project) + `BreadcrumbList` |
| Body | Hero (project title + city + service + year) → Challenge → Solution → Execution → Materials → Equipment → Duration → Results (metrics) → Gallery → Testimonial (from linked case study) → next project → lead CTA |
| `generateStaticParams` | All project slugs from `getProjectsList()` |

### 2.8 Industries Index — `/industries`

| Field | Value |
|---|---|
| File | `src/app/industries/page.tsx` |
| Rendering | SSG + ISR-300 |
| Data | `getIndustriesList()` |
| Title | "Industries We Serve \| Gulf Seismic" |
| Schema | `Organization` + `BreadcrumbList` |
| Body | Hero → industry grid |

### 2.9 Industry Detail — `/industries/[slug]`

| Field | Value |
|---|---|
| File | `src/app/industries/[slug]/page.tsx` |
| Rendering | SSG (7 paths) + ISR-300 |
| Data | `getIndustriesList()` lookup; `getServicesByIndustry(slug)`; `getProjectsList()` filtered by industry |
| Title | "{industry.name} Marking \| Gulf Seismic" |
| Schema | `Organization` + `BreadcrumbList` + `Service` (aggregated) |
| Body | Hero → industry challenges → industry solutions → services we offer → featured projects in industry → CTA |

### 2.10 Case Study Detail — `/case-studies/[slug]`

| Field | Value |
|---|---|
| File | `src/app/case-studies/[slug]/page.tsx` |
| Rendering | SSG + ISR-300 |
| Data | `getCaseStudiesList()` lookup; linked `Project` via `projectSlug` |
| Title | "{caseStudy.title} \| Gulf Seismic Case Study" |
| Schema | `Organization` + `Article` + `BreadcrumbList` |
| Body | Hero → summary → outcomes list → linked project card → testimonial block → next case study |

### 2.11 About — `/about`

| Field | Value |
|---|---|
| File | `src/app/about/page.tsx` |
| Rendering | SSG (no ISR — pure static) |
| Title | "About Gulf Seismic \| Road & Industrial Marking Authority" |
| Schema | `Organization` (expanded: `founder`, `foundingDate`, `numberOfEmployees`) + `BreadcrumbList` |

### 2.12 Contact — `/contact`

| Field | Value |
|---|---|
| File | `src/app/contact/page.tsx` |
| Rendering | SSG |
| Title | "Contact Gulf Seismic \| Request a Quote" |
| Schema | `Organization` + `ContactPage` + `BreadcrumbList` |
| Body | Contact channels (WhatsApp / Call / Email / Tender) + full `LeadForm` (source=`contact-page`) + map embed |

### 2.13 API — `/api/leads`

| Field | Value |
|---|---|
| File | `src/app/api/leads/route.ts` |
| Rendering | DYNAMIC |
| Methods | `POST` (create lead), `GET` (admin list — auth-gated) |
| Validation | Zod schema identical to client-side `leadSchema` |
| Persistence | Prisma `Lead` model (see `LEAD_SYSTEM.md`) |
| Response | `201 Created` with `{ id, status, expectedResponseAt }` |
| Side-effects | Email notification to `info@gulfseismic.com`; CRM webhook (TBD) |
| Rate-limit | 5 req / IP / minute via in-memory token bucket |

### 2.14 Sitemap — `/sitemap.xml`

| Field | Value |
|---|---|
| File | `src/app/sitemap.xml/route.ts` |
| Rendering | ISR-3600 |
| Returns | `application/xml` |
| Includes | All static routes + 2 countries + 16 cities + 128 service-city + 8 services + 7 industries + N projects + N case studies + N blog posts |
| `lastmod` | Each route's `updatedAt` from CMS or build time |
| `priority` | `1.0` for homepage, `0.9` for country/city/service, `0.7` for service-city, `0.6` for projects/case studies |
| `changefreq` | `weekly` for commercial, `monthly` for projects |

### 2.15 Robots — `/robots.txt`

| Field | Value |
|---|---|
| File | `src/app/robots.txt/route.ts` |
| Rendering | ISR-3600 |
| Returns | `text/plain` |
| Body | `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://gulfseismic.com/sitemap.xml` |

### 2.16 Blog (future) — `/blog`, `/blog/[slug]`

| Field | Value |
|---|---|
| File | `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` |
| Rendering | SSG + ISR-300 |
| Title | `post.title` |
| Schema | `Article` + `BreadcrumbList` |
| Notes | Body content currently only stubbed in seed data; see `TECHNICAL_DEBT.md`. |

---

## 3. Route Tree (file system)

```
src/app/
├── layout.tsx                 # Root layout: <Header/> + main + <Footer/> + <WhatsAppFab/>
├── page.tsx                    # Homepage
├── globals.css                 # Theme tokens
├── [country]/
│   ├── page.tsx                # Country hub (UAE / Saudi Arabia)
│   └── [city]/
│       ├── page.tsx            # City hub
│       └── [service]/
│           └── page.tsx        # Service-city programmatic page (128 total)
├── services/[slug]/page.tsx    # Service detail
├── projects/
│   ├── page.tsx                # Projects index
│   └── [slug]/page.tsx         # Project detail
├── industries/
│   ├── page.tsx                # Industries index
│   └── [slug]/page.tsx         # Industry detail
├── case-studies/[slug]/page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── about/page.tsx
├── contact/page.tsx
├── privacy/page.tsx
├── terms/page.tsx
├── sitemap.xml/route.ts
├── robots.txt/route.ts
└── api/
    ├── route.ts                # Health check
    └── leads/route.ts          # Lead ingestion endpoint
```

---

## 4. `generateStaticParams` Reference

```ts
// src/app/[country]/[city]/[service]/page.tsx
import { getServiceCityPages } from "@/lib/gulf-data";

export async function generateStaticParams() {
  return getServiceCityPages().map((p) => ({
    country: p.country,
    city: p.citySlug,
    service: p.serviceSlug,
  }));
}

export const revalidate = 300; // ISR
```

```ts
// src/app/projects/[slug]/page.tsx
import { getProjectsList } from "@/lib/wordpress";

export async function generateStaticParams() {
  const projects = await getProjectsList();
  return projects.map((p) => ({ slug: p.slug }));
}
```

---

## 5. Metadata API Usage

Every page exports an async `generateMetadata` function:

```ts
import { buildMetadata } from "@/lib/seo";
import { getCity } from "@/lib/wordpress";

export async function generateMetadata({ params }) {
  const { country, city } = await params;
  const cityEntity = await getCity(city);
  if (!cityEntity) return buildMetadata({ title: "Not Found", noIndex: true });
  return buildMetadata({
    title: cityEntity.seoTitle,
    description: cityEntity.seoDescription,
    path: `/${country}/${city}`,
  });
}
```

`buildMetadata` returns a fully-populated Next.js `Metadata` object including canonical, robots, OpenGraph and Twitter cards. See `SCHEMA_ARCHITECTURE.md` and `SEO_AUDIT.md`.

---

## 6. Route → Schema Matrix

| Route | Organization | WebSite | BreadcrumbList | Service | LocalBusiness | CreativeWork | Article | FAQPage |
|---|---|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | – | – | – | – | – | – |
| `/[country]` | ✅ | – | ✅ | – | – | – | – | – |
| `/[country]/[city]` | ✅ | – | ✅ | – | ✅ | – | – | – |
| `/[country]/[city]/[service]` | ✅ | – | ✅ | ✅ | ✅ | – | – | ✅ |
| `/services/[slug]` | ✅ | – | ✅ | ✅ | – | – | – | ✅ |
| `/projects/[slug]` | ✅ | – | ✅ | – | – | ✅ | – | – |
| `/case-studies/[slug]` | ✅ | – | ✅ | – | – | – | ✅ | – |
| `/blog/[slug]` | ✅ | – | ✅ | – | – | – | ✅ | – |
| `/about` | ✅ | – | ✅ | – | – | – | – | – |
| `/contact` | ✅ | – | ✅ | – | – | – | – | – |
