/**
 * Gulf Seismic → WordPress Content Migration Script
 * ================================================
 *
 * Pushes ALL Gulf Seismic content (countries, cities, services, industries,
 * projects, case studies, FAQs) into the live WordPress CMS at
 * cms.gulfseismic.com, establishing WordPress as the single source of truth.
 *
 * PREREQUISITES
 * -------------
 * 1. CMS StackProtect must whitelist this machine's IP, OR run from an
 *    environment that passes the reCAPTCHA challenge (see MIGRATION_PLAN.md).
 * 2. CPTs registered: import scripts/wp-import/cptui-post-types.json via
 *    WP Admin → CPT UI → Tools → Import.
 * 3. ACF field groups: import scripts/wp-import/acf-field-groups.json via
 *    WP Admin → Custom Fields → Tools → Import.
 * 4. WPGraphQL + WPGraphQL for ACF plugins active.
 * 5. Environment variables set:
 *      WP_USER=admin
 *      WP_APPLICATION_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
 *
 * USAGE
 * -----
 *   bun run scripts/migrate-to-wordpress.ts            # full migration
 *   bun run scripts/migrate-to-wordpress.ts --dry-run  # preview only
 *   bun run scripts/migrate-to-wordpress.ts --verify    # connection check only
 *   bun run scripts/migrate-to-wordpress.ts --only=projects
 */

import {
  countries,
  cities,
  services,
  industries,
  projects as baseProjects,
  caseStudies as baseCaseStudies,
  blogPosts,
} from "../src/lib/gulf-data";
import {
  expandedProjects,
  expandedCaseStudies,
  expandedFaqs,
} from "../src/lib/gulf-content-expanded";
import {
  verifyConnection,
  upsertPost,
  setRelationship,
  type WpPostPayload,
} from "../src/lib/wp-rest-client";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERIFY_ONLY = args.includes("--verify");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.split("=")[1] : null;

// Merged content (base + expanded)
const allProjects = [...baseProjects, ...expandedProjects];
const allCaseStudies = [...baseCaseStudies, ...expandedCaseStudies];

// ID resolution maps (slug → WP post id) for relationships
const idMap = {
  countries: new Map<string, number>(),
  cities: new Map<string, number>(),
  services: new Map<string, number>(),
  industries: new Map<string, number>(),
  projects: new Map<string, number>(),
};

function log(scope: string, msg: string) {
  console.log(`[${scope}] ${msg}`);
}

async function migrateCountries() {
  log("countries", `Migrating ${countries.length} countries...`);
  for (const c of countries) {
    const payload: WpPostPayload = {
      title: c.name,
      slug: c.slug,
      status: "publish",
      content: `<p>${c.heroDescription}</p>`,
      acf: {
        country_code: c.code,
        short_name: c.shortName,
        flag: c.flag,
        dial_code: c.dialCode,
        phone: c.phone,
        whatsapp: c.whatsapp,
        hero_heading: c.heroHeading,
        hero_description: c.heroDescription,
        seo_title: c.seoTitle,
        seo_description: c.seoDescription,
      },
    };
    if (DRY_RUN) {
      log("countries", `  [dry-run] would upsert "${c.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("countries", payload);
      idMap.countries.set(c.slug, r.id);
      log("countries", `  ${r.isNew ? "✓ created" : "↻ updated"} ${c.slug} (id=${r.id})`);
    } catch (e) {
      log("countries", `  ✗ ${c.slug}: ${(e as Error).message}`);
    }
  }
}

async function migrateCities() {
  log("cities", `Migrating ${cities.length} cities...`);
  for (const ct of cities) {
    const countryId = idMap.countries.get(ct.country);
    const payload: WpPostPayload = {
      title: ct.name,
      slug: ct.slug,
      status: "publish",
      content: `<p>${ct.heroDescription}</p>`,
      acf: {
        country: countryId,
        region: ct.region,
        latitude: ct.latitude,
        longitude: ct.longitude,
        population: ct.population,
        highlights: ct.highlights.map((h) => ({ highlight: h })),
        hero_heading: ct.heroHeading,
        hero_description: ct.heroDescription,
        seo_title: ct.seoTitle,
        seo_description: ct.seoDescription,
      },
    };
    if (DRY_RUN) {
      log("cities", `  [dry-run] would upsert "${ct.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("cities", payload);
      idMap.cities.set(ct.slug, r.id);
      log("cities", `  ${r.isNew ? "✓ created" : "↻ updated"} ${ct.slug} (id=${r.id})`);
    } catch (e) {
      log("cities", `  ✗ ${ct.slug}: ${(e as Error).message}`);
    }
  }
}

async function migrateIndustries() {
  log("industries", `Migrating ${industries.length} industries...`);
  for (const ind of industries) {
    const payload: WpPostPayload = {
      title: ind.name,
      slug: ind.slug,
      status: "publish",
      content: `<p>${ind.description}</p>`,
      acf: {
        description: ind.description,
        icon: ind.icon,
        challenges: ind.challenges.map((c) => ({ challenge: c })),
        solutions: ind.solutions.map((s) => ({ solution: s })),
      },
    };
    if (DRY_RUN) {
      log("industries", `  [dry-run] would upsert "${ind.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("industries", payload);
      idMap.industries.set(ind.slug, r.id);
      log("industries", `  ${r.isNew ? "✓ created" : "↻ updated"} ${ind.slug} (id=${r.id})`);
    } catch (e) {
      log("industries", `  ✗ ${ind.slug}: ${(e as Error).message}`);
    }
  }
  // Set service relationships (services not yet created → defer)
}

async function migrateServices() {
  log("services", `Migrating ${services.length} services...`);
  for (const s of services) {
    const industryIds = s.industriesServed
      .map((slug) => idMap.industries.get(slug))
      .filter(Boolean) as number[];
    const payload: WpPostPayload = {
      title: s.name,
      slug: s.slug,
      status: "publish",
      excerpt: s.shortDescription,
      content: `<p>${s.longDescription}</p>`,
      acf: {
        tagline: s.tagline,
        short_description: s.shortDescription,
        long_description: s.longDescription,
        icon: s.icon,
        benefits: s.benefits.map((b) => ({ benefit: b })),
        materials: s.materials.map((m) => ({ material: m })),
        equipment: s.equipment.map((e) => ({ equipment: e })),
        industries_served: industryIds,
        process: s.process.map((p) => ({ step: p.step, title: p.title, description: p.description })),
        specs: s.specs.map((sp) => ({ label: sp.label, value: sp.value })),
        hero_heading: s.heroHeading,
        hero_description: s.heroDescription,
        seo_title: s.seoTitle,
        seo_description: s.seoDescription,
      },
    };
    if (DRY_RUN) {
      log("services", `  [dry-run] would upsert "${s.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("services", payload);
      idMap.services.set(s.slug, r.id);
      log("services", `  ${r.isNew ? "✓ created" : "↻ updated"} ${s.slug} (id=${r.id})`);
    } catch (e) {
      log("services", `  ✗ ${s.slug}: ${(e as Error).message}`);
    }
  }
  // Backfill industry.services relationships
  for (const ind of industries) {
    const indId = idMap.industries.get(ind.slug);
    if (!indId) continue;
    const svcIds = ind.services
      .map((slug) => idMap.services.get(slug))
      .filter(Boolean) as number[];
    if (svcIds.length) {
      if (!DRY_RUN)
        await setRelationship("industries", indId, "services", svcIds).catch(() => {});
    }
  }
}

async function migrateProjects() {
  log("projects", `Migrating ${allProjects.length} projects...`);
  for (const p of allProjects) {
    const countryId = idMap.countries.get(p.country);
    const cityId = idMap.cities.get(p.city);
    const serviceId = idMap.services.get(p.service);
    const industryId = idMap.industries.get(p.industry);
    const payload: WpPostPayload = {
      title: p.title,
      slug: p.slug,
      status: "publish",
      excerpt: p.challenge.slice(0, 160),
      content: `<h2>Challenge</h2><p>${p.challenge}</p><h2>Solution</h2><p>${p.solution}</p><h2>Execution</h2><p>${p.execution}</p>`,
      acf: {
        country: countryId,
        city: cityId,
        service: serviceId,
        industry: industryId,
        client: p.client,
        year: p.year,
        duration: p.duration,
        location: p.location,
        area: p.area,
        challenge: p.challenge,
        solution: p.solution,
        execution: p.execution,
        materials: p.materials.map((m) => ({ material: m })),
        equipment: p.equipment.map((e) => ({ equipment: e })),
        results: p.results.map((r) => ({ label: r.label, value: r.value })),
      },
    };
    if (DRY_RUN) {
      log("projects", `  [dry-run] would upsert "${p.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("projects", payload);
      idMap.projects.set(p.slug, r.id);
      log("projects", `  ${r.isNew ? "✓ created" : "↻ updated"} ${p.slug} (id=${r.id})`);
    } catch (e) {
      log("projects", `  ✗ ${p.slug}: ${(e as Error).message}`);
    }
  }
}

async function migrateCaseStudies() {
  log("case-studies", `Migrating ${allCaseStudies.length} case studies...`);
  for (const cs of allCaseStudies) {
    const projectId = idMap.projects.get(cs.projectSlug);
    const payload: WpPostPayload = {
      title: cs.title,
      slug: cs.slug,
      status: "publish",
      excerpt: cs.summary,
      content: `<p>${cs.summary}</p>`,
      acf: {
        project: projectId,
        summary: cs.summary,
        outcomes: cs.outcomes.map((o) => ({ outcome: o })),
        testimonial_quote: cs.testimonial?.quote ?? "",
        testimonial_author: cs.testimonial?.author ?? "",
        testimonial_role: cs.testimonial?.role ?? "",
      },
    };
    if (DRY_RUN) {
      log("case-studies", `  [dry-run] would upsert "${cs.slug}"`);
      continue;
    }
    try {
      const r = await upsertPost("case-studies", payload);
      log("case-studies", `  ${r.isNew ? "✓ created" : "↻ updated"} ${cs.slug} (id=${r.id})`);
    } catch (e) {
      log("case-studies", `  ✗ ${cs.slug}: ${(e as Error).message}`);
    }
  }
}

async function migrateFaqs() {
  // Base FAQs from services
  let total = 0;
  const baseFaqs: { service: string; question: string; answer: string }[] = [];
  for (const s of services) {
    for (const f of s.faqs) {
      baseFaqs.push({ service: s.slug, ...f });
    }
  }
  total += baseFaqs.length;

  // Expanded FAQs
  for (const [serviceSlug, faqs] of Object.entries(expandedFaqs)) {
    total += faqs.length;
  }

  log("faqs", `Migrating ${total} FAQs...`);

  // Base FAQs (cluster: general)
  for (const f of baseFaqs) {
    const serviceId = idMap.services.get(f.service);
    const payload: WpPostPayload = {
      title: f.question,
      slug: f.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
      status: "publish",
      acf: {
        answer: f.answer,
        service: serviceId,
        cluster: "general",
      },
    };
    if (DRY_RUN) continue;
    try {
      await upsertPost("faqs", payload);
    } catch (e) {
      log("faqs", `  ✗: ${(e as Error).message}`);
    }
  }

  // Expanded FAQs (clustered)
  for (const [serviceSlug, faqs] of Object.entries(expandedFaqs)) {
    const serviceId = idMap.services.get(serviceSlug);
    for (let i = 0; i < faqs.length; i++) {
      const f = faqs[i];
      const clusterMap = ["cost", "comparison", "process", "compliance", "local"];
      const cluster = clusterMap[i] ?? "general";
      const slug = `${serviceSlug}-faq-${cluster}-${i}`.slice(0, 80);
      const payload: WpPostPayload = {
        title: f.question,
        slug,
        status: "publish",
        acf: {
          answer: f.answer,
          service: serviceId,
          cluster,
        },
      };
      if (DRY_RUN) continue;
      try {
        await upsertPost("faqs", payload);
      } catch (e) {
        log("faqs", `  ✗ ${slug}: ${(e as Error).message}`);
      }
    }
  }
  log("faqs", `  done (${total} FAQs processed)`);
}

async function migrateBlogs() {
  log("blogs", `Migrating ${blogPosts.length} blog posts...`);
  for (const post of blogPosts) {
    const payload: WpPostPayload = {
      title: post.title,
      slug: post.slug,
      status: "publish",
      excerpt: post.excerpt,
      content: `<p>${post.excerpt}</p><p>Full article body to be authored by content team.</p>`,
    };
    if (DRY_RUN) continue;
    try {
      const r = await upsertPost("posts", payload);
      log("blogs", `  ${r.isNew ? "✓ created" : "↻ updated"} ${post.slug}`);
    } catch (e) {
      log("blogs", `  ✗ ${post.slug}: ${(e as Error).message}`);
    }
  }
}

async function main() {
  console.log("=".repeat(70));
  console.log("  Gulf Seismic → WordPress Content Migration");
  console.log(`  Mode: ${DRY_RUN ? "DRY RUN" : "LIVE"}${VERIFY_ONLY ? " (verify only)" : ""}`);
  console.log("=".repeat(70));

  if (VERIFY_ONLY) {
    const r = await verifyConnection();
    console.log(r.ok ? `✓ ${r.site}` : `✗ ${r.error}`);
    process.exit(r.ok ? 0 : 1);
  }

  // Verify connection first
  const conn = await verifyConnection();
  if (!conn.ok) {
    console.error(`\n✗ Cannot connect to WordPress: ${conn.error}`);
    console.error("\nSee docs/MIGRATION_PLAN.md for setup steps.");
    process.exit(1);
  }
  log("auth", conn.site ?? "connected");

  const steps: { key: string; fn: () => Promise<void> }[] = [
    { key: "countries", fn: migrateCountries },
    { key: "cities", fn: migrateCities },
    { key: "industries", fn: migrateIndustries },
    { key: "services", fn: migrateServices },
    { key: "projects", fn: migrateProjects },
    { key: "case-studies", fn: migrateCaseStudies },
    { key: "faqs", fn: migrateFaqs },
    { key: "blogs", fn: migrateBlogs },
  ];

  for (const step of steps) {
    if (ONLY && ONLY !== step.key) continue;
    await step.fn();
  }

  console.log("\n" + "=".repeat(70));
  console.log("  Migration complete.");
  console.log(`  Countries: ${idMap.countries.size}`);
  console.log(`  Cities: ${idMap.cities.size}`);
  console.log(`  Services: ${idMap.services.size}`);
  console.log(`  Industries: ${idMap.industries.size}`);
  console.log(`  Projects: ${idMap.projects.size} / ${allProjects.length}`);
  console.log("  Next: verify GraphQL at https://cms.gulfseismic.com/graphql");
  console.log("=".repeat(70));
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
