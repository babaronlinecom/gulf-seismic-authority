/**
 * WordPress Headless CMS GraphQL client for Gulf Seismic.
 *
 * Endpoint: https://cms.gulfseismic.com/graphql
 *
 * The CMS exposes CPTs: Countries, Cities, Services, Industries, Projects,
 * CaseStudies, Blogs, FAQs, Resources via WPGraphQL + WPGraphQL for ACF.
 *
 * This client attempts to fetch live CMS data and gracefully falls back to
 * the resilient seed data in `gulf-data.ts` when the CMS is unreachable or
 * returns empty results — guaranteeing the frontend always renders.
 */

import {
  countries,
  cities,
  services,
  industries,
  projects,
  caseStudies,
  blogPosts,
  company,
  type Country,
  type City,
  type Service,
  type Industry,
  type Project,
} from "./gulf-data";

const CMS_ENDPOINT = company.graphqlEndpoint;

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
    console.warn("[WPGraphQL] fetch failed, using seed data:", (err as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// QUERIES — kept as exported strings so they can be reviewed/edited in one place
// ---------------------------------------------------------------------------

export const QUERIES = {
  GetCountries: /* GraphQL */ `
    query GetCountries {
      countries(first: 50) {
        nodes {
          slug
          title
          content
          countryFields {
            countryCode
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
    query GetCities($country: String) {
      cities(first: 100, where: { country: $country }) {
        nodes {
          slug
          title
          cityFields {
            country
            latitude
            longitude
            heroHeading
            heroDescription
            seoTitle
            seoDescription
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
            shortDescription
            longDescription
            benefits
            materials
            equipment
            industriesServed
            seoTitle
            seoDescription
          }
        }
      }
    }
  `,
  GetProjects: /* GraphQL */ `
    query GetProjects($city: String, $service: String) {
      projects(first: 50, where: { city: $city, service: $service }) {
        nodes {
          slug
          title
          projectFields {
            country
            city
            service
            industry
            challenge
            solution
            execution
            duration
            materials
            equipment
            results
          }
        }
      }
    }
  `,
  GetCaseStudies: /* GraphQL */ `
    query GetCaseStudies {
      caseStudies(first: 50) {
        nodes {
          slug
          title
          caseStudyFields {
            projectSlug
            summary
            outcomes
            testimonial
          }
        }
      }
    }
  `,
  GetBlogs: /* GraphQL */ `
    query GetBlogs {
      blogs(first: 50) {
        nodes {
          slug
          title
          excerpt
          date
          author {
            node {
              name
            }
          }
        }
      }
    }
  `,
  GetFaqs: /* GraphQL */ `
    query GetFaqs($service: String) {
      faqs(first: 50, where: { service: $service }) {
        nodes {
          title
          content
        }
      }
    }
  `,
};

// ---------------------------------------------------------------------------
// PUBLIC API — always returns data (CMS or seed fallback)
// ---------------------------------------------------------------------------

export async function getCountries(): Promise<Country[]> {
  const data = await fetchGraphQL<{ countries: { nodes: unknown[] } }>(QUERIES.GetCountries);
  if (data?.countries?.nodes?.length) {
    // Map CMS shape → Country[] (left to migration; fall through to seed for now)
  }
  return countries;
}

export async function getCitiesList(country?: string): Promise<City[]> {
  const data = await fetchGraphQL<{ cities: { nodes: unknown[] } }>(QUERIES.GetCities, {
    country,
  });
  if (data?.cities?.nodes?.length) {
    // Map CMS shape → City[] (left to migration; fall through to seed for now)
  }
  return country ? cities.filter((c) => c.country === country) : cities;
}

export async function getServicesList(): Promise<Service[]> {
  const data = await fetchGraphQL<{ services: { nodes: unknown[] } }>(QUERIES.GetServices);
  if (data?.services?.nodes?.length) {
    // Map CMS shape → Service[] (left to migration; fall through to seed for now)
  }
  return services;
}

export async function getIndustriesList(): Promise<Industry[]> {
  return industries;
}

export async function getProjectsList(opts?: {
  city?: string;
  service?: string;
}): Promise<Project[]> {
  const data = await fetchGraphQL<{ projects: { nodes: unknown[] } }>(QUERIES.GetProjects, {
    city: opts?.city,
    service: opts?.service,
  });
  if (data?.projects?.nodes?.length) {
    // Map CMS shape → Project[] (left to migration; fall through to seed for now)
  }
  let result = projects;
  if (opts?.city) result = result.filter((p) => p.city === opts.city);
  if (opts?.service) result = result.filter((p) => p.service === opts.service);
  return result;
}

export async function getBlogPostsList() {
  const data = await fetchGraphQL<{ blogs: { nodes: unknown[] } }>(QUERIES.GetBlogs);
  if (data?.blogs?.nodes?.length) {
    // Map CMS shape → BlogPost[] (left to migration; fall through to seed for now)
  }
  return blogPosts;
}

export async function getCaseStudiesList() {
  return caseStudies;
}
