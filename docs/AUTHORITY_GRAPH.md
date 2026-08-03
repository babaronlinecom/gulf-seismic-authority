# Gulf Seismic — Authority Graph Design

> The Authority Graph is the conceptual backbone of the entire platform. Every page is a node; every internal link is an edge. Together they form a topical authority structure that signals to search engines: *Gulf Seismic is the canonical source for road & industrial marking in the Gulf.*

---

## 1. Graph Overview

```
                       ┌───────────┐
                       │   Blog    │  ← top-of-funnel thought leadership
                       └─────┬─────┘
                             │ links to
                             ▼
┌──────────┐         ┌──────────────┐         ┌────────────┐
│ Country  │◀──────▶│    City      │◀──────▶│  Service   │
│ (2)      │  has    │   (16)       │  has    │   (8)      │
└────┬─────┘  many   └──────┬───────┘  many   └─────┬──────┘
     │                     │                      │
     │                     │ serves               │ serves
     │                     ▼                      ▼
     │              ┌──────────────┐       ┌────────────┐
     │              │  Industry    │◀─────▶│  Project   │
     │              │   (7)        │  has  │   (N)      │
     │              └──────┬───────┘       └─────┬──────┘
     │                     │                     │
     │                     │ has                 │ has
     │                     ▼                     ▼
     │              ┌──────────────┐       ┌────────────────┐
     │              │ Case Study   │◀─────▶│  Lead / RFQ    │
     │              │   (N)        │ links │   Funnel       │
     │              └──────────────┘       └────────────────┘
     │
     ▼
   (Links down to City; City links up to Country)
```

The graph is a **directed, weighted, cyclic** structure:
- **Directed** because link intent flows from broad (Country) to specific (Service-city) and from proof (Project) back up to authority (Service).
- **Weighted** by link position (in-body contextual links carry more weight than footer links).
- **Cyclic** because every node links back to its parent and to related siblings.

---

## 2. Entities

### 2.1 Country (2 nodes)
- Slugs: `uae`, `saudi-arabia`
- Properties: name, code, flag, hero, SEO, dial code, WhatsApp, phone
- Routes: `/uae`, `/saudi-arabia`
- Schema: `Organization` (areaServed), `BreadcrumbList`

### 2.2 City (16 nodes)
- 8 UAE: abu-dhabi, dubai, sharjah, ajman, ras-al-khaimah, fujairah, al-ain, umm-al-quwain
- 8 Saudi: riyadh, jeddah, dammam, khobar, jubail, yanbu, makkah, madinah
- Properties: name, region, lat/lng, hero, SEO, population, highlights
- Routes: `/{country}/{city}`
- Schema: `LocalBusiness` with `geo`, `areaServed`

### 2.3 Service (8 nodes)
- Slugs: road-marking, thermoplastic-road-marking, parking-lot-marking, warehouse-marking, airport-marking, industrial-marking, safety-signage, epoxy-flooring
- Properties: name, tagline, short/long description, benefits, materials, equipment, industriesServed, FAQs, hero, SEO, process, specs
- Routes: `/services/{slug}`
- Schema: `Service` with `provider`, `areaServed`, `offers`

### 2.4 Industry (7 nodes)
- Slugs: highways-roads, commercial, logistics, oil-gas, aviation, industrial, healthcare, energy, retail
- Properties: name, description, challenges, solutions, services
- Routes: `/industries/{slug}`
- Schema: `Thing` (aggregated), `BreadcrumbList`

### 2.5 Project (N nodes; 6 seeded)
- Properties: title, country, city, service, industry, client, year, duration, challenge, solution, execution, materials, equipment, results, gallery, location, area
- Routes: `/projects/{slug}`
- Schema: `CreativeWork` with `creator`, `locationCreated`, `about`

### 2.6 Case Study (N nodes; 3 seeded)
- Properties: title, projectSlug, summary, outcomes, testimonial
- Routes: `/case-studies/{slug}`
- Schema: `Article`

### 2.7 Blog (N nodes; 6 seeded)
- Properties: title, excerpt, category, readTime, date, author
- Routes: `/blog/{slug}`
- Schema: `Article`

### 2.8 FAQ (N nodes)
- Aggregated per service; rendered inside service and service-city pages
- Schema: `FAQPage`

---

## 3. Relationships (Edges)

| From | To | Cardinality | Link Type | Implementation |
|---|---|---|---|---|
| Country | City | 1 → N | "Cities in {country}" | Country page lists cities |
| City | Country | N → 1 | Breadcrumb | Breadcrumbs component |
| Country | Service | 1 → N | "Services in {country}" | Country page lists services |
| Service | Country | N → 1 | areaServed | Service schema |
| City | Service | N → N | Service-city page | `/{country}/{city}/{service}` route |
| Service | Industry | N → N | "Industries served" | `service.industriesServed` array |
| Industry | Service | N → N | "Recommended services" | `industry.services` array |
| Project | City | N → 1 | "Located in" | Project card shows city |
| Project | Service | N → 1 | "Type of work" | Project card shows service |
| Project | Industry | N → 1 | "Industry context" | Project card shows industry |
| Case Study | Project | N → 1 | "Based on project" | `caseStudy.projectSlug` |
| Blog | Service | N → N | "Related to" | Blog tag taxonomy |
| Blog | City | N → N | "Relevant to" | Blog tag taxonomy |
| All nodes | Lead Form | 1 → 1 | CTA | Lead form prefilled with node context |

---

## 4. Link Equity Flow

### 4.1 Top-down equity distribution
The homepage (highest PageRank) passes equity to:
- Country hubs (2)
- Service hubs (8)
- Project index (1)

Country hubs pass equity to:
- City hubs (16)
- Service-city pages in that country (64 per country, 128 total)

City hubs pass equity to:
- All 8 service-city pages for that city
- Local projects

Service hubs pass equity to:
- All 16 service-city pages for that service
- Service-related projects

### 4.2 Bottom-up authority reinforcement
- Project pages link back to the parent Service page and City hub → reinforces topical relevance.
- Case studies link back to the Project → reinforces project authority.
- Blog posts link to Service, City, and Project pages → topical depth signals.

### 4.3 Cross-linking rules
| Rule | Rationale |
|---|---|
| Every service-city page links to its parent city hub and parent service page. | Hub-and-spoke reinforcement. |
| Every project page links to its parent city, service, and industry page. | Three-axis relevance. |
| Every case study links to its parent project. | Single-axis reinforcement. |
| Every blog post links to ≥3 other nodes (service, city, project, or industry). | Topical depth. |
| Footer carries all 8 services + 16 cities + 2 countries on every page. | Crawl discovery + equity spread. |
| In-body contextual links carry more weight than footer/sidebar links. | Editorial endorsement. |

---

## 5. Topical Authority Map

The graph builds topical authority along three orthogonal axes:

### 5.1 Geographic axis
```
UAE → Abu Dhabi, Dubai, Sharjah, Ajman, RAK, Fujairah, Al Ain, Umm Al Quwain
KSA → Riyadh, Jeddah, Dammam, Khobar, Jubail, Yanbu, Makkah, Madinah
```
Each city is a complete sub-graph: city hub + 8 service-city pages + local projects + local case studies.

### 5.2 Service axis
```
road-marking → 16 city variants
thermoplastic-road-marking → 16 city variants
parking-lot-marking → 16 city variants
warehouse-marking → 16 city variants
airport-marking → 16 city variants
industrial-marking → 16 city variants
safety-signage → 16 city variants
epoxy-flooring → 16 city variants
```
Each service is a complete sub-graph: service hub + 16 city variants + service projects + service FAQs.

### 5.3 Industry axis
```
highways-roads, commercial, logistics, oil-gas, aviation, industrial, healthcare, energy, retail
```
Each industry is a complete sub-graph: industry hub + services used + industry projects.

The three axes intersect at **Project** nodes. A project like `dammam-airport-taxiway-marking` simultaneously reinforces:
- Geographic (Dammam, Saudi Arabia)
- Service (airport-marking)
- Industry (aviation)

---

## 6. Authority Graph Component

`src/components/gulf/authority-graph.tsx` renders a visual representation on the homepage:

```
2 Countries → 16 Cities → 8 Services → 7 Industries → 6 Projects → 3 Case Studies → 6 Blogs
```

Each node count is rendered as a card with the entity count, helping users (and crawlers) understand the scope of the platform. The component includes a callout linking to an example programmatic page (`/uae/abu-dhabi/thermoplastic-road-marking`).

---

## 7. Data Flow

```
WordPress CMS (cms.gulfseismic.com)
  │
  │ GraphQL
  ▼
src/lib/wordpress.ts  ←── fetch with next.revalidate = 300s (ISR)
  │
  │ typed entities (Country, City, Service, ...)
  │ (falls back to gulf-data.ts seed if CMS unreachable)
  ▼
src/app/* page.tsx    ←── Server Component, calls wordpress.ts
  │
  │ renders React tree
  ▼
HTML + JSON-LD  →  Vercel CDN  →  Googlebot
```

The CMS is the single source of truth; the seed data is a resilient fallback. When the CMS publishes a new Project, a webhook triggers a Vercel deploy hook → ISR revalidates the affected pages → the new project appears within 5 minutes.

---

## 8. Authority Graph KPIs

| KPI | Target (90 days) |
|---|---|
| Indexed nodes | ≥ 200 |
| Avg internal links per page | ≥ 8 |
| Orphan pages | 0 |
| Pages with ≥1 inbound internal link | 100% |
| Topical clusters ranking in top 10 | ≥ 5 |
| Service-city pages ranking in top 20 | ≥ 60 / 128 |

---

## 9. Expansion Vectors

| Vector | New nodes | Phase |
|---|---|---|
| Qatar expansion | +1 Country, +4 Cities, +32 service-city pages | Quarter 3 |
| Arabic content | 2× nodes (mirror in Arabic) | Quarter 2 |
| Resources (whitepapers, datasheets) | New CPT `Resources` | Quarter 2 |
| Tenders (public tender listings) | New CPT `Tenders` | Quarter 3 |
| Personnel / case-study authors | New CPT `TeamMembers` | Quarter 2 |

---

## 10. Related Documents

- `ROUTES.md` — how each node becomes a URL
- `INTERNAL_LINKING.md` — concrete linking rules and components
- `WORDPRESS_DATA_MODEL.md` — CPT definitions for each node
- `ACF_BLUEPRINT.md` — field groups per node
- `SCHEMA_ARCHITECTURE.md` — JSON-LD per node
