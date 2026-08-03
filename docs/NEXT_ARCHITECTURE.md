# Gulf Seismic — Next.js 16 App Router Architecture

> Reference implementation: `src/app/`
> Framework: Next.js 16 (App Router, RSC by default)
> Hosting: Vercel (Edge Network, ISR, On-Demand Revalidation)
> This document maps every architectural decision to the code that implements it.

---

## 1. App Directory Layout

```
src/app/
├── layout.tsx                 ← Root layout: <Header/>, main, <Footer/>, <WhatsAppFab/>
├── page.tsx                    ← Homepage composition
├── globals.css                 ← Tailwind + theme tokens
├── error.tsx                   ← (planned) global error boundary
├── not-found.tsx               ← (planned) custom 404
├── loading.tsx                 ← (planned) route-level skeleton
├── [country]/
│   ├── page.tsx                ← Country hub (UAE / Saudi Arabia)
│   └── [city]/
│       ├── page.tsx            ← City hub
│       └── [service]/
│           └── page.tsx        ← Service-city programmatic page (128)
├── services/[slug]/page.tsx    ← Service detail
├── projects/
│   ├── page.tsx                ← Projects index
│   └── [slug]/page.tsx         ← Project detail
├── industries/
│   ├── page.tsx                ← Industries index
│   └── [slug]/page.tsx         ← Industry detail
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
    ├── route.ts                ← Health check
    ├── leads/route.ts          ← Lead ingestion
    └── revalidate/route.ts     ← On-demand ISR (Phase 2)
```

---

## 2. Root Layout

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/gulf/header";
import { Footer } from "@/components/gulf/footer";
import { WhatsAppFab } from "@/components/gulf/whatsapp-fab";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/gulf/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { /* Gulf Seismic org metadata */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <WhatsAppFab />
        <Toaster />
      </body>
    </html>
  );
}
```

### Architectural decisions
- **RSC by default** — root layout is a Server Component; only `Header`, `Footer`, `WhatsAppFab` opt into `"use client"`.
- **Self-hosted fonts** via `next/font/google` — zero runtime font requests, no FOIT.
- **Global JSON-LD** — `Organization` and `WebSite` schemas are emitted on every page from the root layout.

---

## 3. Rendering Strategies

| Strategy | Used by | Code |
|---|---|---|
| **SSG (build time)** | Homepage, country, city, service, project, case-study, blog, about, contact | `export const dynamic = "force-static"` or implicit |
| **ISR (300s)** | All CMS-driven pages | `export const revalidate = 300` |
| **ISR (3600s)** | `sitemap.xml`, `robots.txt` | `export const revalidate = 3600` |
| **Dynamic** | `/api/leads`, `/api/revalidate` | `export const dynamic = "force-dynamic"` |

### 3.1 ISR pattern
```tsx
// src/app/[country]/[city]/[service]/page.tsx
export const revalidate = 300;

export async function generateStaticParams() {
  return getServiceCityPages().map((p) => ({
    country: p.country,
    city: p.citySlug,
    service: p.serviceSlug,
  }));
}

export default async function Page({ params }: { params: Promise<{ country: string; city: string; service: string }> }) {
  const { country, city, service } = await params;
  const serviceEntity = await getService(service);
  if (!serviceEntity) notFound();
  // ... render
}
```

### 3.2 Note on `params`
In Next.js 16, `params` is a `Promise` — must be awaited before destructuring. Same for `searchParams`.

---

## 4. Data Fetching

All data access goes through `src/lib/wordpress.ts`, which:
1. Calls `fetchGraphQL` with `next: { revalidate: 300 }`.
2. Maps the CMS response to typed entities.
3. Falls back to seed data in `src/lib/gulf-data.ts` if the CMS is unreachable or returns empty.

```tsx
// src/app/projects/[slug]/page.tsx
import { getProjectsList } from "@/lib/wordpress";

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const projects = await getProjectsList();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

### Per-request deduplication
`fetch` with the same URL+init is deduplicated within a single render pass — no manual dedup needed.

---

## 5. Metadata API

### 5.1 Static metadata (root layout)
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://gulfseismic.com"),
  title: {
    default: "Gulf Seismic — Road & Industrial Marking Authority",
    template: "%s | Gulf Seismic",
  },
  // ... openGraph, twitter, robots, verification
};
```

### 5.2 Dynamic metadata via `generateMetadata`
```ts
// src/app/[country]/[city]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { country, city } = await params;
  const cities = await getCitiesList(country);
  const cityEntity = cities.find((c) => c.slug === city);
  if (!cityEntity) return buildMetadata({ title: "Not Found", noIndex: true });
  return buildMetadata({
    title: cityEntity.seoTitle,
    description: cityEntity.seoDescription,
    path: `/${country}/${city}`,
  });
}
```

`buildMetadata` (in `src/lib/seo.ts`) returns the full `Metadata` object with canonical, robots, OpenGraph and Twitter card. See `SEO_AUDIT.md` §2.

---

## 6. `generateStaticParams` Patterns

### 6.1 Country + City + Service (128 paths)
```ts
import { getServiceCityPages } from "@/lib/gulf-data";

export async function generateStaticParams() {
  return getServiceCityPages().map((p) => ({
    country: p.country,
    city: p.citySlug,
    service: p.serviceSlug,
  }));
}
```
`getServiceCityPages()` returns 128 entries (2 × 16 × 8).

### 6.2 Project slugs (dynamic CMS)
```ts
import { getProjectsList } from "@/lib/wordpress";

export async function generateStaticParams() {
  const projects = await getProjectsList();
  return projects.map((p) => ({ slug: p.slug }));
}
```

### 6.3 Fallback strategy
- `export const dynamicParams = true;` (default) allows new CMS-published slugs to render on first request, then become cached via ISR.

---

## 7. JSON-LD Schema Generation

Schema is built in `src/lib/seo.ts` and rendered via `<JsonLd data={...}/>` (a Server Component):

```tsx
// src/app/projects/[slug]/page.tsx
import { projectSchema, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";

export default async function ProjectPage({ params }) {
  const project = /* ... */;
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: project.title, url: `/projects/${project.slug}` },
  ];
  return (
    <>
      <JsonLd data={[
        organizationSchema(),
        breadcrumbSchema(breadcrumbs),
        projectSchema(project, `/projects/${project.slug}`),
      ]} />
      <ProjectDetail project={project} />
    </>
  );
}
```

See `SCHEMA_ARCHITECTURE.md` for the full schema catalogue.

---

## 8. Breadcrumbs

Implemented by `src/components/gulf/breadcrumbs.tsx`:

```tsx
<Breadcrumbs items={[
  { name: "Home", url: "/" },
  { name: "UAE", url: "/uae" },
  { name: "Abu Dhabi", url: "/uae/abu-dhabi" },
  { name: "Thermoplastic Road Marking" },  // current page; no URL
]} />
```

Each page builds its breadcrumb array from its `params`. The same array feeds both the visible `<Breadcrumbs>` component and the `BreadcrumbList` JSON-LD schema.

---

## 9. Sitemap

```ts
// src/app/sitemap.xml/route.ts
import { getAllSitemapUrls } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const urls = await getAllSitemapUrls();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
```

`getAllSitemapUrls` aggregates URLs from all CPTs:
- 1 homepage
- 2 countries
- 16 cities
- 128 service-city pages
- 8 services
- 7 industries
- N projects + case studies + blog posts
- 4 commercial pages (`/about`, `/contact`, `/privacy`, `/terms`)

---

## 10. OpenGraph Images

Per-page OG images are generated at the edge via `@vercel/og`:

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gulf Seismic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (<div style={{ /* brand styling */ }}>Gulf Seismic</div>),
    { ...size }
  );
}
```

For dynamic OG per route (e.g. service-city page), place `opengraph-image.tsx` inside the route folder and consume `params` to render city/service-specific text.

---

## 11. Client Component Strategy

Only the following components are client components (`"use client"`):

| Component | Why client |
|---|---|
| `Header` | Mobile menu state (`useState`), `Sheet` open state |
| `Footer` | (could be RSC; left as client for `Link` interactivity) |
| `Hero` | Framer Motion animations |
| `PageHero` | Framer Motion |
| `Breadcrumbs` | Could be RSC; left as client for `Link` hover effects |
| `LeadForm` | `react-hook-form`, `useState`, `fetch` to `/api/leads` |
| `LeadCtaSection` | Framer Motion |
| `WhatsAppFab` | Scroll listener, open state |
| `ServicesGrid`, `CitiesSection`, `IndustriesGrid`, `ProjectsShowcase`, `CaseStudiesSection`, `ProcessSection`, `AuthorityGraph`, `FaqSection` | Framer Motion `whileInView` animations |

Everything else is a Server Component by default.

### Hydration boundary discipline
- Client components receive **plain props** (no functions, no class instances).
- Server components fetch data and pass serializable props down.
- No `useEffect` for data fetching — all data is fetched on the server.

---

## 12. Performance Optimisations

| Technique | Implementation |
|---|---|
| **Route segment config** | `export const revalidate = 300` on every CMS-driven page |
| **Font self-hosting** | `next/font/google` with `subsets: ['latin']` and `display: swap` |
| **Image optimisation** | `next/image` everywhere; `priority` on hero images; `sizes` attribute on responsive images |
| **Code splitting** | Per-route code splitting by App Router; dynamic `import()` for heavy client components (e.g. charts) |
| **Tree-shaking** | Tailwind `content` config purges unused classes; shadcn/ui components imported individually |
| **Preload critical resources** | Hero font preloaded by `next/font`; hero image preloaded by `next/image priority` |
| **HTTP/2 push** | Not used (deprecated; Vercel handles prioritisation) |
| **Edge runtime** | Used for `opengraph-image.tsx` and `/api/leads` (planned) |

---

## 13. Error Handling

### 13.1 `not-found.tsx`
```tsx
// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <Button asChild><Link href="/">Back to homepage</Link></Button>
    </div>
  );
}
```

### 13.2 `error.tsx` (client component)
```tsx
// src/app/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### 13.3 `loading.tsx`
```tsx
// src/app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return <Skeleton className="h-[60vh] w-full" />;
}
```

---

## 14. Related Documents

- `ROUTES.md` — full route inventory
- `SEO_AUDIT.md` — metadata strategy
- `SCHEMA_ARCHITECTURE.md` — JSON-LD
- `GRAPHQL_ARCHITECTURE.md` — data layer
- `COMPONENT_INVENTORY.md` — React components
