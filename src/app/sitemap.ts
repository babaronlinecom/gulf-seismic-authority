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

// ISR: revalidate sitemap every 5 minutes to pick up new CMS pages
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Blog listing + seed posts
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Dynamic CMS pages from DB (admin-managed pages at /p/[slug])
  let cmsPages: MetadataRoute.Sitemap = [];
  let dbBlogPosts: MetadataRoute.Sitemap = [];
  try {
    const { db } = await import("@/lib/db");
    const [pages, posts] = await Promise.all([
      db.page.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } }),
      db.post.findMany({ where: { status: "published" }, select: { slug: true, publishedAt: true } }),
    ]);
    cmsPages = pages.map((p) => ({
      url: `${base}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
    dbBlogPosts = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unreachable — use seed data only
  }

  return [
    ...staticPages,
    ...countryPages,
    ...cityPages,
    ...servicePages,
    ...serviceCityPages,
    ...industryPages,
    ...projectPages,
    ...caseStudyPages,
    ...blogPages,
    ...cmsPages,
    ...dbBlogPosts,
  ];
}
