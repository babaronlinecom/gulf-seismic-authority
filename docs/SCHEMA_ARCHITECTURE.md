# Gulf Seismic — JSON-LD Schema Architecture

> Implementation: `src/lib/seo.ts` (builders) + `src/components/gulf/json-ld.tsx` (renderer)
> Standard: Schema.org, JSON-LD serialisation
> Validation: Google Rich Results Test, schema-dts TypeScript types

This document specifies every JSON-LD schema emitted by the platform, the builder function that produces it, the route(s) that emit it, and a complete example payload.

---

## 1. Schema Catalogue

| Schema | Builder | `@type` | Emitted on |
|---|---|---|---|
| Organization | `organizationSchema()` | `Organization` | Every page (root layout) |
| WebSite | `websiteSchema()` | `WebSite` | Every page (root layout) |
| BreadcrumbList | `breadcrumbSchema(items)` | `BreadcrumbList` | Every page except homepage |
| Service | `serviceSchema(service, path)` | `Service` | Service detail, service-city |
| LocalBusiness | `localBusinessSchema(country, city, path)` | `LocalBusiness` | City hub, service-city |
| FAQPage | `faqSchema(faqs)` | `FAQPage` | Service detail, service-city |
| CreativeWork (Project) | `projectSchema(project, path)` | `CreativeWork` | Project detail |
| Article | `articleSchema(post)` | `Article` | Blog detail, case study |

---

## 2. Renderer Component

```tsx
// src/components/gulf/json-ld.tsx
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
```

Usage in a Server Component:

```tsx
import { JsonLd } from "@/components/gulf/json-ld";
import { organizationSchema, breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/seo";

<JsonLd data={[
  organizationSchema(),
  breadcrumbSchema(breadcrumbs),
  serviceSchema(service, path),
  faqSchema(service.faqs),
]} />
```

Multiple `<script type="application/ld+json">` tags are valid per page; Google merges them.

---

## 3. Organization Schema

```ts
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: company.name,
    legalName: company.legalName,
    url: SITE,
    logo: `${SITE}/logo.svg`,
    description: company.description,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.headquarters.city,
      addressCountry: "AE",
    },
    areaServed: countries.map((c) => c.name),
    sameAs: [company.social.linkedin, company.social.instagram],
  };
}
```

### Example output
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://gulfseismic.com/#organization",
  "name": "Gulf Seismic",
  "legalName": "Gulf Seismic Contracting LLC",
  "url": "https://gulfseismic.com",
  "logo": "https://gulfseismic.com/logo.svg",
  "description": "Gulf Seismic is the UAE and Saudi Arabia authority for thermoplastic road marking…",
  "foundingDate": "2015",
  "email": "info@gulfseismic.com",
  "telephone": "+971 4 000 0000",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "areaServed": ["United Arab Emirates", "Kingdom of Saudi Arabia"],
  "sameAs": [
    "https://www.linkedin.com/company/gulf-seismic",
    "https://www.instagram.com/gulfseismic"
  ]
}
```

---

## 4. WebSite Schema

```ts
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: company.name,
    publisher: { "@id": `${SITE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
```

### Notes
- The `potentialAction` `SearchAction` is included for future site-search functionality. Remove if no site search exists at launch.

---

## 5. BreadcrumbList Schema

```ts
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
```

### Example output (service-city page)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gulfseismic.com/" },
    { "@type": "ListItem", "position": 2, "name": "UAE", "item": "https://gulfseismic.com/uae" },
    { "@type": "ListItem", "position": 3, "name": "Abu Dhabi", "item": "https://gulfseismic.com/uae/abu-dhabi" },
    { "@type": "ListItem", "position": 4, "name": "Thermoplastic Road Marking", "item": "https://gulfseismic.com/uae/abu-dhabi/thermoplastic-road-marking" }
  ]
}
```

---

## 6. Service Schema

```ts
export function serviceSchema(service: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    url: absoluteUrl(path),
    provider: { "@id": `${SITE}/#organization` },
    areaServed: countries.map((c) => ({ "@type": "Country", name: c.name })),
    serviceType: service.name,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "AED",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "AED",
      },
    },
  };
}
```

### Example output
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Thermoplastic Road Marking",
  "description": "Hot-applied thermoplastic road marking engineered for Gulf conditions.",
  "url": "https://gulfseismic.com/services/thermoplastic-road-marking",
  "provider": { "@id": "https://gulfseismic.com/#organization" },
  "areaServed": [
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "Kingdom of Saudi Arabia" }
  ],
  "serviceType": "Thermoplastic Road Marking",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "AED",
    "priceSpecification": { "@type": "PriceSpecification", "priceCurrency": "AED" }
  }
}
```

### Notes
- `priceCurrency: "AED"` is used as the default. Saudi service-city pages should switch to `"SAR"` (Phase 2 enhancement).
- `offers.priceSpecification` deliberately omits a numeric price — services are quoted per project.

---

## 7. LocalBusiness Schema

```ts
export function localBusinessSchema(country: Country, city: City, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${company.name} — ${city.name}`,
    description: city.heroDescription,
    url: absoluteUrl(path),
    image: `${SITE}/logo.svg`,
    telephone: country.phone,
    email: company.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: country.code,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude,
      longitude: city.longitude,
    },
    areaServed: { "@type": "City", name: city.name },
    parentOrganization: { "@id": `${SITE}/#organization` },
  };
}
```

### Example output (Dubai)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Gulf Seismic — Dubai",
  "description": "Precision thermoplastic marking and parking lot line marking for Dubai's world-class road network…",
  "url": "https://gulfseismic.com/uae/dubai",
  "image": "https://gulfseismic.com/logo.svg",
  "telephone": "+971 4 000 0000",
  "email": "info@gulfseismic.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressRegion": "Emirate of Dubai",
    "addressCountry": "AE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.2048,
    "longitude": 55.2708
  },
  "areaServed": { "@type": "City", "name": "Dubai" },
  "parentOrganization": { "@id": "https://gulfseismic.com/#organization" }
}
```

---

## 8. FAQPage Schema

```ts
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
```

### Example output
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does thermoplastic road marking last in the Gulf?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quality hydrocarbon thermoplastic with proper glass beads typically lasts 3–5 years on UAE and Saudi highways, depending on traffic volume and UV exposure."
      }
    }
  ]
}
```

### Notes
- FAQ rich results are eligible for FAQ schema; ensure each Q&A is visible on the page (don't hide via CSS).
- Phase 2: Yoast FAQ blocks will auto-generate this schema from the WordPress editor.

---

## 9. CreativeWork Schema (Project)

```ts
export function projectSchema(project: Project, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.challenge,
    url: absoluteUrl(path),
    creator: { "@id": `${SITE}/#organization` },
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: project.location,
      geo: { "@type": "GeoCoordinates" },
    },
    about: {
      "@type": "Service",
      name: services.find((s) => s.slug === project.service)?.name ?? project.service,
    },
  };
}
```

### Example output
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Abu Dhabi–Al Ain Highway Thermoplastic Marking",
  "description": "Re-mark 42 km of a high-speed inter-city highway with minimal lane closures…",
  "url": "https://gulfseismic.com/projects/abu-dhabi-highway-thermoplastic",
  "creator": { "@id": "https://gulfseismic.com/#organization" },
  "dateCreated": "2024",
  "locationCreated": {
    "@type": "Place",
    "name": "E22 Highway, Abu Dhabi – Al Ain",
    "geo": { "@type": "GeoCoordinates" }
  },
  "about": {
    "@type": "Service",
    "name": "Thermoplastic Road Marking"
  }
}
```

### Phase 2 enhancement
Add `geo.latitude` / `geo.longitude` from the linked city. Add `spatialCoverage` Place for the project area.

---

## 10. Article Schema

```ts
export function articleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
```

### Example output
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Thermoplastic vs Cold Paint Road Marking: Which Lasts Longer in the Gulf?",
  "description": "A technical comparison of thermoplastic and cold paint systems under UAE and Saudi climate conditions…",
  "datePublished": "2024-11-12",
  "dateModified": "2024-11-12",
  "author": { "@type": "Organization", "name": "Gulf Seismic Technical Team" },
  "publisher": { "@id": "https://gulfseismic.com/#organization" },
  "mainEntityOfPage": "https://gulfseismic.com/blog/thermoplastic-vs-cold-paint-road-marking"
}
```

---

## 11. Helper Utilities

### 11.1 `absoluteUrl`
```ts
export function absoluteUrl(path = "/"): string {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}
```
Ensures all schema URLs are absolute (required by Google).

### 11.2 `jsonLd` (combiner)
```ts
export function jsonLd(...objects: object[]) {
  return objects;
}
```
Helper to combine multiple schema objects into a single array for the `<JsonLd data={...}/>` component.

---

## 12. Validation

### 12.1 Build-time validation
Use `schema-dts` TypeScript types to validate schema objects at compile time:

```ts
import type { Organization, WithContext } from "schema-dts";

export function organizationSchema(): WithContext<Organization> {
  return { "@context": "https://schema.org", "@type": "Organization", /* ... */ };
}
```

### 12.2 Runtime validation
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Automated via Lighthouse SEO audit in CI

---

## 13. Schema → Route Matrix

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
| `/industries/[slug]` | ✅ | – | ✅ | – | – | – | – | – |
| `/about` | ✅ | – | ✅ | – | – | – | – | – |
| `/contact` | ✅ | – | ✅ | – | – | – | – | – |

---

## 14. Related Documents

- `ROUTES.md` — route inventory
- `SEO_AUDIT.md` — overall SEO strategy
- `NEXT_ARCHITECTURE.md` §7 — schema rendering in App Router
- `AUTHORITY_GRAPH.md` — entity graph
