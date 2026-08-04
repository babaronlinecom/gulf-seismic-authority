/**
 * Gulf Seismic Authority Graph — Master Data Layer
 * --------------------------------------------------
 * Single source of truth for the Country → City → Service → Industry →
 * Project → Case Study → Blog authority graph.
 *
 * In production these entities are served from the headless WordPress CMS
 * (https://cms.gulfseismic.com/graphql) via the CPTs: Countries, Cities,
 * Services, Industries, Projects, CaseStudies, Blogs, FAQs, Resources.
 * This module provides resilient seed data so the frontend renders even
 * when the CMS is unreachable, and acts as the TypeScript contract for
 * the GraphQL response shapes.
 */

export type CountrySlug = "uae" | "saudi-arabia";

export interface Country {
  slug: CountrySlug;
  name: string;
  shortName: string;
  code: string; // ISO 3166-1 alpha-2
  flag: string; // emoji
  heroHeading: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  dialCode: string;
  whatsapp: string;
  phone: string;
}

export interface City {
  slug: string;
  country: CountrySlug;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  heroHeading: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  population: string;
  highlights: string[];
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  icon: string; // lucide icon name
  benefits: string[];
  materials: string[];
  equipment: string[];
  industriesServed: string[]; // industry slugs
  faqs: { question: string; answer: string }[];
  heroHeading: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  process: { step: number; title: string; description: string }[];
  specs: { label: string; value: string }[];
}

export interface Industry {
  slug: string;
  name: string;
  description: string;
  icon: string;
  challenges: string[];
  solutions: string[];
  services: string[]; // service slugs
}

export interface Project {
  slug: string;
  title: string;
  country: CountrySlug;
  city: string; // city slug
  service: string; // service slug
  industry: string; // industry slug
  client: string;
  year: number;
  duration: string;
  challenge: string;
  solution: string;
  execution: string;
  materials: string[];
  equipment: string[];
  results: { label: string; value: string }[];
  gallery: { alt: string; caption: string }[];
  location: string;
  area: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  projectSlug: string;
  summary: string;
  outcomes: string[];
  testimonial: { quote: string; author: string; role: string } | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
}

// ---------------------------------------------------------------------------
// COUNTRIES
// ---------------------------------------------------------------------------

export const countries: Country[] = [
  {
    slug: "uae",
    name: "United Arab Emirates",
    shortName: "UAE",
    code: "AE",
    flag: "🇦🇪",
    heroHeading: "Road Marking Specialists Across the United Arab Emirates",
    heroDescription:
      "Gulf Seismic delivers thermoplastic road marking, parking lot marking, warehouse marking and industrial safety signage across all seven Emirates — engineered to withstand extreme desert heat and heavy traffic loads.",
    seoTitle: "Road Marking UAE | Thermoplastic & Industrial Marking Contractors",
    seoDescription:
      "Leading road marking company in UAE. Thermoplastic road marking, parking lot marking, warehouse marking, airport marking and epoxy flooring across Abu Dhabi, Dubai, Sharjah and all Emirates.",
    dialCode: "+971",
    whatsapp: "971549970833",
    phone: "+971 2 555 5769",
  },
  {
    slug: "saudi-arabia",
    name: "Kingdom of Saudi Arabia",
    shortName: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    heroHeading: "Saudi Arabia's Trusted Road & Industrial Marking Authority",
    heroDescription:
      "From Vision 2030 megaprojects to municipal road networks, Gulf Seismic provides premium thermoplastic marking, warehouse line marking and safety signage across Riyadh, Jeddah, Dammam and the Kingdom.",
    seoTitle: "Road Marking Saudi Arabia | Thermoplastic Marking Riyadh Jeddah",
    seoDescription:
      "Saudi Arabia road marking contractor. Thermoplastic road marking, warehouse marking, airport marking and epoxy flooring in Riyadh, Jeddah, Dammam, Khobar, Jubail, Yanbu, Makkah and Madinah.",
    dialCode: "+966",
    whatsapp: "966507657243",
    phone: "+966 507 657 243",
  },
];

// ---------------------------------------------------------------------------
// CITIES — 16 total (8 UAE + 8 Saudi)
// ---------------------------------------------------------------------------

export const cities: City[] = [
  // ---- UAE ----
  {
    slug: "abu-dhabi",
    country: "uae",
    name: "Abu Dhabi",
    region: "Emirate of Abu Dhabi",
    latitude: 24.4539,
    longitude: 54.3773,
    heroHeading: "Road Marking Contractors in Abu Dhabi",
    heroDescription:
      "Capital-grade road marking, parking line marking and industrial floor marking services for Abu Dhabi's highways, megaprojects and commercial developments.",
    seoTitle: "Road Marking Abu Dhabi | Thermoplastic & Parking Marking",
    seoDescription:
      "Abu Dhabi road marking company. Thermoplastic road marking, parking lot marking, warehouse marking and epoxy flooring for highways, malls and industrial facilities.",
    population: "1.5M+",
    highlights: ["Capital megaprojects", "Highway networks", "Mega-mall parking"],
  },
  {
    slug: "dubai",
    country: "uae",
    name: "Dubai",
    region: "Emirate of Dubai",
    latitude: 25.2048,
    longitude: 55.2708,
    heroHeading: "Road Marking Contractors in Dubai",
    heroDescription:
      "Precision thermoplastic marking and parking lot line marking for Dubai's world-class road network, malls, airports and logistics hubs.",
    seoTitle: "Road Marking Dubai | Parking Lot & Thermoplastic Marking",
    seoDescription:
      "Dubai road marking specialists. Thermoplastic road marking, parking lot marking, warehouse marking, airport marking and epoxy flooring across Dubai.",
    population: "3.6M+",
    highlights: ["Expo legacy infrastructure", "Logistics hubs", "Mall parking"],
  },
  {
    slug: "sharjah",
    country: "uae",
    name: "Sharjah",
    region: "Emirate of Sharjah",
    latitude: 25.3463,
    longitude: 55.4209,
    heroHeading: "Road Marking Contractors in Sharjah",
    heroDescription:
      "Industrial and commercial marking services for Sharjah's manufacturing zones, residential communities and arterial roads.",
    seoTitle: "Road Marking Sharjah | Industrial & Parking Marking",
    seoDescription:
      "Sharjah road marking contractor. Thermoplastic road marking, warehouse marking, parking lot marking and safety signage for industrial areas.",
    population: "1.8M+",
    highlights: ["Industrial zones", "Residential communities", "Cultural capital"],
  },
  {
    slug: "ajman",
    country: "uae",
    name: "Ajman",
    region: "Emirate of Ajman",
    latitude: 25.4052,
    longitude: 55.5136,
    heroHeading: "Road Marking Contractors in Ajman",
    heroDescription:
      "Cost-effective road marking, parking line marking and safety signage for Ajman's growing commercial and residential developments.",
    seoTitle: "Road Marking Ajman | Parking & Safety Marking",
    seoDescription:
      "Ajman road marking services. Thermoplastic road marking, parking lot marking and industrial safety signage for commercial properties.",
    population: "500K+",
    highlights: ["Commercial hubs", "Residential towers", "Port area"],
  },
  {
    slug: "ras-al-khaimah",
    country: "uae",
    name: "Ras Al Khaimah",
    region: "Emirate of Ras Al Khaimah",
    latitude: 25.7853,
    longitude: 55.9432,
    heroHeading: "Road Marking Contractors in Ras Al Khaimah",
    heroDescription:
      "Durable thermoplastic marking and industrial floor marking for RAK's quarries, cement plants and mountain highway networks.",
    seoTitle: "Road Marking Ras Al Khaimah | Industrial & Highway Marking",
    seoDescription:
      "Ras Al Khaimah road marking. Thermoplastic highway marking, warehouse marking and safety signage for industrial and tourism sectors.",
    population: "400K+",
    highlights: ["Industrial quarries", "Mountain highways", "Tourism zones"],
  },
  {
    slug: "fujairah",
    country: "uae",
    name: "Fujairah",
    region: "Emirate of Fujairah",
    latitude: 25.1166,
    longitude: 56.3316,
    heroHeading: "Road Marking Contractors in Fujairah",
    heroDescription:
      "Port and oil-terminal grade marking services for Fujairah's strategic east-coast logistics and energy infrastructure.",
    seoTitle: "Road Marking Fujairah | Port & Industrial Marking",
    seoDescription:
      "Fujairah road marking contractor. Thermoplastic marking, warehouse marking and hazardous-zone safety signage for port and energy facilities.",
    population: "250K+",
    highlights: ["Port operations", "Oil terminals", "East coast highways"],
  },
  {
    slug: "al-ain",
    country: "uae",
    name: "Al Ain",
    region: "Emirate of Abu Dhabi",
    latitude: 24.2075,
    longitude: 55.7447,
    heroHeading: "Road Marking Contractors in Al Ain",
    heroDescription:
      "Garden-city road marking, parking and institutional marking for Al Ain's universities, hospitals and heritage routes.",
    seoTitle: "Road Marking Al Ain | Parking & Institutional Marking",
    seoDescription:
      "Al Ain road marking services. Thermoplastic road marking, parking lot marking and safety signage for institutional and residential areas.",
    population: "760K+",
    highlights: ["Universities", "Heritage routes", "Garden city"],
  },
  {
    slug: "umm-al-quwain",
    country: "uae",
    name: "Umm Al Quwain",
    region: "Emirate of Umm Al Quwain",
    latitude: 25.5593,
    longitude: 55.5558,
    heroHeading: "Road Marking Contractors in Umm Al Quwain",
    heroDescription:
      "Reliable road and parking marking for Umm Al Quwain's coastal developments, tourism projects and residential communities.",
    seoTitle: "Road Marking Umm Al Quwain | Parking & Coastal Marking",
    seoDescription:
      "Umm Al Quwain road marking. Thermoplastic road marking, parking lot marking and safety signage for coastal and tourism developments.",
    population: "80K+",
    highlights: ["Coastal tourism", "Residential growth", "Marina areas"],
  },
  // ---- Saudi Arabia ----
  {
    slug: "riyadh",
    country: "saudi-arabia",
    name: "Riyadh",
    region: "Riyadh Province",
    latitude: 24.7136,
    longitude: 46.6753,
    heroHeading: "Road Marking Contractors in Riyadh",
    heroDescription:
      "Capital-scale thermoplastic marking, parking and industrial floor marking supporting Riyadh's Vision 2030 megaprojects and urban expansion.",
    seoTitle: "Road Marking Riyadh | Thermoplastic & Warehouse Marking",
    seoDescription:
      "Riyadh road marking company. Thermoplastic road marking, parking lot marking, warehouse marking and epoxy flooring for Vision 2030 projects.",
    population: "7.6M+",
    highlights: ["Vision 2030 megaprojects", "Capital highway network", "Logistics city"],
  },
  {
    slug: "jeddah",
    country: "saudi-arabia",
    name: "Jeddah",
    region: "Makkah Province",
    latitude: 21.4858,
    longitude: 39.1925,
    heroHeading: "Road Marking Contractors in Jeddah",
    heroDescription:
      "Coastal-grade marking engineered for Jeddah's humidity — serving the port, corniche and pilgrim transit routes.",
    seoTitle: "Road Marking Jeddah | Parking & Port Industrial Marking",
    seoDescription:
      "Jeddah road marking contractor. Thermoplastic road marking, parking lot marking, warehouse marking and safety signage for port and pilgrim routes.",
    population: "4M+",
    highlights: ["Red Sea port", "Pilgrim transit", "Corniche highways"],
  },
  {
    slug: "dammam",
    country: "saudi-arabia",
    name: "Dammam",
    region: "Eastern Province",
    latitude: 26.4207,
    longitude: 50.0888,
    heroHeading: "Road Marking Contractors in Dammam",
    heroDescription:
      "Oil-and-gas-grade industrial marking for Dammam's Eastern Province energy corridor, ports and logistics hubs.",
    seoTitle: "Road Marking Dammam | Industrial & Warehouse Marking",
    seoDescription:
      "Dammam road marking. Thermoplastic road marking, warehouse marking, hazardous-zone signage and epoxy flooring for the Eastern Province energy sector.",
    population: "1.5M+",
    highlights: ["Energy corridor", "King Abdul Aziz Port", "Industrial cities"],
  },
  {
    slug: "khobar",
    country: "saudi-arabia",
    name: "Al Khobar",
    region: "Eastern Province",
    latitude: 26.2794,
    longitude: 50.2083,
    heroHeading: "Road Marking Contractors in Al Khobar",
    heroDescription:
      "Premium marking for Khobar's commercial boulevards, corniche and upscale parking facilities.",
    seoTitle: "Road Marking Al Khobar | Parking & Commercial Marking",
    seoDescription:
      "Al Khobar road marking contractor. Thermoplastic road marking, parking lot marking and commercial safety signage for the corniche and business districts.",
    population: "600K+",
    highlights: ["Corniche boulevards", "Commercial districts", "Corniche parking"],
  },
  {
    slug: "jubail",
    country: "saudi-arabia",
    name: "Jubail",
    region: "Eastern Province",
    latitude: 27.0046,
    longitude: 49.6614,
    heroHeading: "Road Marking Contractors in Jubail",
    heroDescription:
      "Heavy-industrial marking for the world's largest industrial city — Jubail's petrochemical plants, ports and industrial roads.",
    seoTitle: "Road Marking Jubail | Industrial & Petrochemical Marking",
    seoDescription:
      "Jubail road marking. Industrial thermoplastic marking, warehouse marking, hazardous-zone signage and epoxy flooring for petrochemical facilities.",
    population: "700K+",
    highlights: ["Largest industrial city", "Petrochemical plants", "Industrial ports"],
  },
  {
    slug: "yanbu",
    country: "saudi-arabia",
    name: "Yanbu",
    region: "Madinah Province",
    latitude: 24.0895,
    longitude: 38.0618,
    heroHeading: "Road Marking Contractors in Yanbu",
    heroDescription:
      "Red Sea industrial city marking for Yanbu's refineries, port and industrial road networks.",
    seoTitle: "Road Marking Yanbu | Industrial & Port Marking",
    seoDescription:
      "Yanbu road marking contractor. Industrial thermoplastic marking, warehouse marking and safety signage for refineries and port facilities.",
    population: "400K+",
    highlights: ["Refineries", "Red Sea port", "Industrial city"],
  },
  {
    slug: "makkah",
    country: "saudi-arabia",
    name: "Makkah",
    region: "Makkah Province",
    latitude: 21.3891,
    longitude: 39.8579,
    heroHeading: "Road Marking Contractors in Makkah",
    heroDescription:
      "High-capacity marking for Makkah's pilgrim-season road network, parking structures and holy-site transit routes.",
    seoTitle: "Road Marking Makkah | Pilgrim Route & Parking Marking",
    seoDescription:
      "Makkah road marking. Thermoplastic road marking, parking structure marking and safety signage for pilgrim transit and holy-site routes.",
    population: "2M+",
    highlights: ["Pilgrim transit", "Holy-site routes", "Seasonal capacity"],
  },
  {
    slug: "madinah",
    country: "saudi-arabia",
    name: "Madinah",
    region: "Madinah Province",
    latitude: 24.5247,
    longitude: 39.5692,
    heroHeading: "Road Marking Contractors in Madinah",
    heroDescription:
      "Precision marking for Madinah's pilgrim corridors, central area roads and mosque-adjacent parking facilities.",
    seoTitle: "Road Marking Madinah | Pilgrim Corridor & Parking Marking",
    seoDescription:
      "Madinah road marking contractor. Thermoplastic road marking, parking marking and safety signage for pilgrim corridors and central areas.",
    population: "1.5M+",
    highlights: ["Pilgrim corridors", "Central mosque area", "Heritage routes"],
  },
];

// ---------------------------------------------------------------------------
// SERVICES — 8 core commercial services
// ---------------------------------------------------------------------------

export const services: Service[] = [
  {
    slug: "road-marking",
    name: "Road Marking",
    tagline: "Highway-grade line marking built for Gulf traffic and heat.",
    shortDescription:
      "Durable hot-applied thermoplastic and cold plastic road line marking for highways, urban roads and access roads — compliant with Gulf municipal specifications.",
    longDescription:
      "Our road marking division applies engineered thermoplastic and methyl methacrylate (MMA) line systems designed to survive 50°C+ asphalt temperatures, intense UV exposure and heavy HGV traffic. We deploy self-propelled line-marking machines with glass-bead dispensers for retroreflectivity that keeps roads safe after dark. Every project follows local RTA, DoT and Saudi MOMRA specification, including line width, colour and reflectivity standards.",
    icon: "Road",
    benefits: [
      "Municipal-spec compliance (RTA / DoT / MOMRA)",
      "Hot-applied thermoplastic rated for 50°C+ asphalt",
      "Glass-bead retroreflectivity for night visibility",
      "Fast curing — roads reopen in minutes",
      "5–7 year service life under heavy traffic",
    ],
    materials: [
      "Hot-applied thermoplastic (Type I/II)",
      "MMA cold plastic",
      "Reflective glass beads",
      "Anti-skid aggregate",
      "Preformed thermoplastic (symbols)",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Hand-push line marker",
      "Glass-bead dispenser",
      "Line pre-marking laser",
      "Surface preparation blower",
    ],
    industriesServed: ["highways-roads", "commercial", "residential", "industrial"],
    faqs: [
      {
        question: "How long does thermoplastic road marking last in the UAE climate?",
        answer:
          "Properly applied thermoplastic road marking lasts 5–7 years under normal traffic in the Gulf climate. High-stress intersections may require touch-ups every 2–3 years.",
      },
      {
        question: "How soon can traffic resume after marking?",
        answer:
          "Hot thermoplastic cures in 2–5 minutes depending on ambient temperature. Roads can typically reopen to traffic within 10 minutes of application.",
      },
      {
        question: "Do you comply with RTA and MOMRA specifications?",
        answer:
          "Yes. All line widths, colours, reflectivity and material composition meet local RTA (UAE) and MOMRA (Saudi Arabia) road marking specifications.",
      },
    ],
    heroHeading: "Road Marking — Highway, Urban & Access Roads",
    heroDescription:
      "Thermoplastic and MMA road line marking engineered for Gulf heat, UV and heavy traffic — fully compliant with RTA, DoT and MOMRA specifications.",
    seoTitle: "Road Marking Contractors | Thermoplastic Line Marking UAE & Saudi",
    seoDescription:
      "Professional road marking contractors. Hot-applied thermoplastic line marking for highways and urban roads across UAE and Saudi Arabia. RTA & MOMRA compliant.",
    process: [
      { step: 1, title: "Site Survey", description: "Assess asphalt condition, traffic volumes and spec requirements." },
      { step: 2, title: "Surface Prep", description: "Clean, dry and prime the surface for optimal thermoplastic adhesion." },
      { step: 3, title: "Pre-Marking", description: "Lay laser-guided pre-mark lines for precise geometry." },
      { step: 4, title: "Application", description: "Apply hot thermoplastic with simultaneous glass-bead dispensing." },
      { step: 5, title: "QC & Reopen", description: "Verify reflectivity and line width, then reopen to traffic." },
    ],
    specs: [
      { label: "Line width", value: "100–150 mm standard" },
      { label: "Service life", value: "5–7 years" },
      { label: "Cure time", value: "2–5 minutes" },
      { label: "Reflectivity", value: "Class R2/R3 retroreflective" },
    ],
  },
  {
    slug: "thermoplastic-road-marking",
    name: "Thermoplastic Road Marking",
    tagline: "The industry-standard durable line marking system.",
    shortDescription:
      "Hot-applied thermoplastic line marking offering superior durability, reflectivity and adhesion — the preferred system for highways and high-traffic roads.",
    longDescription:
      "Thermoplastic road marking is the gold standard for durable line marking. Heated to 180–200°C and applied as a melt, it fuses with the asphalt to form a bond that outlasts paint by 5–10×. Embedded glass beads provide retroreflectivity that makes lines glow under headlights. Our thermoplastic systems are formulated for Gulf conditions with UV stabilisers and enhanced softening points to prevent tracking in extreme heat.",
    icon: "Flame",
    benefits: [
      "5–10× longer life than cold paint",
      "Fuses to asphalt — no peeling",
      "Built-in retroreflectivity from glass beads",
      "Skid-resistant aggregate surface",
      "Low VOC, environmentally stable",
    ],
    materials: [
      "Alkyd / hydrocarbon thermoplastic",
      "Reflective glass beads (Type I/II)",
      "Anti-skid aggregate",
      "Primer/sealer (for concrete)",
    ],
    equipment: [
      "Thermoplastic pre-heater (oil-jacketed kettle)",
      "Self-propelled applicator",
      "Extrusion / screed shoe",
      "Bead dispenser (gravity / pressure)",
    ],
    industriesServed: ["highways-roads", "commercial", "industrial", "aviation"],
    faqs: [
      {
        question: "What temperature is thermoplastic applied at?",
        answer:
          "Thermoplastic is heated to 180–200°C in an oil-jacketed kettle and applied at 170–190°C to ensure proper fusion with the substrate.",
      },
      {
        question: "Can thermoplastic be applied over existing paint?",
        answer:
          "No. Existing paint must be removed by water-blasting or mechanical scarifying so the thermoplastic fuses directly with the asphalt or concrete.",
      },
      {
        question: "Is thermoplastic suitable for concrete surfaces?",
        answer:
          "Yes, with a compatible epoxy or solvent primer applied first to promote adhesion between the thermoplastic and the concrete.",
      },
    ],
    heroHeading: "Thermoplastic Road Marking — Durable, Reflective, Compliant",
    heroDescription:
      "Hot-applied thermoplastic line marking fused to the road surface for 5–7 year durability with built-in glass-bead retroreflectivity.",
    seoTitle: "Thermoplastic Road Marking | Hot-Applied Line Marking UAE Saudi",
    seoDescription:
      "Thermoplastic road marking contractors in UAE & Saudi Arabia. Hot-applied durable line marking with glass bead reflectivity for highways and roads.",
    process: [
      { step: 1, title: "Heat", description: "Melt thermoplastic to 180–200°C in oil-jacketed kettle." },
      { step: 2, title: "Prepare", description: "Scarify or water-blast old markings, prime concrete." },
      { step: 3, title: "Apply", description: "Extrude thermoplastic with simultaneous bead dispensing." },
      { step: 4, title: "Bead", description: "Glass beads embed for retroreflectivity." },
      { step: 5, title: "Cure", description: "Cool 2–5 minutes, then reopen." },
    ],
    specs: [
      { label: "Application temp", value: "170–190°C" },
      { label: "Softening point", value: "100–105°C" },
      { label: "Thickness", value: "2.5–3.0 mm" },
      { label: "Reflectivity", value: "R2/R3 with glass beads" },
    ],
  },
  {
    slug: "parking-lot-marking",
    name: "Parking Lot Marking",
    tagline: "Maximise capacity and safety in every parking facility.",
    shortDescription:
      "Precision parking bay line marking, accessibility stencils, direction arrows and pedestrian walkways for malls, offices and residential towers.",
    longDescription:
      "A well-marked parking lot is a revenue asset — optimised bay layout can increase capacity by 10–15%. We design and mark parking facilities with crisp, durable lines that guide drivers, maximise stall count and meet accessibility codes. Our services include bay layout optimisation, disabled-access stencils, directional arrows, pedestrian crossings, speed humps marking and colour-coded zoning for VIP, family and EV bays.",
    icon: "SquareParking",
    benefits: [
      "10–15% capacity optimisation",
      "Accessible-bay compliance (ADA / local code)",
      "Crisp, high-visibility lines",
      "Colour-coded zone marking",
      "Traffic-flow and pedestrian safety",
    ],
    materials: [
      "Solvent-based acrylic paint",
      "Water-based traffic paint",
      "Thermoplastic (high-traffic areas)",
      "Two-component epoxy",
      "Preformed symbols (disabled, arrows)",
    ],
    equipment: [
      "Airless line striper",
      "Hand-push marker",
      "Stencil kit",
      "Layout chalk / laser",
    ],
    industriesServed: ["commercial", "residential", "healthcare", "aviation"],
    faqs: [
      {
        question: "How long does parking lot marking take?",
        answer:
          "A typical 200-bay parking lot is marked in 1–2 days. We work in phases to keep portions of the facility open throughout.",
      },
      {
        question: "Can you re-mark over existing lines?",
        answer:
          "We recommend blacking out ghost lines first to avoid driver confusion. Where layout changes, old lines are obscured with black-out paint before new marking.",
      },
      {
        question: "Do you handle accessibility (disabled) bays?",
        answer:
          "Yes, we apply all accessibility symbols, bay dimensions and signage to meet local and international accessibility codes.",
      },
    ],
    heroHeading: "Parking Lot Marking — Capacity, Safety, Compliance",
    heroDescription:
      "Precision parking bay marking, accessibility stencils and traffic-flow layout that maximise capacity and guide drivers safely.",
    seoTitle: "Parking Lot Marking | Parking Bay Line Marking UAE Saudi Arabia",
    seoDescription:
      "Parking lot marking contractors. Parking bay line marking, accessibility stencils and directional arrows for malls, offices and residential towers.",
    process: [
      { step: 1, title: "Layout Audit", description: "Measure and optimise bay layout for capacity." },
      { step: 2, title: "Ghost Removal", description: "Black out obsolete lines to prevent confusion." },
      { step: 3, title: "Chalk Layout", description: "Snap chalk lines for crisp geometry." },
      { step: 4, title: "Stripe", description: "Apply durable traffic paint or thermoplastic." },
      { step: 5, title: "Stencil", description: "Apply symbols, arrows and accessibility markings." },
    ],
    specs: [
      { label: "Bay width", value: "2.5–3.0 m standard" },
      { label: "Line width", value: "100 mm" },
      { label: "Drying time", value: "30–60 min (paint)" },
      { label: "Capacity gain", value: "Up to 15%" },
    ],
  },
  {
    slug: "warehouse-marking",
    name: "Warehouse Marking",
    tagline: "Organise floor space, protect workers, and guide forklifts.",
    shortDescription:
      "Industrial floor marking for warehouses — pedestrian walkways, forklift lanes, hazard zones, storage bays and OSHA / HSE compliant safety zones.",
    longDescription:
      "Warehouse floor marking is the backbone of facility safety and 5S organisation. We apply high-durability epoxy and polyurea line systems that survive forklift traffic, pallet drag and chemical spills. Our layouts separate pedestrians from MHE traffic, mark storage locations, identify hazard zones and create the visual workplace that drives operational efficiency and HSE compliance.",
    icon: "Warehouse",
    benefits: [
      "Forklift-grade durability (epoxy / polyurea)",
      "Pedestrian–MHE traffic separation",
      "HSE / OSHA compliant hazard zones",
      "5S visual workplace organisation",
      "Chemical and impact resistant",
    ],
    materials: [
      "Two-component epoxy line paint",
      "Polyurea (fast-cure, high-traffic)",
      "MMA cold plastic",
      "Anti-slip aggregate",
      "Preformed hazard tape",
    ],
    equipment: [
      "Airless epoxy sprayer",
      "Hand-push marker",
      "Walk-behind grinder (surface prep)",
      "Stencil system",
    ],
    industriesServed: ["industrial", "logistics", "retail", "aviation"],
    faqs: [
      {
        question: "How long does warehouse floor marking last under forklift traffic?",
        answer:
          "Epoxy marking typically lasts 2–4 years under moderate forklift traffic; polyurea systems can last 4–6 years in high-traffic aisles.",
      },
      {
        question: "Can marking be applied over sealed concrete?",
        answer:
          "Yes, after mechanical grinding or shot-blasting to profile the surface and ensure epoxy adhesion. We always test coating compatibility first.",
      },
      {
        question: "How quickly can the warehouse stay operational?",
        answer:
          "Polyurea systems cure in 1–2 hours, allowing phased application with minimal downtime. Epoxy requires 12–24 hours before traffic.",
      },
    ],
    heroHeading: "Warehouse Marking — Forklift-Grade Safety & 5S Organisation",
    heroDescription:
      "Industrial floor marking for warehouses — pedestrian lanes, forklift aisles, hazard zones and storage bays in durable epoxy and polyurea.",
    seoTitle: "Warehouse Floor Marking | Industrial Line Marking UAE Saudi",
    seoDescription:
      "Warehouse marking contractors. Forklift-grade epoxy and polyurea floor marking for pedestrian lanes, hazard zones and 5S organisation in UAE & Saudi Arabia.",
    process: [
      { step: 1, title: "Surface Prep", description: "Grind or shot-blast concrete for adhesion." },
      { step: 2, title: "Layout", description: "Mark pedestrian, forklift and hazard zones to HSE plan." },
      { step: 3, title: "Prime", description: "Apply epoxy primer for chemical bond." },
      { step: 4, title: "Stripe", description: "Apply epoxy or polyurea line system." },
      { step: 5, title: "Cure", description: "Polyurea: 1–2 hrs. Epoxy: 12–24 hrs." },
    ],
    specs: [
      { label: "System", value: "Epoxy / Polyurea / MMA" },
      { label: "Service life", value: "2–6 years" },
      { label: "Cure time", value: "1 hr (polyurea) – 24 hr (epoxy)" },
      { label: "Lane width", value: "100–150 mm" },
    ],
  },
  {
    slug: "airport-marking",
    name: "Airport Marking",
    tagline: "Precision airside marking to ICAO Annex 14 standards.",
    shortDescription:
      "Runway, taxiway and apron marking compliant with ICAO Annex 14 — including threshold bars, holding positions, centrelines and guidance signs.",
    longDescription:
      "Airside marking demands zero compromise. We apply runway and taxiway markings to ICAO Annex 14 specifications using MMA and preformed thermoplastic systems engineered for jet-blast resistance, fuel spill tolerance and high retroreflectivity in all weather. Our crews are airside-operations trained and work under strict NOTAM coordination to minimise runway downtime.",
    icon: "Plane",
    benefits: [
      "ICAO Annex 14 compliant",
      "Jet-blast and fuel-spill resistant",
      "High retroreflectivity (wet & dry)",
      "MMA fast-cure for minimal downtime",
      "Airside-operations trained crews",
    ],
    materials: [
      "MMA cold plastic (Type III)",
      "Preformed thermoplastic",
      "Airport-grade glass beads",
      "Type II/III retroreflective media",
    ],
    equipment: [
      "MMA extrusion applicator",
      "Preformed thermoplastic heater",
      "Bead dispenser",
      "Airside survey equipment",
    ],
    industriesServed: ["aviation", "industrial"],
    faqs: [
      {
        question: "Do you comply with ICAO Annex 14?",
        answer:
          "Yes. All runway, taxiway and apron markings follow ICAO Annex 14 dimensions, colours and reflectivity, with Type III MMA systems for durability.",
      },
      {
        question: "How do you minimise runway downtime?",
        answer:
          "MMA cold plastic cures in 30–45 minutes, allowing markings to be applied and reopened within a single night-shift NOTAM window.",
      },
      {
        question: "Are your crews airside-trained?",
        answer:
          "Yes. All airside personnel hold valid airside driving permits and follow the airport's safety management system (SMS).",
      },
    ],
    heroHeading: "Airport Marking — ICAO Annex 14 Airside Precision",
    heroDescription:
      "Runway, taxiway and apron marking compliant with ICAO Annex 14 — jet-blast resistant MMA systems with high retroreflectivity.",
    seoTitle: "Airport Marking | Runway & Taxiway Marking ICAO Annex 14",
    seoDescription:
      "Airport marking contractors. ICAO Annex 14 compliant runway, taxiway and apron marking with MMA systems across UAE & Saudi Arabia airports.",
    process: [
      { step: 1, title: "NOTAM Plan", description: "Coordinate marking windows with airside operations." },
      { step: 2, title: "Survey", description: "Lay out markings to Annex 14 geometry." },
      { step: 3, title: "Prepare", description: "Water-blast and dry the surface." },
      { step: 4, title: "Apply MMA", description: "Extrude Type III MMA with beads." },
      { step: 5, title: "Cure & Inspect", description: "30–45 min cure, then QC reflectivity." },
    ],
    specs: [
      { label: "Standard", value: "ICAO Annex 14" },
      { label: "System", value: "MMA Type III" },
      { label: "Cure time", value: "30–45 minutes" },
      { label: "Reflectivity", value: "Type II/III wet & dry" },
    ],
  },
  {
    slug: "industrial-marking",
    name: "Industrial Marking",
    tagline: "Heavy-duty marking for factories, plants and heavy industry.",
    shortDescription:
      "Chemical and heat-resistant floor marking for factories, refineries and plants — hazard zones, equipment zones, pipe identification and safety walkways.",
    longDescription:
      "Industrial facilities demand marking that survives oil, chemicals, heat and heavy machinery. We deploy polyurea, epoxy and MMA systems rated for petrochemical plants, steel mills and manufacturing floors. Our industrial marking covers hazard delineation, equipment footprints, pedestrian safe routes, pipe and valve identification, and OSHA / HSE colour-coded safety zones.",
    icon: "Factory",
    benefits: [
      "Chemical & oil resistant",
      "Heat tolerant (up to 120°C surface)",
      "Heavy-machinery impact resistant",
      "HSE / OSHA colour compliance",
      "Pipe & valve identification",
    ],
    materials: [
      "Polyurea (high chemical resistance)",
      "Novolac epoxy (chemical resistant)",
      "MMA cold plastic",
      "Anti-slip aggregate",
      "High-temp silicone (up to 300°C)",
    ],
    equipment: [
      "Airless sprayer (high-pressure)",
      "Surface grinder",
      "Stencil system",
      "Pipe-banding applicator",
    ],
    industriesServed: ["industrial", "oil-gas", "energy", "logistics"],
    faqs: [
      {
        question: "Can marking survive oil and chemical spills?",
        answer:
          "Novolac epoxy and polyurea systems resist oils, fuels, acids and alkalis. We select the chemistry based on the specific chemicals present in your facility.",
      },
      {
        question: "Do you mark pipes and valves?",
        answer:
          "Yes. We apply colour-coded pipe banding and valve identification to ASME A13.1 / local standards for complete plant identification.",
      },
      {
        question: "Can marking tolerate high surface temperatures?",
        answer:
          "For surfaces up to 120°C we use polyurea; for higher temperatures near furnaces we apply high-temperature silicone-based marking systems.",
      },
    ],
    heroHeading: "Industrial Marking — Chemical, Heat & Impact Resistant",
    heroDescription:
      "Heavy-duty floor marking for factories and plants — polyurea and epoxy systems that survive oil, chemicals, heat and heavy machinery.",
    seoTitle: "Industrial Floor Marking | Factory & Plant Marking UAE Saudi",
    seoDescription:
      "Industrial marking contractors. Chemical and heat resistant polyurea and epoxy floor marking for factories, refineries and plants in UAE & Saudi Arabia.",
    process: [
      { step: 1, title: "Chemical Audit", description: "Identify chemicals and temperatures present." },
      { step: 2, title: "System Selection", description: "Choose polyurea, novolac epoxy or MMA." },
      { step: 3, title: "Surface Prep", description: "Grind and profile the substrate." },
      { step: 4, title: "Apply", description: "Spray or extrude the line system." },
      { step: 5, title: "Cure & Handover", description: "Cure and apply identification stencils." },
    ],
    specs: [
      { label: "Chemical resistance", value: "Oils, fuels, acids, alkalis" },
      { label: "Temp tolerance", value: "Up to 300°C (silicone)" },
      { label: "Service life", value: "3–8 years" },
      { label: "Standards", value: "OSHA / HSE / ASME A13.1" },
    ],
  },
  {
    slug: "safety-signage",
    name: "Safety Signage",
    tagline: "Visual safety systems that protect people and assets.",
    shortDescription:
      "Manufacture and install safety signage, traffic signs, hazard signs, wayfinding and regulatory signage compliant with local and ISO standards.",
    longDescription:
      "Safety signage is the silent guardian of every facility. We manufacture and install reflective traffic signs, hazard warning signs, mandatory and prohibition signs, emergency escape signage and complete wayfinding systems. All signs are produced to ISO 7010, MUTCD-Local and RTA/MOMRA standards using retroreflective sheeting and weather-resistant substrates built for Gulf UV exposure.",
    icon: "ShieldAlert",
    benefits: [
      "ISO 7010 pictogram compliance",
      "Retroreflective (Type I–IV) sheeting",
      "UV and weather resistant",
      "Custom wayfinding systems",
      "Regulatory traffic signs (RTA/MOMRA)",
    ],
    materials: [
      "Engineer-grade reflective sheeting",
      "High-intensity prismatic (Type III)",
      "Diamond-grade (Type IV)",
      "Aluminium substrate",
      "UV-stable digital print",
    ],
    equipment: [
      "Digital flatbed printer",
      "Plotter cutter",
      "Hydraulic press (sign forming)",
      "Powder-coat booth",
    ],
    industriesServed: ["industrial", "commercial", "healthcare", "aviation", "oil-gas"],
    faqs: [
      {
        question: "Are your safety signs ISO 7010 compliant?",
        answer:
          "Yes. All hazard, mandatory, prohibition and emergency signs use ISO 7010 standard pictograms with the correct colour and shape coding.",
      },
      {
        question: "What reflectivity grade do you recommend for roads?",
        answer:
          "For urban roads we recommend Type III high-intensity prismatic; for highways and high-speed roads, Type IV diamond-grade for maximum night visibility.",
      },
      {
        question: "Can you produce custom wayfinding systems?",
        answer:
          "Yes. We design and manufacture complete custom wayfinding systems including directional, identification and informational signage with your brand.",
      },
    ],
    heroHeading: "Safety Signage — ISO 7010 Compliant Visual Safety",
    heroDescription:
      "Reflective traffic signs, hazard signage and wayfinding systems manufactured to ISO 7010 with UV-stable retroreflective sheeting.",
    seoTitle: "Safety Signage | Traffic & Hazard Signs ISO 7010 UAE Saudi",
    seoDescription:
      "Safety signage manufacturers. Retroreflective traffic signs, hazard signs and wayfinding systems compliant with ISO 7010 across UAE & Saudi Arabia.",
    process: [
      { step: 1, title: "Survey", description: "Audit site for required signage and compliance gaps." },
      { step: 2, title: "Design", description: "Design signs to ISO 7010 / local standards." },
      { step: 3, title: "Manufacture", description: "Print and form on reflective aluminium." },
      { step: 4, title: "Install", description: "Install with galvanised posts or wall mounts." },
      { step: 5, title: "Inspect", description: "Verify reflectivity, height and visibility." },
    ],
    specs: [
      { label: "Standard", value: "ISO 7010 / MUTCD-Local" },
      { label: "Sheeting", value: "Type I–IV retroreflective" },
      { label: "Substrate", value: "3mm aluminium" },
      { label: "UV warranty", value: "7–10 years" },
    ],
  },
  {
    slug: "epoxy-flooring",
    name: "Epoxy Flooring",
    tagline: "Seamless, durable, decorative industrial floor systems.",
    shortDescription:
      "High-build epoxy, polyurethane and self-levelling floor systems for warehouses, factories, parking decks and commercial spaces — seamless and chemical resistant.",
    longDescription:
      "Epoxy flooring transforms concrete into a seamless, hygienic, chemical-resistant surface that lasts 10–15 years. We install self-levelling epoxy for warehouses, anti-static epoxy for electronics, polyurethane for car-park decks and decorative flake systems for showrooms. Every system includes moisture testing, surface preparation by shot-blasting, and a primer coat engineered for the substrate condition.",
    icon: "Layers",
    benefits: [
      "Seamless, hygienic, easy-clean surface",
      "10–15 year service life",
      "Chemical and stain resistant",
      "Decorative flake / metallic finishes",
      "Anti-static & conductive options",
    ],
    materials: [
      "Epoxy primer",
      "Self-levelling epoxy screed",
      "Polyurethane topcoat (UV stable)",
      "Decorative vinyl flakes",
      "Conductive carbon primer (ESD)",
    ],
    equipment: [
      "Shot-blaster (surface prep)",
      "Diamond grinder",
      "Squeegee & roller system",
      "Notched trowel / spiked roller",
    ],
    industriesServed: ["industrial", "commercial", "healthcare", "logistics"],
    faqs: [
      {
        question: "How long does epoxy flooring last?",
        answer:
          "A properly installed epoxy floor lasts 10–15 years in commercial environments and 5–10 years in heavy-industrial settings before requiring recoating.",
      },
      {
        question: "Can epoxy be installed over damp concrete?",
        answer:
          "We test moisture vapour transmission first. For damp slabs we use moisture-mitigating primers or polyurea systems that tolerate higher vapour pressure.",
      },
      {
        question: "How soon can the floor be used after installation?",
        answer:
          "Light foot traffic after 12–24 hours; light vehicle traffic after 48 hours; full chemical/heavy traffic after 7 days for full cure.",
      },
    ],
    heroHeading: "Epoxy Flooring — Seamless Industrial & Commercial Systems",
    heroDescription:
      "Self-levelling epoxy, polyurethane and decorative floor systems — seamless, chemical resistant and built for 10–15 year service life.",
    seoTitle: "Epoxy Flooring Contractors | Industrial Epoxy Floors UAE Saudi",
    seoDescription:
      "Epoxy flooring contractors. Self-levelling epoxy, polyurethane and decorative floor systems for warehouses, factories and commercial spaces in UAE & Saudi.",
    process: [
      { step: 1, title: "Moisture Test", description: "Test vapour transmission and substrate condition." },
      { step: 2, title: "Shot-Blast", description: "Profile the concrete for mechanical bond." },
      { step: 3, title: "Prime", description: "Apply epoxy primer (mitigate moisture if needed)." },
      { step: 4, title: "Screed", description: "Apply self-levelling epoxy or build coat." },
      { step: 5, title: "Topcoat", description: "Apply UV-stable polyurethane topcoat." },
    ],
    specs: [
      { label: "Thickness", value: "1.5–4.0 mm" },
      { label: "Service life", value: "10–15 years" },
      { label: "Foot traffic", value: "12–24 hours" },
      { label: "Full cure", value: "7 days" },
    ],
  },
];

// ---------------------------------------------------------------------------
// INDUSTRIES
// ---------------------------------------------------------------------------

export const industries: Industry[] = [
  {
    slug: "highways-roads",
    name: "Highways & Roads",
    description:
      "Municipal and highway-authority road marking for urban arterials, ring roads and inter-city highways.",
    icon: "Road",
    challenges: [
      "High traffic volume minimises closure windows",
      "Extreme UV degrades conventional paint",
      "Heavy HGV traffic abrades lines",
    ],
    solutions: [
      "Night-shift thermoplastic application",
      "UV-stabilised thermoplastic formulation",
      "Glass-bead retroreflectivity for night driving",
    ],
    services: ["road-marking", "thermoplastic-road-marking", "safety-signage"],
  },
  {
    slug: "commercial",
    name: "Commercial & Retail",
    description:
      "Malls, offices, hotels and retail complexes — parking, wayfinding and safety marking.",
    icon: "Building2",
    challenges: [
      "Maximising parking revenue per m²",
      "High pedestrian safety requirement",
      "Brand-consistent aesthetics",
    ],
    solutions: [
      "Bay-layout capacity optimisation",
      "Pedestrian crossing and walkway marking",
      "Colour-coded and custom-stencil branding",
    ],
    services: ["parking-lot-marking", "safety-signage", "epoxy-flooring"],
  },
  {
    slug: "industrial",
    name: "Industrial & Manufacturing",
    description:
      "Factories, plants and manufacturing floors requiring chemical and impact-resistant marking.",
    icon: "Factory",
    challenges: [
      "Forklift and machinery abrasion",
      "Chemical and oil exposure",
      "HSE compliance for traffic segregation",
    ],
    solutions: [
      "Polyurea and epoxy line systems",
      "5S visual workplace layout",
      "OSHA/HSE colour-coded hazard zones",
    ],
    services: ["warehouse-marking", "industrial-marking", "epoxy-flooring", "safety-signage"],
  },
  {
    slug: "logistics",
    name: "Logistics & Warehousing",
    description:
      "Distribution centres, cold storage and freight hubs — high-bay marking and traffic management.",
    icon: "Truck",
    challenges: [
      "24/7 operation — minimal downtime",
      "Mixed pedestrian and forklift traffic",
      "Cold-storage adhesion challenges",
    ],
    solutions: [
      "Fast-cure polyurea for minimal downtime",
      "Clearly segregated traffic lanes",
      "Cold-tolerant epoxy formulations",
    ],
    services: ["warehouse-marking", "industrial-marking", "epoxy-flooring"],
  },
  {
    slug: "aviation",
    name: "Aviation & Airports",
    description:
      "Runways, taxiways and aprons requiring ICAO Annex 14 compliant marking.",
    icon: "Plane",
    challenges: [
      "Strict ICAO Annex 14 compliance",
      "Jet-blast and fuel-spill exposure",
      "Minimal runway closure windows",
    ],
    solutions: [
      "Type III MMA marking systems",
      "Jet-blast resistant formulations",
      "Night-shift NOTAM-coordinated application",
    ],
    services: ["airport-marking", "road-marking", "safety-signage"],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas / Petrochemical",
    description:
      "Refineries, terminals and petrochemical plants — hazardous-zone marking and identification.",
    icon: "Flame",
    challenges: [
      "Hydrocarbon and chemical exposure",
      "ATEX / hazardous-zone requirements",
      "High ambient temperatures",
    ],
    solutions: [
      "Novolac epoxy and polyurea systems",
      "Pipe and valve identification (ASME A13.1)",
      "High-temperature silicone marking",
    ],
    services: ["industrial-marking", "warehouse-marking", "safety-signage"],
  },
  {
    slug: "residential",
    name: "Residential & Communities",
    description:
      "Villas, towers and gated communities — parking, speed calming and safety marking.",
    icon: "Home",
    challenges: [
      "Aesthetic requirements",
      "Pedestrian and child safety",
      "Low-noise application",
    ],
    solutions: [
      "Decorative and colour-matched lines",
      "Speed-hump and pedestrian marking",
      "Quiet daytime application windows",
    ],
    services: ["parking-lot-marking", "road-marking", "safety-signage"],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Institutional",
    description:
      "Hospitals, clinics and institutions — hygienic, accessible and wayfinding marking.",
    icon: "HeartPulse",
    challenges: [
      "Hygiene and infection control",
      "Accessibility compliance",
      "Complex wayfinding",
    ],
    solutions: [
      "Seamless epoxy floors (hygienic)",
      "Accessibility marking and signage",
      "Complete wayfinding systems",
    ],
    services: ["epoxy-flooring", "safety-signage", "parking-lot-marking"],
  },
  {
    slug: "energy",
    name: "Energy & Utilities",
    description:
      "Power plants, substations and renewable energy sites — safety and identification marking.",
    icon: "Zap",
    challenges: [
      "High-voltage safety zones",
      "Outdoor UV exposure",
      "Regulatory identification",
    ],
    solutions: [
      "OSHA colour-coded safety zones",
      "UV-stable reflective signage",
      "Equipment and hazard identification",
    ],
    services: ["industrial-marking", "safety-signage", "epoxy-flooring"],
  },
  {
    slug: "retail",
    name: "Retail & Showrooms",
    description:
      "Showrooms and retail floors — decorative epoxy and branded marking.",
    icon: "ShoppingBag",
    challenges: [
      "Premium aesthetic requirement",
      "High foot traffic",
      "Brand consistency",
    ],
    solutions: [
      "Decorative flake and metallic epoxy",
      "Custom stencilled branding",
      "High-build wear layers",
    ],
    services: ["epoxy-flooring", "parking-lot-marking", "safety-signage"],
  },
];

// ---------------------------------------------------------------------------
// PROJECTS — real-world project portfolio
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    slug: "abu-dhabi-highway-thermoplastic",
    title: "Abu Dhabi–Al Ain Highway Thermoplastic Marking",
    country: "uae",
    city: "abu-dhabi",
    service: "thermoplastic-road-marking",
    industry: "highways-roads",
    client: "Confidential Transport Authority",
    year: 2024,
    duration: "6 weeks",
    challenge:
      "Re-mark 42 km of a high-speed inter-city highway with minimal lane closures during peak pilgrimage and commuter traffic, while upgrading reflectivity to night-driving standards.",
    solution:
      "Deployed two self-propelled thermoplastic applicators operating in night-shift windows between 11pm and 5am, applying hot thermoplastic with simultaneous glass-bead dispensing across all three lanes plus hard-shoulder.",
    execution:
      "Crews pre-marked with laser guidance, water-blasted ghost lines, and applied 3.0 mm thermoplastic at 185°C. Reflectivity tested every 500 m to R3 specification. Total of 168 km of line applied.",
    materials: ["Hydrocarbon thermoplastic", "Type II glass beads", "Anti-skid aggregate"],
    equipment: ["Self-propelled applicator ×2", "Oil-jacketed kettle", "Water-blaster", "Reflectometer"],
    results: [
      { label: "Distance marked", value: "42 km" },
      { label: "Line applied", value: "168 km" },
      { label: "Night closures", value: "28 shifts" },
      { label: "Reflectivity", value: "R3 achieved" },
    ],
    gallery: [
      { alt: "Highway thermoplastic line marking at night", caption: "Night-shift application on E22" },
      { alt: "Glass bead dispenser in operation", caption: "Simultaneous bead dispensing" },
    ],
    location: "E22 Highway, Abu Dhabi – Al Ain",
    area: "42 km",
  },
  {
    slug: "dubai-mall-parking-marking",
    title: "Dubai Mega-Mall Parking Deck Marking",
    country: "uae",
    city: "dubai",
    service: "parking-lot-marking",
    industry: "commercial",
    client: "Confidential Retail Group",
    year: 2024,
    duration: "12 days",
    challenge:
      "Re-mark a 3,200-bay multi-level parking deck without closing the mall, while re-optimising the layout to increase capacity and add EV and family bays.",
    solution:
      "Phased floor-by-floor marking with black-out of ghost lines, layout re-optimisation adding 240 bays, and colour-coded zones (green family, blue disabled, amber EV, red VIP).",
    execution:
      "Surveyed and re-laid bay geometry for capacity gain, applied solvent-based acrylic paint with preformed disabled and arrow symbols, and added pedestrian walkways with anti-skip hatch.",
    materials: ["Solvent acrylic paint", "Preformed symbols", "Black-out paint", "Anti-skid hatch"],
    equipment: ["Airless line striper", "Hand-push marker", "Stencil kit", "Laser chalk line"],
    results: [
      { label: "Bays marked", value: "3,440" },
      { label: "Capacity gain", value: "+240 bays (7.5%)" },
      { label: "Levels", value: "6" },
      { label: "Mall downtime", value: "Zero" },
    ],
    gallery: [
      { alt: "Colour-coded parking bays in Dubai mall", caption: "Zone-coded parking deck" },
      { alt: "Disabled bay stencil application", caption: "Accessibility stencils" },
    ],
    location: "Sheikh Zayed Road, Dubai",
    area: "48,000 m²",
  },
  {
    slug: "riyadh-warehouse-epoxy-marking",
    title: "Riyadh Logistics Hub Warehouse Floor Marking",
    country: "saudi-arabia",
    city: "riyadh",
    service: "warehouse-marking",
    industry: "logistics",
    client: "Confidential 3PL Provider",
    year: 2024,
    duration: "3 weeks",
    challenge:
      "Mark 22,000 m² of a 24/7 logistics warehouse with forklift lanes, pedestrian walkways, and storage bays, while keeping the facility operational throughout.",
    solution:
      "Used fast-cure polyurea line systems applied in sectioned phases, with HSE-compliant colour coding: green pedestrian, amber forklift, red hazard, white storage.",
    execution:
      "Shot-blasted the concrete, applied polyurea lines curing in 90 minutes, and phased the warehouse into 12 zones so each could reopen within 2 hours of marking.",
    materials: ["Polyurea line paint", "Anti-slip aggregate", "Epoxy primer"],
    equipment: ["Shot-blaster", "Airless sprayer", "Hand-push marker"],
    results: [
      { label: "Area marked", value: "22,000 m²" },
      { label: "Downtime", value: "<2 hrs per zone" },
      { label: "Service life", value: "5+ years" },
      { label: "Zones", value: "12" },
    ],
    gallery: [
      { alt: "Warehouse floor with forklift and pedestrian lanes", caption: "HSE colour-coded layout" },
      { alt: "Polyurea line application", caption: "Fast-cure polyurea striping" },
    ],
    location: "Riyadh Logistics City",
    area: "22,000 m²",
  },
  {
    slug: "jubail-petrochemical-hazard-marking",
    title: "Jubail Petrochemical Plant Hazard Marking",
    country: "saudi-arabia",
    city: "jubail",
    service: "industrial-marking",
    industry: "oil-gas",
    client: "Confidential Petrochemical Operator",
    year: 2023,
    duration: "5 weeks",
    challenge:
      "Mark hazardous zones, pipe identification and emergency escape routes across a live petrochemical plant with hydrocarbon exposure and ATEX requirements.",
    solution:
      "Applied novolac epoxy and polyurea systems rated for hydrocarbon exposure, with ASME A13.1 pipe banding and photoluminescent emergency escape route marking.",
    execution:
      "Conducted chemical audit, ground and profiled surfaces, applied novolac epoxy in hazardous zones and polyurea in traffic areas, and installed pipe banding on 14 km of pipework.",
    materials: ["Novolac epoxy", "Polyurea", "Photoluminescent tape", "ASME A13.1 banding"],
    equipment: ["Airless sprayer", "Surface grinder", "Pipe-band applicator"],
    results: [
      { label: "Plant area", value: "18,000 m²" },
      { label: "Pipework identified", value: "14 km" },
      { label: "Escape routes", value: "2.4 km" },
      { label: "ATEX zones", value: "All compliant" },
    ],
    gallery: [
      { alt: "Petrochemical plant hazard zone marking", caption: "Novolac epoxy hazard zones" },
      { alt: "Pipe identification banding", caption: "ASME A13.1 pipe banding" },
    ],
    location: "Jubail Industrial City",
    area: "18,000 m²",
  },
  {
    slug: "dammam-airport-taxiway-marking",
    title: "Dammam Airport Taxiway Marking Upgrade",
    country: "saudi-arabia",
    city: "dammam",
    service: "airport-marking",
    industry: "aviation",
    client: "Confidential Airport Operator",
    year: 2023,
    duration: "4 weeks",
    challenge:
      "Upgrade taxiway and apron markings to ICAO Annex 14 within night-shift NOTAM windows, with jet-blast resistance and high wet-reflectivity.",
    solution:
      "Applied Type III MMA cold plastic with Type II glass beads across taxiway centrelines, holding positions and apron stand markings, all within 4-hour NOTAM windows.",
    execution:
      "Surveyed to Annex 14 geometry, water-blasted and dried surfaces, extruded MMA at night, achieving 30-minute cure and reopening within each NOTAM window.",
    materials: ["MMA Type III", "Type II glass beads", "Preformed holding-position"],
    equipment: ["MMA extrusion applicator", "Bead dispenser", "Airside survey kit"],
    results: [
      { label: "Taxiway marked", value: "6.4 km" },
      { label: "Apron stands", value: "12" },
      { label: "NOTAM windows", value: "18 nights" },
      { label: "Cure time", value: "30 min" },
    ],
    gallery: [
      { alt: "Airport taxiway centreline marking", caption: "MMA taxiway centrelines" },
      { alt: "Apron stand marking at night", caption: "Apron stand numbering" },
    ],
    location: "King Fahd International Airport, Dammam",
    area: "6.4 km taxiway",
  },
  {
    slug: "sharjah-factory-epoxy-floor",
    title: "Sharjah Manufacturing Facility Epoxy Floor",
    country: "uae",
    city: "sharjah",
    service: "epoxy-flooring",
    industry: "industrial",
    client: "Confidential Manufacturer",
    year: 2024,
    duration: "10 days",
    challenge:
      "Install a hygienic, chemical-resistant floor across a 4,500 m² manufacturing facility with minimal production downtime and strict hygiene requirements.",
    solution:
      "Installed a 3 mm self-levelling epoxy system with novolac topcoat in chemical-handling zones, phased over two weekend shutdowns.",
    execution:
      "Tested moisture vapour, shot-blasted the slab, applied epoxy primer, self-levelling screed and a UV-stable polyurethane topcoat with coved skirting for hygiene.",
    materials: ["Epoxy primer", "Self-levelling screed", "Novolac topcoat", "Polyurethane sealer"],
    equipment: ["Shot-blaster", "Diamond grinder", "Notched trowel", "Spiked roller"],
    results: [
      { label: "Area installed", value: "4,500 m²" },
      { label: "System", value: "3 mm self-levelling" },
      { label: "Downtime", value: "2 weekends" },
      { label: "Service life", value: "12–15 years" },
    ],
    gallery: [
      { alt: "Seamless epoxy factory floor", caption: "Self-levelling epoxy finish" },
      { alt: "Coved skirting detail", caption: "Hygienic coved skirting" },
    ],
    location: "Sharjah Industrial Area 12",
    area: "4,500 m²",
  },
];

// ---------------------------------------------------------------------------
// CASE STUDIES (linked to projects)
// ---------------------------------------------------------------------------

export const caseStudies: CaseStudy[] = [
  {
    slug: "abu-dhabi-highway-night-marking",
    title: "How We Marked 42 km of Highway Without Closing a Lane",
    projectSlug: "abu-dhabi-highway-thermoplastic",
    summary:
      "A night-shift thermoplastic operation that re-marked the E22 highway to R3 reflectivity with zero daytime disruption.",
    outcomes: [
      "Zero daytime lane closures across 42 km",
      "R3 night-reflectivity achieved on 100% of lines",
      "168 km of thermoplastic applied in 28 night shifts",
      "Project delivered 4 days ahead of schedule",
    ],
    testimonial: {
      quote:
        "Gulf Seismic's night-shift operation was flawless — they kept the highway open and delivered reflectivity that exceeded our spec.",
      author: "Project Director",
      role: "Transport Authority",
    },
  },
  {
    slug: "dubai-mall-capacity-optimisation",
    title: "Adding 240 Parking Bays Without Expanding the Deck",
    projectSlug: "dubai-mall-parking-marking",
    summary:
      "A layout re-optimisation that increased parking capacity by 7.5% across a 3,200-bay mega-mall deck — with zero mall downtime.",
    outcomes: [
      "+240 bays added (+7.5% capacity)",
      "Zero mall closure days",
      "6 levels marked in 12 days",
      "Colour-coded EV, family, disabled and VIP zones",
    ],
    testimonial: {
      quote:
        "We gained 240 bays of revenue-generating parking without pouring a single metre of concrete. Outstanding engineering.",
      author: "Facilities Director",
      role: "Retail Group",
    },
  },
  {
    slug: "riyadh-warehouse-zero-downtime",
    title: "Zero-Downtime Warehouse Marking for a 24/7 3PL Hub",
    projectSlug: "riyadh-warehouse-epoxy-marking",
    summary:
      "Polyurea line systems and phased zoning kept a 22,000 m² logistics hub fully operational during a complete floor-marking overhaul.",
    outcomes: [
      "22,000 m² marked with <2 hr downtime per zone",
      "HSE-compliant colour coding across 12 zones",
      "Polyurea system rated for 5+ year service life",
      "Zero safety incidents during application",
    ],
    testimonial: {
      quote:
        "Our operation never stopped. That is the definition of a professional marking contractor.",
      author: "Operations Manager",
      role: "3PL Provider",
    },
  },
];

// ---------------------------------------------------------------------------
// BLOG / RESOURCES
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  {
    slug: "thermoplastic-vs-cold-paint-road-marking",
    title: "Thermoplastic vs Cold Paint Road Marking: Which Lasts Longer in the Gulf?",
    excerpt:
      "A technical comparison of thermoplastic and cold paint systems under UAE and Saudi climate conditions — durability, cost and reflectivity.",
    category: "Technical Guide",
    readTime: "6 min read",
    date: "2024-11-12",
    author: "Gulf Seismic Technical Team",
  },
  {
    slug: "parking-lot-capacity-optimisation",
    title: "How Bay Layout Optimisation Can Add 15% More Parking",
    excerpt:
      "The geometry, aisle width and angle strategies that maximise parking capacity without expanding the deck.",
    category: "Commercial",
    readTime: "5 min read",
    date: "2024-11-05",
    author: "Gulf Seismic Design Team",
  },
  {
    slug: "warehouse-5s-floor-marking-guide",
    title: "The Complete 5S Warehouse Floor Marking Guide",
    excerpt:
      "Colour codes, lane widths and zone strategies for an HSE-compliant and 5S-optimised warehouse floor.",
    category: "Industrial Guide",
    readTime: "8 min read",
    date: "2024-10-28",
    author: "Gulf Seismic Industrial Team",
  },
  {
    slug: "icao-annex-14-airport-marking-explained",
    title: "ICAO Annex 14 Airport Marking: A Contractor's Field Guide",
    excerpt:
      "Runway, taxiway and apron marking requirements explained — dimensions, colours, reflectivity and materials.",
    category: "Aviation",
    readTime: "7 min read",
    date: "2024-10-20",
    author: "Gulf Seismic Aviation Team",
  },
  {
    slug: "epoxy-vs-polyurea-industrial-floors",
    title: "Epoxy vs Polyurea: Choosing the Right Industrial Floor System",
    excerpt:
      "Chemical resistance, cure time and service life compared — how to specify the right system for your facility.",
    category: "Technical Guide",
    readTime: "6 min read",
    date: "2024-10-12",
    author: "Gulf Seismic Technical Team",
  },
  {
    slug: "saudi-vision-2030-road-marking-opportunities",
    title: "Saudi Vision 2030: Road Marking Opportunities Across the Kingdom",
    excerpt:
      "How megaprojects, NEOM and urban expansion are driving demand for marking contractors in Saudi Arabia.",
    category: "Market Insight",
    readTime: "5 min read",
    date: "2024-10-04",
    author: "Gulf Seismic Strategy Team",
  },
];

// ---------------------------------------------------------------------------
// COMPANY / ORG DATA
// ---------------------------------------------------------------------------

export const company = {
  name: "Gulf Seismic",
  legalName: "Gulf Seismic General Contracting L.L.C.",
  parentCompany: "FAST and Safe Trading LLC (est. 2013, Dubai)",
  jvPartner: "Seismic Contracting Company LLC (KSA)",
  tagline: "Precision. Safety. Quality.",
  description:
    "Gulf Seismic General Contracting L.L.C. is a leading road marking service provider based in Abu Dhabi, UAE, with operations across Saudi Arabia through Seismic Contracting Company LLC. We specialize in delivering high-quality, durable, and compliant road marking solutions for roads, highways, parking areas, airports, and industrial facilities — using advanced machinery, premium materials, and a skilled workforce to meet international standards and local regulations.",
  url: "https://gulfseismic.com",
  cmsUrl: "https://cms.gulfseismic.com",
  frontendUrl: "https://gulf-seismic.vercel.app",
  graphqlEndpoint: "https://cms.gulfseismic.com/graphql",
  email: "roadmarking@gulfseismic.com",
  emailSecondary: "admin@gulfseismic.com",
  phone: "+971 2 555 5769",
  phoneSecondary: "+971 54 997 0833",
  phoneTertiary: "+971 54 447 2908",
  whatsapp: "971549970833",
  ksaPhone: "+966 507 657 243",
  ksaEmail: "ahmed@seismiccoltd.com",
  ksaAddress: "Office #405, 4th Floor, Old NCB Bank Building, Cross #18, Prince Thamar Street, King Abdulaziz Road, Al Khobar 31952, Saudi Arabia",
  founded: 2018,
  headquarters: {
    country: "uae",
    city: "Abu Dhabi",
    address: "P.O. Box 93187, Abu Dhabi, United Arab Emirates",
  },
  stats: [
    { label: "UAE + KSA Coverage", value: "2" },
    { label: "Years of Experience", value: "7+" },
    { label: "Services", value: "12+" },
    { label: "Industry Clients", value: "15+" },
  ],
  certifications: [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "ISO 45001:2018",
    "OSHA Compliance",
    "HABC Fire Safety",
    "IOSH Managing Safety",
    "Abu Dhabi Municipality Approval",
    "ADNOC Approved Vendor",
    "Aramco Approved Supplier",
    "Saber Certificate",
    "NCEC Certificate",
    "Saudi Contractors Authority (SCA) Registration",
    "ZATCA Registration",
    "Chamber of Commerce Membership",
    "Saudi Made Certificate",
    "National Safety Council (NSC) Membership",
  ],
  approvals: [
    "Abu Dhabi Municipality — Approved Road Marking Contractor",
    "ADNOC — Approved Vendor (ADNOC & Group Companies)",
    "Aramco — Approved Supplier (Aramco & Group Companies)",
    "Saber Certificate — Product Conformity",
    "NCEC Certificate — Conformity Assessment",
  ],
  social: {
    linkedin: "https://www.linkedin.com/company/gulf-seismic",
    instagram: "https://www.instagram.com/gulfseismic",
    facebook: "https://www.facebook.com/profile.php?id=100069905453894",
  },
};

// Real materials from company profile
export const materials = [
  { name: "Heavy Duty Cat Eye", description: "High visibility and heavy duty cat eyes for long lasting performance.", icon: "Eye" },
  { name: "RPM Reflective Tag", description: "Raised pavement markers with reflective face for enhanced visibility.", icon: "Circle" },
  { name: "Fixing Material", description: "High-quality fixing materials for secure and durable installation.", icon: "Wrench" },
  { name: "Uni-Direction Stud", description: "Channels traffic in one direction with enhanced safety.", icon: "ArrowRight" },
  { name: "Prismatic Cat Eye", description: "Prismatic reflectors for superior brightness and long visibility.", icon: "Eye" },
  { name: "Epoxy", description: "High performance epoxy for road studs and marker installation.", icon: "Layers" },
  { name: "Bi-Direction Stud", description: "Provides visibility from both directions for maximum safety.", icon: "ArrowLeftRight" },
  { name: "Glass Beads", description: "Premium quality glass beads for better retro-reflectivity.", icon: "Circle" },
  { name: "Chem Button", description: "Chemical road studs for strong adhesion and long life.", icon: "Circle" },
  { name: "EBond Epoxy (A+B)", description: "High strength epoxy adhesive for permanent bonding and durability.", icon: "Layers" },
  { name: "MMA Road Marking", description: "High durability MMA road marking for long lasting lines.", icon: "Flame" },
  { name: "Moveable Crash Barriers", description: "Temporary crash barriers for road safety and traffic management.", icon: "ShieldAlert" },
  { name: "Barriers", description: "Plastic and concrete barriers for safety and site protection.", icon: "ShieldAlert" },
  { name: "Sandblasting", description: "Surface preparation by sandblasting for better adhesion.", icon: "Wind" },
  { name: "Safety Sign Board", description: "Reflective safety sign boards for traffic control and guidance.", icon: "ShieldAlert" },
  { name: "Euro Barriers", description: "Durable euro barriers for road and site safety.", icon: "ShieldAlert" },
  { name: "Ceramic Studs", description: "High-quality ceramic studs for superior visibility and life.", icon: "Circle" },
  { name: "Reflective Studs", description: "Reflective studs for better night-time visibility.", icon: "Circle" },
  { name: "Milling Removal Asphalt", description: "Efficient removal of old markings and asphalt surfaces.", icon: "Trash2" },
];

// Real machinery/equipment from company profile
export const equipment = [
  { name: "Thermoplastic Road Marking Machine", description: "High-performance thermoplastic road marking machines for durable and precisely applied markings." },
  { name: "Cold Paint Road Marking Machine", description: "Efficient cold paint marking machines ideal for temporary and short-term line applications." },
  { name: "Pre-Marking Machine", description: "Ensures accurate layout and alignment before marking for perfect results every time." },
  { name: "Glass Bead Dispenser", description: "Precision glass bead dispensers for enhanced retro-reflectivity and road safety." },
  { name: "Road Sweeper", description: "Powerful sweepers ensure clean surfaces for better adhesion and marking quality." },
  { name: "Arrow Board Truck", description: "Mobile arrow board systems for safe traffic management and work zone protection." },
  { name: "Line Removal Machine", description: "Specialized machines for safe and efficient removal of old road markings." },
  { name: "High Pressure Washer", description: "High-pressure washers for surface cleaning and preparation before marking." },
  { name: "Retro-Reflectometer", description: "Advanced reflectometers to measure visibility and ensure quality compliance." },
];

// Real clients from company profile
export const clients = [
  { name: "Citiscape", type: "Landscaping & Road Marking" },
  { name: "Al Asab Est.", type: "Gen. Transport & Contracting" },
  { name: "TechnicalCore", type: "General Contracting L.L.C." },
  { name: "TCC (Al Kamal)", type: "General Contracting" },
  { name: "ISGC", type: "Inventive Strategy General Contracting" },
  { name: "Department of Transport (DoT)", type: "Government — Abu Dhabi" },
  { name: "China State Construction (CSCEC)", type: "International Construction" },
  { name: "NCC", type: "Nael Construction & Contracting" },
  { name: "Bin Hafeez Gen. Cont. L.L.C.", type: "General Contracting" },
  { name: "Yas Marina Circuit", type: "Motorsport & Events" },
  { name: "ADNOC Drilling", type: "Oil & Gas — ADNOC Group" },
  { name: "FSDECO", type: "Field Services & Drilling Equipment Co." },
  { name: "Transatlas", type: "Construction & Contracting" },
  { name: "SpeedOne", type: "General Maintenance" },
  { name: "ADNOC Distribution", type: "Oil & Gas — ADNOC Group" },
];

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export const getCountry = (slug: CountrySlug) => countries.find((c) => c.slug === slug);
export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getCaseStudy = (slug: string) => caseStudies.find((cs) => cs.slug === slug);

export const getCitiesByCountry = (country: CountrySlug) =>
  cities.filter((c) => c.country === country);

export const getServicesByIndustry = (industrySlug: string) =>
  services.filter((s) => s.industriesServed.includes(industrySlug));

export const getProjectsByCity = (citySlug: string) =>
  projects.filter((p) => p.city === citySlug);

export const getProjectsByService = (serviceSlug: string) =>
  projects.filter((p) => p.service === serviceSlug);

export const getProjectsByCountry = (country: CountrySlug) =>
  projects.filter((p) => p.country === country);

/**
 * Generate the full list of 128 commercial service-city page combinations.
 * Each entry produces a unique programmatic SEO URL:
 *   /uae/abu-dhabi/road-marking  ... /saudi-arabia/madinah/epoxy-flooring
 */
export interface ServiceCityPage {
  country: CountrySlug;
  countryName: string;
  citySlug: string;
  cityName: string;
  serviceSlug: string;
  serviceName: string;
  path: string;
}

export const getServiceCityPages = (): ServiceCityPage[] => {
  const pages: ServiceCityPage[] = [];
  for (const country of countries) {
    for (const city of getCitiesByCountry(country.slug)) {
      for (const service of services) {
        pages.push({
          country: country.slug,
          countryName: country.name,
          citySlug: city.slug,
          cityName: city.name,
          serviceSlug: service.slug,
          serviceName: service.name,
          path: `/${country.slug}/${city.slug}/${service.slug}`,
        });
      }
    }
  }
  return pages;
};

export const TOTAL_PROGRAMMATIC_PAGES = getServiceCityPages().length; // 128
