# Gulf Seismic — GraphQL Architecture

> Implementation: `src/lib/wordpress.ts`
> Endpoint: `https://cms.gulfseismic.com/graphql`
> Auth: none for reads (public); Application Password for lead mutations
> Caching: ISR `revalidate: 300` (5 minutes) on every fetch

This document specifies every GraphQL query, its variables, fragments, caching strategy, error handling and the resilient fallback pattern that guarantees the frontend always renders — even when the CMS is unreachable.

---

## 1. Client Architecture

### 1.1 Endpoint
```ts
const CMS_ENDPOINT = company.graphqlEndpoint;
// "https://cms.gulfseismic.com/graphql"
```

### 1.2 Fetch wrapper
```ts
async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s hard timeout
    const res = await fetch(CMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      next: { revalidate: 300 }, // ISR: 5 min cache
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) {
      console.warn("[WPGraphQL] errors:", json.errors.map((e) => e.message).join("; "));
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.warn("[WPGraphQL] fetch failed, using seed data:", (err as Error).message);
    return null;
  }
}
```

### 1.3 Resilient fallback pattern
Every public API function follows this pattern:

```ts
export async function getCountries(): Promise<Country[]> {
  const data = await fetchGraphQL<{ countries: { nodes: unknown[] } }>(QUERIES.GetCountries);
  if (data?.countries?.nodes?.length) {
    // Map CMS shape → Country[] (left to migration; fall through to seed for now)
    return mapCountries(data.countries.nodes);
  }
  return countries; // seed data from gulf-data.ts
}
```

The CMS mapping is currently stubbed (see `TECHNICAL_DEBT.md`). When implemented, the mapper converts the WPGraphQL response shape into the typed entity interfaces declared in `gulf-data.ts`.

---

## 2. Query Inventory

All query strings are exported from `QUERIES` in `src/lib/wordpress.ts`:

| Query | Variables | Returns | Used by |
|---|---|---|---|
| `GetCountries` | none | `Country[]` | Country pages, homepage |
| `GetCities` | `country: String` | `City[]` | City pages, country pages |
| `GetServices` | none | `Service[]` | Service pages, homepage, city pages |
| `GetProjects` | `city: String`, `service: String` | `Project[]` | Project pages, city pages, service pages |
| `GetCaseStudies` | none | `CaseStudy[]` | Case study pages, project pages |
| `GetBlogs` | none | `BlogPost[]` | Blog index, blog detail |
| `GetFaqs` | `service: String` | `Faq[]` | Service pages, service-city pages |

---

## 3. Query Specifications

### 3.1 GetCountries

```graphql
query GetCountries {
  countries(first: 50) {
    nodes {
      slug
      title
      content
      countryFields {
        countryCode
        heroHeading
        heroDescription
        seoTitle
        seoDescription
      }
    }
  }
}
```

**Variables:** none.
**Caching:** ISR 300s.
**Used by:** homepage, country hub pages.
**Fallback:** seed `countries` array (2 entries: UAE, Saudi Arabia).

### 3.2 GetCities

```graphql
query GetCities($country: String) {
  cities(first: 100, where: { country: $country }) {
    nodes {
      slug
      title
      cityFields {
        country
        latitude
        longitude
        heroHeading
        heroDescription
        seoTitle
        seoDescription
      }
    }
  }
}
```

**Variables:** `{ country: "uae" | "saudi-arabia" }` (optional; omit to fetch all).
**Caching:** ISR 300s.
**Used by:** city hub pages, country pages.
**Fallback:** seed `cities` array filtered by country.

### 3.3 GetServices

```graphql
query GetServices {
  services(first: 50) {
    nodes {
      slug
      title
      serviceFields {
        shortDescription
        longDescription
        benefits
        materials
        equipment
        industriesServed
        seoTitle
        seoDescription
      }
    }
  }
}
```

**Variables:** none.
**Caching:** ISR 300s.
**Used by:** service detail pages, homepage, city pages, industry pages.
**Fallback:** seed `services` array (8 entries).
**Notes:** `benefits`, `materials`, `equipment` are ACF repeaters; in GraphQL they return arrays of strings.

### 3.4 GetProjects

```graphql
query GetProjects($city: String, $service: String) {
  projects(first: 50, where: { city: $city, service: $service }) {
    nodes {
      slug
      title
      projectFields {
        country
        city
        service
        industry
        challenge
        solution
        execution
        duration
        materials
        equipment
        results
      }
    }
  }
}
```

**Variables:** `{ city?: string, service?: string }` — both optional.
**Caching:** ISR 300s.
**Used by:** project detail pages, city pages (filter by city), service pages (filter by service).
**Fallback:** seed `projects` array filtered by city and/or service.
**Notes:** `where: { city, service }` translates to a `tax_query` on the WP side (see `WORDPRESS_DATA_MODEL.md` §3.5). The query omits `gallery` to keep payload small; gallery is fetched separately via `GetProjectGallery` (Phase 2).

### 3.5 GetCaseStudies

```graphql
query GetCaseStudies {
  caseStudies(first: 50) {
    nodes {
      slug
      title
      caseStudyFields {
        projectSlug
        summary
        outcomes
        testimonial
      }
    }
  }
}
```

**Variables:** none.
**Caching:** ISR 300s.
**Used by:** case study detail pages, project pages (find linked case study).
**Fallback:** seed `caseStudies` array (3 entries).
**Notes:** `testimonial` is a group field returning `{ quote, author, role }` or null.

### 3.6 GetBlogs

```graphql
query GetBlogs {
  blogs(first: 50) {
    nodes {
      slug
      title
      excerpt
      date
      author {
        node {
          name
        }
      }
    }
  }
}
```

**Variables:** none.
**Caching:** ISR 300s.
**Used by:** blog index, blog detail, homepage (latest posts).
**Fallback:** seed `blogPosts` array (6 entries).
**Notes:** Body content (`content`) is not fetched here; a separate `GetBlogBySlug` query retrieves full body when the blog detail page is rendered.

### 3.7 GetFaqs

```graphql
query GetFaqs($service: String) {
  faqs(first: 50, where: { service: $service }) {
    nodes {
      title
      content
    }
  }
}
```

**Variables:** `{ service: string }` — the service slug.
**Caching:** ISR 300s.
**Used by:** service detail pages, service-city pages (FAQ section).
**Fallback:** inline FAQs from the `Service.faqs` field in seed data.
**Notes:** FAQ post title = question; post content = answer. The `faqFields.service` Post Object relationship powers the `where` filter.

---

## 4. Public API Surface

| Function | Input | Output | Cache |
|---|---|---|---|
| `getCountries()` | – | `Promise<Country[]>` | 300s |
| `getCitiesList(country?)` | `CountrySlug?` | `Promise<City[]>` | 300s |
| `getServicesList()` | – | `Promise<Service[]>` | 300s |
| `getIndustriesList()` | – | `Promise<Industry[]>` | 300s (Phase 2: GraphQL) |
| `getProjectsList(opts?)` | `{ city?, service? }` | `Promise<Project[]>` | 300s |
| `getBlogPostsList()` | – | `Promise<BlogPost[]>` | 300s |
| `getCaseStudiesList()` | – | `Promise<CaseStudy[]>` | 300s (Phase 2: GraphQL) |

---

## 5. Caching Layers

```
┌─────────────────────────────────────────────┐
│ Browser cache (no-store for HTML, immutable  │
│ for _next/static/*)                          │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ Vercel Edge cache (ISR) — 300s TTL           │
│ invalidated by: deploy, on-demand revalidate │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ Next.js Data Cache (next.revalidate = 300)   │
│ per-query dedupe within request              │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│ WordPress + WPGraphQL                        │
│ (object cache via Redis, transient cache)    │
└─────────────────────────────────────────────┘
```

### On-Demand Revalidation
When an editor publishes a Project in WordPress, a webhook calls a Vercel deploy hook. The hook triggers `revalidatePath('/projects/[slug]')` for the specific project, plus its parent city/service/industry routes.

```ts
// src/app/api/revalidate/route.ts (Phase 2)
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { event, post_type, slug, related_routes } = await req.json();
  if (event !== "publish") return new Response("ignored", { status: 200 });
  related_routes.forEach((route: string) => revalidatePath(route));
  return new Response("ok", { status: 200 });
}
```

---

## 6. Error & Fallback Handling

### 6.1 Failure modes
| Failure | Detection | Response |
|---|---|---|
| CMS unreachable (network) | `fetch` throws / `AbortController` timeout | `fetchGraphQL` returns `null` → caller uses seed data |
| CMS returns non-200 | `res.ok === false` | Same as above |
| CMS returns GraphQL errors | `json.errors?.length` | Log warning, return `null` |
| CMS returns empty nodes | `data.X.nodes.length === 0` | Caller falls back to seed |
| Field shape mismatch | Mapping throws | Caught and logged; falls back to seed |

### 6.2 Logging
All failures are logged via `console.warn("[WPGraphQL] ...")` — captured by Vercel Logs and surfaced in the Vercel dashboard. Critical errors trigger a Vercel alert via integration with Sentry (Phase 2).

### 6.3 Health check
`/api/health` route returns:
```json
{
  "ok": true,
  "cms": { "reachable": true, "latencyMs": 142 },
  "buildId": "abc123"
}
```

---

## 7. Fragments (Planned)

Once the CMS mapper is implemented, shared fragments will be extracted:

```graphql
fragment CountryFields on Country_Countryfields {
  countryCode
  heroHeading
  heroDescription
  seoTitle
  seoDescription
}

fragment CityFields on City_Cityfields {
  country { node { slug name } }
  latitude
  longitude
  heroHeading
  heroDescription
  seoTitle
  seoDescription
  population
  highlights { highlight }
}

fragment ProjectFields on Project_Projectfields {
  country { node { slug name } }
  city { node { slug name } }
  service { node { slug name } }
  industry { node { slug name } }
  client
  year
  duration
  challenge
  solution
  execution
  materials { material }
  equipment { item }
  results { label value }
  gallery { sourceUrl altText caption }
  location
  area
}
```

Fragments reduce query string size and ensure consistency across consumers.

---

## 8. Mapper Implementation (TODO)

The mapper functions convert raw WPGraphQL responses into the typed entities defined in `gulf-data.ts`. They are stubbed today and must be implemented per `MIGRATION_PLAN.md` step 3.

Example mapper:

```ts
function mapCountries(nodes: WpCountryNode[]): Country[] {
  return nodes.map((n) => ({
    slug: n.slug as CountrySlug,
    name: n.title,
    shortName: n.title.includes("United") ? "UAE" : "Saudi Arabia",
    code: n.countryFields.countryCode,
    flag: n.countryFields.countryCode === "AE" ? "🇦🇪" : "🇸🇦",
    heroHeading: n.countryFields.heroHeading,
    heroDescription: n.countryFields.heroDescription,
    seoTitle: n.countryFields.seoTitle,
    seoDescription: n.countryFields.seoDescription,
    dialCode: n.countryFields.dialCode,
    whatsapp: n.countryFields.whatsapp,
    phone: n.countryFields.phone,
  }));
}
```

---

## 9. Lead Mutation (Phase 2)

For lead write-back to the CMS (so editors see leads in WP admin), expose a custom GraphQL mutation:

```graphql
mutation CreateLead($input: CreateLeadInput!) {
  createLead(input: $input) {
    lead {
      id
      status
    }
  }
}

input CreateLeadInput {
  name: String!
  email: String!
  phone: String!
  company: String
  country: String!
  city: String!
  service: String!
  message: String!
  source: String!
  clientMutationId: String
}
```

This mutation is authenticated via Application Password and is called from the `/api/leads` Route Handler after the Prisma write succeeds.

---

## 10. Performance Budget

| Query | P50 latency | P95 latency | Payload size |
|---|---|---|---|
| GetCountries | 100 ms | 300 ms | 2 KB |
| GetCities | 120 ms | 350 ms | 8 KB |
| GetServices | 150 ms | 400 ms | 12 KB |
| GetProjects (filtered) | 180 ms | 500 ms | 6 KB |
| GetCaseStudies | 100 ms | 300 ms | 4 KB |
| GetBlogs | 100 ms | 300 ms | 4 KB |
| GetFaqs | 80 ms | 250 ms | 2 KB |

With ISR, every query is served from the Vercel Edge cache for 5 minutes after the first request — actual latency to the user is < 20 ms.

---

## 11. Related Documents

- `WORDPRESS_DATA_MODEL.md` — CPT definitions
- `ACF_BLUEPRINT.md` — field shapes consumed by these queries
- `MIGRATION_PLAN.md` — step 3 implements the mappers
- `TECHNICAL_DEBT.md` — known stubs
