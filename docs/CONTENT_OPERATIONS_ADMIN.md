# Content Operations Admin Guide — Gulf Seismic Authority Platform

> Audience: Gulf Seismic content & marketing team — Marketing Manager, SEO Executive, Content Writer, Sales Team.
> Purpose: Train non-technical staff to create, edit and publish Projects, Case Studies, FAQs, Cities, Countries, Services and Industries inside the WordPress CMS at **cms.gulfseismic.com/wp-admin**.
> Last updated: Phase 2 (Headless CMS go-live).

This guide assumes zero WordPress experience. By the end you will be able to log in, create a fully-linked Project, attach a Case Study, publish FAQs, and know exactly what each team member is responsible for.

---

## 1. Logging in to the CMS

1. Open your browser and go to **https://cms.gulfseismic.com/wp-admin**.
2. You will see the WordPress login screen.
   - *If a "Security Verification — StackProtect" page appears*: solve the reCAPTCHA checkbox and click **Continue**. This is the firewall that protects the CMS from automated attacks. It only appears once per session per browser.
3. Enter your credentials:
   - **Username or Email Address**: your assigned account (e.g. `marketing.manager`).
   - **Password**: the password issued by the CMS administrator. If you forgot it, click **Lost your password?** and follow the email reset flow.
4. Click **Log In**.
5. You arrive at the **WordPress Dashboard** — a dark-grey admin screen with a black sidebar on the left containing all the admin menu items.

> **Tip:** bookmark `https://cms.gulfseismic.com/wp-admin` after your first login so you can return quickly.

> **Do not** share your login with anyone. Each user has their own account and a role (see §10 — Roles). The administrator can see who edited what and when.

---

## 2. The Seven Content Types (Custom Post Types)

Gulf Seismic uses seven "Custom Post Types" (CPTs) — these are the seven kinds of content the website is built from. Each appears in the left-hand admin menu with its own icon.

| # | Admin Menu Item     | Icon (Dashicon)        | Single Name | Plural Name   | What it is for |
|---|---------------------|------------------------|-------------|---------------|----------------|
| 1 | **Countries**       | 🏁 Flag (`dashicons-flag`)            | Country     | Countries     | Top-level geographic hubs. Currently 2: UAE, Saudi Arabia. |
| 2 | **Cities**          | 📍 Location pin (`dashicons-location-alt`) | City        | Cities        | City-level landing pages (16 total: 8 UAE + 8 Saudi). |
| 3 | **Services**        | 🔧 Wrench (`dashicons-admin-tools`)   | Service     | Services      | The 8 marking services Gulf Seismic sells (road, thermoplastic, parking, warehouse, airport, industrial, safety signage, epoxy flooring). |
| 4 | **Industries**      | 🏢 Building (`dashicons-building`)    | Industry    | Industries    | The 10 verticals served (highways, commercial, industrial, logistics, aviation, oil & gas, residential, healthcare, energy, retail). |
| 5 | **Projects**        | 📁 Portfolio (`dashicons-portfolio`) | Project     | Projects      | Delivered-work records. The authoritative portfolio (50 live). |
| 6 | **Case Studies**    | 📊 Bar chart (`dashicons-analytics`)  | Case Study  | Case Studies  | Outcome-focused stories linked to a Project (20 live). |
| 7 | **FAQs**            | 💬 Chat (`dashicons-format-chat`)     | FAQ         | FAQs          | Frequently asked questions, clustered by topic (64 live). |

The menu items appear in the order above, between the standard **Posts** and **Pages** items. If you don't see all seven, your user role may be missing capabilities — contact the CMS administrator.

---

## 3. How Relationships Work

The seven CPTs are connected. Understanding the graph is essential — broken relationships are the #1 cause of empty pages on the live site.

```
Country ─┬─< City ──< Project >── Service ──<── Industry
         │                  │
         │                  └──> Case Study
         │
         └─ FAQ >── Service (and optional City)
```

| Relationship | Type | Field location | Example |
|---|---|---|---|
| Country **has many** Cities | one-to-many | City → "Country" field | UAE → Abu Dhabi, Dubai, Sharjah, … |
| City **has many** Projects | one-to-many | Project → "City" field | Dubai → Sheikh Zayed Road Re-Marking |
| Project **belongs to** Country | many-to-one | Project → "Country" field | (auto-resolved via City) |
| Project **belongs to** Service | many-to-one | Project → "Service" field | Parking Lot Marking |
| Project **belongs to** Industry | many-to-one | Project → "Industry" field | Commercial |
| Service **belongs to many** Industries | many-to-many | Service → "Industries Served" | Epoxy Flooring → Commercial, Industrial, Healthcare |
| Case Study **belongs to** Project | one-to-one | Case Study → "Linked Project" | Re-Marking Case Study → SZR Project |
| FAQ **belongs to** Service | many-to-one | FAQ → "Service" field | "How much does thermoplastic cost?" → Thermoplastic Road Marking |
| FAQ **may belong to** City | many-to-one (optional) | FAQ → "City (optional)" | Local Dubai question |

**Golden rule:** when you create a Project you MUST select its Country, City, Service and Industry. If any of those four is left empty, the Project will not appear on the website's country pages, city pages, service pages, or industry pages — it will be orphaned.

---

## 4. Adding / Editing a Project — step by step

This is the most important workflow because Projects power the portfolio, the case studies, and the city/service/industry landing pages.

### 4.1 Open the New Project screen

1. In the left admin menu, hover over **Projects** and click **Add New**.
   - *Alternatively:* click **Projects → Add New** in the top menu bar.
2. You land on the Project editor. The screen has, top to bottom:
   - The title field (large, empty, says "Add title").
   - The WordPress editor (Gutenberg blocks) — used for the main body.
   - The **Project Fields** box (ACF — the form with all the structured data).
   - The **Featured Image** box (right sidebar).
   - The **Yoast SEO** box (below the editor or in the sidebar).
   - The **Publish** box (top-right).

### 4.2 Fill in the title

Enter the project title in the title field. Format: **[Service] — [Location/Project Name] — [Year]**.

Examples:
- ✅ `Thermoplastic Re-Marking — Sheikh Zayed Road, Dubai — 2024`
- ✅ `Airport Runway Marking — King Abdulaziz International, Jeddah — 2023`
- ❌ `Project 17` (too vague)
- ❌ `Dubai job` (no service, no specificity)

### 4.3 Fill in the Project Fields (ACF) box

This is the structured data the website reads. Every field is required unless marked optional.

| Field label | Field type | What to enter | Example |
|---|---|---|---|
| **Country** | Post object (dropdown) | Select the country this project was delivered in. | UAE |
| **City** | Post object (dropdown) | Select the city. Only cities in the chosen country appear. | Dubai |
| **Service** | Post object (dropdown) | The primary service delivered. | Thermoplastic Road Marking |
| **Industry** | Post object (dropdown) | The industry vertical of the client. | Highways & Roads |
| **Client** | Text | Anonymised client name. Use "Confidential [Type] Authority/Operator/Group". | `Confidential Roads & Transport Authority` |
| **Year** | Number | Four-digit year of delivery. | `2024` |
| **Duration** | Text | Human-readable duration. | `56 night shifts over 8 weeks` |
| **Location** | Text | Specific road, district, or site. | `Sheikh Zayed Road, exits 41–55, Dubai` |
| **Area / Scope** | Text | Quantified scope. | `38 km of carriageway, 4 lanes per direction` |
| **Challenge** | Textarea | 2–4 sentences describing the problem before Gulf Seismic arrived. Mention authority, traffic, deadline, condition. | `The existing cold-paint markings had faded to <30% retroreflectivity…` |
| **Solution** | Textarea | 2–4 sentences on what Gulf Seismic designed and why. Mention materials and standards (RTA Standard Drawings Vol 4, ICAO Annex 14, etc.). | `Designed a hot-applied thermoplastic system with calcined bauxite anti-skid…` |
| **Execution** | Textarea | 2–4 sentences on how it was actually delivered. Mention night shifts, equipment, traffic management. | `Delivered across 56 night shifts using a self-propelled thermoplastic applicator…` |
| **Materials** | Repeater | Click **Add Row** for each material. One text field per row. | `Hot-applied thermoplastic`, `Calcined bauxite anti-skid`, `Type II glass beads` |
| **Equipment** | Repeater | Click **Add Row** for each piece of equipment. One text field per row. | `Self-propelled thermoplastic applicator`, `Oil-jacketed kettle`, `Retroreflectometer` |
| **Results** | Repeater | Click **Add Row** for each result metric. Each row has two fields: **Label** and **Value**. | Label=`Retroreflectivity`, Value=`550 mcd/m²/lx`; Label=`On-time delivery`, Value=`100%`; Label=`Night shifts`, Value=`56` |
| **Gallery** | Gallery | Drag-and-drop multiple photos. Each photo can be captioned. | (project photos) |

### 4.4 Writing the main body (Gutenberg editor)

The Gutenberg editor above the ACF box is the project's narrative body. Use this structure (it is mirrored from the migration script):

1. Add a **Heading** block → `Challenge` → type a paragraph below.
2. Add a **Heading** block → `Solution` → paragraph.
3. Add a **Heading** block → `Execution` → paragraph.

Keep total body length between 300 and 800 words. Longer than 800 dilutes the keyword focus; shorter than 300 fails SEO minimums.

### 4.5 Set the Featured Image

1. In the right sidebar, find the **Featured Image** panel.
2. Click **Set featured image**.
3. Upload a high-resolution photo (recommended: **1600×900 px for hero use, 1200×630 px minimum for Open Graph social share**).
4. Add **Alt Text** describing the photo (e.g. "Thermoplastic road marking applicator on Sheikh Zayed Road at night").
5. Click **Set featured image**.

### 4.6 Fill in the Yoast SEO fields

Scroll down to the **Yoast SEO** box. Click **Edit snippet** and fill in:

- **Focus keyphrase**: the primary search term (e.g. `thermoplastic road marking dubai`). One per project — do not reuse across projects.
- **SEO title**: 55–60 characters, include the focus keyphrase near the start. e.g. `Thermoplastic Road Marking Dubai — Sheikh Zayed Road Project`.
- **Meta description**: 150–160 characters, include the keyphrase once and one measurable result. e.g. `Gulf Seismic re-marked 38 km of Sheikh Zayed Road, Dubai with hot-applied thermoplastic — 550 mcd/m²/lx retroreflectivity achieved across 56 night shifts.`

The coloured bar under each field turns green when the length is in the optimal range.

### 4.7 Save and publish

1. Click **Save draft** in the top-right Publish box.
2. Preview the page (click **Preview** → **Preview in new tab**).
3. If everything looks correct, return to the editor and click **Publish**.
4. A confirmation modal appears — click **Publish** again.

The project is now live. The frontend will pick it up within **5 minutes** (see §8 — ISR).

---

## 5. Adding a Case Study

A Case Study is an outcome-focused story that references exactly one Project.

### 5.1 Create the Case Study

1. **Case Studies → Add New**.
2. Enter the title. Format: outcome-led.
   - ✅ `How We Re-Marked Sheikh Zayed Road in 56 Night Shifts`
   - ✅ `First-Time Pass on Royal Commission Jubail Safety Audit`
3. In the **Case Study Fields** box, fill in:

| Field | Type | What to enter |
|---|---|---|
| **Linked Project** | Post object | Search for and select the Project this case study is about. **This is required** — a case study with no linked project is orphaned and will not appear on the live site. |
| **Summary** | Textarea | One paragraph (80–150 words) summarising the engagement and the headline outcome. |
| **Outcomes** | Repeater (text) | Click **Add Row** for each outcome. Each is a single measurable sentence. Aim for 4 outcomes. e.g. `38 km of carriageway re-marked`, `550 mcd/m²/lx retroreflectivity — 220% above RTA spec`, `Zero traffic incidents during 56 night shifts`, `100% on-time delivery`. |
| **Testimonial Quote** | Textarea (optional) | A real client quote in quotation marks. If you don't have one, leave blank. |
| **Testimonial Author** | Text (optional) | Anonymised author. e.g. `Project Director`. |
| **Testimonial Role** | Text (optional) | Anonymised role/company. e.g. `Confidential Roads & Transport Authority`. |

4. Add the main body in Gutenberg (1–3 paragraphs is sufficient — the structured fields carry most of the content).
5. Set the **Featured Image**.
6. Fill in **Yoast SEO** (focus keyphrase, SEO title, meta description).
7. **Save draft** → **Preview** → **Publish**.

### 5.2 Verify the link to the Project

After publishing:

1. Open the linked Project in the editor.
2. Scroll to the bottom — the case study should now appear in a "Related Case Studies" reverse-relationship view (or in the project's frontend at `/projects/[slug]`).
3. If it does not appear, open the Case Study again and confirm the **Linked Project** field is set.

---

## 6. Adding FAQs

FAQs power the FAQPage JSON-LD schema and the per-service FAQ accordions. They are also the content most likely to be cited by AI answer engines (Google AI Overviews, Perplexity, ChatGPT Search) — write them factually and citation-worthy.

### 6.1 Create the FAQ

1. **FAQs → Add New**.
2. The **title** is the question itself, phrased as a natural-language search query.
   - ✅ `How much does thermoplastic road marking cost in Saudi Arabia?`
   - ✅ `What is the difference between MMA and thermoplastic for airport taxiways?`
   - ❌ `Cost question` (not a query)
3. In the **FAQ Fields** box:

| Field | Type | What to enter |
|---|---|---|
| **Answer** | Textarea | 2–4 sentences, factual, specific. Mention real standards (ICAO Annex 14, ISO 7010, RTA Standard Drawings Vol 4, MOMRAH Section 705, Saudi Aramco GES-001), real numbers (AED/SAR ranges, cure times, application rates), and real Gulf context where relevant. |
| **Service** | Post object | The service this FAQ is about. **Required** for the FAQ to appear on the right service page. |
| **City (optional)** | Post object | If the question is location-specific, link the city. Leave blank for general questions. |
| **FAQ Cluster** | Select (dropdown) | One of: `General`, `Cost & Pricing`, `Comparison`, `Process & Timeline`, `Compliance & Standards`, `Local / City-Specific`. See §6.2 below. |

4. FAQs do NOT need a featured image (the CPT does not support thumbnails).
5. Fill in **Yoast SEO** with the focus keyphrase being the question itself.
6. **Publish**.

### 6.2 FAQ Clusters explained

| Cluster | When to use | Example |
|---|---|---|
| `General` | Broad informational questions not in another cluster. | `What is thermoplastic road marking?` |
| `Cost & Pricing` | Any question involving AED/SAR, per-m² pricing, or budgeting. | `How much does parking lot marking cost per square metre in Dubai?` |
| `Comparison` | "X vs Y" or "which is better" questions. | `MMA vs thermoplastic — which lasts longer on UAE highways?` |
| `Process & Timeline` | How it's done, cure time, application rate, project duration. | `How long does thermoplastic take to cure in Saudi summer heat?` |
| `Compliance & Standards` | Any question citing a regulatory standard. | `Does airport runway marking comply with ICAO Annex 14?` |
| `Local / City-Specific` | Questions tied to a specific city. | `What are the RTA road marking requirements for Dubai parking lots?` |

The cluster is read by the frontend and used to group FAQs into accordion sections on service pages.

---

## 7. Editing Cities, Countries, Services, Industries

These four CPTs are mostly "set once" reference data. The migration script created 2 Countries, 16 Cities, 8 Services and 10 Industries on go-live. You will typically edit — not create — these.

### 7.1 City — the most-edited reference type

After go-live you'll mostly update cities to add **Google Business Profile** data and **NAP** (Name/Address/Phone) citations.

1. **Cities → [select your city]**.
2. In **City Fields** the editable fields are:
   - `Country` — set once, do not change.
   - `Region / Province`, `Latitude`, `Longitude`, `Population Label`, `Highlights`, `Hero Heading`, `Hero Description`, `SEO Title`, `SEO Description` — set during migration; edit only for accuracy.
   - `Google Maps Embed URL` — paste a Google Maps embed URL. Format: `https://www.google.com/maps?q=...&z=11&output=embed`. If empty, the frontend auto-constructs one from the city coordinates.
   - `Google Business Profile URL` — paste the GBP listing URL (e.g. `https://www.google.com/maps/place/...`). Used by the LocalBusinessSignals block on the city-service page.
   - `NAP — Name` — the exact local citation name. e.g. `Gulf Seismic Contracting LLC — Dubai`.
   - `NAP — Address` — the exact street address used in citations. Must match Google Business Profile character-for-character.
3. Click **Update**.

> **NAP consistency is critical for local SEO.** The NAP Name and Address you enter here MUST be byte-for-byte identical to your Google Business Profile, your Bing Places listing, and any local directory citations. Even a missing comma or "LLC" vs "L.L.C." hurts rankings.

### 7.2 Country — rarely edited

Country phone numbers, WhatsApp numbers and hero copy live here. Edit only when contact details change.

### 7.3 Service — edited when service lines evolve

Each Service has: tagline, short/long description, icon name, benefits repeater, materials repeater, equipment repeater, industries served (relationship), process steps repeater, specs repeater, hero copy, and SEO fields. Edit the long description and SEO fields quarterly to refresh keyword targeting. The benefits/materials/equipment/process/specs are also consumed by the HowTo schema — keep them accurate.

### 7.4 Industry — edited when serving new verticals

Industries have a description, icon, challenges repeater, solutions repeater, and a relationship field to Related Services. Use the relationship field to declare which services Gulf Seismic offers to that industry.

---

## 8. How the Frontend Consumes Your Content

This section is important to understand the **publishing lag**.

The website at **gulfseismic.com** is a Next.js application hosted on Vercel. It does not read from WordPress on every page load. Instead it uses **Incremental Static Regeneration (ISR)**:

1. When a visitor requests a page, Vercel serves a pre-built static HTML copy from its edge cache.
2. In the background, every **5 minutes** (300 seconds) Vercel re-queries WordPress via GraphQL, rebuilds the page if content has changed, and replaces the cached copy.
3. The next visitor after the rebuild sees the new content.

### What this means for content editors

| Action | When does it appear on the live site? |
|---|---|
| Edit a Project and click **Update** | Within 5 minutes (next ISR cycle). |
| Publish a new Project | Within 5 minutes. |
| Delete a Project | Within 5 minutes (page returns 404 after rebuild). |
| Edit a Service page (long description, FAQ) | Within 5 minutes. |
| Edit City NAP / GBP URL | Within 5 minutes. |

### Force-revalidating a page immediately

If you need a change to appear faster than 5 minutes (e.g. correcting a typo on the homepage):

1. Open the page on `gulfseismic.com` in your browser.
2. Append `?revalidate=1` to the URL, e.g. `https://gulfseismic.com/projects/thermoplastic-remarking-sheikh-zayed-road?revalidate=1` (note: this only works if the deployment exposes the revalidation hook — check with engineering if unsure).
3. Alternatively, ask engineering to run the Vercel redeploy or hit `/api/cms-health` which triggers a fresh fetch.

> **Do not** panic if a change doesn't appear instantly. Wait 5 minutes first, then refresh with `Ctrl+Shift+R` (hard refresh).

---

## 9. Common Mistakes to Avoid

| # | Mistake | Why it's bad | Fix |
|---|---|---|---|
| 1 | Publishing a Project with no Country/City/Service/Industry set | The project becomes orphaned — it won't appear on any listing page. | Always fill all four relationship fields before clicking Publish. |
| 2 | Creating a Case Study with no Linked Project | The case study is orphaned; the "related case studies" section on the project page stays empty. | Set Linked Project first; if the project doesn't exist yet, create it first. |
| 3 | Duplicate slugs | WordPress auto-generates slugs from titles; two projects with similar titles can collide. | Edit the permalink (under the title) to make it unique before publishing. |
| 4 | Missing SEO Title / Meta Description | Page falls back to the title; loses ranking opportunity. | Always fill Yoast SEO fields; the bar must be green. |
| 5 | Using a real client name in the Client field | Breach of NDA; legal exposure. | Always use `Confidential [Type] Authority/Operator/Group`. |
| 6 | NAP inconsistencies (comma, LLC vs L.L.C.) | Hurts local SEO; confuses Google Business Profile matching. | Copy-paste the exact NAP from the GBP listing. |
| 7 | Publishing a draft FAQ without a Service | The FAQ won't appear in any service accordion. | Always set the Service field. |
| 8 | Forgetting the Featured Image | Page shows a broken image placeholder; OG social shares show no thumbnail. | Set Featured Image before publishing. |
| 9 | Editing a published Project without saving | Changes are lost on browser refresh. | Click **Update** frequently while editing. |
| 10 | Reusing the same Focus Keyphrase across multiple Projects | Keyword cannibalisation — Google doesn't know which page to rank. | Each Project gets a unique focus keyphrase. |

---

## 10. Roles — Who Does What

The CMS has four user roles aligned with the team. The matrix below shows who is responsible for each step in the content workflow.

| Role | Who | Capabilities |
|---|---|---|
| **Content Writer** | Content team | Create drafts of Projects, Case Studies, FAQs. Upload images. Cannot publish. |
| **SEO Executive** | SEO/marketing | Edit SEO fields, focus keyphrases, internal links. Can publish FAQs. Cannot publish Projects/Case Studies. |
| **Marketing Manager** | Marketing lead | Review and publish Projects, Case Studies, Services, Cities. Full editorial control. |
| **Administrator** | Engineering/IT | User management, CPT/ACF schema, plugin updates, StackProtect whitelist, migration runs. |

### Content workflow — draft → review → publish

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  1. DRAFT        │ ──> │  2. SEO OPTIMISE │ ──> │  3. REVIEW        │ ──> │  4. PUBLISH  │
│  Content Writer  │     │  SEO Executive   │     │  Marketing Mgr    │     │  Marketing Mgr│
│                  │     │                  │     │                   │     │               │
│  - Create draft  │     │  - Add focus     │     │  - Read through   │     │  - Click      │
│  - Fill ACF      │     │    keyphrase     │     │  - Verify         │     │    Publish    │
│  - Upload images │     │  - Edit SEO      │     │    relationships  │     │  - Verify on  │
│  - Save as draft │     │    title/desc    │     │  - Check NAP      │     │    live site  │
│                  │     │  - Save draft    │     │  - Approve or     │     │    (5 min)    │
│                  │     │                  │     │    return to      │     │               │
│                  │     │                  │     │    writer         │     │               │
└─────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────┘
```

**Step-by-step for a new Project:**

1. **Content Writer** — Go to **Projects → Add New**. Fill title, ACF fields, body, featured image. Click **Save draft**. Notify SEO Executive.
2. **SEO Executive** — Open the draft. Fill Yoast SEO fields. Adjust focus keyphrase to be unique. Optionally add internal links in the body (link to the Service page, the City page). Click **Save draft**. Notify Marketing Manager.
3. **Marketing Manager** — Open the draft. Read the body. Verify the four relationship fields (Country/City/Service/Industry). Verify the client is anonymised. Verify the Featured Image has alt text. Click **Publish**.
4. **Marketing Manager** — After 5 minutes, visit `gulfseismic.com/projects/[slug]` and confirm the page renders correctly. Submit the URL to Google Search Console → URL Inspection → Request Indexing.

---

## 11. Screenshot-Style Walkthrough — Adding a New Project

Even without actual screenshots, here is the screen-by-screen walkthrough to follow.

### Screen 1 — Dashboard after login

After login you see the Dashboard. Left sidebar lists (top to bottom): Dashboard, Posts, **Countries**, **Cities**, **Services**, **Industries**, **Projects**, **Case Studies**, **FAQs**, Pages, Comments, Appearance, Plugins, Users, Tools, Settings, Yoast SEO. The main panel shows "At a Glance" widgets and Yoast SEO dashboard.

### Screen 2 — Projects list

Click **Projects** in the sidebar. The main panel shows a table of all Projects with columns: Title, Author, Categories, Tags, Comments, Date. The "Add New" button is at the top of the page, next to the "Projects" heading. Use the search box (top-right) to find an existing project by slug or title.

### Screen 3 — Add New Project

Click **Add New**. The page has:
- Top bar: WordPress admin bar (black, sticky) with "+ New", your profile, "Howdy, [username]".
- Title field: large empty input.
- Gutenberg editor: a blank canvas with a "+" inserter button at top-left.
- **Project Fields** box: appears below the editor. Contains the form fields described in §4.3.
- Right sidebar: **Publish** box (top), **Featured Image** panel, **Yoast SEO** panel.
- Bottom of sidebar: **Slug** field (auto-generated from title — editable).

### Screen 4 — Filling the ACF Project Fields

Scroll to the **Project Fields** box. Each field is a labelled input. Post-object fields (Country, City, Service, Industry, Linked Project) appear as dropdowns — click to open, type to search, click an option to select. Repeater fields (Materials, Equipment, Results) have an **Add Row** button at the bottom — click to add a row; each row has its own inputs. The Gallery field has a large dashed-bordered drop area — drag photos from your desktop or click **Add to gallery** to upload.

### Screen 5 — Yoast SEO panel

Scroll to the Yoast SEO box (or find it in the right sidebar under "Summary"). Three fields: **Focus keyphrase** (text input with a "Save" button), **Google Preview** (click to expand), and **Facebook Preview** (for OG image). The coloured bars under SEO title and Meta description turn green/red as you type.

### Screen 6 — Publish modal

Click the blue **Publish** button in the top-right. A modal slides down with: "Are you ready to publish?" → Visibility: Public → Publish immediately → click the second **Publish** button. The page reloads with the URL now visible under the title, and the button now reads **Update**.

### Screen 7 — View on the live site

In the admin bar at the top, click **View Project** (the icon next to the project title). A new tab opens at `https://gulfseismic.com/projects/[slug]`. If the page shows the old content (or 404), wait 5 minutes and hard-refresh with `Ctrl+Shift+R` (`Cmd+Shift+R` on Mac).

---

## 12. Quick Reference — Field-by-field checklist

Before clicking **Publish** on any post, run through this checklist:

### Project checklist
- [ ] Title follows `[Service] — [Location] — [Year]` format
- [ ] Country, City, Service, Industry all selected
- [ ] Client is anonymised (`Confidential …`)
- [ ] Year, Duration, Location, Area filled
- [ ] Challenge, Solution, Execution each ≥ 2 sentences
- [ ] At least 3 Materials rows
- [ ] At least 3 Equipment rows
- [ ] At least 4 Results rows with measurable values
- [ ] Gallery has 2+ photos with alt text
- [ ] Featured Image set (1600×900 px or larger)
- [ ] Yoast SEO: focus keyphrase unique, SEO title 55–60 chars, meta description 150–160 chars
- [ ] Slug is unique (no other project shares it)

### Case Study checklist
- [ ] Title is outcome-focused
- [ ] Linked Project is set
- [ ] Summary is 80–150 words
- [ ] At least 4 Outcomes rows
- [ ] (Optional) Testimonial fields all filled or all empty
- [ ] Featured Image set
- [ ] Yoast SEO fields filled

### FAQ checklist
- [ ] Title is a natural-language question
- [ ] Answer is 2–4 sentences, factual, includes standards/numbers
- [ ] Service field is set
- [ ] City field set if location-specific
- [ ] FAQ Cluster selected (not left as default "General" if it's actually a cost/comparison/process/compliance/local question)

---

## 13. Where to Get Help

| Issue | Contact |
|---|---|
| Cannot log in / forgot password | CMS Administrator (engineering) |
| StackProtect challenge loops or never resolves | CMS Administrator — request IP whitelist |
| Need a new user account or role change | Marketing Manager → escalate to Administrator |
| Need a new Service, Industry, Country or City created | Marketing Manager (these are not created by Content Writers) |
| Page did not update after 5 minutes | Engineering — check `/api/cms-health` and ISR logs |
| Migration script needs re-running (bulk content) | Engineering — see `PRODUCTION_DEPLOYMENT_CHECKLIST.md` |
| Yoast SEO showing red on a field you can't fix | SEO Executive |

---

## 14. Related Documents

- `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md` — engineer's runbook for go-live and re-migration.
- `docs/WORDPRESS_DATA_MODEL.md` — full CPT registration reference.
- `docs/ACF_BLUEPRINT.md` — every ACF field group, complete with sub-fields.
- `docs/GRAPHQL_ARCHITECTURE.md` — the queries the frontend sends to read your content.
- `docs/SEO_AUDIT.md` — why every SEO field matters and how it is consumed.
- `docs/CONTENT_OPERATIONS.md` — the AI content pipeline that produces drafts for you to review.

---

*End of guide. Keep this document open in a tab while you work — it is your single source of truth for daily content operations.*
