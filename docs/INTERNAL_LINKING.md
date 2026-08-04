# Gulf Seismic — Internal Linking Engine

> The internal linking engine is the connective tissue of the authority graph. It defines how link equity flows between Country, City, Service, Industry, Project, Case Study and Blog nodes, and how every page reinforces the topical clusters around it.

This document defines the linking rules, the contextual link blocks, the breadcrumb rules, and the related-content components that implement the engine.

---

## 1. Linking Principles

| Principle | Rationale |
|---|---|
| **Hub-and-spoke** | Broad hubs (Country, Service) link to many spokes (city, project); spokes link back to hubs. |
| **Editorial > navigational** | In-body contextual links carry more weight than footer/sidebar links. |
| **Three-axis relevance** | Every project links along three axes: geography (city), service type, industry context. |
| **No orphans** | Every page must have ≥1 inbound internal link. Footer guarantees this. |
| **No dead ends** | Every page must have ≥1 outbound internal link to a related page (not just header/footer). |
| **Anchor text variety** | Mix exact-match, partial-match, and generic ("learn more") anchor text. |

---

## 2. Link Graph Rules

### 2.1 Country → City (down)
- Country page lists all cities in that country (8 cities each).
- Anchor text: city name (e.g. "Abu Dhabi", "Riyadh").
- Position: in-body grid + footer.

### 2.2 City → Country (up)
- Every city page breadcrumb links back to its country.
- City page footer lists the country name.

### 2.3 Country → Service (cross)
- Country page lists all 8 services offered in that country.
- Anchor text: service name (e.g. "Thermoplastic Road Marking in UAE").
- Position: in-body grid + footer.

### 2.4 City → Service (programmatic)
- City page links to all 8 service-city pages for that city.
- Anchor text: "{Service} in {City}" (e.g. "Thermoplastic Road Marking in Abu Dhabi").
- Position: in-body "Services in {city}" grid.

### 2.5 Service → City (programmatic)
- Service page links to all 16 service-city pages for that service.
- Anchor text: "{Service} in {City}" (e.g. "Thermoplastic Road Marking in Dubai").
- Position: in-body "Cities offering {service}" grid.

### 2.6 Service-city → City hub (up)
- Breadcrumb: Home → Country → City → Service.
- In-body "About {city}" link.

### 2.7 Service-city → Service hub (up)
- Breadcrumb: Home → Services → Service.
- In-body "Learn more about {service}" link.

### 2.8 Service-city → Local projects (down)
- "Local projects" section: 1–3 project cards filtered to city + service.
- Anchor text: project title.

### 2.9 Project → City/Service/Industry (up)
- Breadcrumb: Home → Projects → Project.
- In-body links: "More projects in {city}", "More {service} projects", "More {industry} projects".

### 2.10 Project → Related projects (cross)
- "Related projects" section: 3 cards (same service, different city).
- Anchor text: project title.

### 2.11 Project → Case Study (down)
- "Read full case study" CTA linking to `/case-studies/[slug]`.

### 2.12 Case Study → Project (up)
- Breadcrumb: Home → Case Studies → Case Study.
- In-body "View the original project" link.

### 2.13 Blog → Service/City/Project (cross)
- Blog post body links to ≥3 nodes (service, city, project, or industry).
- Anchor text: descriptive, varied.

### 2.14 All pages → Lead form
- Every page has at least one CTA linking to `/#quote` or `/contact`.
- Service-city pages embed the lead form directly (prefilled with city + service).

---

## 3. Breadcrumbs

Implemented by `src/components/gulf/breadcrumbs.tsx`. Every page (except homepage) renders breadcrumbs. The same array feeds both the visible UI and the `BreadcrumbList` JSON-LD.

### 3.1 Breadcrumb patterns by route

| Route | Breadcrumb |
|---|---|
| `/uae` | Home → UAE |
| `/saudi-arabia` | Home → Saudi Arabia |
| `/uae/abu-dhabi` | Home → UAE → Abu Dhabi |
| `/uae/abu-dhabi/thermoplastic-road-marking` | Home → UAE → Abu Dhabi → Thermoplastic Road Marking |
| `/services/thermoplastic-road-marking` | Home → Services → Thermoplastic Road Marking |
| `/projects/abu-dhabi-highway-thermoplastic` | Home → Projects → Abu Dhabi–Al Ain Highway Thermoplastic Marking |
| `/case-studies/abu-dhabi-highway-night-marking` | Home → Case Studies → How We Marked 42 km of Highway… |
| `/industries/highways-roads` | Home → Industries → Highways & Roads |
| `/blog/thermoplastic-vs-cold-paint-road-marking` | Home → Blog → Thermoplastic vs Cold Paint… |
| `/about` | Home → About |
| `/contact` | Home → Contact |

### 3.2 Breadcrumb code

```tsx
<Breadcrumbs items={[
  { name: "Home", url: "/" },
  { name: "UAE", url: "/uae" },
  { name: "Abu Dhabi", url: "/uae/abu-dhabi" },
  { name: "Thermoplastic Road Marking" },  // current page; no URL
]} />
```

---

## 4. Footer Link Strip

Implemented by `src/components/gulf/footer.tsx`. The footer renders on every page and guarantees:

- All 8 services (anchor: service name; href: `/services/{slug}`)
- Both countries (anchor: country name; href: `/{slug}`)
- All 16 cities (in a compact strip — anchor: city name; href: `/{country}/{slug}`)
- 4 commercial links: About, Projects, Industries, Contact
- Legal links: Privacy, Terms, Sitemap

This ensures no page is an orphan and gives crawlers a path to every URL from every page.

---

## 5. Related-Content Blocks (Components)

### 5.1 `RelatedServices` (planned)
Renders 3–6 service cards related to the current context.
```tsx
<RelatedServices services={services} contextCity={city} />
```

### 5.2 `RelatedProjects` (planned)
Renders 3 project cards related by service (excluding current project).
```tsx
<RelatedProjects
  projects={projects.filter(p => p.service === current.service && p.slug !== current.slug).slice(0, 3)}
/>
```

### 5.3 `LocalProjects` (planned)
Renders 1–3 project cards filtered by city + service.
```tsx
<LocalProjects
  projects={getProjectsList({ city, service })}
  fallback={<ComingSoonNotice city={city} service={service} />}
/>
```

### 5.4 `CitiesOfferingService` (planned)
Renders 16 city links for a given service.
```tsx
<CitiesOfferingService service={service} />
```

### 5.5 `ServicesInCity` (planned)
Renders 8 service-city links for a given city.
```tsx
<ServicesInCity country={country} city={city} />
```

### 5.6 `RelatedCaseStudies` (planned)
Renders 3 case study cards (related by service or industry).

### 5.7 `RelatedBlogs` (planned)
Renders 3 blog post cards (related by category or tag).

---

## 6. Contextual Link Rules

| Context | In-body link | Anchor text |
|---|---|---|
| Service page mentions a city | Link to that city hub | city name |
| Service page mentions an industry | Link to that industry hub | industry name |
| City page mentions a service | Link to the service-city page | "{service} in {city}" |
| Project page mentions the client's industry | Link to that industry hub | industry name |
| Blog post mentions a project | Link to the project detail | project title |
| Blog post mentions a service | Link to the service hub | service name |
| Case study mentions the project team | Link to the linked project | project title |

In-body links must use **descriptive anchor text**, not "click here" or "learn more". Footer/sidebar links may use shorter anchors.

---

## 7. Link Equity Flow Diagram

```
                 ┌──────────────┐
                 │  Homepage    │  ← highest equity (external links)
                 └──────┬───────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │ Country │    │ Service  │    │ Projects │
   │  hubs   │    │  hubs    │    │  index   │
   └────┬────┘    └────┬─────┘    └────┬─────┘
        │              │                │
        ▼              ▼                ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │  City   │    │ Service- │    │ Project  │
   │  hubs   │◀──▶│  city    │◀──▶│ details  │
   │ (16)    │    │  (128)   │    │   (N)    │
   └────┬────┘    └────┬─────┘    └────┬─────┘
        │              │                │
        └──────────────┼────────────────┘
                       ▼
                 ┌──────────┐
                 │ Case     │  ← bottom-up reinforcement
                 │ studies  │
                 └──────────┘
                       ▲
                       │
                 ┌──────────┐
                 │  Blog    │  ← top-of-funnel discovery
                 └──────────┘
```

---

## 8. Anchor Text Strategy

| Link type | Anchor pattern | Example |
|---|---|---|
| Country hub | Country name | "UAE", "Saudi Arabia" |
| City hub | City name | "Abu Dhabi" |
| Service hub | Service name | "Thermoplastic Road Marking" |
| Service-city | "{Service} in {City}" | "Thermoplastic Road Marking in Abu Dhabi" |
| Project | Project title | "Abu Dhabi–Al Ain Highway Thermoplastic Marking" |
| Case study | Case study title | "How We Marked 42 km of Highway Without Closing a Lane" |
| Blog | Blog title | "Thermoplastic vs Cold Paint Road Marking" |
| Industry | Industry name | "Highways & Roads" |
| CTA | Action verb | "Get a Free Quote" |

Avoid:
- "Click here"
- "Read more" (use only when paired with descriptive aria-label)
- Exact-match keyword stuffing (vary anchors naturally)

---

## 9. Crawl Path Optimisation

| Goal | Strategy |
|---|---|
| Discover new pages fast | Footer + sitemap guarantee ≤3 clicks from homepage to any page. |
| Pass equity to money pages | Service-city pages (128) receive inbound links from parent city hub + parent service hub + footer. |
| Reinforce topical clusters | Project pages link to parent service + city + industry → reinforces three-axis relevance. |
| Avoid dilution | No more than 100 links per page (Google's old guideline; still good practice). Footer has ~30 links; in-body has ≤8. |

---

## 10. Link Audit Checklist (Quarterly)

| Check | Tool | Action |
|---|---|---|
| Orphan pages | Ahrefs / Screaming Frog | Add inbound links or remove |
| Broken internal links | Screaming Frog | Fix or redirect |
| Anchor text distribution | Ahrefs Anchor report | Diversify if over-optimised |
| Inbound link count per page | GSC Internal Links report | Ensure ≥1 for every page |
| Outbound link count per page | Manual | Cap at 100 |
| Deep links to money pages | Ahrefs Site Explorer | Boost equity to underperforming service-city pages |

---

## 11. Implementation Notes

- All internal links use Next.js `<Link>` component for client-side navigation.
- `rel="noopener noreferrer"` is added to external links only (LinkedIn, Instagram, WhatsApp, tel:, mailto:).
- All internal links omit `rel="nofollow"` — we want full equity flow.
- The footer is rendered on every page via root layout.
- Breadcrumbs are rendered per-page (not in layout) so they reflect the actual hierarchy.

---

## 12. Related Documents

- `AUTHORITY_GRAPH.md` — entity graph design
- `ROUTES.md` — route inventory
- `COMPONENT_INVENTORY.md` — component list
- `SCHEMA_ARCHITECTURE.md` — `BreadcrumbList` schema
