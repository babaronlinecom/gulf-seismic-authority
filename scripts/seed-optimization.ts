/**
 * Seed default optimization data: SEO profiles for key pages, entity definitions, FAQ clusters, CTAs.
 */
import { db } from "../src/lib/db";
import { KEY_PAGES } from "../src/lib/optimization";
import { services, company } from "../src/lib/gulf-data";

async function main() {
  console.log("→ Seeding optimization data...\n");

  // --- 1. SEO Profiles for key pages ---
  console.log("→ SEO Profiles...");
  const seoData = [
    { pageUrl: "/", metaTitle: "Gulf Seismic | Road & Industrial Marking Authority — UAE & Saudi Arabia", metaDescription: "Leading road marking company in UAE & Saudi Arabia. Thermoplastic road marking, parking, warehouse, airport marking and epoxy flooring across 16 cities.", focusKeyword: "road marking UAE", secondaryKeywords: ["thermoplastic road marking", "parking lot marking", "warehouse marking", "Saudi Arabia road marking"] },
    { pageUrl: "/uae", metaTitle: "Road Marking UAE | Thermoplastic & Industrial Marking Contractors", metaDescription: "Leading road marking company in UAE. Thermoplastic road marking, parking lot marking, warehouse marking and epoxy flooring across Abu Dhabi, Dubai, Sharjah and all Emirates.", focusKeyword: "road marking UAE" },
    { pageUrl: "/saudi-arabia", metaTitle: "Road Marking Saudi Arabia | Thermoplastic Marking Riyadh Jeddah", metaDescription: "Saudi Arabia road marking contractor. Thermoplastic road marking, warehouse marking, airport marking and epoxy flooring in Riyadh, Jeddah, Dammam, Khobar, Jubail, Yanbu, Makkah and Madinah.", focusKeyword: "road marking Saudi Arabia" },
    { pageUrl: "/services/road-marking", metaTitle: "Road Marking Contractors | Thermoplastic Line Marking UAE & Saudi", metaDescription: "Professional road marking contractors. Hot-applied thermoplastic line marking for highways and urban roads across UAE and Saudi Arabia. RTA & MOMRA compliant.", focusKeyword: "road marking contractors" },
    { pageUrl: "/services/thermoplastic-road-marking", metaTitle: "Thermoplastic Road Marking | Hot-Applied Line Marking UAE Saudi", metaDescription: "Thermoplastic road marking contractors in UAE & Saudi Arabia. Hot-applied durable line marking with glass bead reflectivity for highways and roads.", focusKeyword: "thermoplastic road marking" },
    { pageUrl: "/services/parking-lot-marking", metaTitle: "Parking Lot Marking | Parking Bay Line Marking UAE Saudi Arabia", metaDescription: "Parking lot marking contractors. Parking bay line marking, accessibility stencils and directional arrows for malls, offices and residential towers.", focusKeyword: "parking lot marking" },
    { pageUrl: "/services/warehouse-marking", metaTitle: "Warehouse Floor Marking | Industrial Line Marking UAE Saudi", metaDescription: "Warehouse marking contractors. Forklift-grade epoxy and polyurea floor marking for pedestrian lanes, hazard zones and 5S organisation in UAE & Saudi Arabia.", focusKeyword: "warehouse marking" },
    { pageUrl: "/projects", metaTitle: "Marking Projects Portfolio | Road, Parking, Warehouse, Airport Case Studies", metaDescription: "Browse Gulf Seismic's delivered marking projects across UAE and Saudi Arabia — highways, malls, warehouses, plants and airports with real results.", focusKeyword: "marking projects" },
    { pageUrl: "/about", metaTitle: "About Gulf Seismic | Road & Industrial Marking Authority", metaDescription: "Gulf Seismic — 10+ years delivering marking projects across the Gulf. ISO 9001 certified, ICAO Annex 14 compliant. 850+ projects across 16 cities.", focusKeyword: "about gulf seismic" },
    { pageUrl: "/contact", metaTitle: "Contact Gulf Seismic | Get a Free Marking Quote", metaDescription: "Contact Gulf Seismic for road marking, parking marking, warehouse marking and epoxy flooring quotes in UAE & Saudi Arabia. Response within 1 business hour.", focusKeyword: "contact gulf seismic" },
  ];

  for (const seo of seoData) {
    await db.seoProfile.upsert({
      where: { pageUrl: seo.pageUrl },
      update: {},
      create: {
        ...seo,
        secondaryKeywords: seo.secondaryKeywords ? JSON.stringify(seo.secondaryKeywords) : null,
        ogTitle: seo.metaTitle, ogDescription: seo.metaDescription,
        canonicalUrl: `https://gulfseismic.com${seo.pageUrl}`,
      },
    });
  }
  console.log(`  ✓ ${seoData.length} SEO profiles\n`);

  // --- 2. Entity Definitions (AIO + GEO) ---
  console.log("→ Entity Definitions...");
  const entities = [
    { name: "Gulf Seismic", description: "Gulf Seismic is a road and industrial marking contractor headquartered in Dubai, serving the UAE and Saudi Arabia with thermoplastic road marking, parking lot marking, warehouse marking, airport marking, industrial marking, safety signage and epoxy flooring.", entityType: "Organization", sameAs: [company.social.linkedin, company.social.instagram], properties: { foundingDate: "2015", areaServed: "UAE, Saudi Arabia", numberOfEmployees: "50+", telephone: company.phone } },
    { name: "Thermoplastic Road Marking", description: "Thermoplastic road marking is a hot-applied line marking system heated to 180-200°C and fused to the road surface, providing 5-7 year durability with glass bead retroreflectivity for night visibility.", entityType: "Service", sameAs: ["https://en.wikipedia.org/wiki/Thermoplastic_pavement_marking"], properties: { applicationTemp: "180-200°C", serviceLife: "5-7 years", cureTime: "2-5 minutes", standard: "RTA, MOMRA" } },
    { name: "MMA Cold Plastic", description: "MMA (Methyl Methacrylate) cold plastic is a two-component road marking system that cures in 30-45 minutes, used for airport markings compliant with ICAO Annex 14.", entityType: "Service", sameAs: [], properties: { cureTime: "30-45 min", standard: "ICAO Annex 14", type: "Type III" } },
    { name: "ICAO Annex 14", description: "ICAO Annex 14 is the international standard for aerodrome design and operations, including specifications for runway, taxiway and apron markings.", entityType: "Thing", sameAs: ["https://en.wikipedia.org/wiki/Annex_14"], properties: { issuer: "International Civil Aviation Organization", scope: "Aerodromes" } },
    { name: "ISO 7010", description: "ISO 7010 is the international standard for safety signs and signals, specifying pictograms, colours and shapes for hazard, mandatory, prohibition and emergency signs.", entityType: "Thing", sameAs: ["https://en.wikipedia.org/wiki/ISO_7010"], properties: { issuer: "ISO", scope: "Safety signs" } },
    { name: "Epoxy Flooring", description: "Epoxy flooring is a seamless floor coating system using two-component epoxy resin, providing 10-15 year service life in industrial and commercial environments.", entityType: "Service", sameAs: [], properties: { thickness: "1.5-4.0 mm", serviceLife: "10-15 years", cureTime: "12-24 hours" } },
  ];
  for (const e of entities) {
    await db.entityDefinition.upsert({
      where: { name: e.name },
      update: {},
      create: {
        ...e,
        sameAs: JSON.stringify(e.sameAs),
        properties: JSON.stringify(e.properties),
      },
    });
  }
  console.log(`  ✓ ${entities.length} entity definitions\n`);

  // --- 3. FAQ Clusters (AEO) ---
  console.log("→ FAQ Clusters...");
  const faqs = [
    { question: "How much does thermoplastic road marking cost in Dubai?", answer: "Thermoplastic road marking in Dubai typically costs AED 15-35 per linear meter depending on line width, surface condition and traffic volume. Prices include materials (thermoplastic + glass beads), application and RTA compliance. Contact Gulf Seismic for a site-specific quote.", category: "cost", pageUrl: "/uae/dubai" },
    { question: "How long does thermoplastic road marking last in the UAE climate?", answer: "Properly applied thermoplastic road marking lasts 5-7 years under normal traffic in the Gulf climate. High-stress intersections may require touch-ups every 2-3 years. The extreme UV and heat in UAE and Saudi Arabia are accounted for in our UV-stabilised thermoplastic formulation.", category: "general", pageUrl: "/services/thermoplastic-road-marking" },
    { question: "Thermoplastic vs cold paint road marking — which is better?", answer: "Thermoplastic lasts 5-10x longer than cold paint (5-7 years vs 6-12 months), fuses to the asphalt instead of sitting on top, and has built-in glass bead reflectivity. Cold paint is cheaper upfront but requires frequent reapplication. For Gulf climate roads, thermoplastic is the standard.", category: "comparison", pageUrl: "/services/thermoplastic-road-marking" },
    { question: "How soon can traffic resume after thermoplastic marking?", answer: "Hot thermoplastic cures in 2-5 minutes depending on ambient temperature. Roads can typically reopen to traffic within 10 minutes of application, making it ideal for night-shift road work with minimal closure.", category: "process", pageUrl: "/services/thermoplastic-road-marking" },
    { question: "Is thermoplastic road marking compliant with RTA and MOMRA specifications?", answer: "Yes. All line widths, colours, reflectivity and material composition meet local RTA (UAE) and MOMRA (Saudi Arabia) road marking specifications. Gulf Seismic applies thermoplastic to municipal-spec standards on every project.", category: "compliance", pageUrl: "/services/road-marking" },
    { question: "How much does warehouse floor marking cost in Saudi Arabia?", answer: "Warehouse floor marking in Saudi Arabia costs SAR 15-40 per linear meter for polyurea systems and SAR 10-25 for epoxy. Pricing depends on floor condition, area, and the line system selected. Polyurea is recommended for high-traffic forklift aisles.", category: "cost", pageUrl: "/saudi-arabia/riyadh" },
    { question: "What is ICAO Annex 14 and why does it matter for airport marking?", answer: "ICAO Annex 14 is the international standard for aerodrome design and operations. It specifies dimensions, colours, reflectivity and materials for runway, taxiway and apron markings. All Gulf Seismic airport marking is ICAO Annex 14 compliant using Type III MMA systems.", category: "compliance", pageUrl: "/services/airport-marking" },
    { question: "How long does epoxy flooring last in a warehouse?", answer: "A properly installed epoxy floor lasts 10-15 years in commercial environments and 5-10 years in heavy-industrial settings before requiring recoating. Surface preparation (shot-blasting) and moisture testing are critical to achieving full service life.", category: "general", pageUrl: "/services/epoxy-flooring" },
  ];
  for (const f of faqs) {
    const existing = await db.faqCluster.findFirst({ where: { question: f.question } });
    if (!existing) await db.faqCluster.create({ data: f });
  }
  console.log(`  ✓ ${faqs.length} FAQ clusters\n`);

  // --- 4. Conversion CTAs (SXO) ---
  console.log("→ Conversion CTAs...");
  const ctas = [
    { name: "Homepage Primary CTA", pageUrl: "/", ctaLabel: "Get a Free Quote", ctaUrl: "/contact", ctaType: "primary", placement: "hero", intent: "conversion" },
    { name: "Homepage Secondary CTA", pageUrl: "/", ctaLabel: "Explore Services", ctaUrl: "/services/road-marking", ctaType: "secondary", placement: "hero", intent: "consideration" },
    { name: "Service Page Quote CTA", pageUrl: "/services/road-marking", ctaLabel: "Request a Quote", ctaUrl: "/contact", ctaType: "primary", placement: "bottom", intent: "conversion" },
    { name: "Projects Page CTA", pageUrl: "/projects", ctaLabel: "Get a Quote", ctaUrl: "/contact", ctaType: "primary", placement: "bottom", intent: "conversion" },
    { name: "Contact Page WhatsApp", pageUrl: "/contact", ctaLabel: "WhatsApp Us", ctaUrl: "https://wa.me/97150000000", ctaType: "whatsapp", placement: "sidebar", intent: "conversion" },
  ];
  for (const c of ctas) {
    const existing = await db.conversionFlow.findFirst({ where: { name: c.name } });
    if (!existing) await db.conversionFlow.create({ data: c });
  }
  console.log(`  ✓ ${ctas.length} conversion CTAs\n`);

  console.log("✅ Optimization data seeded!");
}

main().catch(console.error).finally(() => db.$disconnect());
