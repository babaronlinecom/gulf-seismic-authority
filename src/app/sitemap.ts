import type { MetadataRoute } from "next";
import {
  company,
  countries,
  cities,
  services,
  industries,
  blogPosts,
  getServiceCityPages,
} from "@/lib/gulf-data";
import { allProjects, allCaseStudies } from "@/lib/gulf-content-merged";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Country hubs
  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // City pages
  const cityPages: MetadataRoute.Sitemap = cities.map((ct) => ({
    url: `${base}/${ct.country}/${ct.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 128 programmatic service-city pages
  const serviceCityPages: MetadataRoute.Sitemap = getServiceCityPages().map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Service pages
  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Industry pages
  const industryPages: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${base}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = allProjects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Case study pages
  const caseStudyPages: MetadataRoute.Sitemap = allCaseStudies.map((cs) => ({
    url: `${base}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...countryPages,
    ...cityPages,
    ...servicePages,
    ...serviceCityPages,
    ...industryPages,
    ...projectPages,
    ...caseStudyPages,
  ];
}
