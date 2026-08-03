# Gulf Seismic — Programmatic SEO Strategy

> **8 services × 16 cities = 128 commercial landing pages.**
> Each page targets high-intent local search demand across the UAE and Saudi Arabia.

This document defines the URL patterns, the uniqueness strategy, the duplicate-content avoidance rules, and the `generateStaticParams` implementation that produces all 128 pages at build time.

---

## 1. Why Programmatic SEO?

Road marking is a **high-intent, locally-served B2B service**. Buyers search for things like:

- *"thermoplastic road marking Abu Dhabi"*
- *"warehouse floor marking Riyadh"*
- *"airport runway marking Jeddah"*
- *"epoxy flooring Sharjah"*

Each such query has:
- **Low competition** (no national brand dominates)
- **High commercial intent** (ready-to-buy)
- **Geographic specificity** (must be served by a local contractor)

A single `/services/thermoplastic-road-marking` page cannot rank for all 16 city variants. Programmatic SEO creates a **dedicated page per (service, city) combination**, each targeting one such query cluster.

---

## 2. The 8 Services

| Slug | Name | Search Intent Cluster |
|---|---|---|
| `road-marking` | Road Marking | General road line marking |
| `thermoplastic-road-marking` | Thermoplastic Road Marking | Hot-applied thermoplastic (most searched) |
| `parking-lot-marking` | Parking Lot Marking | Mall, commercial, retail parking |
| `warehouse-marking` | Warehouse Marking | Logistics, 3PL, factory floor |
| `airport-marking` | Airport Marking | Runway, taxiway, apron (ICAO) |
| `industrial-marking` | Industrial Marking | Plant, refinery, hazard, pipe ID |
| `safety-signage` | Safety Signage | Traffic signs, hazard signage |
| `epoxy-flooring` | Epoxy Flooring | Decorative + industrial floor systems |

---

## 3. The 16 Cities

### UAE (8 cities)
| Slug | Name | Region | Population |
|---|---|---|---|
| `abu-dhabi` | Abu Dhabi | Emirate of Abu Dhabi | 1.5M+ |
| `dubai` | Dubai | Emirate of Dubai | 3.6M+ |
| `sharjah` | Sharjah | Emirate of Sharjah | 1.8M+ |
| `ajman` | Ajman | Emirate of Ajman | 500K+ |
| `ras-al-khaimah` | Ras Al Khaimah | Emirate of Ras Al Khaimah | 400K+ |
| `fujairah` | Fujairah | Emirate of Fujairah | 250K+ |
| `al-ain` | Al Ain | Emirate of Abu Dhabi | 750K+ |
| `umm-al-quwain` | Umm Al Quwain | Emirate of Umm Al Quwain | 80K+ |

### Saudi Arabia (8 cities)
| Slug | Name | Region | Population |
|---|---|---|---|
| `riyadh` | Riyadh | Riyadh Province | 7.6M+ |
| `jeddah` | Jeddah | Makkah Province | 4M+ |
| `dammam` | Dammam | Eastern Province | 1.5M+ |
| `khobar` | Khobar | Eastern Province | 500K+ |
| `jubail` | Jubail | Eastern Province | 600K+ |
| `yanbu` | Yanbu | Madinah Province | 400K+ |
| `makkah` | Makkah | Makkah Province | 2M+ |
| `madinah` | Madinah | Madinah Province | 1.5M+ |

---

## 4. URL Pattern

```
/{country-slug}/{city-slug}/{service-slug}
```

Examples:
- `/uae/abu-dhabi/thermoplastic-road-marking`
- `/saudi-arabia/riyadh/warehouse-marking`
- `/uae/dubai/parking-lot-marking`
- `/saudi-arabia/jubail/industrial-marking`

---

## 5. The 128 URL Inventory

### UAE (64 URLs)
| City \ Service | road-marking | thermoplastic | parking-lot | warehouse | airport | industrial | safety-signage | epoxy-flooring |
|---|---|---|---|---|---|---|---|---|
| Abu Dhabi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dubai | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sharjah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ajman | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ras Al Khaimah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fujairah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Al Ain | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Umm Al Quwain | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Saudi Arabia (64 URLs)
| City \ Service | road-marking | thermoplastic | parking-lot | warehouse | airport | industrial | safety-signage | epoxy-flooring |
|---|---|---|---|---|---|---|---|---|
| Riyadh | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Jeddah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dammam | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Khobar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Jubail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Yanbu | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Makkah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Madinah | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 6. Implementation — `getServiceCityPages()`

Defined in `src/lib/gulf-data.ts`:

```ts
export interface ServiceCityPage {
  country: CountrySlug;
  countryName: string;
  citySlug: string;
  cityName: string;
  serviceSlug: string;
  serviceName: string;
  path: string;
}

export const getServiceCityPages = (): ServiceCityPage[] => {
  const pages: ServiceCityPage[] = [];
  for (const country of countries) {
    for (const city of getCitiesByCountry(country.slug)) {
      for (const service of services) {
        pages.push({
          country: country.slug,
          countryName: country.name,
          citySlug: city.slug,
          cityName: city.name,
          serviceSlug: service.slug,
          serviceName: service.name,
          path: `/${country.slug}/${city.slug}/${service.slug}`,
        });
      }
    }
  }
  return pages;
};

export const TOTAL_PROGRAMMATIC_PAGES = getServiceCityPages().length; // 128
```

### `generateStaticParams`

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

At build time, Next.js pre-renders all 128 pages. New pages added in the CMS later are generated on first request and cached via ISR.

---

## 7. Uniqueness Strategy

Each of the 128 pages must be **substantially unique** — not a Mad Libs template swap. The strategy:

### 7.1 City-specific sections (≥60% of body)
| Section | How it varies per city |
|---|---|
| **Hero** | "{Service Name} in {City} — {city-specific tagline}" e.g. "Thermoplastic Road Marking in Abu Dhabi — Capital-Grade Highway Marking" |
| **Local context intro** | 2–3 paragraphs covering: city's traffic volumes, key infrastructure (highways, malls, airports), local authority (RTA/DoT/MOMRA), climate considerations. |
| **Local stats block** | City population, km of roads, number of malls/airports/warehouses, recent megaprojects. |
| **Local projects** | 1–3 project cards filtered to `city` and `service`. Falls back to "Coming soon — see our {country} projects" if no local project yet. |
| **Local FAQ** | 3 city-specific FAQs (e.g. "Do you work with RTA Abu Dhabi?", "Are you approved by MOMRA Riyadh?"). |
| **Local CTA** | Pre-filled LeadForm with `country`, `city`, `service` defaults. WhatsApp link uses country-specific number. |

### 7.2 Shared sections (≤40% of body)
| Section | Why shared |
|---|---|
| Service overview | Same service definition applies everywhere — but introduced with city context. |
| Materials & equipment | Identical product spec; reused as a structured spec table. |
| Process (5-step) | Identical workflow; introduced as "Our {city} process". |

### 7.3 Templated copy rules
- The first H2 is always city-specific.
- The first paragraph always contains the city name.
- The first 100 words must be ≥70% unique vs. any other service-city page (checked by a content QA script).
- The meta description always contains "{city}" and "{service}".

---

## 8. Duplicate Content Avoidance

| Risk | Mitigation |
|---|---|
| Two pages share 80%+ identical copy | Content QA script (in `CONTENT_OPERATIONS.md`) rejects pages with >40% similarity to existing pages. |
| Service-city page is a thin re-write of the parent service page | Service-city page must contain city-specific local context, local projects, local FAQ — none of which exist on the service page. |
| Country page duplicates content from city pages | Country page is a hub: links to cities, no deep content per city. |
| Same project appears on 5 service-city pages | Project appears only on the service-city matching its `service` + `city`. Other pages link to it via "Related projects". |

---

## 9. Content Production Pipeline

Each of the 128 pages requires:
1. **Local research** (population, traffic, megaprojects, local authority)
2. **Local FAQ** (3 questions answered)
3. **Local projects** (≥1 case study or coming-soon placeholder)
4. **City-specific hero copy** (90 chars heading, 280 chars description)

This is produced by the AI Content Operations pipeline documented in `CONTENT_OPERATIONS.md`. The pipeline:
1. Research Agent gathers city facts
2. SEO Agent defines the keyword target
3. Content Agent drafts the page
4. QA Agent checks uniqueness + readability
5. Publishing Agent pushes to WordPress CMS
6. Linking Agent wires internal links

---

## 10. Internal Linking (per page)

Every service-city page links to:

| Link target | Where in the page |
|---|---|
| Parent country hub (`/{country}`) | Breadcrumb + footer |
| Parent city hub (`/{country}/{city}`) | Breadcrumb + hero "About {city}" link + footer |
| Parent service hub (`/services/{slug}`) | Breadcrumb + service overview link + footer |
| Local projects (`/projects/[slug]`) | "Local projects" section |
| Other services in the same city (`/{country}/{city}/{other-service}`) | "Other services in {city}" sidebar |
| Same service in nearby cities (`/{country}/{nearby-city}/{service}`) | "Also serving nearby" section |
| Industry page (`/industries/[slug]`) | "Industries we serve" sidebar |
| Lead form (on-page) | Hero CTA + footer CTA |

This creates a hub-and-spoke internal link structure where each programmatic page receives equity from and passes equity to multiple hubs.

---

## 11. Schema Per Page

Each service-city page emits:
- `Organization`
- `Service` (with `areaServed` = city)
- `LocalBusiness` (with `geo` = city lat/lng)
- `BreadcrumbList`
- `FAQPage` (if local FAQs present)

See `SCHEMA_ARCHITECTURE.md` for the JSON-LD examples.

---

## 12. Performance & Build Budget

| Metric | Target |
|---|---|
| Build time for 128 pages | < 90 s |
| Avg page weight (HTML) | ≤ 35 KB gzipped |
| LCP (mobile, p75) | < 2.5 s |
| INP (mobile, p75) | < 200 ms |

To stay within budget:
- `generateStaticParams` returns the 128 entries synchronously from `gulf-data.ts` — no per-page CMS fetch.
- Each page fetches only the data it needs (filtered `getProjectsList({ city, service })`).
- ISR (300s) ensures post-build updates without rebuild.

---

## 13. Monitoring & KPIs

| KPI | Target (90 days) |
|---|---|
| Indexed service-city pages (GSC) | ≥ 120 / 128 |
| Service-city pages ranking in top 20 | ≥ 60 / 128 |
| Service-city pages ranking in top 10 | ≥ 25 / 128 |
| Avg position per page | ≤ 25 |
| Click-through rate (GSC) | ≥ 4% |
| Leads from service-city pages | ≥ 50 / month |

---

## 14. Expansion Vectors

| Vector | New pages |
|---|---|
| Qatar expansion (Doha, Al Rayyan, Al Wakrah, Lusail) | +4 cities × 8 services = +32 pages |
| Bahrain (Manama, Riffa, Muharraq) | +3 cities × 8 = +24 pages |
| Kuwait (Kuwait City, Hawalli, Salmiya) | +3 cities × 8 = +24 pages |
| Oman (Muscat, Salalah, Sohar) | +3 cities × 8 = +24 pages |
| New service (e.g. `anti-skid-surfacings`) | +1 service × 16 cities = +16 pages |

The `getServiceCityPages()` function automatically scales as `countries`, `cities`, and `services` arrays grow.

---

## 15. Related Documents

- `ROUTES.md` — service-city route definition
- `INTERNAL_LINKING.md` — hub-and-spoke rules
- `SCHEMA_ARCHITECTURE.md` — per-page JSON-LD
- `CONTENT_OPERATIONS.md` — content production pipeline
- `SEO_AUDIT.md` — overall SEO strategy
