# Gulf Seismic — Project Authority Layer

> Route: `/projects`, `/projects/[slug]`
> CPT: `project` (WordPress)
> ACF Field Group: `projectFields`
> Schema: `CreativeWork`
> Purpose: Build topical authority via real-world project evidence.

The `/projects` hub and `/projects/[slug]` detail pages are the **proof layer** of the authority graph. They convert abstract service claims into verifiable, dated, located, measured outcomes — the kind of evidence Google's E-E-A-T guidelines reward.

---

## 1. Why Projects Are the Authority Anchor

Services pages describe **what we do**. Industry pages describe **who we do it for**. Projects prove **that we actually did it** — with a real client, a real location, a real duration, real materials, real equipment and real measured results.

A `/services/thermoplastic-road-marking` page that links to `/projects/abu-dhabi-highway-thermoplastic` (with `CreativeWork` schema) signals to search engines: *this isn't marketing copy; this is documented work.*

---

## 2. Project Authority Template

Every project page renders the same eight-section template:

| # | Section | Source field | Purpose |
|---|---|---|---|
| 1 | **Hero** | `title`, `city`, `service`, `year`, `area` | Position the project |
| 2 | **Challenge** | `challenge` | What problem was the client trying to solve? |
| 3 | **Solution** | `solution` | What approach did Gulf Seismic take? |
| 4 | **Execution** | `execution` | How was the work actually performed? |
| 5 | **Materials** | `materials` (array) | What materials were used? (spec credibility) |
| 6 | **Equipment** | `equipment` (array) | What equipment was deployed? (spec credibility) |
| 7 | **Duration** | `duration` | How long did it take? (timeline credibility) |
| 8 | **Results** | `results` (label/value array) | What measurable outcomes were achieved? (proof) |
| 9 | **Gallery** | `gallery` (image array) | Visual evidence |
| 10 | **Testimonial** | (linked `CaseStudy.testimonial`) | Social proof |
| 11 | **Next project** | next project in portfolio | Engagement loop |

---

## 3. Project Entity (TypeScript)

Defined in `src/lib/gulf-data.ts`:

```ts
export interface Project {
  slug: string;
  title: string;
  country: CountrySlug;       // "uae" | "saudi-arabia"
  city: string;                // city slug
  service: string;             // service slug
  industry: string;            // industry slug
  client: string;
  year: number;
  duration: string;            // e.g. "6 weeks"
  challenge: string;           // 200–500 chars
  solution: string;            // 200–500 chars
  execution: string;           // 200–600 chars
  materials: string[];         // e.g. ["Hydrocarbon thermoplastic", "Type II glass beads"]
  equipment: string[];         // e.g. ["Self-propelled applicator ×2", "Reflectometer"]
  results: { label: string; value: string }[];  // e.g. [{ label: "Distance marked", value: "42 km" }]
  gallery: { alt: string; caption: string }[];
  location: string;            // e.g. "E22 Highway, Abu Dhabi – Al Ain"
  area: string;                // e.g. "42 km" or "22,000 m²"
}
```

---

## 4. Example Project URLs

The 6 seeded projects (will grow to 50+ in production):

| URL | Title | City | Service |
|---|---|---|---|
| `/projects/abu-dhabi-highway-thermoplastic` | Abu Dhabi–Al Ain Highway Thermoplastic Marking | Abu Dhabi | thermoplastic-road-marking |
| `/projects/dubai-mall-parking-marking` | Dubai Mega-Mall Parking Deck Marking | Dubai | parking-lot-marking |
| `/projects/riyadh-warehouse-epoxy-marking` | Riyadh Logistics Hub Warehouse Floor Marking | Riyadh | warehouse-marking |
| `/projects/jubail-petrochemical-hazard-marking` | Jubail Petrochemical Plant Hazard Marking | Jubail | industrial-marking |
| `/projects/dammam-airport-taxiway-marking` | Dammam Airport Taxiway Marking Upgrade | Dammam | airport-marking |
| `/projects/sharjah-factory-epoxy-floor` | Sharjah Manufacturing Facility Epoxy Floor | Sharjah | epoxy-flooring |

---

## 5. Example — Abu Dhabi Highway Thermoplastic (full record)

```ts
{
  slug: "abu-dhabi-highway-thermoplastic",
  title: "Abu Dhabi–Al Ain Highway Thermoplastic Marking",
  country: "uae",
  city: "abu-dhabi",
  service: "thermoplastic-road-marking",
  industry: "highways-roads",
  client: "Confidential Transport Authority",
  year: 2024,
  duration: "6 weeks",
  challenge: "Re-mark 42 km of a high-speed inter-city highway with minimal lane closures during peak pilgrimage and commuter traffic, while upgrading reflectivity to night-driving standards.",
  solution: "Deployed two self-propelled thermoplastic applicators operating in night-shift windows between 11pm and 5am, applying hot thermoplastic with simultaneous glass-bead dispensing across all three lanes plus hard-shoulder.",
  execution: "Crews pre-marked with laser guidance, water-blasted ghost lines, and applied 3.0 mm thermoplastic at 185°C. Reflectivity tested every 500 m to R3 specification. Total of 168 km of line applied.",
  materials: ["Hydrocarbon thermoplastic", "Type II glass beads", "Anti-skid aggregate"],
  equipment: ["Self-propelled applicator ×2", "Oil-jacketed kettle", "Water-blaster", "Reflectometer"],
  results: [
    { label: "Distance marked", value: "42 km" },
    { label: "Line applied", value: "168 km" },
    { label: "Night closures", value: "28 shifts" },
    { label: "Reflectivity", value: "R3 achieved" },
  ],
  gallery: [
    { alt: "Highway thermoplastic line marking at night", caption: "Night-shift application on E22" },
    { alt: "Glass bead dispenser in operation", caption: "Simultaneous bead dispensing" },
  ],
  location: "E22 Highway, Abu Dhabi – Al Ain",
  area: "42 km",
}
```

---

## 6. ACF Field Group (`projectFields`)

Full specification in `ACF_BLUEPRINT.md` §6. Summary:

| Field | Type | Required | Notes |
|---|---|---|---|
| `country` | Post Object (Country) | ✅ | Single |
| `city` | Post Object (City) | ✅ | Single |
| `service` | Post Object (Service) | ✅ | Single |
| `industry` | Post Object (Industry) | ✅ | Single |
| `client` | Text | ✅ | |
| `year` | Number | ✅ | 2015 → current year |
| `duration` | Text | ✅ | |
| `challenge` | Textarea | ✅ | 200–500 chars |
| `solution` | Textarea | ✅ | 200–500 chars |
| `execution` | Textarea | ✅ | 200–600 chars |
| `materials` | Repeater | ✅ | Min 2, max 10 |
| `equipment` | Repeater | ✅ | Min 1, max 10 |
| `results` | Repeater | ✅ | Min 2, max 6 |
| `gallery` | Gallery | ✅ | Min 2, max 20 images |
| `location` | Text | ✅ | |
| `area` | Text | ✅ | |

---

## 7. Page Rendering

```tsx
// src/app/projects/[slug]/page.tsx
import { getProjectsList } from "@/lib/wordpress";
import { getCaseStudiesList } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/seo";
import { projectSchema, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjectsList();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const projects = await getProjectsList();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return buildMetadata({ title: "Not Found", noIndex: true });
  return buildMetadata({
    title: `${project.title} — Gulf Seismic Project`,
    description: project.challenge.slice(0, 155),
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const projects = await getProjectsList();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const caseStudies = await getCaseStudiesList();
  const caseStudy = caseStudies.find((cs) => cs.projectSlug === project.slug);

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
      <ProjectDetail project={project} caseStudy={caseStudy} relatedProjects={...} />
    </>
  );
}
```

---

## 8. JSON-LD — `CreativeWork` Schema

Built in `src/lib/seo.ts`:

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

See `SCHEMA_ARCHITECTURE.md` §7 for the full JSON-LD example.

---

## 9. Internal Linking (per project page)

| Link target | Where in the page |
|---|---|
| Parent country hub | Breadcrumb + "More projects in {country}" |
| Parent city hub | Breadcrumb + "More projects in {city}" |
| Parent service hub | "View {service} service" link |
| Parent industry hub | "More {industry} projects" |
| Related projects (same service, different city) | "Related projects" section (3 cards) |
| Linked case study | "Read full case study" CTA |
| Lead form (prefilled with service + city) | Footer CTA |

---

## 10. Quality Bar

Every project published must satisfy:

| Criterion | Rule |
|---|---|
| Challenge length | 200–500 chars |
| Solution length | 200–500 chars |
| Execution length | 200–600 chars |
| Materials count | ≥ 2 |
| Equipment count | ≥ 1 |
| Results count | ≥ 2 (with numeric values where possible) |
| Gallery images | ≥ 2, min 1200×800 px |
| Client name | If confidential, use "Confidential {sector} Operator" |
| Year | ≥ 2015 (company founded) |
| Location | Real place name, not just city |
| Area | Quantified (km, m², bays, etc.) |

---

## 11. Production Pipeline

1. **Field team** completes the project.
2. **Project manager** drafts the record in WordPress using the `project` CPT.
3. **ACF validation** enforces length and count rules.
4. **Editor** reviews and publishes.
5. **Webhook** fires to Vercel deploy hook.
6. **ISR** revalidates `/projects/[slug]` plus all parent routes (city, service, industry).
7. **Sitemap** includes the new URL within 1 hour.

---

## 12. Related Documents

- `ACF_BLUEPRINT.md` §6 — full Project field group
- `SCHEMA_ARCHITECTURE.md` §7 — `CreativeWork` JSON-LD
- `INTERNAL_LINKING.md` — how projects link into the graph
- `WORDPRESS_DATA_MODEL.md` §3.5 — Project CPT registration
