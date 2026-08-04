# Gulf Seismic — Technical SEO Audit & Strategy

> Scope: All routes under `gulfseismic.com`
> Standards: Google Search Central guidelines, Schema.org, Core Web Vitals (March 2024 thresholds)

---

## 1. Audit Summary

| Area | Current | Target | Gap |
|---|---|---|---|
| Metadata API usage | Partial (root layout is Z.ai default) | 100% of routes via `generateMetadata` | Replace root layout; ensure all dynamic routes export `generateMetadata` |
| Canonical URLs | Helper exists (`buildMetadata`) | Every page sets `alternates.canonical` | Wire helper into every page |
| OpenGraph / Twitter | Helper exists | OG image per page type | Generate per-page-type OG images |
| JSON-LD schema | Builders exist in `seo.ts` | 8 schema types across all routes | Wire `<JsonLd data={...}/>` into every page |
| Sitemap | Not created | `/sitemap.xml` with all 200+ URLs | Create `sitemap.xml/route.ts` |
| Robots | Not created | `/robots.txt` referencing sitemap | Create `robots.txt/route.ts` |
| Internal linking | Components link to seed-data slugs | Context-aware related-content blocks | Build `RelatedProjects`, `RelatedServices` blocks |
| Programmatic pages | 0 of 128 generated | 128 unique pages via `generateStaticParams` | Build `[country]/[city]/[service]` route |
| Core Web Vitals | Untested | LCP < 2.5s, INP < 200ms, CLS < 0.1 | Lighthouse + CrUX monitoring |
| Image optimisation | `<img>` used in projects showcase | `next/image` with `priority` on hero | Replace `<img>` tags |
| Hreflang | Not implemented | `en-ae`, `en-sa`, `ar-ae`, `ar-sa` variants (Phase 2) | Plan i18n expansion |

---

## 2. Metadata API Strategy

### 2.1 Root layout metadata (defaults)
```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://gulfseismic.com"),
  title: {
    default: "Gulf Seismic — Road & Industrial Marking Authority",
    template: "%s | Gulf Seismic",
  },
  description:
    "Gulf Seismic delivers thermoplastic road marking, parking, warehouse, airport, industrial, safety signage and epoxy flooring across UAE and Saudi Arabia.",
  applicationName: "Gulf Seismic",
  authors: [{ name: "Gulf Seismic Contracting LLC" }],
  generator: "Next.js 16",
  keywords: [
    "road marking UAE", "thermoplastic road marking", "parking lot marking Dubai",
    "warehouse marking Saudi Arabia", "airport marking", "epoxy flooring Riyadh",
    "industrial marking", "safety signage",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, address: false, email: true },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://gulfseismic.com",
    siteName: "Gulf Seismic",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Gulf Seismic" }],
  },
  twitter: { card: "summary_large_image", creator: "@gulfseismic" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: { google: "GOOGLE_SITE_VERIFICATION_TOKEN" },
};
```

### 2.2 Per-page metadata
Each route exports `generateMetadata({ params })` that returns `buildMetadata({ title, description, path, image?, noIndex? })`. The helper produces canonical, OG and Twitter tags with the absolute URL.

### 2.3 Title patterns
| Route | Title pattern |
|---|---|
| Homepage | "Gulf Seismic — Road & Industrial Marking Authority" |
| Country | "{country.seoTitle}" |
| City | "{city.seoTitle}" |
| Service-city | "{Service Name} in {City} — Gulf Seismic" |
| Service | "{service.seoTitle}" |
| Project | "{project.title} — Gulf Seismic Project" |
| Case study | "{caseStudy.title} — Gulf Seismic Case Study" |
| Industry | "{industry.name} Marking — Gulf Seismic" |

---

## 3. Canonical URL Strategy

- **Trailing slash:** consistent no-trailing-slash. Vercel `trailingSlash: false` in `next.config.ts`.
- **HTTPS:** enforced via Vercel; HSTS preload header.
- **WWW vs non-WWW:** non-www (`gulfseismic.com`).
- **Self-canonical:** every page's `<link rel="canonical">` points to itself.
- **Pagination:** `rel="next"` / `rel="prev"` removed; use self-canonical + `noindex,follow` on page 2+.
- **Programmatic pages:** each of the 128 service-city pages is canonical to its own URL — never to the parent service page.

---

## 4. OpenGraph & Twitter Card

| Page type | OG image | Dimensions |
|---|---|---|
| Default | `/og/default.png` | 1200×630 |
| Country | `/og/country-{slug}.png` | 1200×630 |
| City | `/og/city-{slug}.png` | 1200×630 |
| Service | `/og/service-{slug}.png` | 1200×630 |
| Service-city | `/og/service-city-{service}-{city}.png` | 1200×630 (generated) |
| Project | First gallery image | 1200×630 (cropped) |
| Blog | Featured image | 1200×630 |

OG images generated at build time via `@vercel/og` edge function and cached at the CDN.

---

## 5. JSON-LD Schema

Implemented in `src/lib/seo.ts` and rendered via `<JsonLd data={...}/>` (`src/components/gulf/json-ld.tsx`). See `SCHEMA_ARCHITECTURE.md` for full specifications.

### 5.1 Schema coverage matrix

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

### 5.2 Validation
- Validate via Google Rich Results Test: https://search.google.com/test/rich-results
- All schemas pass `schema-dts` TypeScript validation at build time.

---

## 6. Sitemap Architecture

### 6.1 Implementation
```ts
// src/app/sitemap.xml/route.ts
export const revalidate = 3600;

export async function GET() {
  const pages = await getAllSitemapUrls(); // returns { url, lastModified, priority, changeFrequency }[]
  const xml = renderSitemapXml(pages);
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
```

### 6.2 URL inventory
- 1 homepage
- 2 country hubs
- 16 city hubs
- 128 service-city pages
- 8 service pages
- 7 industry pages
- N project pages (currently 6 in seed; will grow to 50+)
- N case studies
- N blog posts
- 4 commercial pages (`/about`, `/contact`, `/privacy`, `/terms`)

### 6.3 Sitemap index strategy (Phase 2)
Split into `sitemap-static.xml`, `sitemap-services.xml`, `sitemap-projects.xml`, `sitemap-blog.xml` once total URL count exceeds 1,000.

### 6.4 Submission
- Google Search Console: submit `https://gulfseismic.com/sitemap.xml`
- Bing Webmaster Tools: same URL
- Automated re-submission on content publish via WP webhook → Vercel deploy hook

---

## 7. Internal Linking Strategy

Detailed in `INTERNAL_LINKING.md`. Summary:

- **Top-down:** Homepage → Country → City → Service-city.
- **Cross-link:** Service-city ↔ Project (filter by city+service).
- **Topical reinforcement:** Service → Industry → Project → Case Study → Blog.
- **Footer:** Every page lists all 8 services + both countries + all 16 cities.
- **Breadcrumbs:** Every page except homepage renders `<Breadcrumbs>` (visible + `BreadcrumbList` schema).
- **Related blocks:** Project page shows 3 related projects (same service, different city). Service page shows all cities offering the service.

---

## 8. Programmatic SEO Strategy

See `PROGRAMMATIC_SEO.md` for full strategy. Key principles:

1. **8 services × 16 cities = 128 unique URLs** via `getServiceCityPages()` in `gulf-data.ts`.
2. Each page contains ≥60% city-specific content (local hero, local stats, local projects, local FAQ).
3. Templated components (process, materials, equipment) shared across city variants — but always introduced with city context.
4. No two service-city pages share >40% identical body copy.
5. Each page links to the parent city hub and parent service page (creates hub-and-spoke structure).

---

## 9. Core Web Vitals

| Metric | Threshold (Good) | Strategy |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 s (p75 mobile) | Hero image served via `next/image` with `priority`; preload hero font; no render-blocking JS. |
| **INP** (Interaction to Next Paint) | < 200 ms (p75 mobile) | Minimise client components; only `Header`, `LeadForm`, `WhatsAppFab`, `Hero`, `Breadcrumbs` are client; everything else is RSC. |
| **CLS** (Cumulative Layout Shift) | < 0.1 | All images specify `width` + `height`; fonts use `font-display: swap` with `size-adjust` to prevent FOIT/FOUT shift; no injected ads. |

### 9.1 Image optimisation
- Use `next/image` everywhere — automatic AVIF/WebP, responsive `srcset`, lazy-loading below the fold.
- Project gallery images: max 1920×1080 source, displayed at 800×450 in grid.
- Logo: inline SVG (no image request).

### 9.2 Font strategy
- Geist Sans + Geist Mono via `next/font/google` with `subsets: ['latin']` and `display: swap`.
- Self-hosted at build time — zero runtime font requests.

### 9.3 JS budget
- Target: ≤ 80 KB JS gzipped on homepage.
- shadcn/ui is tree-shaken per component (Radix primitives included only when used).
- Framer Motion is loaded only for client components that need it.

---

## 10. Page Speed Budget

| Resource | Budget |
|---|---|
| HTML | ≤ 30 KB gzipped |
| CSS | ≤ 30 KB gzipped (Tailwind purge) |
| JS (homepage) | ≤ 80 KB gzipped |
| JS (city page) | ≤ 100 KB gzipped |
| Hero image | ≤ 100 KB (AVIF) |
| Total page weight (homepage) | ≤ 250 KB |

---

## 11. Monitoring

| Tool | Purpose | Cadence |
|---|---|---|
| Google Search Console | Indexation, queries, CTR, Core Web Vitals | Weekly |
| Bing Webmaster Tools | Indexation, queries | Weekly |
| Vercel Analytics | Real-user Core Web Vitals | Continuous |
| Lighthouse CI | Synthetic perf budget on every PR | Per-PR |
| Schema Markup Validator | Rich-result eligibility | Per-publish |
| Ahrefs / SemRush | Backlinks, keyword tracking, technical audit | Weekly |

---

## 12. SEO Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Thin content penalty** on 128 service-city pages | City-specific content ≥ 60% of body; each page has unique local project, local FAQ, local stats. |
| **Duplicate meta** across service-city pages | `generateMetadata` includes city name in title and description. |
| **Orphan pages** | Every programmatic page is linked from its parent city hub and parent service page. |
| **Stale content** | ISR revalidates every 5 min; CMS-driven content auto-updates. |
| **Crawl budget waste** | `robots.txt` blocks `/api/`, `/admin`, `/private`; sitemap includes only canonical URLs. |
| **Hreflang misconfiguration** | Phase 1 ships `en` only; Phase 2 adds `ar` with proper `hreflang` annotation. |
| **Image-heavy pages** | All images use `next/image` with proper `sizes` attribute. |

---

## 13. Phase Plan

| Phase | Scope | Timeline |
|---|---|---|
| **1 — Foundation** | Replace root layout; ship homepage, country, city, service routes; submit sitemap | Week 1 |
| **2 — Programmatic** | Ship 128 service-city pages with city-specific content | Week 2–3 |
| **3 — Authority** | Ship project, case study, industry, blog routes with full schema | Week 3–4 |
| **4 — Optimisation** | Lighthouse perf budget; A/B test CTA copy; internal-link audit | Week 5+ |
| **5 — i18n** | Add Arabic variants with hreflang | Quarter 2 |
