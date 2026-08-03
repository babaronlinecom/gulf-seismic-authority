/**
 * SEO + Schema (JSON-LD) helpers for the Gulf Seismic authority graph.
 * Generates structured data for Organization, Service, LocalBusiness,
 * BreadcrumbList, FAQPage, Article and Project entities.
 */

import type { Metadata } from "next";
import {
  company,
  countries,
  services,
  cities,
  type Country,
  type City,
  type Service,
  type Project,
} from "./gulf-data";

const SITE = company.url;

export function absoluteUrl(path = "/"): string {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

// ---------------------------------------------------------------------------
// JSON-LD BUILDERS
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: company.name,
    legalName: company.legalName,
    url: SITE,
    logo: `${SITE}/logo.svg`,
    description: company.description,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.headquarters.city,
      addressCountry: "AE",
    },
    areaServed: countries.map((c) => c.name),
    sameAs: [company.social.linkedin, company.social.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: company.name,
    publisher: { "@id": `${SITE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function serviceSchema(service: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    url: absoluteUrl(path),
    provider: { "@id": `${SITE}/#organization` },
    areaServed: countries.map((c) => ({ "@type": "Country", name: c.name })),
    serviceType: service.name,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "AED",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "AED",
      },
    },
  };
}

export function localBusinessSchema(country: Country, city: City, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${company.name} — ${city.name}`,
    description: city.heroDescription,
    url: absoluteUrl(path),
    image: `${SITE}/logo.svg`,
    telephone: country.phone,
    email: company.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: country.code,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude,
      longitude: city.longitude,
    },
    areaServed: { "@type": "City", name: city.name },
    parentOrganization: { "@id": `${SITE}/#organization` },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function projectSchema(project: Project, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.challenge,
    url: absoluteUrl(path),
    creator: { "@id": `${SITE}/#organization` },
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: project.location,
      geo: {
        "@type": "GeoCoordinates",
      },
    },
    about: {
      "@type": "Service",
      name: services.find((s) => s.slug === project.service)?.name ?? project.service,
    },
  };
}

export function articleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

/**
 * Combine multiple JSON-LD objects into a single script tag payload.
 */
export function jsonLd(...objects: object[]) {
  return objects;
}

// ---------------------------------------------------------------------------
// METADATA HELPERS
// ---------------------------------------------------------------------------

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path ?? "/");
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: company.name,
      type: "website",
      images: opts.image ? [{ url: opts.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

export function buildBreadcrumbs(items: { name: string; url: string }[]) {
  return items;
}
