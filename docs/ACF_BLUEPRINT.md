# Gulf Seismic — ACF Field Blueprint

> Plugin: Advanced Custom Fields Pro (ACF 6.x)
> GraphQL exposure: WPGraphQL for ACF
> This document defines every field group, field key, field type, GraphQL field name, validation, and default value.

Field keys follow ACF's `field_<hash>` convention but for clarity we use semantic keys (e.g. `field_country_code`). Replace with generated ACF keys when importing JSON.

---

## 1. Field Group Inventory

| Field Group | CPT Location | GraphQL Field Name |
|---|---|---|
| Country Fields | `country` (post_type == country) | `countryFields` |
| City Fields | `city` | `cityFields` |
| Service Fields | `service` | `serviceFields` |
| Industry Fields | `industry` | `industryFields` |
| Project Fields | `project` | `projectFields` |
| Case Study Fields | `case-study` | `caseStudyFields` |
| FAQ Fields | `faq` | `faqFields` |
| Resource Fields | `resource` | `resourceFields` |

---

## 2. Country Fields (`countryFields`)

| Field Name | Key | Type | Required | GraphQL | Notes |
|---|---|---|---|---|---|
| `countryCode` | field_country_code | Text | ✅ | `countryCode` | ISO 3166-1 alpha-2 (e.g. `AE`, `SA`) |
| `flag` | field_country_flag | Text | ✅ | `flag` | Emoji flag (🇦🇪 / 🇸🇦) |
| `heroHeading` | field_country_hero_heading | Text | ✅ | `heroHeading` | Max 90 chars |
| `heroDescription` | field_country_hero_desc | Textarea | ✅ | `heroDescription` | Max 280 chars |
| `seoTitle` | field_country_seo_title | Text | ✅ | `seoTitle` | Max 60 chars |
| `seoDescription` | field_country_seo_desc | Textarea | ✅ | `seoDescription` | Max 155 chars |
| `dialCode` | field_country_dial_code | Text | ✅ | `dialCode` | e.g. `+971` |
| `whatsapp` | field_country_whatsapp | Text | ✅ | `whatsapp` | Digits only (e.g. `97150000000`) |
| `phone` | field_country_phone | Text | ✅ | `phone` | Display format |
| `stats` | field_country_stats | Repeater | – | `stats` | Sub-fields: `label`, `value` |

### Sub-field: `stats` repeater
| Sub-field | Type | GraphQL |
|---|---|---|
| `label` | Text | `label` |
| `value` | Text | `value` |

---

## 3. City Fields (`cityFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `country` | Post Object (Country) | ✅ | `country` | Single, filtered to Country CPT |
| `latitude` | Number | ✅ | `latitude` | Decimal, 6 places |
| `longitude` | Number | ✅ | `longitude` | Decimal, 6 places |
| `region` | Text | ✅ | `region` | e.g. "Emirate of Abu Dhabi" |
| `heroHeading` | Text | ✅ | `heroHeading` | Max 90 chars |
| `heroDescription` | Textarea | ✅ | `heroDescription` | Max 280 chars |
| `seoTitle` | Text | ✅ | `seoTitle` | Max 60 chars |
| `seoDescription` | Textarea | ✅ | `seoDescription` | Max 155 chars |
| `population` | Text | – | `population` | e.g. "1.5M+" |
| `highlights` | Repeater | – | `highlights` | Sub-field: `highlight` (Text) |

### GraphQL fragment
```graphql
fragment CityFields on City_Cityfields {
  country { node { slug name } }
  latitude
  longitude
  region
  heroHeading
  heroDescription
  seoTitle
  seoDescription
  population
  highlights { highlight }
}
```

---

## 4. Service Fields (`serviceFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `tagline` | Text | ✅ | `tagline` | Max 80 chars |
| `shortDescription` | Textarea | ✅ | `shortDescription` | Max 200 chars |
| `longDescription` | Wysiwyg | ✅ | `longDescription` | Full editor |
| `icon` | Text | ✅ | `icon` | Lucide icon name (e.g. `PaintBucket`) |
| `benefits` | Repeater | ✅ | `benefits` | Sub-field: `benefit` (Text) |
| `materials` | Repeater | ✅ | `materials` | Sub-field: `material` (Text) |
| `equipment` | Repeater | ✅ | `equipment` | Sub-field: `item` (Text) |
| `industriesServed` | Relationship (Industry) | ✅ | `industriesServed` | Multi-select |
| `faqs` | Repeater | – | `faqs` | Sub-fields: `question`, `answer` |
| `heroHeading` | Text | ✅ | `heroHeading` | |
| `heroDescription` | Textarea | ✅ | `heroDescription` | |
| `seoTitle` | Text | ✅ | `seoTitle` | |
| `seoDescription` | Textarea | ✅ | `seoDescription` | |
| `process` | Repeater | ✅ | `process` | Sub-fields: `step`, `title`, `description` |
| `specs` | Repeater | – | `specs` | Sub-fields: `label`, `value` |

### Sub-field definitions

#### `benefits` repeater
```json
{
  "sub_fields": [
    { "label": "Benefit", "name": "benefit", "type": "text", "required": true }
  ]
}
```

#### `process` repeater
```json
{
  "sub_fields": [
    { "label": "Step", "name": "step", "type": "number", "required": true },
    { "label": "Title", "name": "title", "type": "text", "required": true },
    { "label": "Description", "name": "description", "type": "textarea", "required": true }
  ]
}
```

#### `specs` repeater
```json
{
  "sub_fields": [
    { "label": "Label", "name": "label", "type": "text", "required": true },
    { "label": "Value", "name": "value", "type": "text", "required": true }
  ]
}
```

#### `faqs` repeater
```json
{
  "sub_fields": [
    { "label": "Question", "name": "question", "type": "text", "required": true },
    { "label": "Answer", "name": "answer", "type": "textarea", "required": true }
  ]
}
```

---

## 5. Industry Fields (`industryFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `description` | Textarea | ✅ | `description` | |
| `icon` | Text | ✅ | `icon` | Lucide icon name |
| `challenges` | Repeater | ✅ | `challenges` | Sub-field: `challenge` (Text) |
| `solutions` | Repeater | ✅ | `solutions` | Sub-field: `solution` (Text) |
| `services` | Relationship (Service) | ✅ | `services` | Multi-select |

---

## 6. Project Fields (`projectFields`)

The Project field group is the most complex — it captures the full project authority template.

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `country` | Post Object (Country) | ✅ | `country` | Single |
| `city` | Post Object (City) | ✅ | `city` | Single |
| `service` | Post Object (Service) | ✅ | `service` | Single |
| `industry` | Post Object (Industry) | ✅ | `industry` | Single |
| `client` | Text | ✅ | `client` | e.g. "Confidential Transport Authority" |
| `year` | Number | ✅ | `year` | Min 2015, max current year |
| `duration` | Text | ✅ | `duration` | e.g. "6 weeks" |
| `challenge` | Textarea | ✅ | `challenge` | 200–500 chars |
| `solution` | Textarea | ✅ | `solution` | 200–500 chars |
| `execution` | Textarea | ✅ | `execution` | 200–600 chars |
| `materials` | Repeater | ✅ | `materials` | Sub-field: `material` (Text) |
| `equipment` | Repeater | ✅ | `equipment` | Sub-field: `item` (Text) |
| `results` | Repeater | ✅ | `results` | Sub-fields: `label`, `value` |
| `gallery` | Gallery | ✅ | `gallery` | 2–20 images, min 1200×800 |
| `location` | Text | ✅ | `location` | e.g. "E22 Highway, Abu Dhabi – Al Ain" |
| `area` | Text | ✅ | `area` | e.g. "42 km" or "22,000 m²" |

### Sub-field definitions

#### `results` repeater (key metrics)
```json
{
  "label": "Results",
  "name": "results",
  "type": "repeater",
  "min": 2,
  "max": 6,
  "sub_fields": [
    { "label": "Label", "name": "label", "type": "text", "required": true, "max_length": 30 },
    { "label": "Value", "name": "value", "type": "text", "required": true, "max_length": 30 }
  ]
}
```

#### `gallery` (project photos)
```json
{
  "label": "Gallery",
  "name": "gallery",
  "type": "gallery",
  "min": 2,
  "max": 20,
  "min_width": 1200,
  "min_height": 800,
  "mime_types": "jpg,jpeg,webp,png",
  "insert": "append",
  "library": "all",
  "return_format": "array"
}
```

### GraphQL fragment
```graphql
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

---

## 7. Case Study Fields (`caseStudyFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `projectSlug` | Post Object (Project) | ✅ | `projectSlug` | Single — links case study to project |
| `summary` | Textarea | ✅ | `summary` | 100–300 chars |
| `outcomes` | Repeater | ✅ | `outcomes` | Sub-field: `outcome` (Text) |
| `testimonialQuote` | Textarea | – | `testimonialQuote` | Optional |
| `testimonialAuthor` | Text | – | `testimonialAuthor` | Required if quote present |
| `testimonialRole` | Text | – | `testimonialRole` | Required if quote present |

### Conditional logic
`testimonialAuthor` and `testimonialRole` are required if `testimonialQuote` is non-empty. Enforced via ACF conditional rules.

---

## 8. FAQ Fields (`faqFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `service` | Post Object (Service) | ✅ | `service` | Single — links FAQ to service |
| `questionOrder` | Number | – | `questionOrder` | Sort order |

The FAQ question is stored as the post title; the answer is stored as the post content (WYSIWYG). This keeps Yoast SEO able to index FAQ content.

---

## 9. Resource Fields (`resourceFields`)

| Field Name | Type | Required | GraphQL | Notes |
|---|---|---|---|---|
| `type` | Select | ✅ | `type` | Options: `datasheet`, `whitepaper`, `casestudy-pdf`, `guide` |
| `file` | File | ✅ | `file` | PDF, max 10 MB |
| `downloadUrl` | Url | – | `downloadUrl` | External URL if hosted elsewhere |
| `relatedService` | Post Object (Service) | – | `relatedService` | |
| `relatedIndustry` | Post Object (Industry) | – | `relatedIndustry` | |

---

## 10. WPGraphQL for ACF — Exposure Checklist

For every field group and every field, in ACF → Field Group → Edit:

1. ✅ **Show in GraphQL**: Yes
2. ✅ **GraphQL Field Name**: camelCase (e.g. `heroHeading`)
3. ✅ **GraphQL Types**: auto-detected from location rules
4. ✅ For repeaters: each sub-field has its own **Show in GraphQL** toggle
5. ✅ For Post Object / Relationship fields: **Return Format** = Post Object (not ID)
6. ✅ For Gallery fields: **Return Format** = Image Array (not ID)
7. ✅ For Image fields: **Return Format** = Image Array, **Preview Size** = `large`

---

## 11. ACF JSON Export

Each field group should be exported as JSON and committed to `/home/z/my-project/db/acf/` for version control and re-import on environment refresh. Example file structure:

```
db/acf/
├── country-fields.json
├── city-fields.json
├── service-fields.json
├── industry-fields.json
├── project-fields.json
├── case-study-fields.json
├── faq-fields.json
└── resource-fields.json
```

Sync via WP-CLI:
```bash
wp acf sync --all --path=/var/www/cms.gulfseismic.com
```

---

## 12. Field-Level Validation Examples (PHP)

Add server-side validation for fields that ACF's built-in rules cannot enforce:

```php
// functions.php
add_filter('acf/validate_value/name=country_code', function($valid, $value) {
  if (!in_array(strtoupper($value), ['AE', 'SA'])) {
    return 'Country code must be AE or SA.';
  }
  return $valid;
}, 10, 4);

add_filter('acf/validate_value/name=whatsapp', function($valid, $value) {
  if (!preg_match('/^\d{9,15}$/', $value)) {
    return 'WhatsApp number must be digits only, 9–15 chars.';
  }
  return $valid;
}, 10, 4);

add_filter('acf/validate_value/name=year', function($valid, $value) {
  if ($value < 2015 || $value > (int)date('Y')) {
    return 'Year must be between 2015 and the current year.';
  }
  return $valid;
}, 10, 4);
```

---

## 13. Related Documents

- `WORDPRESS_DATA_MODEL.md` — CPT registration
- `GRAPHQL_ARCHITECTURE.md` — queries that consume these fields
- `PROJECT_AUTHORITY.md` — Project field group in context
- `MIGRATION_PLAN.md` — provisioning sequence
