import type { Content } from "@/lib/content";

const BASE = "https://gulfseismic.com";

/** Organization + WebSite schema, sitewide. */
export function orgSchema(t: Content) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Gulf Seismic General Contracting LLC",
    alternateName: t.brand.name,
    url: BASE,
    logo: `${BASE}/images/logo-mark.png`,
    email: t.contact.email,
    telephone: t.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
      addressRegion: "Abu Dhabi",
      addressLocality: "Abu Dhabi",
    },
    areaServed: ["SA", "AE", "QA", "OM", "KW", "BH"],
    knowsAbout: [
      "Road marking",
      "Thermoplastic road marking",
      "Airport runway marking",
      "Parking marking",
      "Road studs",
      "Industrial safety marking",
      "Line removal",
    ],
  };
}

export function websiteSchema(t: Content) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: `${t.brand.name} — ${t.brand.tagline}`,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${BASE}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE}${it.path}`,
    })),
  };
}

export function serviceSchema(service: {
  title: string;
  h1: string;
  intro: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.intro,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: ["SA", "AE", "QA", "OM", "KW", "BH"],
    image: `${BASE}${service.image}`,
    serviceType: service.title,
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${BASE}/#contact`,
    name: "Contact & RFQ",
  };
}
