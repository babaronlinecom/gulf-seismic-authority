/**
 * Merged content accessors — combines base seed data with expanded content.
 *
 * Base data (src/lib/gulf-data.ts): 6 projects, 3 case studies, base FAQs
 * Expanded data (src/lib/gulf-content-expanded.ts): 44 projects, 17 case studies, 40 FAQs
 *
 * Totals: 50 projects, 20 case studies, 64 FAQs.
 *
 * At runtime, the GraphQL client (src/lib/wordpress.ts) fetches live data
 * from WordPress CMS. If the CMS is reachable and returns data, the live
 * data is used. This merged seed data is:
 *   1. The migration source — pushed into WordPress via scripts/migrate-to-wordpress.ts
 *   2. A dev-only fallback — used when CMS is unreachable (DEV_FALLBACK env)
 */

import {
  projects as baseProjects,
  caseStudies as baseCaseStudies,
  services,
  type Project,
  type CaseStudy,
} from "./gulf-data";
import {
  expandedProjects,
  expandedCaseStudies,
  expandedFaqs,
} from "./gulf-content-expanded";

export const allProjects: Project[] = [...baseProjects, ...expandedProjects];
export const allCaseStudies: CaseStudy[] = [...baseCaseStudies, ...expandedCaseStudies];

/**
 * All FAQs keyed by service slug — combines per-service base FAQs (3 each)
 * with the expanded FAQ clusters (5 each: cost, comparison, process,
 * compliance, local). Powers the FAQ schema and AEO answer-engine citation.
 */
export const allFaqsByService: Record<string, { question: string; answer: string }[]> = {};
for (const s of services) {
  allFaqsByService[s.slug] = [...s.faqs, ...(expandedFaqs[s.slug] ?? [])];
}

export const totalProjectCount = allProjects.length; // 50
export const totalCaseStudyCount = allCaseStudies.length; // 20
export const totalFaqCount = Object.values(allFaqsByService).reduce((a, b) => a + b.length, 0); // 64
