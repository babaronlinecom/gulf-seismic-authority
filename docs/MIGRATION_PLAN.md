# Gulf Seismic — Migration Plan

> Step-by-step plan to migrate from the current state (Z.ai scaffold + seed data) to production (live authority platform on gulfseismic.com).

This plan is sequenced to minimise risk and allow independent rollback at each step. Each step has an owner, estimated effort, exit criteria, and rollback plan.

---

## Step 1 — Push Prisma schema (Lead model + Postgres)

**Owner:** Backend
**Effort:** 2 hours
**Debt closed:** TD3, TD21

### Actions
1. Provision Vercel Postgres (or Neon / Supabase).
2. Get the connection string.
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Replace `User` and `Post` models with `Lead`, `LeadEvent`, and `LeadStatus` enum (see `LEAD_SYSTEM.md` §4).
5. Set `DATABASE_URL` env var locally and in Vercel.
6. Run:
   ```bash
   npx prisma migrate dev --name init-postgres
   npx prisma generate
   ```
7. Verify with `npx prisma studio`.

### Exit criteria
- `prisma migrate status` reports no pending migrations.
- `Lead` model is queryable via Prisma Studio.

### Rollback
- Drop the new schema; restore `User`/`Post`; revert `datasource` to SQLite.

---

## Step 2 — Replace root layout + homepage

**Owner:** Frontend
**Effort:** 4 hours
**Debt closed:** TD4, TD5

### Actions
1. Replace `src/app/layout.tsx` metadata with Gulf Seismic org metadata (see `SEO_AUDIT.md` §2.1).
2. Wrap children with `<Header />`, `<main>`, `<Footer />`, `<WhatsAppFab />`, `<Toaster />`.
3. Emit global JSON-LD (`organizationSchema`, `websiteSchema`) via `<JsonLd>`.
4. Replace `src/app/page.tsx` with the homepage composition:
   ```tsx
   <Hero />
   <ServicesGrid />
   <CitiesSection />
   <IndustriesGrid />
   <ProjectsShowcase />
   <AuthorityGraph />
   <ProcessSection />
   <LeadCtaSection />
   ```
5. Add `error.tsx`, `not-found.tsx`, `loading.tsx` per `NEXT_ARCHITECTURE.md` §13.

### Exit criteria
- Homepage renders with all 8 sections.
- `<title>` is "Gulf Seismic — Road & Industrial Marking Authority".
- Mobile menu opens and closes.
- WhatsApp FAB appears after scroll.
- 404 renders custom `not-found.tsx`.

### Rollback
- Revert `layout.tsx` and `page.tsx` to previous commit.

---

## Step 3 — Configure WordPress CPTs + ACF

**Owner:** CMS
**Effort:** 1 day
**Debt closed:** TD6, TD7

### Actions
1. Provision WordPress host (Kinsta / WP Engine / self-hosted VPS).
2. Point `cms.gulfseismic.com` DNS A record to host IP.
3. Install plugins:
   - WPGraphQL
   - WPGraphQL for ACF
   - ACF Pro
   - CPT UI
   - Yoast SEO + WPGraphQL Yoast SEO Addon
   - Application Passwords (built into WP core)
4. Activate the CPT registration snippets from `WORDPRESS_DATA_MODEL.md` §3 (paste as MU plugin at `wp-content/mu-plugins/gulf-cpts.php`).
5. Import ACF field group JSON files from `db/acf/*.json` (export from a local ACF dev install first).
6. Create 2 Countries, 16 Cities, 8 Services, 7 Industries, 6 Projects, 3 Case Studies, 6 Blogs (mirror the seed data in `gulf-data.ts`).
7. Generate Application Password for the API user (`api-user`).
8. Store in Vercel env vars: `CMS_API_URL`, `CMS_API_USER`, `CMS_API_PASSWORD`.
9. Verify GraphQL endpoint: `curl -X POST https://cms.gulfseismic.com/graphql -H "Content-Type: application/json" -d '{"query":"{countries{nodes{slug title}}}"}'`

### Exit criteria
- GraphiQL at `/graphql` returns all 9 CPTs.
- Each CPT has its ACF field group visible in the WP editor.
- ACF fields are exposed in GraphQL (e.g. `countryFields { heroHeading }`).

### Rollback
- Deactivate MU plugin; CPTs disappear (data preserved in DB).

---

## Step 4 — Map GraphQL responses to typed entities

**Owner:** Backend / CMS
**Effort:** 1 day
**Debt closed:** TD1

### Actions
1. Implement mapper functions in `src/lib/wordpress.ts`:
   - `mapCountries(nodes: WpCountryNode[]): Country[]`
   - `mapCities(nodes: WpCityNode[]): City[]`
   - `mapServices(nodes: WpServiceNode[]): Service[]`
   - `mapIndustries(nodes: WpIndustryNode[]): Industry[]`
   - `mapProjects(nodes: WpProjectNode[]): Project[]`
   - `mapCaseStudies(nodes: WpCaseStudyNode[]): CaseStudy[]`
   - `mapBlogs(nodes: WpBlogNode[]): BlogPost[]`
   - `mapFaqs(nodes: WpFaqNode[]): Faq[]`
2. Replace each `// Map CMS shape → ... (left to migration)` stub with the actual mapper call.
3. Add unit tests for each mapper (`tests/wordpress.test.ts`).
4. Test end-to-end: temporarily set `CMS_API_URL` to the live CMS; verify that `getCountries()` returns CMS data (not seed).

### Exit criteria
- All public API functions (`getCountries`, `getCitiesList`, etc.) return CMS data when CMS is reachable.
- All public API functions fall back to seed data when CMS is unreachable.
- Unit tests pass.

### Rollback
- Revert mappers; fall through to seed data.

---

## Step 5 — Create the authority graph route tree

**Owner:** Frontend
**Effort:** 2 days
**Debt closed:** TD8, TD9, TD10, TD17

### Actions
1. Create all route files per `ROUTES.md` §3:
   - `src/app/[country]/page.tsx`
   - `src/app/[country]/[city]/page.tsx`
   - `src/app/[country]/[city]/[service]/page.tsx`
   - `src/app/services/[slug]/page.tsx`
   - `src/app/projects/page.tsx` and `[slug]/page.tsx`
   - `src/app/industries/page.tsx` and `[slug]/page.tsx`
   - `src/app/case-studies/[slug]/page.tsx`
   - `src/app/blog/page.tsx` and `[slug]/page.tsx`
   - `src/app/about/page.tsx`
   - `src/app/contact/page.tsx`
   - `src/app/privacy/page.tsx`
   - `src/app/terms/page.tsx`
2. Implement `generateStaticParams` for each dynamic route.
3. Implement `generateMetadata` for each route (using `buildMetadata`).
4. Render `<Breadcrumbs>`, `<PageHero>`, JSON-LD (`<JsonLd>`) per route.
5. Create `src/app/sitemap.xml/route.ts` and `src/app/robots.txt/route.ts`.
6. Create `src/app/error.tsx`, `not-found.tsx`, `loading.tsx`.

### Exit criteria
- All 128 service-city pages build successfully (`next build`).
- `sitemap.xml` returns valid XML with all URLs.
- `robots.txt` returns expected text.
- Each route emits the correct JSON-LD per `SCHEMA_ARCHITECTURE.md` §13.
- Lighthouse SEO audit passes for homepage + 1 service-city page.

### Rollback
- Revert route files; previous routes still work.

---

## Step 6 — Implement `/api/leads` endpoint

**Owner:** Backend
**Effort:** 4 hours
**Debt closed:** TD2

### Actions
1. Create `src/app/api/leads/route.ts` per `LEAD_SYSTEM.md` §3.
2. Implement Zod validation (mirror client-side schema).
3. Implement rate limiting (in-memory token bucket: 5 req / IP / min).
4. Implement `scoreLead()` per `LEAD_SYSTEM.md` §5.
5. Implement `sendLeadNotificationEmail()` via Resend.
6. Add `RESEND_API_KEY` env var.
7. Add `ADMIN_API_TOKEN` env var for the `GET` endpoint.
8. Test: POST a sample lead; verify Prisma record + email arrives.

### Exit criteria
- `POST /api/leads` with valid body returns 201.
- `POST /api/leads` with invalid body returns 422.
- Rate limit returns 429 after 5 requests.
- Lead record exists in Prisma.
- Email arrives at `info@gulfseismic.com`.

### Rollback
- Disable the route (return 410 Gone).

---

## Step 7 — Add real project gallery images

**Owner:** Content / Frontend
**Effort:** 1 day
**Debt closed:** TD11, TD16

### Actions
1. Collect real project photos from the field team (min 1200×800 px).
2. Upload to WP media library.
3. Update each Project's `gallery` ACF field to reference the uploaded images.
4. Update the GraphQL `ProjectFields.gallery` fragment to return `sourceUrl` + `altText`.
5. Update the `ProjectDetail` component to render gallery via `next/image`:
   ```tsx
   <Image src={photo.sourceUrl} alt={photo.altText} width={1200} height={800} priority={i === 0} />
   ```
6. Replace `<img>` in `ProjectsShowcase` with `next/image`.

### Exit criteria
- Each project has ≥2 real photos.
- Images render via `next/image` (auto AVIF/WebP).
- LCP remains < 2.5s on mobile.

### Rollback
- Revert to placeholder gallery.

---

## Step 8 — Add blog post body content

**Owner:** Content
**Effort:** 2 days
**Debt closed:** TD12

### Actions
1. Write full body content for the 6 seeded blog posts (1,500–2,500 words each).
2. Publish via WordPress `blog` CPT (full editor body).
3. Update GraphQL `GetBlogs` query to include `content`.
4. Create `src/app/blog/[slug]/page.tsx` rendering the body.
5. Add `Article` JSON-LD via `articleSchema()`.
6. Add `RelatedBlogs` block at the bottom.

### Exit criteria
- 6 blog posts render with full body.
- Each post has valid `Article` JSON-LD.
- Related blogs section shows 3 cards.

### Rollback
- Revert blog body; keep excerpt-only.

---

## Step 9 — Deploy to Vercel

**Owner:** DevOps
**Effort:** 2 hours
**Debt closed:** TD15, TD20

### Actions
1. Connect the GitHub repo to Vercel.
2. Configure environment variables in Vercel:
   - `DATABASE_URL` (Postgres)
   - `CMS_API_URL`, `CMS_API_USER`, `CMS_API_PASSWORD`
   - `RESEND_API_KEY`
   - `ADMIN_API_TOKEN`
   - `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` (placeholder for now)
   - `NEXT_PUBLIC_SITE_URL=https://gulfseismic.com`
3. Configure security headers in `next.config.ts` (see `TECHNICAL_DEBT.md` TD20).
4. Trigger production deploy.
5. Verify on the Vercel preview URL: all routes, lead form, sitemap.
6. Run Lighthouse audit on the preview URL.

### Exit criteria
- Production deploy succeeds.
- All routes return 200.
- Lighthouse mobile score: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 90.
- Vercel Analytics shows Core Web Vitals within budget.

### Rollback
- Redeploy previous git commit.

---

## Step 10 — Set up sitemap submission

**Owner:** SEO
**Effort:** 1 hour
**Debt closed:** TD23

### Actions
1. Verify `https://gulfseismic.com/sitemap.xml` returns valid XML.
2. Add property in Google Search Console (`gulfseismic.com`).
3. Verify ownership via DNS TXT record.
4. Submit sitemap URL in GSC.
5. Repeat in Bing Webmaster Tools.
6. Set up weekly GSC API sync to track indexation (Phase 2).

### Exit criteria
- GSC reports "Sitemap processed successfully".
- Bing Webmaster Tools reports the same.

### Rollback
- Remove sitemap from GSC (no production impact).

---

## Step 11 — DNS cutover

**Owner:** DevOps
**Effort:** 1 hour (plus DNS propagation)

### Actions
1. Verify Vercel preview deployment is fully functional.
2. In the domain registrar (GoDaddy / Namecheap / Cloudflare):
   - Point `gulfseismic.com` A record to Vercel (or CNAME to `cname.vercel-dns.com`).
   - Point `www.gulfseismic.com` to `gulfseismic.com` (301 redirect, handled by Vercel).
   - Verify `cms.gulfseismic.com` is already pointing to the WordPress host.
3. Add the domain in Vercel project settings.
4. Wait for Vercel to issue the SSL certificate (usually < 5 minutes).
5. Verify `https://gulfseismic.com` loads the new site.
6. Verify `https://gulfseismic.com/api/leads` accepts POST.
7. Verify `https://cms.gulfseismic.com/graphql` returns data.

### Exit criteria
- `https://gulfseismic.com` loads Gulf Seismic homepage.
- All routes return 200.
- SSL Labs grade A or A+.
- DNS propagated globally (check via `dig` from multiple regions).

### Rollback
- Revert DNS A record to previous value (e.g. old WordPress host).
- DNS TTL 1 hour → rollback within 1 hour.

---

## Step 12 — Post-launch verification

**Owner:** All
**Effort:** 1 day

### Verification checklist
- [ ] Homepage Lighthouse: Perf ≥ 90, SEO ≥ 95, A11y ≥ 90
- [ ] 1 service-city page Lighthouse: same thresholds
- [ ] 1 project page Lighthouse: same thresholds
- [ ] `/sitemap.xml` returns 200 with all expected URLs
- [ ] `/robots.txt` returns 200 with expected text
- [ ] Lead form submission creates a Prisma record + sends email
- [ ] WhatsApp FAB opens `wa.me` link with prefilled message
- [ ] Mobile menu opens and closes
- [ ] All JSON-LD validates in Google Rich Results Test
- [ ] GSC "URL Inspection" shows "URL is on Google" for homepage
- [ ] No console errors on any route
- [ ] No 404s in Vercel logs
- [ ] No 500s in Vercel logs
- [ ] WordPress CMS is reachable from Vercel (check logs for `[WPGraphQL] fetch failed`)

---

## Migration Timeline

| Step | Day | Owner |
|---|---|---|
| 1 | 1 | Backend |
| 2 | 1 | Frontend |
| 3 | 2 | CMS |
| 4 | 3 | Backend |
| 5 | 3–4 | Frontend |
| 6 | 4 | Backend |
| 7 | 5 | Content / Frontend |
| 8 | 6–7 | Content |
| 9 | 7 | DevOps |
| 10 | 8 | SEO |
| 11 | 8 | DevOps |
| 12 | 9 | All |

**Total elapsed time:** ~9 working days.

---

## Risk Register (Migration-Specific)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| CMS host provisioning delayed | Medium | High | Start Step 3 on Day 1 in parallel |
| DNS propagation slower than expected | Low | Medium | Use Cloudflare with 1-min TTL |
| Vercel build fails on 128 service-city pages | Low | High | Test build locally first; ensure `generateStaticParams` returns synchronously from `gulf-data.ts` |
| CMS data shape doesn't match mapper | Medium | Medium | Build mappers + tests in Step 4 before relying on them |
| Lead volume spikes Vercel function limits | Low | Medium | Use Edge runtime for `/api/leads`; queue via Upstash Redis if needed |
| WordPress hacked | Low | Critical | Enable 2FA, limit login attempts, daily backups |

---

## Related Documents

- `PROJECT_AUDIT.md` — overall gap analysis
- `TECHNICAL_DEBT.md` — debt register (referenced by step)
- `ROUTES.md` — route inventory (Step 5)
- `LEAD_SYSTEM.md` — lead system (Step 6)
- `WORDPRESS_DATA_MODEL.md` — CPT setup (Step 3)
- `GRAPHQL_ARCHITECTURE.md` — mapper implementation (Step 4)
- `SEO_AUDIT.md` — post-launch verification
