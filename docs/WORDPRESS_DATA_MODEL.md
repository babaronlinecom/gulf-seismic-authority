# Gulf Seismic — WordPress Data Model

> CMS: `cms.gulfseismic.com` (WordPress 6.x + WPGraphQL + WPGraphQL for ACF + CPT UI)
> Endpoint: `https://cms.gulfseismic.com/graphql`
> Authentication: Application Password (server-side only, never exposed to browser)

This document defines the nine Custom Post Types (CPTs) that back the Authority Graph, their fields, relationships, GraphQL exposure, validation rules and SEO fields.

---

## 1. Plugin Stack

| Plugin | Purpose |
|---|---|
| **CPT UI** | Register CPTs and taxonomies |
| **ACF Pro** | Custom fields (field groups per CPT) |
| **WPGraphQL** | Expose WordPress as GraphQL |
| **WPGraphQL for ACF** | Expose ACF fields in GraphQL schema |
| **Yoast SEO** (or RankMath) | Per-post SEO title/description/canonical |
| **WPGraphQL Yoast SEO Addon** | Expose SEO fields in GraphQL |
| **Application Passwords** | Authenticated GraphQL mutations (lead write-back) |

---

## 2. CPT Inventory

| CPT | Slug | GraphQL Endpoint | Count (initial) | URL Pattern |
|---|---|---|---|---|
| Countries | `country` | `countries` | 2 | `/{slug}` (e.g. `/uae`) |
| Cities | `city` | `cities` | 16 | `/{country}/{slug}` (e.g. `/uae/dubai`) |
| Services | `service` | `services` | 8 | `/services/{slug}` |
| Industries | `industry` | `industries` | 7 | `/industries/{slug}` |
| Projects | `project` | `projects` | N (6 seeded) | `/projects/{slug}` |
| Case Studies | `case-study` | `caseStudies` | N (3 seeded) | `/case-studies/{slug}` |
| Blogs | `blog` | `blogs` | N (6 seeded) | `/blog/{slug}` |
| FAQs | `faq` | `faqs` | N | (rendered inside Service pages) |
| Resources | `resource` | `resources` | 0 (future) | `/resources/{slug}` |

---

## 3. CPT Registration (CPT UI PHP snippets)

### 3.1 Countries

```php
// functions.php or wp-content/mu-plugins/gulf-cpt-countries.php
function gulf_register_cpt_country() {
  register_post_type('country', [
    'labels' => [
      'name' => 'Countries',
      'singular_name' => 'Country',
      'add_new_item' => 'Add New Country',
      'edit_item' => 'Edit Country',
    ],
    'public' => true,
    'has_archive' => false,
    'rewrite' => ['slug' => ''],
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'country',
    'graphql_plural_name' => 'countries',
    'menu_icon' => 'dashicons-flag',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
    'hierarchical' => false,
  ]);
}
add_action('init', 'gulf_register_cpt_country');
```

### 3.2 Cities

```php
function gulf_register_cpt_city() {
  register_post_type('city', [
    'labels' => [
      'name' => 'Cities',
      'singular_name' => 'City',
    ],
    'public' => true,
    'has_archive' => false,
    'rewrite' => ['slug' => 'city'],
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'city',
    'graphql_plural_name' => 'cities',
    'menu_icon' => 'dashicons-location-alt',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
  ]);
}
add_action('init', 'gulf_register_cpt_city');

// Country taxonomy on cities
function gulf_register_country_taxonomy() {
  register_taxonomy('country_tax', ['city', 'project', 'case-study'], [
    'labels' => ['name' => 'Countries (tax)'],
    'public' => true,
    'show_admin_column' => true,
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'countryTax',
    'graphql_plural_name' => 'countriesTax',
    'hierarchical' => false,
  ]);
}
add_action('init', 'gulf_register_country_taxonomy');
```

### 3.3 Services

```php
function gulf_register_cpt_service() {
  register_post_type('service', [
    'labels' => ['name' => 'Services', 'singular_name' => 'Service'],
    'public' => true,
    'has_archive' => true,
    'rewrite' => ['slug' => 'services'],
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'service',
    'graphql_plural_name' => 'services',
    'menu_icon' => 'dashicons-admin-tools',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
  ]);
}
add_action('init', 'gulf_register_cpt_service');
```

### 3.4 Industries

```php
function gulf_register_cpt_industry() {
  register_post_type('industry', [
    'labels' => ['name' => 'Industries', 'singular_name' => 'Industry'],
    'public' => true,
    'has_archive' => true,
    'rewrite' => ['slug' => 'industries'],
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'industry',
    'graphql_plural_name' => 'industries',
    'menu_icon' => 'dashicons-building',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
  ]);
}
add_action('init', 'gulf_register_cpt_industry');
```

### 3.5 Projects

```php
function gulf_register_cpt_project() {
  register_post_type('project', [
    'labels' => ['name' => 'Projects', 'singular_name' => 'Project'],
    'public' => true,
    'has_archive' => true,
    'rewrite' => ['slug' => 'projects'],
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'project',
    'graphql_plural_name' => 'projects',
    'menu_icon' => 'dashicons-portfolio',
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
  ]);
}
add_action('init', 'gulf_register_cpt_project');

// Service taxonomy on projects (and FAQs)
function gulf_register_service_taxonomy() {
  register_taxonomy('service_tax', ['project', 'case-study', 'faq'], [
    'labels' => ['name' => 'Services (tax)'],
    'public' => true,
    'show_admin_column' => true,
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'serviceTax',
    'graphql_plural_name' => 'servicesTax',
  ]);
}
add_action('init', 'gulf_register_service_taxonomy');

// Industry taxonomy on projects
function gulf_register_industry_taxonomy() {
  register_taxonomy('industry_tax', ['project', 'case-study'], [
    'labels' => ['name' => 'Industries (tax)'],
    'public' => true,
    'show_admin_column' => true,
    'show_in_rest' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'industryTax',
    'graphql_plural_name' => 'industriesTax',
  ]);
}
add_action('init', 'gulf_register_industry_taxonomy');
```

### 3.6 Case Studies, Blogs, FAQs, Resources

```php
function gulf_register_cpt_case_study() {
  register_post_type('case-study', [
    'labels' => ['name' => 'Case Studies', 'singular_name' => 'Case Study'],
    'public' => true, 'has_archive' => true, 'rewrite' => ['slug' => 'case-studies'],
    'show_in_rest' => true, 'show_in_graphql' => true,
    'graphql_single_name' => 'caseStudy', 'graphql_plural_name' => 'caseStudies',
    'menu_icon' => 'dashicons-testimonial', 'supports' => ['title','editor','thumbnail','custom-fields'],
  ]);
}

function gulf_register_cpt_blog() {
  register_post_type('blog', [
    'labels' => ['name' => 'Blog Posts', 'singular_name' => 'Blog Post'],
    'public' => true, 'has_archive' => true, 'rewrite' => ['slug' => 'blog'],
    'show_in_rest' => true, 'show_in_graphql' => true,
    'graphql_single_name' => 'blog', 'graphql_plural_name' => 'blogs',
    'menu_icon' => 'dashicons-welcome-write-blog', 'supports' => ['title','editor','author','thumbnail','excerpt','custom-fields','comments'],
  ]);
}

function gulf_register_cpt_faq() {
  register_post_type('faq', [
    'labels' => ['name' => 'FAQs', 'singular_name' => 'FAQ'],
    'public' => false, 'show_ui' => true, 'has_archive' => false,
    'show_in_rest' => true, 'show_in_graphql' => true,
    'graphql_single_name' => 'faq', 'graphql_plural_name' => 'faqs',
    'menu_icon' => 'dashicons-format-chat', 'supports' => ['title','editor','custom-fields'],
  ]);
}

function gulf_register_cpt_resource() {
  register_post_type('resource', [
    'labels' => ['name' => 'Resources', 'singular_name' => 'Resource'],
    'public' => true, 'has_archive' => true, 'rewrite' => ['slug' => 'resources'],
    'show_in_rest' => true, 'show_in_graphql' => true,
    'graphql_single_name' => 'resource', 'graphql_plural_name' => 'resources',
    'menu_icon' => 'dashicons-media-document', 'supports' => ['title','editor','thumbnail','custom-fields'],
  ]);
}
add_action('init', 'gulf_register_cpt_case_study');
add_action('init', 'gulf_register_cpt_blog');
add_action('init', 'gulf_register_cpt_faq');
add_action('init', 'gulf_register_cpt_resource');
```

---

## 4. Field Group → CPT Mapping

Detailed field-by-field schema is in `ACF_BLUEPRINT.md`. Summary:

| CPT | ACF Field Group | Key fields |
|---|---|---|
| Country | `country_fields` | countryCode, heroHeading, heroDescription, seoTitle, seoDescription, dialCode, whatsapp, phone |
| City | `city_fields` | country (relation), latitude, longitude, heroHeading, heroDescription, seoTitle, seoDescription, population, highlights (repeater) |
| Service | `service_fields` | shortDescription, longDescription, benefits (repeater), materials (repeater), equipment (repeater), industriesServed (relation), faqs (repeater), heroHeading, heroDescription, seoTitle, seoDescription, process (repeater), specs (repeater) |
| Industry | `industry_fields` | description, challenges (repeater), solutions (repeater), services (relation) |
| Project | `project_fields` | country (relation), city (relation), service (relation), industry (relation), client, year, duration, challenge, solution, execution, materials (repeater), equipment (repeater), results (repeater), gallery (gallery), location, area |
| Case Study | `case_study_fields` | projectSlug (relation), summary, outcomes (repeater), testimonialQuote, testimonialAuthor, testimonialRole |
| Blog | (uses default WP fields + Yoast) | category, readTime, featuredImage |
| FAQ | `faq_fields` | service (relation), questionOrder |
| Resource | `resource_fields` | type, file (file), downloadUrl, relatedService (relation) |

---

## 5. GraphQL Exposure (WPGraphQL for ACF)

Each ACF field group must have **"Show in GraphQL"** enabled and **"GraphQL Field Name"** set to the snake_case key (e.g. `country_fields`). For repeater fields, enable **"Show in GraphQL"** on each sub-field and set its "GraphQL Field Name" (e.g. `benefits`).

### 5.1 Sample GraphQL query — GetCountries

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

### 5.2 Sample GraphQL query — GetProjects (filtered)

```graphql
query GetProjects($city: String, $service: String) {
  projects(first: 50, where: { taxQuery: { taxArray: [
    { taxonomy: CITYTAX, field: SLUG, terms: [$city] },
    { taxonomy: SERVICETAX, field: SLUG, terms: [$service] }
  ]}}) {
    nodes {
      slug
      title
      projectFields {
        country { node { slug } }
        city { node { slug } }
        service { node { slug } }
        industry { node { slug } }
        challenge
        solution
        execution
        duration
        materials { value }
        equipment { value }
        results { label value }
        gallery { sourceUrl altText }
        location
        area
      }
    }
  }
}
```

Full query strings are in `src/lib/wordpress.ts` and documented in `GRAPHQL_ARCHITECTURE.md`.

---

## 6. Validation Rules

| Field | Rule | Enforcement |
|---|---|---|
| Country slug | One of `uae`, `saudi-arabia` | CPT UI slug regex `[a-z-]+`; pre-publish check |
| City slug | kebab-case, ≤ 30 chars | ACF `name` regex |
| City.country | Must match an existing Country post | ACF Post Object relationship |
| Service.slug | One of the 8 reserved slugs | Pre-publish checklist |
| Service.industriesServed | Each entry must exist in Industry CPT | ACF Relationship field |
| Project.city | Must exist in City CPT | ACF Post Object |
| Project.service | Must exist in Service CPT | ACF Post Object |
| Project.year | ≥ 2015 (company founded) | ACF Number min/max |
| Project.duration | Free text, ≤ 50 chars | ACF Text max length |
| Project.gallery | 2–20 images, ≥ 1200px width | ACF Gallery min/max + image size rule |
| Case Study.projectSlug | Must match an existing Project | ACF Post Object |
| FAQ.service | Must exist in Service CPT | ACF Post Object |
| SEO title | ≤ 60 chars | Yoast |
| SEO description | ≤ 155 chars | Yoast |

---

## 7. SEO Fields

Every public CPT exposes SEO fields via Yoast + WPGraphQL Yoast SEO Addon:

```graphql
fragment SEOFields on PostTypeSEO {
  title
  metaDesc
  canonical
  opengraphTitle
  opengraphDescription
  opengraphImage { sourceUrl }
  twitterTitle
  twitterDescription
  twitterImage { sourceUrl }
}
```

The Next.js frontend **prefers Yoast values** when present and falls back to ACF `seoTitle` / `seoDescription`:

```ts
// src/lib/wordpress.ts (mapping logic)
function mapSeo(wpSeo: WpSeoFields, acfSeo: { seoTitle: string; seoDescription: string }) {
  return {
    seoTitle: wpSeo?.title || acfSeo.seoTitle,
    seoDescription: wpSeo?.metaDesc || acfSeo.seoDescription,
    canonical: wpSeo?.canonical,
    ogImage: wpSeo?.opengraphImage?.sourceUrl,
  };
}
```

---

## 8. Webhook → ISR Revalidation

When an editor publishes/updates a post in WordPress, a webhook fires to Vercel:

```
POST https://api.vercel.com/v1/.../deploy-hooks/{hook_id}
Content-Type: application/json

{
  "event": "publish",
  "post_type": "project",
  "slug": "abu-dhabi-highway-thermoplastic",
  "related_routes": [
    "/projects/abu-dhabi-highway-thermoplastic",
    "/uae/abu-dhabi/thermoplastic-road-marking",
    "/uae/abu-dhabi",
    "/services/thermoplastic-road-marking",
    "/industries/highways-roads"
  ]
}
```

Vercel's deploy hook triggers a rebuild of those specific pages via On-Demand ISR (`revalidatePath`).

---

## 9. Roles & Capabilities

| Role | Capabilities |
|---|---|
| Gulf Editor (admin) | Full CPT editing + publish |
| Content Author | Draft only; cannot publish |
| SEO Manager | Edit Yoast fields only |
| API User (Application Password) | Read access to GraphQL; write to `lead` mutation only |

---

## 10. Related Documents

- `ACF_BLUEPRINT.md` — full ACF field group definitions
- `GRAPHQL_ARCHITECTURE.md` — query layer in `src/lib/wordpress.ts`
- `MIGRATION_PLAN.md` — WordPress provisioning sequence
- `SCHEMA_ARCHITECTURE.md` — how CMS data maps to JSON-LD
