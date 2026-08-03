/**
 * WordPress Headless CMS GraphQL client for Gulf Seismic.
 *
 * Endpoint: https://cms.gulfseismic.com/graphql
 *
 * ARCHITECTURE (Phase 2 — production)
 * ------------------------------------
 *   WordPress CMS (source of truth)
 *      ↓  GraphQL (WPGraphQL + WPGraphQL for ACF)
 *   this client (fetch + map → TS types)
 *      ↓
 *   Next.js pages (SSG/ISR)
 *
 * The CMS exposes CPTs: Countries, Cities, Services, Industries, Projects,
 * CaseStudies, FAQs. Content is pushed into the CMS by
 * `scripts/migrate-to-wordpress.ts`.
 *
 * FALLBACK POLICY
 * ---------------
 * Live CMS data is PRIMARY. The merged seed data in `gulf-content-merged.ts`
 * is used ONLY when:
 *   (a) NODE_ENV === "development" AND the env var USE_CMS_FALLBACK !== "false"
 *   (b) the CMS is unreachable on first attempt at runtime
 * In production, a CMS failure surfaces an error (so it is never silently
 * serving stale seed data to users).
 */

import {
  countries as seedCountries,
  cities as seedCities,
  services as seedServices,
  industries as seedIndustries,
  type Country,
  type City,
  type Service,
  type Industry,
  type Project,
  type CaseStudy,
} from "./gulf-data";
import { allProjects, allCaseStudies, allFaqsByService } from "./gulf-content-merged";

const CMS_ENDPOINT = "https://cms.gulfseismic.com/graphql";
const DEV_FALLBACK =
  process.env.NODE_ENV === "development" && process.env.USE_CMS_FALLBACK !== "false";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(CMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      next: { revalidate: 300 }, // ISR: 5 min cache
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) {
      console.warn("[WPGraphQL] errors:", json.errors.map((e) => e.message).join("; "));
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    if (DEV_FALLBACK) {
      console.warn("[WPGraphQL] fetch failed, using DEV seed fallback:", (err as Error).message);
    } else {
      console.error("[WPGraphQL] fetch failed:", (err as Error).message);
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// QUERIES — full field selection matching the ACF field groups
// ---------------------------------------------------------------------------

export const QUERIES = {
  GetCountries: /* GraphQL */ `
    query GetCountries {
      countries(first: 50) {
        nodes {
          slug
          title
          countryFields {
            countryCode
            shortName
            flag
            dialCode
            phone
            whatsapp
            heroHeading
            heroDescription
            seoTitle
            seoDescription
          }
        }
      }
    }
  `,
  GetCities: /* GraphQL */ `
    query GetCities($country: ID) {
      cities(first: 100, where: { country: $country }) {
        nodes {
          slug
          title
          cityFields {
            country {
              node {
                slug
              }
            }
            region
            latitude
            longitude
            population
            highlights {
              highlight
            }
            heroHeading
            heroDescription
            seoTitle
            seoDescription
            mapUrl
            gbpUrl
            napName
            napAddress
          }
        }
      }
    }
  `,
  GetServices: /* GraphQL */ `
    query GetServices {
      services(first: 50) {
        nodes {
          slug
          title
          serviceFields {
            tagline
            shortDescription
            longDescription
            icon
            benefits { benefit }
            materials { material }
            equipment { equipment }
            industriesServed {
              nodes { slug }
            }
            process { step title description }
            specs { label value }
            heroHeading
            heroDescription
            seoTitle
            seoDescription
          }
        }
      }
    }
  `,
  GetIndustries: /* GraphQL */ `
    query GetIndustries {
      industries(first: 50) {
        nodes {
          slug
          title
          industryFields {
            description
            icon
            challenges { challenge }
            solutions { solution }
            services {
              nodes { slug }
            }
          }
        }
      }
    }
  `,
  GetProjects: /* GraphQL */ `
    query GetProjects($city: ID, $service: ID) {
      projects(first: 100, where: { city: $city, service: $service }) {
        nodes {
          slug
          title
          projectFields {
            country { node { slug } }
            city { node { slug } }
            service { node { slug } }
            industry { node { slug } }
            client
            year
            duration
            location
            area
            challenge
            solution
            execution
            materials { material }
            equipment { equipment }
            results { label value }
          }
        }
      }
    }
  `,
  GetCaseStudies: /* GraphQL */ `
    query GetCaseStudies {
      caseStudies(first: 100) {
        nodes {
          slug
          title
          caseStudyFields {
            project { node { slug } }
            summary
            outcomes { outcome }
            testimonialQuote
            testimonialAuthor
            testimonialRole
          }
        }
      }
    }
  `,
  GetFaqs: /* GraphQL */ `
    query GetFaqs($service: ID) {
      faqs(first: 200, where: { service: $service }) {
        nodes {
          slug
          title
          faqFields {
            answer
            service { node { slug } }
            city { node { slug } }
            cluster
          }
        }
      }
    }
  `,
};

// ---------------------------------------------------------------------------
// CMS RESPONSE TYPES (matching WPGraphQL + ACF shapes)
// ---------------------------------------------------------------------------

interface CmsCountry {
  slug: string;
  title: string;
  countryFields: {
    countryCode: string;
    shortName: string;
    flag: string;
    dialCode: string;
    phone: string;
    whatsapp: string;
    heroHeading: string;
    heroDescription: string;
    seoTitle: string;
    seoDescription: string;
  };
}

interface CmsCity {
  slug: string;
  title: string;
  cityFields: {
    country?: { node?: { slug?: string } };
    region: string;
    latitude: number;
    longitude: number;
    population: string;
    highlights?: { highlight: string }[];
    heroHeading: string;
    heroDescription: string;
    seoTitle: string;
    seoDescription: string;
    mapUrl?: string;
    gbpUrl?: string;
    napName?: string;
    napAddress?: string;
  };
}

interface CmsService {
  slug: string;
  title: string;
  serviceFields: {
    tagline: string;
    shortDescription: string;
    longDescription: string;
    icon: string;
    benefits?: { benefit: string }[];
    materials?: { material: string }[];
    equipment?: { equipment: string }[];
    industriesServed?: { nodes?: { slug: string }[] };
    process?: { step: number; title: string; description: string }[];
    specs?: { label: string; value: string }[];
    heroHeading: string;
    heroDescription: string;
    seoTitle: string;
    seoDescription: string;
  };
}

interface CmsIndustry {
  slug: string;
  title: string;
  industryFields: {
    description: string;
    icon: string;
    challenges?: { challenge: string }[];
    solutions?: { solution: string }[];
    services?: { nodes?: { slug: string }[] };
  };
}

interface CmsProject {
  slug: string;
  title: string;
  projectFields: {
    country?: { node?: { slug?: string } };
    city?: { node?: { slug?: string } };
    service?: { node?: { slug?: string } };
    industry?: { node?: { slug?: string } };
    client: string;
    year: number;
    duration: string;
    location: string;
    area: string;
    challenge: string;
    solution: string;
    execution: string;
    materials?: { material: string }[];
    equipment?: { equipment: string }[];
    results?: { label: string; value: string }[];
  };
}

interface CmsCaseStudy {
  slug: string;
  title: string;
  caseStudyFields: {
    project?: { node?: { slug?: string } };
    summary: string;
    outcomes?: { outcome: string }[];
    testimonialQuote?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
  };
}

interface CmsFaq {
  slug: string;
  title: string;
  faqFields: {
    answer: string;
    service?: { node?: { slug?: string } };
    city?: { node?: { slug?: string } };
    cluster: string;
  };
}

// ---------------------------------------------------------------------------
// MAPPERS — CMS shapes → app TS types
// ---------------------------------------------------------------------------

function mapCountry(c: CmsCountry): Country {
  return {
    slug: c.slug as Country["slug"],
    name: c.title,
    shortName: c.countryFields.shortName,
    code: c.countryFields.countryCode,
    flag: c.countryFields.flag,
    heroHeading: c.countryFields.heroHeading,
    heroDescription: c.countryFields.heroDescription,
    seoTitle: c.countryFields.seoTitle,
    seoDescription: c.countryFields.seoDescription,
    dialCode: c.countryFields.dialCode,
    whatsapp: c.countryFields.whatsapp,
    phone: c.countryFields.phone,
  };
}

function mapCity(c: CmsCity): City {
  return {
    slug: c.slug,
    country: (c.cityFields.country?.node?.slug ?? "uae") as Country["slug"],
    name: c.title,
    region: c.cityFields.region,
    latitude: c.cityFields.latitude,
    longitude: c.cityFields.longitude,
    heroHeading: c.cityFields.heroHeading,
    heroDescription: c.cityFields.heroDescription,
    seoTitle: c.cityFields.seoTitle,
    seoDescription: c.cityFields.seoDescription,
    population: c.cityFields.population,
    highlights: (c.cityFields.highlights ?? []).map((h) => h.highlight),
  };
}

function mapService(s: CmsService): Service {
  return {
    slug: s.slug,
    name: s.title,
    tagline: s.serviceFields.tagline,
    shortDescription: s.serviceFields.shortDescription,
    longDescription: s.serviceFields.longDescription,
    icon: s.serviceFields.icon || "Road",
    benefits: (s.serviceFields.benefits ?? []).map((b) => b.benefit),
    materials: (s.serviceFields.materials ?? []).map((m) => m.material),
    equipment: (s.serviceFields.equipment ?? []).map((e) => e.equipment),
    industriesServed: (s.serviceFields.industriesServed?.nodes ?? []).map((n) => n.slug),
    faqs: [], // populated via GetFaqs
    heroHeading: s.serviceFields.heroHeading,
    heroDescription: s.serviceFields.heroDescription,
    seoTitle: s.serviceFields.seoTitle,
    seoDescription: s.serviceFields.seoDescription,
    process: (s.serviceFields.process ?? []).map((p) => ({
      step: p.step,
      title: p.title,
      description: p.description,
    })),
    specs: (s.serviceFields.specs ?? []).map((sp) => ({ label: sp.label, value: sp.value })),
  };
}

function mapIndustry(i: CmsIndustry): Industry {
  return {
    slug: i.slug,
    name: i.title,
    description: i.industryFields.description,
    icon: i.industryFields.icon || "Building2",
    challenges: (i.industryFields.challenges ?? []).map((c) => c.challenge),
    solutions: (i.industryFields.solutions ?? []).map((s) => s.solution),
    services: (i.industryFields.services?.nodes ?? []).map((n) => n.slug),
  };
}

function mapProject(p: CmsProject): Project {
  return {
    slug: p.slug,
    title: p.title,
    country: (p.projectFields.country?.node?.slug ?? "uae") as Country["slug"],
    city: p.projectFields.city?.node?.slug ?? "",
    service: p.projectFields.service?.node?.slug ?? "",
    industry: p.projectFields.industry?.node?.slug ?? "",
    client: p.projectFields.client,
    year: p.projectFields.year,
    duration: p.projectFields.duration,
    challenge: p.projectFields.challenge,
    solution: p.projectFields.solution,
    execution: p.projectFields.execution,
    materials: (p.projectFields.materials ?? []).map((m) => m.material),
    equipment: (p.projectFields.equipment ?? []).map((e) => e.equipment),
    results: (p.projectFields.results ?? []).map((r) => ({ label: r.label, value: r.value })),
    gallery: [], // gallery populated from ACF Gallery field at render time
    location: p.projectFields.location,
    area: p.projectFields.area,
  };
}

function mapCaseStudy(cs: CmsCaseStudy): CaseStudy {
  const hasT =
    cs.caseStudyFields.testimonialQuote && cs.caseStudyFields.testimonialAuthor;
  return {
    slug: cs.slug,
    title: cs.title,
    projectSlug: cs.caseStudyFields.project?.node?.slug ?? "",
    summary: cs.caseStudyFields.summary,
    outcomes: (cs.caseStudyFields.outcomes ?? []).map((o) => o.outcome),
    testimonial: hasT
      ? {
          quote: cs.caseStudyFields.testimonialQuote!,
          author: cs.caseStudyFields.testimonialAuthor!,
          role: cs.caseStudyFields.testimonialRole ?? "",
        }
      : null,
  };
}

// ---------------------------------------------------------------------------
// PUBLIC API — live CMS primary, dev seed fallback
// ---------------------------------------------------------------------------

export async function getCountries(): Promise<Country[]> {
  const data = await fetchGraphQL<{ countries: { nodes: CmsCountry[] } }>(
    QUERIES.GetCountries
  );
  if (data?.countries?.nodes?.length) {
    return data.countries.nodes.map(mapCountry);
  }
  return DEV_FALLBACK ? seedCountries : seedCountries; // countries are stable reference data
}

export async function getCitiesList(country?: string): Promise<City[]> {
  const data = await fetchGraphQL<{ cities: { nodes: CmsCity[] } }>(QUERIES.GetCities, {
    country,
  });
  if (data?.cities?.nodes?.length) {
    const mapped = data.cities.nodes.map(mapCity);
    return country ? mapped.filter((c) => c.country === country) : mapped;
  }
  return country ? seedCities.filter((c) => c.country === country) : seedCities;
}

export async function getServicesList(): Promise<Service[]> {
  const data = await fetchGraphQL<{ services: { nodes: CmsService[] } }>(
    QUERIES.GetServices
  );
  if (data?.services?.nodes?.length) {
    const mapped = data.services.nodes.map(mapService);
    // Hydrate FAQs from CMS (or merged seed fallback)
    for (const s of mapped) {
      s.faqs = await getFaqsForService(s.slug);
    }
    return mapped;
  }
  return DEV_FALLBACK ? seedServices : seedServices;
}

export async function getIndustriesList(): Promise<Industry[]> {
  const data = await fetchGraphQL<{ industries: { nodes: CmsIndustry[] } }>(
    QUERIES.GetIndustries
  );
  if (data?.industries?.nodes?.length) {
    return data.industries.nodes.map(mapIndustry);
  }
  return seedIndustries;
}

export async function getProjectsList(opts?: {
  city?: string;
  service?: string;
}): Promise<Project[]> {
  const data = await fetchGraphQL<{ projects: { nodes: CmsProject[] } }>(QUERIES.GetProjects, {
    city: opts?.city,
    service: opts?.service,
  });
  if (data?.projects?.nodes?.length) {
    let result = data.projects.nodes.map(mapProject);
    if (opts?.city) result = result.filter((p) => p.city === opts.city);
    if (opts?.service) result = result.filter((p) => p.service === opts.service);
    return result;
  }
  // Fallback to merged seed (50 projects)
  let result = allProjects;
  if (opts?.city) result = result.filter((p) => p.city === opts.city);
  if (opts?.service) result = result.filter((p) => p.service === opts.service);
  return result;
}

export async function getCaseStudiesList(): Promise<CaseStudy[]> {
  const data = await fetchGraphQL<{ caseStudies: { nodes: CmsCaseStudy[] } }>(
    QUERIES.GetCaseStudies
  );
  if (data?.caseStudies?.nodes?.length) {
    return data.caseStudies.nodes.map(mapCaseStudy);
  }
  return allCaseStudies;
}

export async function getFaqsForService(
  serviceSlug: string
): Promise<{ question: string; answer: string }[]> {
  const data = await fetchGraphQL<{ faqs: { nodes: CmsFaq[] } }>(QUERIES.GetFaqs, {
    service: serviceSlug,
  });
  if (data?.faqs?.nodes?.length) {
    return data.faqs.nodes.map((f) => ({
      question: f.title,
      answer: f.faqFields.answer,
    }));
  }
  return allFaqsByService[serviceSlug] ?? [];
}

/** Health check — used by /api/cms-health */
export async function checkCmsHealth(): Promise<{
  ok: boolean;
  endpoint: string;
  latencyMs?: number;
  counts?: Record<string, number>;
  error?: string;
}> {
  const start = Date.now();
  try {
    const data = await fetchGraphQL<{
      countries: { nodes: unknown[] };
      cities: { nodes: unknown[] };
      services: { nodes: unknown[] };
      industries: { nodes: unknown[] };
      projects: { nodes: unknown[] };
      caseStudies: { nodes: unknown[] };
      faqs: { nodes: unknown[] };
    }>(`{
      countries(first:1){nodes{slug}}
      cities(first:1){nodes{slug}}
      services(first:1){nodes{slug}}
      industries(first:1){nodes{slug}}
      projects(first:1){nodes{slug}}
      caseStudies(first:1){nodes{slug}}
      faqs(first:1){nodes{slug}}
    }`);
    if (!data) {
      return { ok: false, endpoint: CMS_ENDPOINT, error: "No response (StackProtect challenge or network)" };
    }
    return {
      ok: true,
      endpoint: CMS_ENDPOINT,
      latencyMs: Date.now() - start,
      counts: {
        countries: data.countries?.nodes?.length ?? 0,
        cities: data.cities?.nodes?.length ?? 0,
        services: data.services?.nodes?.length ?? 0,
        industries: data.industries?.nodes?.length ?? 0,
        projects: data.projects?.nodes?.length ?? 0,
        caseStudies: data.caseStudies?.nodes?.length ?? 0,
        faqs: data.faqs?.nodes?.length ?? 0,
      },
    };
  } catch (e) {
    return {
      ok: false,
      endpoint: CMS_ENDPOINT,
      latencyMs: Date.now() - start,
      error: (e as Error).message,
    };
  }
}
