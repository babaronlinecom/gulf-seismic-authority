# Gulf Seismic — Content Operations Pipeline

> The AI content workflow that takes a raw keyword idea and ships it as a fully-linked, schema-marked, SEO-optimised page on gulfseismic.com.

This document defines the six-agent pipeline (Research → SEO → Content → QA → Publishing → Linking), the inputs/outputs of each agent, and the orchestration rules that govern handoffs.

---

## 1. Pipeline Overview

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. Research  │──▶│ 2. SEO       │──▶│ 3. Content   │
│    Agent     │   │    Agent     │   │    Agent     │
└──────────────┘   └──────────────┘   └──────┬───────┘
                                              │
                                              ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 6. Linking   │◀──│ 5. Publishing│◀──│ 4. QA        │
│    Agent     │   │    Agent     │   │    Agent     │
└──────────────┘   └──────────────┘   └──────────────┘
```

Each agent is a Claude / GPT-4o prompt (or LangGraph node) with a specific role, input contract and output contract. Outputs are persisted to a Notion / Airtable tracking board and to the WordPress CMS.

---

## 2. Agent Specifications

### 2.1 Research Agent
**Role:** Gather facts about a target city + service combination.

**Input:** `{ city, service }` (e.g. `{ city: "Abu Dhabi", service: "thermoplastic-road-marking" }`).

**Tasks:**
1. Collect city facts: population, climate, traffic volumes, key infrastructure (highways, malls, airports, industrial zones).
2. Collect local authority: RTA / DoT / MOMRA / GACA contact and approval requirements.
3. Identify local megaprojects (e.g. Mafraq–Ghuwaifat upgrade, Saadiyat Island expansion).
4. Find 3 recent local news items about road marking or infrastructure in that city.
5. Identify 1–2 competitor pages ranking for the target query.

**Output:**
```json
{
  "city": "Abu Dhabi",
  "service": "thermoplastic-road-marking",
  "facts": {
    "population": "1.5M+",
    "climate": "Hot desert climate, summer peaks 48°C",
    "keyInfrastructure": ["E22 Abu Dhabi–Al Ain highway", "Yas Island", "Saadiyat Island"],
    "localAuthority": "Department of Transport (DoT) — Abu Dhabi",
    "approvalRequirements": "DoT-approved contractor list, traffic management plan",
    "megaprojects": ["Mafraq–Ghuwaifat upgrade", "Saadiyat expansion"]
  },
  "competitorUrls": ["https://competitor1.ae/...", "https://competitor2.ae/..."],
  "newsItems": ["...", "...", "..."]
}
```

### 2.2 SEO Agent
**Role:** Define the keyword target, search intent cluster, and on-page SEO brief.

**Input:** Research Agent output.

**Tasks:**
1. Identify primary keyword (e.g. "thermoplastic road marking Abu Dhabi").
2. Identify 5–10 secondary keywords (e.g. "hot-applied road marking UAE", "highway line marking Abu Dhabi").
3. Define search intent: commercial-investigational vs. transactional.
4. Draft the SEO title (≤60 chars) and meta description (≤155 chars).
5. Define the H1, H2 outline, and target word count (1,200–2,000 words).
6. Identify 3 internal link targets (existing pages to link from).

**Output:**
```json
{
  "primaryKeyword": "thermoplastic road marking Abu Dhabi",
  "secondaryKeywords": ["hot-applied road marking UAE", "highway line marking Abu Dhabi"],
  "intent": "commercial-investigational",
  "seoTitle": "Thermoplastic Road Marking Abu Dhabi | Highway Marking",
  "metaDescription": "Abu Dhabi thermoplastic road marking contractor. DoT-approved, R3 reflectivity, night-shift application. Free quote within 1 business hour.",
  "h1": "Thermoplastic Road Marking in Abu Dhabi",
  "h2Outline": [
    "Why thermoplastic outlasts cold paint in Abu Dhabi's climate",
    "Our Abu Dhabi marking process",
    "Local authority compliance (DoT)",
    "Abu Dhabi projects we've delivered",
    "Materials & specifications",
    "Frequently asked questions"
  ],
  "wordCount": 1500,
  "internalLinkTargets": [
    "/services/thermoplastic-road-marking",
    "/uae/abu-dhabi",
    "/projects/abu-dhabi-highway-thermoplastic"
  ]
}
```

### 2.3 Content Agent
**Role:** Draft the page body using Research + SEO briefs.

**Input:** Research Agent + SEO Agent outputs.

**Tasks:**
1. Write the hero copy (90-char heading, 280-char description).
2. Write the intro (2–3 paragraphs weaving city facts).
3. Write each H2 section (200–400 words each).
4. Write 3 city-specific FAQs.
5. Write 1 city-specific stat block (4 stats).
6. Suggest 2 image alt texts + captions.

**Constraints:**
- ≤40% templated copy (process, materials, equipment can be reused from service page).
- ≥60% city-specific copy.
- Reading level: Grade 11 (Flesch-Kincaid).
- No marketing fluff ("best in class", "world-class"); prefer concrete numbers.

**Output:** A markdown draft persisted to the CMS as a draft `service-city` post (or ACF repeater for FAQs).

### 2.4 QA Agent
**Role:** Validate the draft against quality and uniqueness rules.

**Input:** Content Agent draft + existing published pages.

**Tasks:**
1. Check word count (≥1,200 words).
2. Check keyword density (primary keyword in H1, first 100 words, ≤2.5% density).
3. Check meta title/description lengths.
4. Run plagiarism / similarity check against existing service-city pages. Reject if >40% similar to any other published page.
5. Check all internal links resolve (HEAD request each URL).
6. Check FAQ schema is well-formed.
7. Check reading level.

**Output:**
```json
{
  "passed": true,
  "warnings": [
    "Primary keyword density 2.8% (target ≤2.5%) — reduce by 1 mention"
  ],
  "similarityScores": [
    { "comparedTo": "/uae/dubai/thermoplastic-road-marking", "score": 0.32 }
  ]
}
```

If `passed === false`, the draft returns to the Content Agent with the failure reasons.

### 2.5 Publishing Agent
**Role:** Push the validated draft to WordPress and trigger Vercel deploy.

**Input:** QA-passed draft.

**Tasks:**
1. Create or update the `service-city` post in WordPress via WPGraphQL mutation (or REST API).
2. Set Yoast SEO title and description.
3. Attach the lead-form CTA shortcode.
4. Set post status to `publish`.
5. Trigger the Vercel deploy hook for ISR revalidation of affected routes.
6. Submit the URL to Google Indexing API.

**Output:** `{ post_id, permalink, deploy_status }`.

### 2.6 Linking Agent
**Role:** Wire the new page into the internal link graph.

**Input:** Published page URL + Research Agent's `internalLinkTargets`.

**Tasks:**
1. Add a link to the new page from each `internalLinkTargets` page (via in-body contextual link, not just footer).
2. Add the new page to the parent city hub's "Services in {city}" grid.
3. Add the new page to the parent service hub's "Cities offering {service}" grid.
4. Add the new page to the sitemap.
5. Verify the new page has ≥3 inbound internal links.

**Output:** Link audit report.

---

## 3. Orchestration Rules

### 3.1 Sequential vs parallel
- Research → SEO → Content → QA are **sequential** (each depends on the previous).
- Publishing and Linking run **sequentially** after QA passes.
- Multiple (city, service) pairs can be processed **in parallel** (different pipeline instances).

### 3.2 Failure handling
| Stage | Failure | Action |
|---|---|---|
| Research | Cannot find city facts | Flag for manual research; skip page |
| SEO | No search volume for primary keyword | Drop the keyword; pick another or skip |
| Content | Plagiarism score > 40% | Return to Content Agent with feedback |
| QA | Any check fails | Return to Content Agent |
| Publishing | CMS auth error | Retry 3× with exponential backoff; alert ops |
| Linking | Target page not found | Skip that link; report |

### 3.3 Cadence
- Phase 1: 10 pages/week (manual review of each).
- Phase 2: 30 pages/week (auto-publish after QA pass).
- Phase 3: 50 pages/week (continuous pipeline).

### 3.4 Tracking board
Each pipeline run is tracked in a Notion database with columns:
- City
- Service
- Status (research → SEO → content → QA → published → linked)
- Assigned editor
- Last updated
- URL (once published)
- GSC position (weekly sync)

---

## 4. Tools & Integrations

| Tool | Role |
|---|---|
| Claude / GPT-4o | LLM for Research, SEO, Content, QA agents |
| LangGraph (or CrewAI) | Agent orchestration |
| Ahrefs / SemRush API | Keyword research (SEO Agent) |
| Copyscape / custom similarity | Plagiarism check (QA Agent) |
| WordPress REST / GraphQL | Publishing |
| Vercel Deploy Hook | ISR revalidation trigger |
| Google Indexing API | URL submission |
| Notion API | Tracking board |

---

## 5. Content Templates

### 5.1 Service-city page template
```markdown
# {Service} in {City}

{Hero description — 280 chars mentioning city, service, local authority}

## Why {service} matters in {city}
{2–3 paragraphs weaving city facts: population, traffic, climate, megaprojects}

## Our {city} {service} process
{5-step process — same as parent service page but introduced with city context}

## Local authority compliance ({authority})
{1 paragraph on local approvals, e.g. DoT/RTA/MOMRA/GACA}

## {City} projects we've delivered
{1–3 project cards, or "Coming soon — see our {country} {service} projects" with link}

## Materials & specifications
{Spec table reused from service page}

## Frequently asked questions
{3 city-specific FAQs}

[Lead form prefilled with city + service]
```

### 5.2 Blog post template
```markdown
# {Title}

{Excerpt — 155 chars}

By {Author} • {Date} • {Read time}

{Body — 1,500–2,500 words, with ≥3 internal links to service/city/project pages}

{Author bio}
```

### 5.3 Project template
See `PROJECT_AUTHORITY.md` §2 for the 11-section project template.

---

## 6. Quality Gates

Every page must pass these gates before publishing:

| Gate | Rule |
|---|---|
| Word count | ≥1,200 words (service-city); ≥1,500 (blog); ≥400 (project) |
| Primary keyword | In H1, first 100 words, URL slug, meta title |
| Meta title | ≤60 chars, contains primary keyword |
| Meta description | ≤155 chars, contains primary keyword |
| Internal links | ≥3 in-body links to related pages |
| External links | ≤2 (and only to authoritative sources) |
| Images | ≥1 with descriptive alt text |
| Schema | Valid JSON-LD for the page type |
| Similarity | <40% similar to any other published page |
| Reading level | Grade 9–12 (Flesch-Kincaid) |
| Spelling/grammar | Zero errors (Grammarly check) |

---

## 7. Editorial Calendar

| Week | Focus | Output |
|---|---|---|
| 1 | UAE thermoplastic pages | 8 pages (1 per UAE city) |
| 2 | Saudi thermoplastic pages | 8 pages |
| 3 | UAE parking-lot-marking | 8 pages |
| 4 | Saudi parking-lot-marking | 8 pages |
| 5–16 | Remaining 96 service-city pages | 6 pages/week |
| 17+ | Blog posts + new projects + case studies | 4/week |

---

## 8. Measurement

| Metric | Tool | Cadence |
|---|---|---|
| Pages published | Notion tracking | Weekly |
| Pages indexed | GSC | Weekly |
| Avg position per page | GSC | Weekly |
| Organic clicks | GSC | Weekly |
| Leads from organic | `/api/leads` source tracking | Weekly |
| Pipeline cycle time | Notion timestamps | Per-page |

---

## 9. Related Documents

- `PROGRAMMATIC_SEO.md` — the 128-page strategy
- `AUTHORITY_GRAPH.md` — how pages interconnect
- `INTERNAL_LINKING.md` — Linking Agent rules
- `SEO_AUDIT.md` — SEO standards
- `WORDPRESS_DATA_MODEL.md` — Publishing Agent target schema
