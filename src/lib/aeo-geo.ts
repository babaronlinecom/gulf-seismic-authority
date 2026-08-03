/**
 * AEO / GEO / LLMO — Answer Engine Optimization, Generative Engine
 * Optimization, and Large Language Model Optimization.
 *
 * These schemas make Gulf Seismic's content maximally citable by AI search
 * engines (Google AI Overviews, Perplexity, ChatGPT Search, Bing Copilot):
 *
 *   1. KnowledgeGraph — declares Gulf Seismic as a known entity with
 *      @id, sameAs, and areaServed so LLMs disambiguate and cite.
 *   2. DefinedTerm + DefinedTermSet — every service term is a defined
 *      entity (thermoplastic road marking, MMA, etc.) so LLMs treat them
 *      as authoritative definitions.
 *   3. HowTo — every service process is a step-by-step HowTo that AI
 *      overviews can surface as a procedure.
 *   4. Mention List — services mention standards (ICAO Annex 14, ISO 7010,
 *      ASME A13.1, RTA/MOMRA spec) so LLMs can verify and cite.
 *   5. Citation architecture — every FAQ answer is a self-contained
 *      factual statement with a sourceable URL.
 */

import { company } from "./gulf-data";
import type { Service, City, Country, Project } from "./gulf-data";
import { services } from "./gulf-data";

const SITE = company.url;

/**
 * Organization Knowledge Graph entry — declares the entity and its
 * disambiguation signals. This is the "entity card" LLMs use to
 * identify Gulf Seismic.
 */
export function knowledgeGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE}/#organization`,
    name: company.name,
    legalName: company.legalName,
    alternateName: ["Gulf Seismic Contracting", "Gulf Seismic Marking"],
    description: company.description,
    url: SITE,
    logo: `${SITE}/logo.svg`,
    slogan: company.tagline,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    knowsAbout: [
      "Thermoplastic road marking",
      "MMA cold plastic marking",
      "Parking lot line marking",
      "Warehouse floor marking",
      "Airport runway marking",
      "ICAO Annex 14",
      "Epoxy flooring",
      "Safety signage",
      "ISO 7010",
      "ASME A13.1 pipe identification",
    ],
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: company.headquarters.city,
      addressCountry: "AE",
    },
    sameAs: [company.social.linkedin, company.social.instagram],
    parentOrganization: undefined,
  };
}

/**
 * DefinedTermSet — the Gulf Seismic glossary of marking terms.
 * LLMs treat DefinedTerm entries as authoritative definitions and
 * cite the source URL.
 */
export function glossarySchema() {
  const terms = services.map((s) => ({
    "@type": "DefinedTerm",
    name: s.name,
    description: s.shortDescription,
    url: `${SITE}/services/${s.slug}`,
    inDefinedTermSet: `${SITE}/glossary#marking-terms`,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Gulf Seismic Marking Glossary",
    description:
      "Authoritative definitions of road and industrial marking terms used across the UAE and Saudi Arabia.",
    url: `${SITE}/glossary`,
    hasDefinedTerm: terms,
  };
}

/**
 * HowTo schema for a service process — surfaces in AI overviews as a
 * step-by-step procedure.
 */
export function howToSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to deliver ${service.name.toLowerCase()}`,
    description: service.shortDescription,
    totalTime: "P1D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "AED" },
    supply: service.materials.map((m) => ({ "@type": "HowToSupply", name: m })),
    tool: service.equipment.map((e) => ({ "@type": "HowToTool", name: e })),
    step: service.process.map((p) => ({
      "@type": "HowToStep",
      position: p.step,
      name: p.title,
      text: p.description,
    })),
  };
}

/**
 * Local citation architecture — declares Gulf Seismic's presence in each
 * city as a distinct LocalBusiness node with geo coordinates, so LLMs
 * can answer "road marking company near me in Dubai" with Gulf Seismic.
 */
export function localCitationSchema(country: Country, city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/${country.slug}/${city.slug}#localbusiness`,
    name: `${company.name} — ${city.name}`,
    parentOrganization: { "@id": `${SITE}/#organization` },
    description: city.heroDescription,
    url: `${SITE}/${country.slug}/${city.slug}`,
    telephone: country.phone,
    email: company.email,
    image: `${SITE}/logo.svg`,
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
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "08:00",
      closes: "18:00",
    },
  };
}

/**
 * CollectionPage schema for the projects index — signals to LLMs that
 * Gulf Seismic has a verified project portfolio (authority signal).
 */
export function projectCollectionSchema(projectCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gulf Seismic Marking Projects",
    description: `${projectCount} delivered road and industrial marking projects across UAE and Saudi Arabia.`,
    url: `${SITE}/projects`,
    isPartOf: { "@id": `${SITE}/#website` },
    hasPart: {
      "@type": "ItemList",
      numberOfItems: projectCount,
      itemListElement: [],
    },
  };
}

/**
 * Speakable schema — marks the headline + summary as the preferred
 * snippet for voice assistants (Alexa, Google Assistant).
 */
export function speakableSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE}${path}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-summary"],
    },
  };
}

/**
 * Full AEO/GEO schema bundle for a city-service page — the heaviest
 * schema payload, designed to make the page maximally citable.
 */
export function aeoBundle(args: {
  country: Country;
  city: City;
  service: Service;
  faqs: { question: string; answer: string }[];
  path: string;
}) {
  return [
    knowledgeGraphSchema(),
    localCitationSchema(args.country, args.city),
    howToSchema(args.service),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: args.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    speakableSchema(args.path),
  ];
}
