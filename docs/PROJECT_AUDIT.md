# Gulf Seismic Authority Platform — Project Audit

> Author: Enterprise Solution Architect
> Scope: gulfseismic.com (Next.js 16 frontend) + cms.gulfseismic.com (WordPress + WPGraphQL + ACF)
> Date: 2024-Q4

---

## 1. Executive Summary

Gulf Seismic is being transformed from a static brochure website into a **topical-authority content platform** for road marking & industrial marking across the United Arab Emirates and the Kingdom of Saudi Arabia. The transformation is built on three pillars:

1. **Authority Graph** — a structured graph of *Country → City → Service → Industry → Project → Case Study → Blog* entities that interlink to claim topical authority.
2. **Programmatic SEO** — 8 services × 16 cities = **128 commercial landing pages**, each with city-specific context, local projects and local CTAs.
3. **Lead-Centric Funnels** — RFQ, WhatsApp, Call, Email and Tender funnels, all instrumented with source / campaign / city / service tracking and persisted to a Prisma `Lead` model.

This audit documents the current state, the future state, gaps, risks, quick wins and critical fixes required to ship to production.

---

## 2. Current State (As-Built)

### 2.1 Frontend (`src/app/`)
| Layer | Status | Notes |
|---|---|---|
| Next.js 16 App Router | ✅ Scaffolded | `src/app/page.tsx` still ships the default Z.ai template — **must be replaced**. |
| Root `layout.tsx` | ⚠️ Default metadata | Hardcodes "Z.ai Code Scaffold" title, description and Z.ai icon — must be replaced with Gulf Seismic org metadata. |
| `/api/route.ts` | ⚠️ Returns `Hello, world!` | The `/api/leads` endpoint referenced by `LeadForm` **does not exist** yet. |
| Route tree for authority graph | ❌ Not created | `/uae`, `/saudi-arabia`, `/uae/[city]`, `/services/[slug]`, `/projects`, `/projects/[slug]`, `/industries`, `/industries/[slug]`, `/case-studies/[slug]`, `/about`, `/contact`, `/sitemap.xml`, `/robots.txt` — none exist. |
| `globals.css` | ✅ Theme tokens present | Asphalt charcoal + thermoplastic amber palette, road-stripe utility classes. |

### 2.2 Domain Library (`src/lib/`)
| Module | Status | Notes |
|---|---|---|
| `gulf-data.ts` | ✅ Complete seed | 2 countries, 16 cities, 8 services, 7 industries, 6 projects, 3 case studies, 6 blog posts, company org. ~1,570 lines of typed content. |
| `wordpress.ts` | ⚠️ Half-wired | GraphQL queries defined and dispatched, but CMS response → typed entity mapping is stubbed (`// Map CMS shape → Country[] (left to migration)`). Falls back to seed data. |
| `seo.ts` | ✅ Complete | JSON-LD builders for Organization, WebSite, BreadcrumbList, Service, LocalBusiness, FAQPage, CreativeWork (Project), Article; `buildMetadata` for the Metadata API. |
| `icons.ts` | ✅ Complete | Lucide icon resolver. |
| `db.ts` | ✅ Prisma client | Wraps `@prisma/client`. |

### 2.3 Components (`src/components/gulf/`)
16 production-grade components shipped: `Header`, `Footer`, `Hero`, `PageHero`, `Breadcrumbs`, `ServicesGrid`, `CitiesSection`, `IndustriesGrid`, `ProjectsShowcase`, `CaseStudiesSection`, `FaqSection`, `ProcessSection`, `AuthorityGraph`, `LeadForm`, `LeadCtaSection`, `WhatsAppFab`, `JsonLd`. All consume the seed data layer directly.

### 2.4 Database / Prisma
- `prisma/schema.prisma` still defines the original template `User` + `Post` models.
- **Missing:** `Lead` model (referenced by `/api/leads`), `LeadEvent` for funnel tracking, `PageView` for analytics.

### 2.5 Headless CMS
- Domain `cms.gulfseismic.com` intended to host WordPress + WPGraphQL + WPGraphQL for ACF + CPT UI.
- **Not yet provisioned** in code; CPT registration snippets and ACF field groups are documented in `WORDPRESS_DATA_MODEL.md` and `ACF_BLUEPRINT.md`.

---

## 3. Future State (To-Be)

### 3.1 Route inventory (full list in `ROUTES.md`)
- 1 homepage
- 2 country hubs (`/uae`, `/saudi-arabia`)
- 16 city hubs (`/uae/[city]`, `/saudi-arabia/[city]`)
- 128 service-city pages (`/{country}/{city}/{service}`)
- 8 service pages (`/services/[slug]`)
- 7 industry pages (`/industries/[slug]`)
- N project pages (`/projects/[slug]`)
- N case studies (`/case-studies/[slug]`)
- N blog posts (`/blog/[slug]`)
- 4 commercial pages (`/about`, `/contact`, `/privacy`, `/terms`)
- 2 infrastructure routes (`/sitemap.xml`, `/robots.txt`)
- 1 API endpoint (`/api/leads`)

### 3.2 Rendering strategy
- **SSG + ISR (revalidate: 300s)** for all country/city/service/project pages.
- **Dynamic** for `/api/leads` and `/sitemap.xml`.
- **Static** for `/robots.txt` (revalidate: 3600s).

### 3.3 Schema coverage
Every page emits at minimum `Organization` + `BreadcrumbList`. Service pages also emit `Service`. City hubs emit `LocalBusiness`. Project pages emit `CreativeWork`. FAQ sections emit `FAQPage`. Blog posts emit `Article`.

---

## 4. Gaps

| # | Gap | Severity | Owner |
|---|---|---|---|
| G1 | `src/app/page.tsx` is the Z.ai scaffold, not the Gulf Seismic homepage | 🔴 Critical | Frontend |
| G2 | Root `layout.tsx` metadata is Z.ai default | 🔴 Critical | Frontend |
| G3 | `/api/leads` endpoint not implemented | 🔴 Critical | Backend |
| G4 | Prisma `Lead` model missing | 🔴 Critical | Backend |
| G5 | CMS response → typed entity mappers in `wordpress.ts` are stubbed | 🟠 High | CMS |
| G6 | WordPress CPTs + ACF field groups not registered on `cms.gulfseismic.com` | 🟠 High | CMS |
| G7 | Authority graph route tree (`/uae`, `/saudi-arabia`, etc.) not created | 🟠 High | Frontend |
| G8 | `sitemap.xml` and `robots.txt` routes not created | 🟠 High | Frontend |
| G9 | Project gallery images are stubbed (no real photos) | 🟡 Medium | Content |
| G10 | Blog post body content (only excerpt + metadata seeded) | 🟡 Medium | Content |
| G11 | CRM webhook integration (HubSpot / Zoho) not implemented | 🟡 Medium | Backend |
| G12 | Open Graph default images not generated | 🟡 Medium | Design |
| G13 | `robots.txt` does not reference sitemap; no GSC submission script | 🟢 Low | SEO |
| G14 | Vercel project + production env vars not configured | 🟢 Low | DevOps |

---

## 5. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Duplicate content** across 128 service-city pages triggers Google thin-content penalty | Each page must include city-specific hero, local stats, local projects, local FAQ. Templated copy must be ≤40% of body. Document uniqueness strategy in `PROGRAMMATIC_SEO.md`. |
| R2 | **CMS downtime** takes site down | `wordpress.ts` already falls back to seed data on fetch failure/timeout. Add ISR cache (5 min) so even CMS outage degrades gracefully. |
| R3 | **Saudi regulatory** content (MOMRA specs, Vision 2030 alignment) wrong or generic | Engage Saudi-side SME before publishing `/saudi-arabia/*` content. Document in `SAUDI_EXPANSION.md`. |
| R4 | **Lead data loss** if Prisma SQLite is used in production | Migrate to PostgreSQL (Vercel Postgres / Neon) before go-live. Document in `MIGRATION_PLAN.md`. |
| R5 | **Image performance** — unoptimised project gallery photos destroy Core Web Vitals | Use Next.js `<Image>` with `next/image` automatic optimisation; serve via Vercel CDN; provide `width`/`height` to prevent CLS. |
| R6 | **Slug collisions** between WP CPT slugs and Next.js reserved paths | Enforce a slug allowlist in `generateStaticParams`; reject `api`, `_next`, `admin`. |
| R7 | **GraphQL N+1** on city pages (one query per page) | Pre-fetch all cities once and use `generateStaticParams` + ISR. Document caching in `GRAPHQL_ARCHITECTURE.md`. |

---

## 6. Quick Wins (≤1 day each)

1. **Replace `src/app/page.tsx`** with the Gulf Seismic homepage composition (`Hero` + `ServicesGrid` + `CitiesSection` + `IndustriesGrid` + `ProjectsShowcase` + `AuthorityGraph` + `ProcessSection` + `LeadCtaSection`).
2. **Replace root `layout.tsx` metadata** with Gulf Seismic org metadata (title, description, logo, OG, Twitter card).
3. **Implement `/api/leads`** Route Handler that validates with Zod, persists to Prisma `Lead` model, returns 201.
4. **Add Prisma `Lead` model** and run `prisma migrate dev`.
5. **Create `/robots.txt`** Route Handler that returns `User-agent: *` + `Sitemap: https://gulfseismic.com/sitemap.xml`.
6. **Add `<Header />` + `<Footer />` + `<WhatsAppFab />`** to root layout.

---

## 7. Critical Fixes (must-do before production cutover)

1. **CMS mapper implementation** — replace every `// Map CMS shape → ... (left to migration)` comment in `src/lib/wordpress.ts` with the actual GraphQL response → typed entity mapping.
2. **WordPress CPT registration** — register Countries, Cities, Services, Industries, Projects, CaseStudies, Blogs, FAQs, Resources CPTs (snippets in `WORDPRESS_DATA_MODEL.md`).
3. **ACF field groups** — install and configure per `ACF_BLUEPRINT.md`.
4. **Image pipeline** — upload real project gallery images to WP media library and wire `gallery` field to `next/image`.
5. **PostgreSQL migration** — switch `datasource` in `prisma/schema.prisma` from `sqlite` to `postgresql` and run migrations.
6. **DNS cutover** — point `gulfseismic.com` to Vercel; point `cms.gulfseismic.com` to WordPress host; verify `https://cms.gulfseismic.com/graphql` returns 200.
7. **Search Console submission** — submit `/sitemap.xml` in GSC + Bing Webmaster; verify ownership via DNS TXT.
8. **Performance budget** — LCP < 2.5s, INP < 200ms, CLS < 0.1 on Lighthouse mobile for homepage and 1 representative service-city page.

---

## 8. KPIs & Targets (post-launch 90 days)

| Metric | Target |
|---|---|
| Indexed pages (GSC) | ≥ 200 |
| Service-city pages ranking in top 20 | ≥ 60 / 128 |
| Service-city pages ranking in top 10 | ≥ 25 / 128 |
| Organic sessions / month | ≥ 12,000 |
| Leads / month | ≥ 80 |
| Lead → SQL conversion | ≥ 35% |
| LCP (mobile, p75) | < 2.5s |
| INP (mobile, p75) | < 200ms |

---

## 9. Related Documents

- `ROUTES.md` — full route inventory
- `SEO_AUDIT.md` — technical SEO audit
- `AUTHORITY_GRAPH.md` — entity graph design
- `WORDPRESS_DATA_MODEL.md` — CPT definitions
- `ACF_BLUEPRINT.md` — ACF field groups
- `GRAPHQL_ARCHITECTURE.md` — query layer
- `NEXT_ARCHITECTURE.md` — App Router architecture
- `PROGRAMMATIC_SEO.md` — 128-page strategy
- `SCHEMA_ARCHITECTURE.md` — JSON-LD
- `LEAD_SYSTEM.md` — lead funnels
- `MIGRATION_PLAN.md` — go-live sequence
- `TECHNICAL_DEBT.md` — known debt register
