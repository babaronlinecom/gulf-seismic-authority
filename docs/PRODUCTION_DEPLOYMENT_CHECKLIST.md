# Production Deployment Checklist — Gulf Seismic Authority Platform

> Audience: Deploying engineer (DevOps / full-stack).
> Purpose: Take the Gulf Seismic Authority Platform from local dev to live on **gulfseismic.com** with the WordPress CMS at **cms.gulfseismic.com** as the single source of truth.
> Scope: WordPress provisioning → CPT/ACF import → IP whitelist → content migration → Vercel deploy → DNS cutover → post-launch SEO.
> Last updated: Phase 2 go-live.

This is a **runbook**. Execute every step in order. Do not skip the exit criteria. Each step has a checkbox, a verification command, and a rollback note. Sign off at the bottom before declaring "go-live complete".

---

## Pre-deploy — Environment Variables

Collect these before starting. They are referenced throughout the checklist.

| Variable | Value | Set where |
|---|---|---|
| `WP_USER` | `admin` (or your WP API username) | local `.env`, Vercel |
| `WP_APPLICATION_PASSWORD` | WordPress Application Password (24-char, space-separated). Generated at WP Admin → Users → Profile → Application Passwords. | local `.env` (NEVER commit), Vercel |
| `USE_CMS_FALLBACK` | **`false`** in production (so a CMS failure surfaces an error rather than serving stale seed data). Set to `true` only in local dev. | Vercel (Production + Preview envs = `false`); local dev = `true` |
| `DATABASE_URL` | Postgres connection string (Vercel Postgres / Neon / Supabase). The Prisma `Lead` model uses this. | Vercel |
| `NEXT_PUBLIC_SITE_URL` | `https://gulfseismic.com` | Vercel |
| `CMS_ENDPOINT` | `https://cms.gulfseismic.com/graphql` (already hard-coded as default in `src/lib/wordpress.ts` — override only if pointing at staging). | Vercel (optional) |

### Pre-deploy checklist

- [ ] Provision Vercel Postgres (or Neon / Supabase) and copy the connection string.
- [ ] Confirm `prisma/schema.prisma` `datasource db` uses `postgresql` (not SQLite — see `docs/MIGRATION_PLAN.md` Step 1).
- [ ] Run `npx prisma migrate dev --name init-postgres` against the new DB; verify `prisma migrate status` reports no pending migrations.
- [ ] Run `npx prisma generate`.
- [ ] Create `.env` locally with `WP_USER`, `WP_APPLICATION_PASSWORD`, `DATABASE_URL`, `USE_CMS_FALLBACK=true` (dev only).
- [ ] Add `.env` to `.gitignore` (verify: `git status` should not list `.env`).

**Exit criteria:** All env vars are staged in a password manager / Vercel project config (do not paste into Slack or chat). Local `bun run dev` boots without env warnings.

**Rollback:** n/a (pre-deploy).

---

## Step 1 — Register the 7 Custom Post Types (CPT UI import)

**Goal:** Install the 7 CPTs (Countries, Cities, Services, Industries, Projects, Case Studies, FAQs) into the live WordPress via the CPT UI plugin.

### Actions

- [ ] Log in to `https://cms.gulfseismic.com/wp-admin` as an Administrator.
- [ ] Confirm plugins are installed and active: **CPT UI**, **ACF Pro** (or ACF), **WPGraphQL**, **WPGraphQL for ACF**, **Yoast SEO** + **WPGraphQL Yoast SEO Addon**, **StackProtect**. (Plugins → Installed Plugins.)
- [ ] Go to **CPT UI → Tools → Import**.
- [ ] Open `scripts/wp-import/cptui-post-types.json` from the repo on your local machine. Copy its full contents.
- [ ] Paste into the **Import Post Types** textarea on the WP admin page.
- [ ] Click **Import Post Types**.
- [ ] On success, the page reloads with "Imported post types" success message.
- [ ] Go to **CPT UI → View/Edit Post Types** and confirm all 7 are listed: countries, cities, services, industries, projects, case_studies, faqs.
- [ ] Open the WP admin left sidebar — confirm all 7 menu items appear with their correct dashicons (flag, location-alt, admin-tools, building, portfolio, analytics, format-chat).

### Verification

- [ ] Visit `https://cms.gulfseismic.com/wp-admin/admin.php?page=cptui_manage_post_types` — all 7 CPTs visible.
- [ ] Each CPT shows `show_in_graphql = 1` and `graphql_single_name` / `graphql_plural_name` filled in the table.
- [ ] Visit `https://cms.gulfseismic.com/wp-admin/edit.php?post_type=projects` — the Projects list screen loads without error.

**Exit criteria:** All 7 CPTs visible in the admin sidebar and at `cptui_manage_post_types`. No PHP errors in the WordPress debug log.

**Rollback:** CPT UI → View/Edit Post Types → click **Delete** on each imported type. (Note: deleting a CPT that has posts will orphan the post data in `wp_posts` — only run rollback before any content is created.)

---

## Step 2 — Import the 7 ACF Field Groups

**Goal:** Install the ACF field groups that give each CPT its structured data fields (country, city, materials repeater, gallery, etc.).

### Actions

- [ ] Go to **Custom Fields → Tools** (top-level admin menu, under "Custom Fields").
- [ ] Scroll to **Import Field Groups**.
- [ ] Open `scripts/wp-import/acf-field-groups.json` from the repo. Copy its full contents.
- [ ] Paste into the **Import Field Groups** textarea.
- [ ] Click **Import Field Groups**.
- [ ] On success: "7 field groups imported" message.
- [ ] Go to **Custom Fields → Field Groups** and confirm all 7 groups are listed:
  - `Country Fields`
  - `City Fields`
  - `Service Fields`
  - `Industry Fields`
  - `Project Fields`
  - `Case Study Fields`
  - `FAQ Fields`
- [ ] Open **Project Fields** — verify it has 16 fields including the 4 post_object relationships (country, city, service, industry), 3 repeaters (materials, equipment, results) and 1 gallery field.
- [ ] For each field group, verify the **Location** rule matches its CPT (e.g. Project Fields shows "Post Type == projects").

### Verification

- [ ] Go to **Projects → Add New** — the **Project Fields** box appears below the editor with all 16 fields.
- [ ] Go to **FAQs → Add New** — the **FAQ Fields** box appears with Answer, Service, City, FAQ Cluster.
- [ ] Run a GraphQL introspection query (Step 3 below) to confirm ACF fields are exposed.

**Exit criteria:** All 7 ACF groups imported and visible in the editor of their respective CPT.

**Rollback:** Custom Fields → Field Groups → select all 7 → Bulk Actions → Delete.

---

## Step 3 — Verify WPGraphQL exposes all 7 types

**Goal:** Confirm the GraphQL endpoint at `cms.gulfseismic.com/graphql` exposes all 7 CPTs with their ACF fields.

### Actions

- [ ] Open `https://cms.gulfseismic.com/graphql` in your browser. The WPGraphQL GraphiQL IDE loads.
- [ ] In the query panel, paste this introspection query:

```graphql
{
  __type(name: "RootQuery") {
    fields {
      name
    }
  }
}
```

- [ ] Click the **Play** button (▶). The right panel returns a JSON object listing all root query fields.
- [ ] Confirm the following 7 fields appear in the response: `countries`, `cities`, `services`, `industries`, `projects`, `caseStudies`, `faqs`.
- [ ] Run a real data query (will be empty until migration):

```graphql
{
  countries(first: 5) { nodes { slug title countryFields { countryCode shortName flag } } }
  cities(first: 5) { nodes { slug title cityFields { region latitude longitude } } }
  services(first: 5) { nodes { slug title serviceFields { tagline } } }
  industries(first: 5) { nodes { slug title industryFields { description } } }
  projects(first: 5) { nodes { slug title projectFields { client year } } }
  caseStudies(first: 5) { nodes { slug title caseStudyFields { summary } } }
  faqs(first: 5) { nodes { slug title faqFields { answer cluster } } }
}
```

- [ ] Confirm the query returns no errors (the `nodes` arrays will be empty pre-migration, but the schema must validate).
- [ ] Verify ACF exposure: the `countryFields`, `cityFields`, `serviceFields`, `industryFields`, `projectFields`, `caseStudyFields`, `faqFields` selectors must all be present (if missing, the **WPGraphQL for ACF** plugin is not active — re-install and re-activate).

### Verification

- [ ] All 7 root query fields present.
- [ ] All 7 `*Fields` ACF selectors present.
- [ ] No GraphQL errors in the response.

**Exit criteria:** GraphQL schema exposes all 7 CPTs + all 7 ACF field groups. The frontend GraphQL client (`src/lib/wordpress.ts` `QUERIES`) will not throw at runtime.

**Rollback:** n/a (no state change to roll back).

---

## Step 4 — Whitelist the deployment IP in StackProtect

**Goal:** Allow the migration script (run from your laptop or a CI runner) and the Vercel ISR fetcher to reach the WordPress REST + GraphQL endpoints without being challenged by the StackProtect reCAPTCHA firewall.

> **Why this matters:** Without the whitelist, every request from your machine to `cms.gulfseismic.com` returns a 401 with a reCAPTCHA challenge page. The migration script will fail with `BLOCKED BY STACKPROTECT` (see `src/lib/wp-rest-client.ts` line 53). Vercel's ISR background fetcher will also fail silently, causing the frontend to fall back to seed data or error out.

### Actions

- [ ] Determine your current public IP: visit `https://ifconfig.me` from the machine you'll run migration on. Note the IPv4 address.
- [ ] Determine the Vercel IP range: Vercel uses dynamic IPs — you cannot whitelist a single Vercel IP. Instead, configure StackProtect to **whitelist the `Authorization` header** path or **bypass challenges for `/wp-json/*` and `/graphql` requests that carry a valid Application Password**. If StackProtect only supports IP whitelisting, request a static egress IP from Vercel (Enterprise plan) or route migration through a fixed-IP proxy.
- [ ] Go to **WP Admin → Settings → StackProtect**.
- [ ] Open the **IP Whitelist** tab.
- [ ] Add your migration machine IP. Click **Add**.
- [ ] (Optional) Add a CIDR range or wildcard if your office uses a NAT pool.
- [ ] Save changes.
- [ ] Test from your migration machine:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: Basic $(echo -n 'admin:XXXX XXXX XXXX XXXX XXXX XXXX' | base64)" \
  https://cms.gulfseismic.com/wp-json/wp/v2/users/me
```

- [ ] Expected output: `200`. If you see `401` or `403`, the whitelist is not effective.

### Verification

- [ ] `curl` from the migration machine returns `200` with a JSON user payload.
- [ ] From a non-whitelisted machine (e.g. mobile hotspot), the same curl returns the StackProtect challenge HTML.

**Exit criteria:** Migration machine can authenticate to the WP REST API. Vercel can read from `/graphql` without challenge (verify post-deploy via `/api/cms-health`).

**Rollback:** Remove the IP from StackProtect whitelist (Settings → StackProtect → IP Whitelist → Delete).

---

## Step 5 — Run the content migration

**Goal:** Push all base + expanded content (2 countries, 16 cities, 8 services, 10 industries, 50 projects, 20 case studies, 64 FAQs) from the seed data files into the live WordPress.

### Pre-flight

- [ ] Confirm `.env` is set locally with `WP_USER` and `WP_APPLICATION_PASSWORD`.
- [ ] Confirm StackProtect whitelist (Step 4) is active.
- [ ] Confirm CPT UI import (Step 1) and ACF import (Step 2) are complete.
- [ ] Confirm you are on the `main` branch with the latest pull: `git pull origin main`.

### Actions

- [ ] **Verify connectivity:**
  ```bash
  bun run cms:verify
  ```
  Expected: `✓ Authenticated as admin`. If you see `BLOCKED BY STACKPROTECT` → re-check Step 4.

- [ ] **Dry run (no writes):**
  ```bash
  bun run cms:migrate:dry
  ```
  Review the log. It should print "would upsert" for: 2 countries, 16 cities, 10 industries, 8 services, 50 projects, 20 case studies, 64 FAQs (+ optional 6 blogs). Confirm counts match expectations before proceeding.

- [ ] **Full migration:**
  ```bash
  bun run cms:migrate
  ```
  The script runs in this order (defined in `scripts/migrate-to-wordpress.ts`): countries → cities → industries → services → projects → case-studies → faqs → blogs. Each step logs `✓ created` or `↻ updated` per record. Wait for the final summary block.

- [ ] Review the final summary. Expected:
  ```
  Countries: 2
  Cities: 16
  Services: 8
  Industries: 10
  Projects: 50 / 50
  ```

- [ ] If any record errored (`✗`), note the slug and re-run with `--only=<cpt>`:
  ```bash
  bun run cms:migrate:projects   # projects only
  ```

### Verification

- [ ] Open **WP Admin → Countries** — 2 entries (UAE, Saudi Arabia).
- [ ] Open **Cities** — 16 entries.
- [ ] Open **Services** — 8 entries.
- [ ] Open **Industries** — 10 entries.
- [ ] Open **Projects** — 50 entries.
- [ ] Open **Case Studies** — 20 entries.
- [ ] Open **FAQs** — 64 entries (24 base + 40 expanded).
- [ ] Run the health query via GraphQL — `projects(first:100){nodes{slug}}` should return 50 slugs.

**Exit criteria:** All seven CPTs contain the expected counts in WordPress admin and via GraphQL.

**Rollback:** WP Admin → each CPT list screen → select all → Bulk Actions → Delete. (Or re-run migration with corrected seed data — the script is idempotent via upsert.)

---

## Step 6 — Verify relationships in WordPress admin

**Goal:** Confirm the migration script correctly linked Projects to their Country/City/Service/Industry and Case Studies to their Project.

### Actions

- [ ] Open **Projects** → click any project, e.g. `thermoplastic-remarking-sheikh-zayed-road`.
- [ ] In the **Project Fields** box, confirm:
  - `Country` field shows the UAE post (not empty).
  - `City` field shows Dubai (not empty).
  - `Service` field shows Thermoplastic Road Marking (not empty).
  - `Industry` field shows Highways & Roads (not empty).
- [ ] Repeat for 3 random projects covering both countries (open a Saudi project e.g. `airport-marking-king-abdulaziz-jeddah`).
- [ ] Open **Case Studies** → click any case study.
- [ ] Confirm the `Linked Project` field shows the correct Project (not empty).
- [ ] Open **Services** → click "Thermoplastic Road Marking".
- [ ] In **Service Fields**, confirm the `Industries Served` relationship field has multiple industries selected (e.g. Highways & Roads, Aviation).
- [ ] Open **Industries** → click "Highways & Roads".
- [ ] Confirm the `Related Services` relationship field shows multiple services (the migration script backfills this — see `migrateServices()` in `migrate-to-wordpress.ts` lines 217–227).

### Verification

- [ ] 5 spot-checked Projects all have all 4 relationship fields populated.
- [ ] 3 spot-checked Case Studies all have a Linked Project.
- [ ] 2 spot-checked Services show ≥ 2 Industries Served.
- [ ] 1 spot-checked Industry shows ≥ 2 Related Services (bidirectional relationship backfilled).

**Exit criteria:** Zero orphaned relationships across the spot check.

**Rollback:** n/a (data fix only — re-run the migration if relationships are missing; the script overwrites ACF fields on upsert).

---

## Step 7 — Test GraphQL queries against the live endpoint

**Goal:** Run each of the 7 production queries defined in `src/lib/wordpress.ts` `QUERIES` against the live endpoint and confirm they return non-empty data.

### Actions

- [ ] Open `https://cms.gulfseismic.com/graphql` (GraphiQL IDE).
- [ ] For each query in `QUERIES` (lines 87–250 of `src/lib/wordpress.ts`), paste it into the IDE and run:
  - `GetCountries` — expect 2 nodes.
  - `GetCities` — expect 16 nodes.
  - `GetServices` — expect 8 nodes.
  - `GetIndustries` — expect 10 nodes.
  - `GetProjects` — expect 50 nodes.
  - `GetCaseStudies` — expect 20 nodes.
  - `GetFaqs` — expect 64 nodes (run with variable `service: "thermoplastic-road-marking"` to filter; expect ~8 FAQs).
- [ ] Confirm each query returns no `errors` array in the response.
- [ ] Confirm the ACF sub-fields (e.g. `countryFields.countryCode`, `projectFields.materials { material }`, `caseStudyFields.project { node { slug } }`) are populated with real values, not null.

### Verification

- [ ] All 7 queries return 200 with non-empty `nodes`.
- [ ] All ACF sub-fields resolve (no `null` where data should be).
- [ ] No `errors` array in any response.

**Exit criteria:** Live GraphQL endpoint serves the same shape the frontend's mappers expect.

**Rollback:** n/a.

---

## Step 8 — Deploy the frontend to Vercel

**Goal:** Get the Next.js app live on Vercel, connected to the WordPress CMS.

### Actions

- [ ] Push the `main` branch to `github.com/babaronlinecom/gulf-seismic`.
- [ ] Log in to **https://vercel.com**.
- [ ] Click **Add New → Project**.
- [ ] Import the GitHub repo `babaronlinecom/gulf-seismic`.
- [ ] Framework preset: **Next.js**.
- [ ] Build command: leave default (`next build`).
- [ ] Output directory: leave default (`.next`).
- [ ] Install command: `bun install` (or `npm install` if not using Bun).
- [ ] Under **Environment Variables**, add (Production + Preview + Development):
  ```
  WP_USER=admin
  WP_APPLICATION_PASSWORD=XXXX XXXX XXXX XXXX XXXX XXXX
  USE_CMS_FALLBACK=false
  DATABASE_URL=postgres://...
  NEXT_PUBLIC_SITE_URL=https://gulfseismic.com
  ```
  > ⚠️ `USE_CMS_FALLBACK` MUST be `false` in Production and Preview. Setting it to `true` will silently serve stale seed data to live users if the CMS goes down.
- [ ] Click **Deploy**.
- [ ] Wait for the build to complete (typically 2–4 minutes).
- [ ] On success, Vercel assigns a `*.vercel.app` URL — open it and verify the homepage renders with all 8 sections (Hero, ServicesGrid, CitiesSection, IndustriesGrid, ProjectsShowcase, AuthorityGraph, ProcessSection, LeadCtaSection).

### Verification

- [ ] Build logs show no errors.
- [ ] `*.vercel.app` URL loads homepage in < 3 s.
- [ ] Inspect page source — confirm JSON-LD scripts for `Organization`, `WebSite` are present.
- [ ] Click into a city-service page (e.g. `/uae/dubai/parking-lot-marking`) — renders with city-specific hero, FAQ accordion, and LocalBusinessSignals block.

**Exit criteria:** Site is reachable on the `*.vercel.app` domain and renders live CMS data.

**Rollback:** In Vercel → Deployments → click the previous deployment → **Promote to Production**. (Or roll back the Git commit and let Vercel auto-redeploy.)

---

## Step 9 — Verify `/api/cms-health`

**Goal:** Confirm the live frontend can reach the CMS through Vercel's runtime.

### Actions

- [ ] Open `https://<your-vercel-app>.vercel.app/api/cms-health` in a browser.
- [ ] Expected JSON response:
  ```json
  {
    "ok": true,
    "endpoint": "https://cms.gulfseismic.com/graphql",
    "latencyMs": 120,
    "counts": {
      "countries": 1,
      "cities": 1,
      "services": 1,
      "industries": 1,
      "projects": 1,
      "caseStudies": 1,
      "faqs": 1
    }
  }
  ```
  > Note: `counts` reflect `first:1` per type in the health query (a connectivity check, not a full count). The `1` values confirm the schema is reachable and each type has at least 1 record.
- [ ] If `ok: false`:
  - `"No response (StackProtect challenge or network)"` → Step 4 whitelist is not effective for Vercel's egress IP. Re-configure StackProtect to bypass challenges for `/graphql` requests, or proxy through a fixed-IP edge worker.
  - Other error → check Vercel function logs.

### Verification

- [ ] Response status is `200`.
- [ ] `ok: true`.
- [ ] All 7 `counts` are `≥ 1`.
- [ ] `latencyMs < 1000` (sub-second response from Vercel to the CMS).

**Exit criteria:** `/api/cms-health` returns `ok: true` with all 7 counts populated.

**Rollback:** If the CMS is unreachable from Vercel and cannot be fixed quickly, set `USE_CMS_FALLBACK=true` in Vercel env vars and redeploy. This will serve merged seed data (50 projects, 20 case studies, 64 FAQs) until the CMS issue is resolved. Set a calendar reminder to flip back to `false` once fixed.

---

## Step 10 — Verify `sitemap.xml` and submit to Google Search Console

**Goal:** Ensure the sitemap contains all expected URLs (240+) and is submitted to Google.

### Actions

- [ ] Open `https://<your-vercel-app>.vercel.app/sitemap.xml`.
- [ ] Count the `<url>` entries. Expected breakdown:
  - 7 static pages (/, /about, /contact, /projects, /industries, /case-studies, /glossary)
  - 2 country pages
  - 16 city pages
  - 128 programmatic service-city pages (8 services × 16 cities)
  - 8 service pages
  - 10 industry pages
  - 50 project pages
  - 20 case study pages
  - **Total: 241 URLs**
- [ ] If total < 240, inspect the missing category — most likely cause is a missing `allProjects` or `allCaseStudies` import in `src/app/sitemap.ts`.
- [ ] Log in to **Google Search Console** (https://search.google.com/search-console) with the Gulf Seismic property owner account.
- [ ] Add a new property for `gulfseismic.com` (or verify the existing one if DNS cutover is already done — see Step 13).
- [ ] Go to **Sitemaps** → submit `https://gulfseismic.com/sitemap.xml` → click **Submit**.
- [ ] Status should change to "Success" within a few minutes.

### Verification

- [ ] `sitemap.xml` returns 200 with 240+ `<url>` entries.
- [ ] Google Search Console shows the sitemap as "Discovered" or "Success".
- [ ] Spot-check: 3 random project URLs from the sitemap return 200 when fetched.

**Exit criteria:** Sitemap submitted and accepted by Google.

**Rollback:** n/a.

---

## Step 11 — Set up Google Business Profile for each major city

**Goal:** Create Google Business Profile (GBP) listings for each major city and link them to the CMS City records, powering the LocalBusinessSignals block and NAP citations.

### Actions

For each of the 6 priority cities — Abu Dhabi, Dubai, Sharjah (UAE); Riyadh, Jeddah, Dammam (Saudi Arabia):

- [ ] Create or claim the Google Business Profile listing at `https://business.google.com`.
- [ ] Verify the listing (postcard by mail or video verification per Google's process — schedule this 1–2 weeks before launch).
- [ ] Copy the GBP listing URL (e.g. `https://www.google.com/maps/place/Gulf+Seismic+Contracting/@25.20,55.27,17z`).
- [ ] Open the City record in WordPress: **Cities → [city name]**.
- [ ] In **City Fields**, paste into:
  - `Google Business Profile URL` (field name: `gbp_url`)
  - `Google Maps Embed URL` (field name: `map_url`) — format `https://www.google.com/maps?q=...&z=11&output=embed`
  - `NAP — Name` (field name: `nap_name`) — must match GBP exactly (e.g. `Gulf Seismic Contracting LLC — Dubai`)
  - `NAP — Address` (field name: `nap_address`) — must match GBP exactly
- [ ] Click **Update**.
- [ ] Wait 5 minutes (ISR), then open `https://gulfseismic.com/uae/dubai/parking-lot-marking` (or any service page for that city) and verify the **LocalBusinessSignals** card renders with the GBP link, the map embed, and the NAP.

### Verification

- [ ] 6 priority cities all have `gbp_url`, `map_url`, `nap_name`, `nap_address` populated.
- [ ] Frontend LocalBusinessSignals card renders correctly on 3 spot-checked city-service pages.
- [ ] NAP strings are byte-for-byte identical to the GBP listings.

**Exit criteria:** All 6 priority cities have complete GBP + NAP data; LocalBusinessSignals block renders live.

**Rollback:** Clear the 4 NAP/GBP fields in WordPress — the LocalBusinessSignals component gracefully falls back to coordinate-based map embeds (see `src/components/gulf/local-business-signals.tsx`).

---

## Step 12 — Configure Vercel Cron for uptime monitoring

**Goal:** Hit `/api/cms-health` every 5 minutes so Vercel alerts you when the CMS becomes unreachable.

### Actions

- [ ] Create or edit `vercel.json` at the project root:
  ```json
  {
    "crons": [
      {
        "path": "/api/cms-health",
        "schedule": "*/5 * * * *"
      }
    ]
  }
  ```
- [ ] Commit and push to `main`. Vercel auto-redeploys.
- [ ] In Vercel dashboard → Project → **Settings → Cron Jobs** — confirm the cron appears with schedule `*/5 * * * *`.
- [ ] Optional: add a Vercel Log Drain to a Slack/Datadog/PagerDuty endpoint so cron failures (503 responses) raise alerts.
- [ ] Optional: set up an external uptime monitor (UptimeRobot / Pingdom) hitting `https://gulfseismic.com/api/cms-health` independently of Vercel Cron, so you are alerted even if Vercel itself is down.

### Verification

- [ ] After 5 minutes, Vercel → **Logs** shows a successful cron invocation returning 200.
- [ ] External monitor reports uptime.

**Exit criteria:** Uptime monitoring active and verified.

**Rollback:** Remove the cron entry from `vercel.json` and redeploy.

---

## Step 13 — DNS cutover — point gulfseismic.com to Vercel

**Goal:** Switch the apex domain `gulfseismic.com` (and `www.gulfseismic.com`) to Vercel.

### Pre-cutover

- [ ] Confirm the `*.vercel.app` deployment (Step 8) is healthy and `/api/cms-health` is `ok: true`.
- [ ] Confirm DNS access to the Gulf Seismic domain registrar (GoDaddy / Namecheap / Cloudflare / etc.).
- [ ] Confirm `cms.gulfseismic.com` is a separate DNS record (subdomain) pointing to the WordPress host — do NOT change this record. Only change `gulfseismic.com` and `www.gulfseismic.com`.

### Actions

- [ ] In Vercel dashboard → Project → **Settings → Domains** → add `gulfseismic.com` and `www.gulfseismic.com`.
- [ ] Vercel displays the required DNS records (typically an `A` record `76.76.21.21` for the apex, and a `CNAME` `cname.vercel-dns.com` for `www`).
- [ ] At your DNS provider, add:
  - `A` record: `@` → `76.76.21.21`
  - `CNAME` record: `www` → `cname.vercel-dns.com`
  - Keep `cms` subdomain unchanged.
- [ ] Wait for DNS propagation (5–60 minutes depending on TTL). Monitor at `https://dnschecker.org/#A=gulfseismic.com`.
- [ ] Once propagation is complete, Vercel auto-issues an SSL certificate (Let's Encrypt) — visible as a green padlock next to the domain in Vercel Settings.
- [ ] Open `https://gulfseismic.com` — should load the homepage.
- [ ] Open `https://gulfseismic.com/api/cms-health` — should return `ok: true`.

### Verification

- [ ] `https://gulfseismic.com` loads with valid SSL.
- [ ] `https://www.gulfseismic.com` redirects to `https://gulfseismic.com` (or vice versa, per Vercel domain config).
- [ ] `https://cms.gulfseismic.com/wp-admin` still loads (untouched).
- [ ] Mobile + desktop render correctly.

**Exit criteria:** Apex domain serves the Vercel deployment with SSL. CMS subdomain unaffected.

**Rollback:** Revert DNS `A` and `CNAME` records to the previous values. DNS TTL governs the rollback window — set a low TTL (300s) before cutover to enable fast rollback.

---

## Step 14 — Post-launch SEO

**Goal:** Kick-start Google indexing and analytics.

### Actions

- [ ] In Google Search Console (already verified in Step 10 if DNS cutover is complete), submit the sitemap at **Sitemaps → `https://gulfseismic.com/sitemap.xml`**.
- [ ] Go to **URL Inspection** → paste each of these key URLs → click **Request Indexing**:
  - `https://gulfseismic.com/`
  - `https://gulfseismic.com/uae`
  - `https://gulfseismic.com/saudi-arabia`
  - `https://gulfseismic.com/uae/dubai`
  - `https://gulfseismic.com/uae/dubai/parking-lot-marking`
  - `https://gulfseismic.com/uae/dubai/thermoplastic-road-marking`
  - `https://gulfseismic.com/saudi-arabia/riyadh`
  - `https://gulfseismic.com/saudi-arabia/jeddah/airport-marking`
  - `https://gulfseismic.com/projects`
  - `https://gulfseismic.com/case-studies`
  - `https://gulfseismic.com/glossary`
- [ ] Set up **Google Analytics 4** (GA4):
  - Create a GA4 property at `https://analytics.google.com`.
  - Get the Measurement ID (`G-XXXXXXXXXX`).
  - Add as env var `NEXT_PUBLIC_GA4_ID` in Vercel and redeploy (or wire up in `src/app/layout.tsx` if not already).
  - Verify events flow via GA4 DebugView.
- [ ] Set up **Bing Webmaster Tools**: submit `https://gulfseismic.com/sitemap.xml`.
- [ ] Set up Vercel Analytics (Project → Settings → Analytics → Enable) for Core Web Vitals tracking.

### Verification

- [ ] Search Console shows sitemap "Success".
- [ ] 10+ URLs requested for indexing.
- [ ] GA4 DebugView receives events from the live site.
- [ ] Vercel Analytics dashboard populates within 24 hours.

**Exit criteria:** Sitemap submitted, key pages requested for indexing, GA4 + Vercel Analytics active.

**Rollback:** n/a (analytics additions are additive).

---

## Rollback Plan — full revert

If a critical issue is discovered post-launch and you need to revert to a pre-Phase-2 state:

### Option A — Soft rollback (frontend falls back to seed data)

Use this if the CMS is broken but Vercel is healthy.

1. In Vercel → Project → **Settings → Environment Variables**, set `USE_CMS_FALLBACK=true` for Production.
2. Click **Redeploy** on the latest deployment.
3. The frontend will now serve merged seed data (50 projects, 20 case studies, 64 FAQs) from `src/lib/gulf-content-merged.ts` instead of querying the CMS.
4. Users see no downtime (just potentially stale content).
5. Investigate and fix the CMS issue. Once fixed, set `USE_CMS_FALLBACK=false` and redeploy.

### Option B — Hard rollback (revert to pre-Phase-2 deployment)

Use this if the new frontend itself is broken.

1. In Vercel → **Deployments** → find the last known-good deployment (pre-Phase-2).
2. Click the `⋯` menu → **Promote to Production**.
3. Users are now served the previous deployment within seconds.
4. Roll back the Git commit on `main` so future auto-deploys don't reintroduce the bug:
   ```bash
   git revert <commit-sha>
   git push origin main
   ```
5. Investigate the broken deployment in a Preview environment before re-promoting.

### Option C — DNS rollback (last resort)

Use this if Vercel itself is unreachable or the deploy is catastrophic.

1. At your DNS provider, revert the `A` record for `gulfseismic.com` to the previous IP.
2. Wait for DNS TTL to expire (5–60 minutes).
3. Investigate Vercel status at `https://www.vercel-status.com`.

> **CMS rollback is independent.** The WordPress CMS at `cms.gulfseismic.com` is on a separate host with its own DNS record. Reverting the frontend never touches the CMS. To roll back CMS content: re-run `bun run cms:migrate` from an earlier commit, or restore a WordPress database backup via the host's panel.

---

## Monitoring — ongoing

After go-live, monitor these channels:

| Channel | What it tells you | Where | Cadence |
|---|---|---|---|
| `/api/cms-health` | CMS reachability + latency from Vercel's runtime | `https://gulfseismic.com/api/cms-health` (or Vercel Cron logs) | every 5 min (automated) |
| Vercel Analytics | Core Web Vitals (LCP, FID, CLS), top pages, traffic | Vercel → Project → Analytics | daily |
| Vercel Logs | Function errors, 5xx responses, ISR rebuild failures | Vercel → Project → Logs | on alert |
| Google Search Console | Index coverage, search queries, CTR, indexing errors | https://search.google.com/search-console | weekly |
| GA4 | User behaviour, conversions, traffic sources | https://analytics.google.com | weekly |
| WordPress admin | Content counts, broken relationships, draft vs published | `cms.gulfseismic.com/wp-admin` | weekly content audit |
| UptimeRobot / Pingdom | External uptime (independent of Vercel) | https://uptimerobot.com | real-time alerts |

### Alert thresholds (recommended)

- `/api/cms-health` returns `ok: false` for 3 consecutive checks → page engineering on-call.
- Vercel Analytics LCP > 2.5 s on > 10% of pageviews → investigate ISR/cache.
- Search Console "Coverage" errors > 5 URLs → investigate sitemap / 404s.
- Vercel function error rate > 1% over 1 hour → check CMS latency / WPGraphQL errors.

---

## Sign-off

Once every checkbox above is ticked, complete the sign-off block below. This becomes the auditable go-live record.

```
Deployment: Gulf Seismic Authority Platform — Phase 2 Production
Date:       YYYY-MM-DD
Engineer:   _________________________  (deploy lead)
Reviewer:   _________________________  (engineering manager)
Marketing:  _________________________  (Marketing Manager sign-off)

Pre-deploy env vars staged:           [ ]
Step 1  CPT UI import:                [ ]
Step 2  ACF import:                   [ ]
Step 3  WPGraphQL verified:           [ ]
Step 4  StackProtect whitelist:       [ ]
Step 5  Content migration (counts OK):[ ]
Step 6  Relationships verified:       [ ]
Step 7  GraphQL queries return data:  [ ]
Step 8  Vercel deployment healthy:    [ ]
Step 9  /api/cms-health ok:           [ ]
Step 10 sitemap 240+ URLs submitted:  [ ]
Step 11 6 GBPs linked to Cities:      [ ]
Step 12 Vercel Cron active:           [ ]
Step 13 DNS cutover complete:         [ ]
Step 14 GA4 + Search Console active:  [ ]

Rollback plan reviewed:               [ ]
Monitoring channels configured:       [ ]

Final URL verified: https://gulfseismic.com  [ ]
CMS URL verified:   https://cms.gulfseismic.com  [ ]

Status:   [ ] GO LIVE   [ ] HOLD   [ ] ROLLBACK

Notes:
____________________________________________________________________
____________________________________________________________________
```

---

## Related Documents

- `docs/CONTENT_OPERATIONS_ADMIN.md` — content team's daily-use admin guide (companion to this checklist).
- `docs/MIGRATION_PLAN.md` — the broader 12-step migration sequence (this checklist is the operational subset).
- `docs/WORDPRESS_DATA_MODEL.md` — full CPT registration reference (PHP and CPT UI JSON).
- `docs/ACF_BLUEPRINT.md` — every ACF field group, complete with sub-fields.
- `docs/GRAPHQL_ARCHITECTURE.md` — the 7 production queries the frontend sends to the CMS.
- `docs/SEO_AUDIT.md` — metadata, JSON-LD, sitemap, indexing strategy.
- `docs/LEAD_SYSTEM.md` — `/api/leads` endpoint and Prisma Lead model (depends on `DATABASE_URL`).

---

*End of runbook. Print this document, check the boxes by hand on deploy day, and file the signed sign-off block as the auditable record of go-live.*
