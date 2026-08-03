/**
 * Optimization Ecosystem data access.
 *
 * 5 pillars:
 *   SEO  — Search Engine Optimization (meta tags, sitemap, robots)
 *   AIO  — Artificial Intelligence Optimization (entity definitions, structured data)
 *   GEO  — Generative Engine Optimization (citation blocks, E-E-A-T, authority signals)
 *   AEO  — Answer Engine Optimization (FAQ clusters, answer blocks)
 *   SXO  — Search Experience Optimization (CTAs, conversion flows, search intent)
 */
import { db } from "./db";

// ---------------------------------------------------------------------------
// SCORING — compute a 0-100 score for each pillar
// ---------------------------------------------------------------------------

export interface OptimizationScores {
  seo: number;
  aio: number;
  geo: number;
  aeo: number;
  sxo: number;
  overall: number;
}

export async function getOptimizationScores(): Promise<OptimizationScores> {
  const [seoProfiles, entities, faqs, ctas, pages] = await Promise.all([
    db.seoProfile.count(),
    db.entityDefinition.count(),
    db.faqCluster.count({ where: { status: "published" } }),
    db.conversionFlow.count({ where: { status: "active" } }),
    db.page.count({ where: { status: "published" } }),
  ]);

  // SEO: based on how many pages have SEO profiles vs total pages
  // (rough heuristic — in production this would check actual meta tag completeness)
  const seo = Math.min(100, Math.round((seoProfiles / Math.max(pages + 20, 1)) * 100 + 20));

  // AIO: based on entity definitions (need at least 20 for good coverage)
  const aio = Math.min(100, Math.round((entities / 20) * 100));

  // GEO: based on entities + faqs (citation-worthy content)
  const geo = Math.min(100, Math.round(((entities + faqs) / 40) * 100));

  // AEO: based on published FAQs (need at least 30 for good answer coverage)
  const aeo = Math.min(100, Math.round((faqs / 30) * 100));

  // SXO: based on active CTAs (need at least 15 for good conversion coverage)
  const sxo = Math.min(100, Math.round((ctas / 15) * 100));

  const overall = Math.round((seo + aio + geo + aeo + sxo) / 5);

  return { seo, aio, geo, aeo, sxo, overall };
}

// ---------------------------------------------------------------------------
// SEO PROFILES
// ---------------------------------------------------------------------------

export async function getSeoProfile(pageUrl: string) {
  try {
    return await db.seoProfile.findUnique({ where: { pageUrl } });
  } catch {
    return null;
  }
}

export async function getAllSeoProfiles() {
  try {
    return await db.seoProfile.findMany({ orderBy: { pageUrl: "asc" } });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// ENTITY DEFINITIONS (AIO + GEO)
// ---------------------------------------------------------------------------

export async function getEntityDefinitions() {
  try {
    return await db.entityDefinition.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export async function getEntityByName(name: string) {
  try {
    return await db.entityDefinition.findUnique({ where: { name } });
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// FAQ CLUSTERS (AEO)
// ---------------------------------------------------------------------------

export async function getFaqClusters(opts?: { pageUrl?: string; category?: string }) {
  try {
    return await db.faqCluster.findMany({
      where: {
        status: "published",
        ...(opts?.pageUrl ? { pageUrl: opts.pageUrl } : {}),
        ...(opts?.category ? { category: opts.category } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// CONVERSION FLOWS (SXO)
// ---------------------------------------------------------------------------

export async function getConversionFlows(pageUrl?: string) {
  try {
    return await db.conversionFlow.findMany({
      where: {
        status: "active",
        ...(pageUrl ? { pageUrl } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// KEY PAGES — the URLs that should have optimization profiles
// ---------------------------------------------------------------------------

export const KEY_PAGES = [
  { url: "/", label: "Homepage" },
  { url: "/uae", label: "UAE Hub" },
  { url: "/saudi-arabia", label: "Saudi Arabia Hub" },
  { url: "/services/road-marking", label: "Road Marking" },
  { url: "/services/thermoplastic-road-marking", label: "Thermoplastic Road Marking" },
  { url: "/services/parking-lot-marking", label: "Parking Lot Marking" },
  { url: "/services/warehouse-marking", label: "Warehouse Marking" },
  { url: "/services/airport-marking", label: "Airport Marking" },
  { url: "/services/industrial-marking", label: "Industrial Marking" },
  { url: "/services/safety-signage", label: "Safety Signage" },
  { url: "/services/epoxy-flooring", label: "Epoxy Flooring" },
  { url: "/projects", label: "Projects" },
  { url: "/industries", label: "Industries" },
  { url: "/case-studies", label: "Case Studies" },
  { url: "/blog", label: "Blog" },
  { url: "/about", label: "About" },
  { url: "/contact", label: "Contact" },
];
