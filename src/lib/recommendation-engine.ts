/**
 * Recommendation Engine — analyzes current optimization state and generates
 * prioritized, actionable suggestions across all 5 pillars.
 *
 * Each recommendation has:
 *   - pillar: which pillar it improves (seo | aio | geo | aeo | sxo)
 *   - priority: critical | high | medium | low
 *   - title: short action description
 *   - description: why it matters + what to do
 *   - impact: estimated score points gained (1-20)
 *   - effort: quick | medium | heavy
 *   - action: { label, url } — quick link to the admin section to fix it
 */

import { db } from "./db";
import { KEY_PAGES } from "./optimization";
import { services, cities, countries } from "./gulf-data";

export interface Recommendation {
  id: string;
  pillar: "seo" | "aio" | "geo" | "aeo" | "sxo";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  impact: number; // estimated score points
  effort: "quick" | "medium" | "heavy";
  action?: { label: string; url: string };
}

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export async function generateRecommendations(): Promise<{
  recommendations: Recommendation[];
  summary: { total: number; critical: number; high: number; potentialGain: number };
}> {
  const [seoProfiles, entities, faqs, ctas, pages, posts, projects, caseStudies] = await Promise.all([
    db.seoProfile.count(),
    db.entityDefinition.count(),
    db.faqCluster.count({ where: { status: "published" } }),
    db.conversionFlow.count({ where: { status: "active" } }),
    db.page.count({ where: { status: "published" } }),
    db.post.count({ where: { status: "published" } }),
    db.projectRecord.count({ where: { status: "published" } }),
    db.caseStudyRecord.count({ where: { status: "published" } }),
  ]);

  const recs: Recommendation[] = [];
  let recId = 0;

  // --- SEO RECOMMENDATIONS ---
  const pagesWithoutSeo = KEY_PAGES.length - seoProfiles;
  if (pagesWithoutSeo > 0) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "seo",
      priority: pagesWithoutSeo > 10 ? "critical" : "high",
      title: `${pagesWithoutSeo} key pages missing SEO profiles`,
      description: `${KEY_PAGES.length} key pages identified, but only ${seoProfiles} have SEO profiles. Add meta titles, descriptions, and focus keywords for the remaining pages to improve search visibility.`,
      impact: Math.min(20, pagesWithoutSeo * 2),
      effort: "quick",
      action: { label: "Optimize Pages", url: "/admin/optimization" },
    });
  }

  if (posts < 10) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "seo",
      priority: "high",
      title: `Publish ${10 - posts} more blog posts`,
      description: `You have ${posts} blog posts. Publishing fresh, keyword-targeted content regularly signals to search engines that your site is active and authoritative. Target: 1-2 posts per week covering service-specific topics.`,
      impact: 8,
      effort: "medium",
      action: { label: "Create Post", url: "/admin/posts" },
    });
  }

  // --- AIO RECOMMENDATIONS ---
  if (entities < 20) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "aio",
      priority: entities < 10 ? "critical" : "high",
      title: `Define ${20 - entities} more AI entities`,
      description: `Only ${entities} entities defined. AI search engines (ChatGPT, Perplexity, Google AI Overviews) need at least 20 well-defined entities to understand your business. Define each service, industry, standard, and location as an entity with sameAs links to Wikipedia/LinkedIn.`,
      impact: Math.min(15, (20 - entities) * 1),
      effort: "quick",
      action: { label: "Add Entities", url: "/admin/optimization" },
    });
  }

  // Check if key services are defined as entities
  const serviceEntities = await db.entityDefinition.findMany({
    where: { name: { in: services.map((s) => s.name) } },
    select: { name: true },
  });
  const missingServiceEntities = services.filter((s) => !serviceEntities.find((e) => e.name === s.name));
  if (missingServiceEntities.length > 0) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "aio",
      priority: "high",
      title: `${missingServiceEntities.length} services not defined as AI entities`,
      description: `These services need entity definitions: ${missingServiceEntities.slice(0, 3).map((s) => s.name).join(", ")}${missingServiceEntities.length > 3 ? "..." : ""}. Each service should be an entity with description, type (Service), and sameAs links so AI can recommend Gulf Seismic when users ask about these services.`,
      impact: 10,
      effort: "quick",
      action: { label: "Define Services", url: "/admin/optimization" },
    });
  }

  // --- GEO RECOMMENDATIONS ---
  if (entities < 15) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "geo",
      priority: "high",
      title: "Add sameAs links to authority sources",
      description: "Generative AI engines (Google AI Overviews, Perplexity) cite entities that have sameAs links to Wikipedia, LinkedIn, and other authoritative sources. Add sameAs URLs to your entity definitions to increase citation probability.",
      impact: 8,
      effort: "quick",
      action: { label: "Edit Entities", url: "/admin/optimization" },
    });
  }

  if (caseStudies < 10) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "geo",
      priority: "medium",
      title: `Add ${Math.max(0, 10 - caseStudies)} more case studies with results`,
      description: `Case studies with measurable results (e.g., "240 bays added", "42 km marked") are high-citation-value content. AI engines prefer citing content with specific data points. You have ${caseStudies} case studies — add more with concrete numbers.`,
      impact: 6,
      effort: "medium",
      action: { label: "Add Case Study", url: "/admin/case-studies" },
    });
  }

  // --- AEO RECOMMENDATIONS ---
  if (faqs < 30) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "aeo",
      priority: faqs < 15 ? "critical" : "high",
      title: `Create ${30 - faqs} more FAQ answers`,
      description: `Only ${faqs} FAQs published. Answer engines (Google Featured Snippets, ChatGPT, voice assistants) need 30+ well-structured Q&As to cite your site. Focus on cost questions ("How much does..."), comparison questions ("X vs Y"), and process questions ("How long does...").`,
      impact: Math.min(18, (30 - faqs) * 1),
      effort: "quick",
      action: { label: "Add FAQs", url: "/admin/optimization" },
    });
  }

  // Check for cost-category FAQs (high AEO value)
  const costFaqs = await db.faqCluster.count({ where: { category: "cost", status: "published" } });
  if (costFaqs < 8) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "aeo",
      priority: "high",
      title: `Add ${8 - costFaqs} cost/pricing FAQs`,
      description: `Cost questions are the #1 type of query AI answer engines surface. Users ask "How much does road marking cost in Dubai?" — if you have that answer, you get cited. Create cost FAQs for each service × city combination.`,
      impact: 10,
      effort: "quick",
      action: { label: "Add Cost FAQs", url: "/admin/optimization" },
    });
  }

  // Check for comparison FAQs
  const comparisonFaqs = await db.faqCluster.count({ where: { category: "comparison", status: "published" } });
  if (comparisonFaqs < 5) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "aeo",
      priority: "medium",
      title: `Add ${5 - comparisonFaqs} comparison FAQs`,
      description: `Comparison queries ("thermoplastic vs cold paint", "epoxy vs polyurea") are high-intent and frequently cited by AI. Create head-to-head comparison FAQs for each service category.`,
      impact: 7,
      effort: "quick",
      action: { label: "Add Comparison FAQs", url: "/admin/optimization" },
    });
  }

  // --- SXO RECOMMENDATIONS ---
  const pagesWithCtas = await db.conversionFlow.findMany({
    where: { status: "active" },
    distinct: ["pageUrl"],
    select: { pageUrl: true },
  });
  const keyPagesWithoutCtas = KEY_PAGES.filter(
    (p) => !pagesWithCtas.find((c) => c.pageUrl === p.url)
  );
  if (keyPagesWithoutCtas.length > 0) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "sxo",
      priority: keyPagesWithoutCtas.length > 5 ? "high" : "medium",
      title: `${keyPagesWithoutCtas.length} key pages missing conversion CTAs`,
      description: `These pages have no call-to-action: ${keyPagesWithoutCtas.slice(0, 3).map((p) => p.url).join(", ")}${keyPagesWithoutCtas.length > 3 ? "..." : ""}. Every page should guide visitors toward a quote request, WhatsApp chat, or phone call. Add CTAs matching the page's search intent.`,
      impact: Math.min(12, keyPagesWithoutCtas.length * 2),
      effort: "quick",
      action: { label: "Add CTAs", url: "/admin/optimization" },
    });
  }

  if (ctas < 15) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "sxo",
      priority: "medium",
      title: `Add ${15 - ctas} more conversion CTAs`,
      description: `Only ${ctas} active CTAs. Aim for at least 15 across your key pages — include WhatsApp CTAs (high conversion in Gulf market), call CTAs, and form CTAs. Match CTA type to search intent (awareness → "Learn more", conversion → "Get a Quote").`,
      impact: 8,
      effort: "quick",
      action: { label: "Add CTAs", url: "/admin/optimization" },
    });
  }

  // --- CONTENT GAP RECOMMENDATIONS ---
  // Check if each service has at least one project
  const projectsByService = await db.projectRecord.groupBy({
    by: ["service"],
    _count: true,
    where: { status: "published" },
  });
  const servicesWithoutProjects = services.filter(
    (s) => !projectsByService.find((p) => p.service === s.slug)
  );
  if (servicesWithoutProjects.length > 0) {
    recs.push({
      id: `rec-${recId++}`,
      pillar: "seo",
      priority: "medium",
      title: `${servicesWithoutProjects.length} services have no project examples`,
      description: `Add at least one project for: ${servicesWithoutProjects.slice(0, 3).map((s) => s.name).join(", ")}${servicesWithoutProjects.length > 3 ? "..." : ""}. Service pages with linked projects rank higher and convert better — Google sees them as more authoritative.`,
      impact: 6,
      effort: "medium",
      action: { label: "Add Projects", url: "/admin/projects" },
    });
  }

  // Sort by priority then impact
  recs.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return b.impact - a.impact;
  });

  const summary = {
    total: recs.length,
    critical: recs.filter((r) => r.priority === "critical").length,
    high: recs.filter((r) => r.priority === "high").length,
    potentialGain: recs.reduce((sum, r) => sum + r.impact, 0),
  };

  return { recommendations: recs, summary };
}

// ---------------------------------------------------------------------------
// CONTENT GAP ANALYSIS — specific suggestions for what content to create
// ---------------------------------------------------------------------------

export interface ContentGap {
  type: "faq" | "entity" | "page" | "cta" | "project";
  title: string;
  description: string;
  pillar: string;
  suggestedContent?: string;
}

export async function getContentGaps(): Promise<ContentGap[]> {
  const gaps: ContentGap[] = [];

  // FAQ gaps — cost questions for each service
  const costFaqs = await db.faqCluster.findMany({
    where: { category: "cost", status: "published" },
    select: { question: true },
  });
  const costFaqQuestions = new Set(costFaqs.map((f) => f.question.toLowerCase()));

  for (const service of services) {
    for (const country of countries) {
      const question = `How much does ${service.name.toLowerCase()} cost in ${country.shortName}?`;
      if (!costFaqQuestions.has(question.toLowerCase())) {
        gaps.push({
          type: "faq",
          title: `FAQ: "${question}"`,
          description: `High-value AEO content. Users search this exact query. Provide a price range (e.g., AED 15-35/m) and link to the service page.`,
          pillar: "AEO",
          suggestedContent: `${service.name} in ${country.shortName} typically costs [price range] depending on [factors]. Contact Gulf Seismic for a site-specific quote.`,
        });
      }
    }
  }

  // Entity gaps — cities not defined as entities
  const cityEntities = await db.entityDefinition.findMany({
    where: { entityType: "Place" },
    select: { name: true },
  });
  const definedCities = new Set(cityEntities.map((e) => e.name));
  for (const city of cities.slice(0, 8)) {
    if (!definedCities.has(city.name)) {
      gaps.push({
        type: "entity",
        title: `Entity: "${city.name}"`,
        description: `Define ${city.name} as a Place entity with coordinates, population, and sameAs link to Wikipedia. This helps AI recommend Gulf Seismic for "${city.name} road marking" queries.`,
        pillar: "AIO/GEO",
      });
    }
  }

  return gaps.slice(0, 20); // Top 20 gaps
}
