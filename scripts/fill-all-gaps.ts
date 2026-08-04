/**
 * Fill ALL content gaps identified by the recommendation engine.
 *
 * Creates: 40+ FAQs (cost/comparison/process for every service×country),
 * 14+ entity definitions (services + cities), 7 SEO profiles, 13 CTAs.
 *
 * Run: DATABASE_URL="..." bun run scripts/fill-all-gaps.ts
 */
import { db } from "../src/lib/db";
import { services, cities, countries, industries, company } from "../src/lib/gulf-data";
import { KEY_PAGES } from "../src/lib/optimization";

async function main() {
  console.log("→ Filling ALL content gaps...\n");

  // =========================================================================
  // 1. FAQ CLUSTERS — cost, comparison, process for every service
  // =========================================================================
  console.log("→ FAQ Clusters (AEO)...");
  let faqCount = 0;

  // Cost FAQs for every service × country
  const costRanges: Record<string, string> = {
    "road-marking": "AED 15-35 per linear meter",
    "thermoplastic-road-marking": "AED 18-40 per linear meter",
    "parking-lot-marking": "AED 8-20 per bay",
    "warehouse-marking": "AED 12-30 per linear meter (epoxy), AED 20-45 (polyurea)",
    "airport-marking": "AED 80-200 per square meter (MMA Type III)",
    "industrial-marking": "AED 15-40 per linear meter",
    "safety-signage": "AED 150-800 per sign (depending on size/reflectivity)",
    "epoxy-flooring": "AED 60-150 per square meter",
  };

  for (const service of services) {
    for (const country of countries) {
      const currency = country.slug === "uae" ? "AED" : "SAR";
      const range = costRanges[service.slug] || "Contact for pricing";
      const question = `How much does ${service.name.toLowerCase()} cost in ${country.shortName}?`;
      const answer = `${service.name} in ${country.shortName} typically costs ${range.replace("AED", currency)} depending on project scope, surface condition, and material specification. Pricing includes materials, application, and compliance with ${country.slug === "uae" ? "RTA" : "MOMRA"} specifications. Contact Gulf Seismic for a free site-specific quote.`;

      const existing = await db.faqCluster.findFirst({ where: { question } });
      if (!existing) {
        await db.faqCluster.create({
          data: { question, answer, category: "cost", entity: service.name, pageUrl: `/${country.slug}`, status: "published" },
        });
        faqCount++;
      }
    }
  }

  // Comparison FAQs for each service
  const comparisons: Record<string, { q: string; a: string }> = {
    "road-marking": { q: "Thermoplastic vs cold paint road marking — which is better?", a: "Thermoplastic lasts 5-10× longer than cold paint (5-7 years vs 6-12 months), fuses to asphalt for superior adhesion, and includes glass bead reflectivity for night visibility. Cold paint is cheaper upfront but requires frequent reapplication. For Gulf climate roads with heavy traffic, thermoplastic is the industry standard." },
    "thermoplastic-road-marking": { q: "Thermoplastic vs MMA cold plastic — which should I choose?", a: "Thermoplastic is ideal for highways and urban roads (lower cost, 5-7 year life). MMA cold plastic is preferred for airports (ICAO Annex 14 compliant, 30-min cure, jet-blast resistant) and high-stress areas. For most road marking in UAE and Saudi Arabia, thermoplastic is the standard choice." },
    "parking-lot-marking": { q: "Solvent paint vs thermoplastic for parking lots — which lasts longer?", a: "Solvent acrylic paint is standard for parking lots (cost-effective, 2-3 year life). Thermoplastic is recommended for high-traffic parking decks (5-7 year life, higher upfront cost). For most commercial parking facilities in the Gulf, solvent paint with proper surface preparation provides the best ROI." },
    "warehouse-marking": { q: "Epoxy vs polyurea warehouse marking — which is better for forklift traffic?", a: "Polyurea is superior for high-traffic forklift aisles (cures in 1-2 hours, 4-6 year life, chemical resistant). Epoxy is suitable for moderate traffic (12-24 hour cure, 2-4 year life, lower cost). For 24/7 logistics operations, polyurea's fast cure minimises downtime — the key advantage." },
    "airport-marking": { q: "MMA vs preformed thermoplastic for airport markings?", a: "MMA Type III is the ICAO Annex 14 standard for runways (jet-blast resistant, 30-min cure, high wet reflectivity). Preformed thermoplastic is used for taxiway hold positions and apron markings. For runway centrelines and threshold bars, MMA is mandatory. Both systems meet GACA/GCAA requirements." },
    "industrial-marking": { q: "Polyurea vs novolac epoxy for chemical-resistant industrial marking?", a: "Novolac epoxy resists acids, alkalis, and fuels (best for chemical plants). Polyurea offers faster cure (1-2 hrs vs 24 hrs) and better flexibility. For petrochemical facilities in Jubail and Ruwais, novolac epoxy is preferred. For general manufacturing, polyurea provides the best balance of durability and minimal downtime." },
    "safety-signage": { q: "Engineer-grade vs diamond-grade reflective signage?", a: "Engineer-grade (Type I) sheeting lasts 7-10 years and suits low-speed urban signs. High-intensity prismatic (Type III) suits highways (10-12 year life, 3× brighter). Diamond-grade (Type IV) is the premium choice for high-speed highways and critical safety signs (12-15 year life, visible at 500m+). For Gulf highways, Type III or IV is recommended." },
    "epoxy-flooring": { q: "Epoxy vs polyurethane flooring — which is better for warehouses?", a: "Epoxy is the standard for warehouse floors (seamless, 10-15 year life, chemical resistant). Polyurethane topcoat adds UV stability (for car park decks exposed to sunlight) and is more flexible (crack-resistant). For indoor warehouses, epoxy alone is sufficient. For outdoor or UV-exposed areas, epoxy + polyurethane topcoat is the best system." },
  };

  for (const service of services) {
    const comp = comparisons[service.slug];
    if (comp) {
      const existing = await db.faqCluster.findFirst({ where: { question: comp.q } });
      if (!existing) {
        await db.faqCluster.create({
          data: { question: comp.q, answer: comp.a, category: "comparison", entity: service.name, pageUrl: `/services/${service.slug}`, status: "published" },
        });
        faqCount++;
      }
    }
  }

  // Process FAQs for each service
  const processFaqs: Record<string, { q: string; a: string }> = {
    "road-marking": { q: "How long does road marking take to complete?", a: "A typical road marking project takes 1-5 days depending on scope. A 5km highway can be marked in 2-3 night shifts. We work in night-shift windows (11pm-5am) to minimise traffic disruption. Thermoplastic cures in 2-5 minutes, so lanes reopen within 10 minutes of application." },
    "thermoplastic-road-marking": { q: "What temperature is thermoplastic applied at?", a: "Thermoplastic is heated to 180-200°C in an oil-jacketed kettle and applied at 170-190°C. This temperature ensures proper fusion with the asphalt substrate. The material cools to traffic-ready hardness in 2-5 minutes. Application is suspended if ambient temperature drops below 10°C or if the surface is wet." },
    "parking-lot-marking": { q: "How long does parking lot marking take?", a: "A 200-bay parking lot is typically marked in 1-2 days. We work in phases to keep portions of the facility open. Solvent paint dries in 30-60 minutes; thermoplastic cures in 2-5 minutes. Layout optimisation (adding bays) is done first, followed by line striping and stencil application." },
    "warehouse-marking": { q: "How quickly can warehouse marking be applied with minimal downtime?", a: "Polyurea systems cure in 1-2 hours, allowing phased application with minimal disruption. We section the warehouse into zones and mark one zone at a time — each zone reopens within 2 hours. A typical 5,000 m² warehouse can be fully marked in 2-3 days with zero operational downtime." },
    "airport-marking": { q: "How do you minimise runway downtime during airport marking?", a: "MMA Type III cold plastic cures in 30-45 minutes, allowing markings to be applied and reopened within a single night-shift NOTAM window (typically 4 hours). We coordinate with airside operations, work under NOTAM, and use airside-trained crews. A typical taxiway marking project is completed in 3-5 night shifts." },
    "industrial-marking": { q: "Can industrial marking be applied to a live operating plant?", a: "Yes. We use phased application with ATEX-compliant equipment for hazardous zones. For petrochemical plants, we conduct a chemical audit first, then select novolac epoxy or polyurea systems rated for the specific chemicals present. Work is scheduled during planned maintenance windows or in isolated zones to ensure zero operational risk." },
    "safety-signage": { q: "How long does safety signage manufacturing and installation take?", a: "Standard signs are manufactured in 3-5 days. Custom wayfinding systems take 1-2 weeks (design + manufacture). Installation takes 1-2 days for a typical facility. For urgent compliance requirements, we offer 48-hour expedited production for standard ISO 7010 signs." },
    "epoxy-flooring": { q: "How long does epoxy flooring installation take?", a: "A typical 1,000 m² epoxy floor takes 3-5 days: Day 1 (surface prep + primer), Day 2-3 (self-levelling screed), Day 4 (topcoat). Foot traffic resumes after 12-24 hours; vehicle traffic after 48 hours; full chemical cure after 7 days. We work in phases for operational facilities to maintain access." },
  };

  for (const service of services) {
    const pf = processFaqs[service.slug];
    if (pf) {
      const existing = await db.faqCluster.findFirst({ where: { question: pf.q } });
      if (!existing) {
        await db.faqCluster.create({
          data: { question: pf.q, answer: pf.a, category: "process", entity: service.name, pageUrl: `/services/${service.slug}`, status: "published" },
        });
        faqCount++;
      }
    }
  }

  // Compliance FAQs
  const complianceFaqs = [
    { q: "What standards do Gulf Seismic road markings comply with?", a: "All road markings comply with RTA (UAE Roads and Transport Authority) and MOMRAH (Saudi Ministry of Municipalities, Rural Affairs and Housing) specifications. Materials meet ASTM D928 (thermoplastic), AASHTO M247 (glass beads), and local municipal standards. Reflectivity meets R2/R3 classification per local spec.", entity: "Road Marking", pageUrl: "/services/road-marking" },
    { q: "Are your airport markings ICAO Annex 14 compliant?", a: "Yes. All runway, taxiway, and apron markings follow ICAO Annex 14 Vol I Chapter 5 specifications for dimensions, colours, and reflectivity. We use Type III MMA systems meeting GACA (Saudi) and GCAA (UAE) regulatory requirements. Crews hold valid airside driving permits and follow the airport SMS.", entity: "ICAO Annex 14", pageUrl: "/services/airport-marking" },
    { q: "Do your safety signs meet ISO 7010?", a: "Yes. All hazard, mandatory, prohibition, and emergency signs use ISO 7010 standard pictograms with correct colour and shape coding. Sign substrates use ISO 3864 retroreflective sheeting. Regulatory traffic signs meet MUTCD-local and RTA/MOMRA specifications.", entity: "ISO 7010", pageUrl: "/services/safety-signage" },
    { q: "Is Gulf Seismic ISO 9001 certified?", a: "Yes, Gulf Seismic is ISO 9001 certified. Our quality management system covers all marking services — from project scoping and material selection through application, quality control, and handover. Every project follows documented procedures with ITPs (Inspection and Test Plans) and QA/QC records.", pageUrl: "/about" },
  ];
  for (const f of complianceFaqs) {
    const existing = await db.faqCluster.findFirst({ where: { question: f.q } });
    if (!existing) {
      await db.faqCluster.create({ data: { question: f.q, answer: f.a, category: "compliance", entity: f.entity, pageUrl: f.pageUrl, status: "published" } });
      faqCount++;
    }
  }

  // Local FAQs for key cities
  const cityFaqs = [
    { q: "Can you do road marking in Dubai at night?", a: "Yes. We operate night-shift thermoplastic application crews in Dubai from 11pm to 5am to avoid traffic disruption. RTA permits are obtained in advance. Lanes reopen within 10 minutes of application. Night work is the standard for all major Dubai road marking projects.", pageUrl: "/uae/dubai", entity: "Dubai" },
    { q: "Do you serve Riyadh and the Eastern Province?", a: "Yes. Gulf Seismic delivers road marking, warehouse marking, and industrial marking across Riyadh, Jeddah, Dammam, Khobar, Jubail, Yanbu, Makkah, and Madinah. For Vision 2030 megaprojects, we provide direct or partner-led service depending on project requirements.", pageUrl: "/saudi-arabia", entity: "Riyadh" },
    { q: "How quickly can you mobilise in Abu Dhabi?", a: "For Abu Dhabi projects, we typically mobilise within 24-72 hours of quote approval, depending on scope and DoT permit requirements. Emergency and night-shift mobilisation is available. Our Abu Dhabi crews are locally based with full DoT compliance.", pageUrl: "/uae/abu-dhabi", entity: "Abu Dhabi" },
  ];
  for (const f of cityFaqs) {
    const existing = await db.faqCluster.findFirst({ where: { question: f.q } });
    if (!existing) {
      await db.faqCluster.create({ data: { question: f.q, answer: f.a, category: "local", entity: f.entity, pageUrl: f.pageUrl, status: "published" } });
      faqCount++;
    }
  }

  console.log(`  ✓ ${faqCount} new FAQs created\n`);

  // =========================================================================
  // 2. ENTITY DEFINITIONS — all services + key cities
  // =========================================================================
  console.log("→ Entity Definitions (AIO/GEO)...");
  let entityCount = 0;

  // Service entities
  for (const service of services) {
    const existing = await db.entityDefinition.findUnique({ where: { name: service.name } });
    if (!existing) {
      await db.entityDefinition.create({
        data: {
          name: service.name,
          description: service.shortDescription,
          entityType: "Service",
          sameAs: JSON.stringify([]),
          properties: JSON.stringify({ tagline: service.tagline, benefits: service.benefits.slice(0, 3).join("; "), materials: service.materials.slice(0, 3).join("; ") }),
        },
      });
      entityCount++;
    }
  }

  // City entities (top 8)
  for (const city of cities.slice(0, 8)) {
    const existing = await db.entityDefinition.findUnique({ where: { name: city.name } });
    if (!existing) {
      const country = countries.find((c) => c.slug === city.country)!;
      await db.entityDefinition.create({
        data: {
          name: city.name,
          description: `${city.name} is a city in ${country.name} where Gulf Seismic provides road marking, parking marking, warehouse marking, and industrial marking services. ${city.heroDescription}`,
          entityType: "Place",
          sameAs: JSON.stringify([`https://en.wikipedia.org/wiki/${city.name.replace(/\s+/g, "_")}`]),
          properties: JSON.stringify({
            country: country.name,
            region: city.region,
            latitude: city.latitude,
            longitude: city.longitude,
            population: city.population,
            areaServed: "Road marking, industrial marking",
          }),
        },
      });
      entityCount++;
    }
  }

  // Industry entities
  for (const industry of industries.slice(0, 5)) {
    const existing = await db.entityDefinition.findUnique({ where: { name: industry.name } });
    if (!existing) {
      await db.entityDefinition.create({
        data: {
          name: industry.name,
          description: industry.description,
          entityType: "Thing",
          sameAs: JSON.stringify([]),
          properties: JSON.stringify({ challenges: industry.challenges.join("; "), solutions: industry.solutions.join("; ") }),
        },
      });
      entityCount++;
    }
  }

  // Additional authority entities
  const authorityEntities = [
    { name: "RTA (Roads and Transport Authority)", description: "The Roads and Transport Authority (RTA) is the Dubai government agency responsible for road infrastructure, transport planning, and road marking specifications in Dubai, UAE.", entityType: "Organization", sameAs: ["https://en.wikipedia.org/wiki/Roads_and_Transport_Authority"], properties: { country: "UAE", scope: "Dubai roads" } },
    { name: "MOMRAH", description: "The Saudi Ministry of Municipalities, Rural Affairs and Housing (MOMRAH) is the government body responsible for municipal road specifications including road marking standards across Saudi Arabia.", entityType: "Organization", sameAs: ["https://en.wikipedia.org/wiki/Ministry_of_Municipal_and_Rural_Affairs"], properties: { country: "Saudi Arabia", scope: "Municipal roads" } },
    { name: "GACA (General Authority of Civil Aviation)", description: "The General Authority of Civil Aviation (GACA) is Saudi Arabia's civil aviation regulator, responsible for airport safety standards including runway marking compliance with ICAO Annex 14.", entityType: "Organization", sameAs: [], properties: { country: "Saudi Arabia", scope: "Airports" } },
    { name: "ASME A13.1", description: "ASME A13.1 is the American standard for pipe identification, specifying colour codes, label sizes, and placement for pipe systems in industrial facilities.", entityType: "Thing", sameAs: ["https://en.wikipedia.org/wiki/ASME"], properties: { issuer: "ASME", scope: "Pipe identification" } },
    { name: "Vision 2030", description: "Saudi Vision 2030 is the Kingdom's strategic framework to reduce dependence on oil, diversify the economy, and develop public service sectors including infrastructure, creating significant demand for road marking and industrial marking services.", entityType: "Thing", sameAs: ["https://en.wikipedia.org/wiki/Vision_2030"], properties: { country: "Saudi Arabia", scope: "National strategy" } },
  ];
  for (const e of authorityEntities) {
    const existing = await db.entityDefinition.findUnique({ where: { name: e.name } });
    if (!existing) {
      await db.entityDefinition.create({
        data: { ...e, sameAs: JSON.stringify(e.sameAs), properties: JSON.stringify(e.properties) },
      });
      entityCount++;
    }
  }

  console.log(`  ✓ ${entityCount} new entities created\n`);

  // =========================================================================
  // 3. SEO PROFILES — fill remaining key pages
  // =========================================================================
  console.log("→ SEO Profiles...");
  let seoCount = 0;
  const remainingPages = KEY_PAGES.filter((p) => ![
    "/", "/uae", "/saudi-arabia", "/services/road-marking", "/services/thermoplastic-road-marking",
    "/services/parking-lot-marking", "/services/warehouse-marking", "/projects", "/about", "/contact",
  ].includes(p.url));

  for (const page of remainingPages) {
    const existing = await db.seoProfile.findUnique({ where: { pageUrl: page.url } });
    if (!existing) {
      const title = `${page.label} | Gulf Seismic Road & Industrial Marking`;
      const desc = `Professional ${page.label.toLowerCase()} services across UAE and Saudi Arabia. Thermoplastic marking, epoxy flooring, safety signage. ISO 9001 certified. Get a free quote.`;
      await db.seoProfile.create({
        data: {
          pageUrl: page.url, metaTitle: title, metaDescription: desc,
          canonicalUrl: `https://gulfseismic.com${page.url}`,
          ogTitle: title, ogDescription: desc,
          focusKeyword: page.label.toLowerCase(),
          robotsIndex: true, robotsFollow: true,
        },
      });
      seoCount++;
    }
  }
  console.log(`  ✓ ${seoCount} new SEO profiles created\n`);

  // =========================================================================
  // 4. CONVERSION CTAs — fill remaining key pages
  // =========================================================================
  console.log("→ Conversion CTAs (SXO)...");
  let ctaCount = 0;

  const existingCtaPages = await db.conversionFlow.findMany({
    where: { status: "active" },
    distinct: ["pageUrl"],
    select: { pageUrl: true },
  });
  const pagesWithCtas = new Set(existingCtaPages.map((c) => c.pageUrl));

  for (const page of KEY_PAGES) {
    if (!pagesWithCtas.has(page.url)) {
      await db.conversionFlow.create({
        data: {
          name: `${page.label} Quote CTA`,
          pageUrl: page.url,
          ctaLabel: "Get a Free Quote",
          ctaUrl: "/contact",
          ctaType: "primary",
          placement: "bottom",
          intent: "conversion",
          status: "active",
        },
      });
      ctaCount++;
    }
  }

  // Add WhatsApp CTAs for key pages
  const whatsappPages = ["/uae", "/saudi-arabia", "/services/road-marking", "/services/thermoplastic-road-marking", "/services/parking-lot-marking"];
  for (const pageUrl of whatsappPages) {
    const existing = await db.conversionFlow.findFirst({ where: { pageUrl, ctaType: "whatsapp" } });
    if (!existing) {
      await db.conversionFlow.create({
        data: {
          name: `${pageUrl} WhatsApp CTA`,
          pageUrl, ctaLabel: "WhatsApp Us", ctaUrl: "https://wa.me/97150000000",
          ctaType: "whatsapp", placement: "sidebar", intent: "conversion", status: "active",
        },
      });
      ctaCount++;
    }
  }

  console.log(`  ✓ ${ctaCount} new CTAs created\n`);

  // =========================================================================
  // SUMMARY
  // =========================================================================
  const [totalFaqs, totalEntities, totalSeo, totalCtas] = await Promise.all([
    db.faqCluster.count({ where: { status: "published" } }),
    db.entityDefinition.count(),
    db.seoProfile.count(),
    db.conversionFlow.count({ where: { status: "active" } }),
  ]);

  console.log("=".repeat(60));
  console.log("  ALL GAPS FILLED!");
  console.log("=".repeat(60));
  console.log(`  New FAQs:        ${faqCount}  (total: ${totalFaqs})`);
  console.log(`  New Entities:    ${entityCount}  (total: ${totalEntities})`);
  console.log(`  New SEO Profiles: ${seoCount}  (total: ${totalSeo})`);
  console.log(`  New CTAs:        ${ctaCount}  (total: ${totalCtas})`);
  console.log("=".repeat(60));
}

main().catch(console.error).finally(() => db.$disconnect());
