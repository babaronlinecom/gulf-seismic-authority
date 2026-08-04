/**
 * Programmatic SEO content generator.
 *
 * Produces UNIQUE, locally-relevant content for each of the 128
 * service × city combinations — so no two pages are duplicate content.
 *
 * Uniqueness levers:
 *  1. City-specific climate, traffic and regulatory context
 *  2. City-specific project references
 *  3. Local authority compliance references (RTA/DoT/MOMRA/GACA/MODON)
 *  4. City population and infrastructure stats
 *  5. Unique FAQ variants per city
 */

import {
  type City,
  type Service,
  type Country,
  cities,
  getProjectsByCity,
} from "./gulf-data";

const CITY_CONTEXT: Record<string, { climate: string; traffic: string; authority: string }> = {
  "abu-dhabi": {
    climate: "coastal desert heat exceeding 48°C in summer",
    traffic: "high-volume capital traffic and pilgrimage-season surges",
    authority: "Department of Transport (DoT) and municipal spec",
  },
  dubai: {
    climate: "intense UV and humidity with 45°C+ summers",
    traffic: "world-class highway network with Expo-legacy traffic loads",
    authority: "RTA road marking specifications",
  },
  sharjah: {
    climate: "industrial-zone heat and dust exposure",
    traffic: "heavy commercial and inter-emirate freight traffic",
    authority: "Sharjah Municipality spec",
  },
  ajman: {
    climate: "coastal humidity and heat",
    traffic: "growing commercial and residential traffic",
    authority: "Ajman Municipality spec",
  },
  "ras-al-khaimah": {
    climate: "mountain and quarry dust with high heat",
    traffic: "industrial freight and tourism traffic",
    authority: "RAK Municipality spec",
  },
  fujairah: {
    climate: "east-coast humidity and salt exposure",
    traffic: "port and oil-terminal heavy-vehicle traffic",
    authority: "Fujairah Municipality spec",
  },
  "al-ain": {
    climate: "inland desert heat and low humidity",
    traffic: "institutional and residential traffic",
    authority: "Abu Dhabi DoT and Al Ain Municipality spec",
  },
  "umm-al-quwain": {
    climate: "coastal heat and humidity",
    traffic: "residential and tourism traffic",
    authority: "UAQ Municipality spec",
  },
  riyadh: {
    climate: "extreme dry desert heat exceeding 50°C",
    traffic: "capital megaproject and Vision 2030 traffic",
    authority: "Riyadh Municipality and MOMRA spec",
  },
  jeddah: {
    climate: "Red Sea humidity with high UV",
    traffic: "port, pilgrim and corniche traffic",
    authority: "Jeddah Municipality and MOMRA spec",
  },
  dammam: {
    climate: "Gulf-coast heat and industrial exposure",
    traffic: "oil-and-gas and port heavy-vehicle traffic",
    authority: "Eastern Province Municipality and MODON spec",
  },
  khobar: {
    climate: "coastal humidity and heat",
    traffic: "commercial boulevard and corniche traffic",
    authority: "Eastern Province Municipality spec",
  },
  jubail: {
    climate: "industrial-city chemical and heat exposure",
    traffic: "petrochemical heavy-vehicle traffic",
    authority: "Royal Commission for Jubail and MODON spec",
  },
  yanbu: {
    climate: "Red Sea industrial heat and salt",
    traffic: "refinery and port traffic",
    authority: "Royal Commission for Yanbu spec",
  },
  makkah: {
    climate: "mountain desert heat",
    traffic: "seasonal pilgrimage traffic surges",
    authority: "Makkah Municipality and MOMRA spec",
  },
  madinah: {
    climate: "inland desert heat",
    traffic: "pilgrim corridor and central-area traffic",
    authority: "Madinah Municipality and MOMRA spec",
  },
};

export function generateCityServiceHeading(city: City, service: Service): string {
  return `${service.name} in ${city.name}`;
}

export function generateCityServiceIntro(
  city: City,
  service: Service,
  country: Country
): string {
  const ctx = CITY_CONTEXT[city.slug] ?? CITY_CONTEXT["dubai"];
  return `Gulf Seismic is the trusted ${service.name.toLowerCase()} contractor in ${city.name}, ${
    country.name
  }. Our ${service.name.toLowerCase()} systems are engineered for ${ctx.climate} and ${ctx.traffic}, fully compliant with ${ctx.authority}. We deliver ${service.tagline.toLowerCase()}`;
}

export function generateCityServiceBody(
  city: City,
  service: Service,
  country: Country
): string {
  const ctx = CITY_CONTEXT[city.slug] ?? CITY_CONTEXT["dubai"];
  const cityProjects = getProjectsByCity(city.slug);

  return `${service.longDescription}

Operating in ${city.name}, our crews understand the local conditions — ${ctx.climate} and ${ctx.traffic} — and apply ${ctx.authority} on every line we mark. ${city.population} residents and the city's infrastructure depend on markings that perform year after year.${
    cityProjects.length > 0
      ? ` Our delivered projects in ${city.name} include ${cityProjects
          .slice(0, 2)
          .map((p) => p.title)
          .join(" and ")}.`
      : ""
  }

Every ${service.name.toLowerCase()} project in ${city.name} is delivered with the same Gulf Seismic standard: ${service.benefits
    .slice(0, 3)
    .join(", ")}, and a commitment to minimal disruption to your operations.`;
}

export function generateCityServiceFaqs(
  city: City,
  service: Service,
  country: Country
): { question: string; answer: string }[] {
  const ctx = CITY_CONTEXT[city.slug] ?? CITY_CONTEXT["dubai"];
  const base = service.faqs.map((f) => ({ ...f }));

  // Inject city-specific FAQ for uniqueness
  base.push({
    question: `Why choose Gulf Seismic for ${service.name.toLowerCase()} in ${city.name}?`,
    answer: `We are a ${country.shortName}-based marking specialist with 10+ years delivering ${service.name.toLowerCase()} projects in ${city.name}. Our crews are trained for ${ctx.climate} and apply ${ctx.authority} on every job, with the equipment and materials to deliver durable results that survive ${ctx.traffic}.`,
  });

  base.push({
    question: `How quickly can you mobilise a ${service.name.toLowerCase()} crew in ${city.name}?`,
    answer: `For projects in ${city.name}, we typically mobilise within 24–72 hours of quote approval, depending on scope and ${country.shortName} permit requirements. Emergency and night-shift mobilisation is available for time-critical work.`,
  });

  return base;
}

export function generateCityServiceMeta(city: City, service: Service): {
  title: string;
  description: string;
} {
  return {
    title: `${service.name} ${city.name} | ${service.tagline}`,
    description: `${service.name} contractors in ${city.name}. ${service.shortDescription} Compliant with local specifications. Get a free quote today.`,
  };
}
