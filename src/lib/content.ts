import type { Lang } from "@/lib/store";

/**
 * Gulf Seismic — content layer.
 * Single source of truth for every view. Bilingual EN / AR.
 *
 * COMPLIANCE (per SKILL.md Phase 0 gate):
 * - No invented Saudi CR, MISA, Etimad, Saudi office, Saudi staff, Saudi clients or projects.
 * - Saudi Presence page describes a market-access EXECUTION PLAN, not claimed presence.
 * - Case studies are clearly labelled "Capability Example" until verified.
 * - Standards resources cite source/jurisdiction and a reviewer disclaimer.
 */

export interface Faq {
  q: string;
  a: string;
}
export interface ServicePage {
  slug: string;
  icon: string; // lucide name
  image: string;
  navLabel: string;
  title: string;
  h1: string;
  intro: string;
  directAnswer: string;
  problem: string[];
  selection: string[];
  methodology: string[];
  qaqc: string[];
  procurement: string[];
  faqs: Faq[];
}
export interface Industry {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  bullets: string[];
}
export interface CaseStudy {
  slug: string;
  category: "capability-example" | "verified-project";
  title: string;
  clientType: string;
  location: string;
  challenge: string;
  scope: string;
  solution: string;
  materials: string;
  equipment: string;
  result: string;
  image: string;
}
export interface Resource {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  type: string; // checklist / matrix / guide
  source: string;
  jurisdiction: string;
  reviewer: string;
  disclaimer: string;
  items: string[];
}

export interface Content {
  dir: "ltr" | "rtl";
  brand: { name: string; tagline: string };
  nav: { id: string; label: string }[];
  navGroups: { label: string; items: { id: string; label: string; sub?: { slug: string; label: string }[] }[] }[];
  cta: {
    rfq: string;
    callback: string;
    whatsapp: string;
    phone: string;
    download: string;
    consult: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    addressLine: string;
    sla: string;
  };
  footer: {
    about: string;
    columns: { title: string; links: { label: string; id?: string; slug?: string }[] }[];
    legal: string;
    note: string;
  };
  home: {
    badge: string;
    h1: string;
    sub: string;
    heroPoints: string[];
    trustStrip: string[];
    servicesTitle: string;
    servicesSub: string;
    whyTitle: string;
    whySub: string;
    whyCards: { icon: string; title: string; body: string }[];
    processTitle: string;
    processSub: string;
    process: { step: string; title: string; body: string }[];
    proofTitle: string;
    proofSub: string;
    saudiTitle: string;
    saudiSub: string;
    saudiPoints: string[];
    rfqTitle: string;
    rfqSub: string;
    faqTitle: string;
    faqs: Faq[];
  };
  services: ServicePage[];
  servicesHub: { h1: string; sub: string };
  industries: { h1: string; sub: string; items: Industry[] };
  projects: { h1: string; sub: string };
  caseStudies: { h1: string; sub: string; disclaimer: string; items: CaseStudy[] };
  resources: { h1: string; sub: string; items: Resource[] };
  saudiPresence: {
    h1: string;
    sub: string;
    intro: string;
    gateTitle: string;
    gateIntro: string;
    gate: { item: string; status: string }[];
    planTitle: string;
    plan: { phase: string; title: string; body: string }[];
    routeTitle: string;
    routes: { name: string; body: string }[];
    faqs: Faq[];
  };
  saudiMobilization: {
    h1: string;
    sub: string;
    intro: string;
    steps: { title: string; body: string }[];
    partners: string[];
    faqs: Faq[];
  };
  gcc: {
    h1: string;
    sub: string;
    intro: string;
    countries: { name: string; code: string; note: string }[];
    faqs: Faq[];
  };
  about: {
    h1: string;
    sub: string;
    story: string[];
    values: { icon: string; title: string; body: string }[];
    capabilities: string[];
    compliance: string[];
  };
  contactRfq: {
    h1: string;
    sub: string;
    formTitle: string;
    fields: Record<string, string>;
    options: {
      clientType: string[];
      service: string[];
      procurementStage: string[];
      saudiRoute: string[];
      preferredContact: string[];
    };
    assistantTitle: string;
    assistantSub: string;
    analyzerTitle: string;
    analyzerSub: string;
    gradesTitle: string;
    grades: { grade: string; label: string; body: string }[];
    slaTitle: string;
    slaBody: string;
  };
}

const en: Content = {
  dir: "ltr",
  brand: {
    name: "Gulf Seismic",
    tagline: "Road Marking & Infrastructure Contracting — Saudi Arabia & GCC",
  },
  nav: [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "industries", label: "Industries" },
    { id: "projects", label: "Projects" },
    { id: "case-studies", label: "Case Studies" },
    { id: "resources", label: "Technical Resources" },
    { id: "saudi-presence", label: "Saudi Presence" },
    { id: "gcc", label: "GCC" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact & RFQ" },
  ],
  navGroups: [
    {
      label: "Company",
      items: [
        { id: "about", label: "About" },
        { id: "projects", label: "Projects" },
        { id: "case-studies", label: "Case Studies" },
      ],
    },
    {
      label: "Capabilities",
      items: [
        {
          id: "services",
          label: "Services",
          sub: [
            { slug: "road-marking", label: "Road & Highway Marking" },
            { slug: "thermoplastic", label: "Thermoplastic Road Marking" },
            { slug: "airport-runway", label: "Airport & Runway Marking" },
            { slug: "parking-marking", label: "Parking Marking" },
            { slug: "road-studs", label: "Road Studs & RPMs" },
            { slug: "industrial-safety", label: "Industrial Safety Marking" },
            { slug: "line-removal", label: "Line Removal & Remarking" },
          ],
        },
        { id: "industries", label: "Industries" },
        { id: "resources", label: "Technical Resources" },
      ],
    },
    {
      label: "Saudi & GCC",
      items: [
        { id: "saudi-presence", label: "Saudi Presence" },
        { id: "saudi-mobilization", label: "Saudi Subcontracting & Mobilization" },
        { id: "gcc", label: "GCC Coverage" },
      ],
    },
  ],
  cta: {
    rfq: "Request a Technical RFQ",
    callback: "Request Call Back",
    whatsapp: "WhatsApp a Project Brief",
    phone: "Call Us",
    download: "Download Capability Statement",
    consult: "Book a Technical Consultation",
  },
  contact: {
    email: "roadmarking@gulfseismic.com",
    phone: "+971 2 555 5769",
    phoneAlt: "+971 54 997 0833",
    whatsapp: "+971 54 447 2908",
    addressLine: "Abu Dhabi, United Arab Emirates",
    sla: "A-grade RFQs receive a technical response within one working day.",
  },
  footer: {
    about:
      "Gulf Seismic General Contracting LLC is a specialist road marking and infrastructure contractor headquartered in Abu Dhabi, UAE, executing a structured Saudi Arabia and GCC market-access programme.",
    columns: [
      {
        title: "Services",
        links: [
          { slug: "road-marking", label: "Road & Highway Marking" },
          { slug: "thermoplastic", label: "Thermoplastic Marking" },
          { slug: "airport-runway", label: "Airport & Runway Marking" },
          { slug: "parking-marking", label: "Parking Marking" },
          { slug: "road-studs", label: "Road Studs & RPMs" },
          { slug: "industrial-safety", label: "Industrial Safety Marking" },
          { slug: "line-removal", label: "Line Removal & Remarking" },
        ],
      },
      {
        title: "Saudi & GCC",
        links: [
          { id: "saudi-presence", label: "Saudi Presence" },
          { id: "saudi-mobilization", label: "Subcontracting & Mobilization" },
          { id: "gcc", label: "GCC Coverage" },
        ],
      },
      {
        title: "Company",
        links: [
          { id: "about", label: "About" },
          { id: "projects", label: "Projects" },
          { id: "case-studies", label: "Case Studies" },
          { id: "resources", label: "Technical Resources" },
          { id: "contact", label: "Contact & RFQ" },
        ],
      },
    ],
    legal: "© Gulf Seismic General Contracting LLC. All rights reserved.",
    note: "Market-access status, registrations and certifications are presented only where verified. Unverified items are described as planned or project-specific.",
  },
  home: {
    badge: "UAE-headquartered • Saudi & GCC market-access programme",
    h1: "Specialist road marking & infrastructure marking for Saudi Arabia and the GCC",
    sub: "Thermoplastic road marking, airport and runway marking, road studs, industrial safety marking and line removal — executed to specification, with method statements, ITPs and a procurement-ready RFQ process.",
    heroPoints: [
      "Scope reviewed before pricing",
      "Method statements & ITPs on every package",
      "Crew, equipment and materials proof",
      "Procurement-ready RFQ response",
    ],
    trustStrip: [
      "Thermoplastic & cold plastic marking",
      "Airport & runway marking",
      "Road studs & raised pavement markers",
      "Industrial safety marking",
      "Line removal & remarking",
      "Inspection, rectification & handover",
    ],
    servicesTitle: "Commercial services",
    servicesSub: "Specialist marking disciplines built around buyer, procurement and technical intent — not generic contractor volume.",
    whyTitle: "Why procurement teams choose Gulf Seismic",
    whySub: "Technical trust is built on scope review, method, proof and a transparent operating model — not claims.",
    whyCards: [
      { icon: "ClipboardCheck", title: "Scope reviewed before pricing", body: "We review drawings, specifications and site conditions before quoting — so the price you receive reflects the real scope, materials and programme." },
      { icon: "FileCheck2", title: "Method statements & ITPs", body: "Every package is supported by a method statement and an Inspection and Test Plan (ITP), aligned to the specified standard and the client's quality requirements." },
      { icon: "HardHat", title: "Crew, equipment & materials proof", body: "We provide equipment lists, crew composition, material datasheets and approvals — evidence you can submit to consultants and principals." },
      { icon: "ShieldCheck", title: "Safety, traffic & access controls", body: "Traffic management, lane closures, access permits and HSE controls are planned into the programme, not bolted on after." },
      { icon: "Search", title: "Inspection, rectification & handover", body: "Line thickness, retroreflectivity, adhesion and dimensional checks are documented. Defects are rectified before handover." },
      { icon: "RefreshCw", title: "Maintenance & lifecycle options", body: "We advise on lifecycle cost — thermoplastic vs cold plastic, reapplication cycles and maintenance regimes — so the right system is specified." },
    ],
    processTitle: "How a Gulf Seismic package is delivered",
    processSub: "A controlled, auditable sequence from RFQ to handover.",
    process: [
      { step: "01", title: "RFQ & scope review", body: "We receive your RFQ, drawings and specification, then review scope, surface, quantities, programme and access before any pricing." },
      { step: "02", title: "Technical proposal", body: "You receive a technical proposal: system selection, method statement, ITP, materials, equipment, crew, programme and price." },
      { step: "03", title: "Mobilization", body: "Materials are approved, equipment and crew are mobilized, traffic management and HSE controls are established on site." },
      { step: "04", title: "Execution & QA/QC", body: "Marking is applied to the approved method; thickness, retroreflectivity, adhesion and dimensions are inspected and recorded." },
      { step: "05", title: "Rectification & handover", body: "Defects are rectified, as-built records and inspection reports are issued, and the package is handed over with maintenance guidance." },
    ],
    proofTitle: "Proof over claims",
    proofSub: "Where project data is not yet verified, we present capability examples — not fabricated case studies.",
    saudiTitle: "A structured Saudi market-access programme",
    saudiSub: "Compliance and operating route come before large Saudi investment. We do not imply registrations, offices or projects we do not hold.",
    saudiPoints: [
      "Market-access execution plan: CR, MISA, Saudi Contractors Authority, Etimad",
      "Partner-led and project-specific delivery routes, where commercially justified",
      "Qualified opportunities converted through a real RFQ and CRM process",
      "No invented Saudi presence, clients or approvals — ever",
    ],
    rfqTitle: "Request a technical RFQ",
    rfqSub: "Upload drawings and specifications. Receive a scope-reviewed technical response, not a generic quote.",
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "Are you a Saudi-registered company?", a: "Gulf Seismic General Contracting LLC is headquartered in Abu Dhabi, UAE. Our Saudi market-access programme is described transparently on the Saudi Presence page, including which registrations are planned, in progress or complete. We do not imply status we have not achieved." },
      { q: "Do you provide method statements and ITPs?", a: "Yes. Every commercial package is supported by a method statement and an Inspection and Test Plan aligned to the specified standard and the client's quality requirements." },
      { q: "Can you mobilize for Saudi projects?", a: "Where a Saudi operating route is commercially justified we deliver through partner-led or project-specific routes. See Saudi Subcontracting & Mobilization for the mobilization sequence and dependencies." },
      { q: "What information do you need to quote?", a: "Drawings, specifications, quantities, surface type and condition, programme, access constraints and procurement stage. The RFQ form captures all of this and supports drawing/specification uploads." },
      { q: "How quickly do you respond?", a: "A-grade RFQs — active project, decision-maker, drawings/specification and a real deadline — receive a technical response within one working day." },
    ],
  },
  servicesHub: {
    h1: "Commercial marking services",
    sub: "Each service page is built around search, buyer and procurement intent — with technical scope, methodology, QA/QC and an RFQ route.",
  },
  services: [
    {
      slug: "road-marking",
      icon: "Route",
      image: "/images/hero-highway.jpg",
      navLabel: "Road & Highway Marking",
      title: "Road & Highway Marking",
      h1: "Road & highway marking contractor for Saudi Arabia and the GCC",
      intro: "Permanent, retroreflective line marking for highways, urban roads and interchanges — applied to specification, with documented thickness, adhesion and dimensional control.",
      directAnswer: "Gulf Seismic applies hot thermoplastic and cold plastic road markings to highways and urban roads, with method statements, ITPs and documented QA/QC, for Saudi Arabia and GCC projects where the operating route is commercially justified.",
      problem: [
        "Road markings that lose retroreflectivity within months of opening, creating night-time and wet-weather safety risk.",
        "Lines applied without surface preparation or primer, leading to adhesion failure and early delamination.",
        "Packages priced without scope review, so quantities, surface condition and access constraints are not reflected in the price.",
        "Inspection records missing at handover, delaying acceptance and payment.",
      ],
      selection: [
        "Thermoplastic (hot-applied) for high-volume highways — durability and embedded reflective beads.",
        "Cold plastic (2K methyl methacrylate) for areas requiring fast cure, colour stability or thin-film applications.",
        "Solvent / waterborne paint for temporary marking, detours or low-volume roads.",
        "Preformed thermoplastic for symbols, legends and short-run special markings.",
      ],
      methodology: [
        "Surface survey: cleanliness, moisture, temperature, existing marking condition and asphalt age.",
        "Line removal or scarification where existing markings conflict.",
        "Primer application where specified or where surface conditions require it.",
        "Hot thermoplastic applied at controlled temperature (typically 180–220°C) with simultaneous glass-bead dispensing.",
        "Dimensional control: line width, offset, spacing and radius set out from approved drawings.",
        "In-process checks: thickness, bead embedment, adhesion and appearance.",
        "Traffic management and curing time before reopening to traffic.",
      ],
      qaqc: [
        "Material datasheets and approvals submitted before application.",
        "Wet-film / dry-film thickness measured and recorded.",
        "Retroreflectivity (RL) measured with a reflectometer at representative locations.",
        "Adhesion tested per the specified method.",
        "Dimensional tolerance checked against approved drawings.",
        "Non-conformances rectified before handover; as-built and inspection records issued.",
      ],
      procurement: [
        "Provide approved drawings, specifications and the governing standard.",
        "Confirm quantities, surface type and condition, and access constraints.",
        "State programme, lane-closure windows and traffic management responsibility.",
        "Confirm acceptance criteria: thickness, retroreflectivity, adhesion, dimensions.",
        "Identify the inspection authority and required documentation.",
      ],
      faqs: [
        { q: "What standard do you apply road markings to?", a: "We apply to the client's specified standard. Where the client does not specify, we reference recognized road-marking standards and confirm the governing document in the method statement. Standards content is cited with source, version and jurisdiction on the Technical Resources pages." },
        { q: "Do you supply materials and equipment?", a: "Yes. We supply thermoplastic material, glass beads, primer, application equipment and crew. Material datasheets and equipment lists are provided with the technical proposal." },
        { q: "Can you work at night?", a: "Yes — night work and lane closures are planned into the traffic management plan where required by the programme or road authority." },
      ],
    },
    {
      slug: "thermoplastic",
      icon: "Flame",
      image: "/images/thermoplastic-application.jpg",
      navLabel: "Thermoplastic Road Marking",
      title: "Thermoplastic Road Marking",
      h1: "Thermoplastic road marking services in Saudi Arabia and the GCC",
      intro: "Hot-applied thermoplastic with reflective glass beads — the durable, high-retroreflectivity system for highways, intersections and high-wear locations.",
      directAnswer: "Thermoplastic road marking is a hot-applied (≈180–220°C) material with embedded reflective glass beads, delivering high durability and night-time visibility for high-traffic roads. Gulf Seismic applies it with controlled temperature, thickness and bead embedment, documented through an ITP.",
      problem: [
        "Thermoplastic applied outside temperature range, causing poor adhesion and bubbling.",
        "Glass beads not properly embedded — beads roll off under traffic and retroreflectivity collapses.",
        "Insufficient film thickness, reducing service life below specification.",
        "Surface contamination and moisture not addressed, causing delamination.",
      ],
      selection: [
        "Type I / II / III thermoplastic per the specified standard and traffic volume.",
        "Drop-on glass beads: refractive index and gradation per specification.",
        "Primer / tack coat for concrete or aged asphalt surfaces.",
        "Preformed thermoplastic for symbols, stop bars and special markings.",
      ],
      methodology: [
        "Surface preparation: cleaning, drying, removal of loose material and conflicting markings.",
        "Material heated in a controlled kettle to the manufacturer's application temperature.",
        "Application by screed or spray extrusion equipment to the specified thickness.",
        "Drop-on glass beads applied at the correct rate and embedment while the material is molten.",
        "Line geometry controlled from approved set-out; intersections and symbols set out separately.",
        "Cure time and no-track confirmation before reopening to traffic.",
      ],
      qaqc: [
        "Material temperature logged at the kettle and at application.",
        "Dry-film thickness measured and recorded against specification.",
        "Bead embedment and rate verified visually and by sample.",
        "Retroreflectivity measured with a reflectometer.",
        "Adhesion and appearance inspected; non-conformances rectified.",
      ],
      procurement: [
        "Confirm thermoplastic type, glass-bead specification and primer requirement.",
        "Provide quantities, line types and the approved drawing set.",
        "State surface type and condition, and any existing markings to be removed.",
        "Confirm programme, lane-closure windows and acceptance criteria.",
      ],
      faqs: [
        { q: "How long does thermoplastic road marking last?", a: "Service life depends on traffic volume, surface condition, material type and climate. Under typical highway conditions a correctly applied thermoplastic line can deliver several years of service; we advise on expected life for your specific site once scope is reviewed." },
        { q: "Thermoplastic vs cold plastic — which should I specify?", a: "Thermoplastic is preferred for high-volume highways for durability and bead retention. Cold plastic (MMA) suits areas needing fast cure, thin film, colour stability or chemical resistance. The Technical Resources page includes a selection matrix." },
        { q: "Do you measure retroreflectivity?", a: "Yes. Retroreflectivity is measured with a reflectometer at representative locations and recorded in the inspection documentation." },
      ],
    },
    {
      slug: "airport-runway",
      icon: "Plane",
      image: "/images/airport-runway-marking.jpg",
      navLabel: "Airport & Runway Marking",
      title: "Airport & Runway Marking",
      h1: "Airport and runway marking for Saudi Arabia and GCC airports",
      intro: "Precision airfield marking — runway centreline, threshold, touchdown zone, taxiway and apron markings — applied to aviation standards with strict dimensional and material control.",
      directAnswer: "Airport marking requires precision geometry, aviation-approved materials and documented QA/QC. Gulf Seismic applies runway, taxiway and apron markings with method statements and ITPs aligned to the governing aviation standard, for projects where the operating route is commercially justified.",
      problem: [
        "Runway markings with poor retroreflectivity in low-visibility and wet conditions.",
        "Dimensional errors on threshold and touchdown-zone markings, causing survey rejection.",
        "Materials not aviation-approved, risking non-conformance and rework.",
        "Work sequenced without coordination with airside operations, causing downtime.",
      ],
      selection: [
        "Aviation-approved marking materials (typically MMA / solvent paint per the airport standard).",
        "Type I / Type III glass beads per aviation bead specification.",
        "Removal of rubber deposits and old markings prior to application.",
        "Preformed thermoplastic for some apron and stand markings where permitted.",
      ],
      methodology: [
        "Airside coordination: works windows, NOTAMs, access and escort requirements.",
        "Surface preparation: rubber removal, cleaning, drying, existing marking removal.",
        "Set-out survey for runway centreline, threshold, touchdown zone, aiming point and taxiway markings.",
        "Application of paint and reflective media under controlled conditions.",
        "In-process and final inspection against the approved standard.",
        "Restoration of pavement to operational condition before handback.",
      ],
      qaqc: [
        "Material approvals and certificates of conformity submitted.",
        "Dimensional tolerance verified by survey.",
        "Dry-film thickness, colour and retroreflectivity measured and recorded.",
        "Adhesion and resistance to aviation fuels and oils confirmed per specification.",
        "Inspection records and as-built documentation issued for survey acceptance.",
      ],
      procurement: [
        "Provide the airport standard and any project-specific specification.",
        "Confirm airside access, works windows and escort/permit requirements.",
        "Provide the approved set-out drawings and survey requirements.",
        "State acceptance authority and required documentation.",
      ],
      faqs: [
        { q: "Can you work during airport operational hours?", a: "Airside work is sequenced within approved works windows, typically night closures, with NOTAMs and escort coordination. The exact sequence is agreed with airport operations in the method statement." },
        { q: "What materials do you use on runways?", a: "Aviation-approved materials per the airport standard — commonly MMA or solvent paint with aviation glass beads. We do not substitute materials; approvals and certificates of conformity are submitted before application." },
        { q: "Do you remove rubber deposits?", a: "Yes. Rubber removal and existing-marking removal are part of the surface preparation sequence where required." },
      ],
    },
    {
      slug: "parking-marking",
      icon: "ParkingSquare",
      image: "/images/parking-marking.jpg",
      navLabel: "Parking Marking",
      title: "Parking Marking",
      h1: "Parking lot and car-park marking services",
      intro: "Crisp, durable parking-bay marking — standard bays, disabled bays, parent-and-child, EV charging, directional arrows and pedestrian walkways — for retail, commercial, residential and municipal car parks.",
      directAnswer: "Parking marking covers bay lines, symbols, arrows, disabled and EV bays, and pedestrian routes. Gulf Seismic applies thermoplastic, cold plastic or paint systems selected for the surface, traffic and durability required, with documented layout control.",
      problem: [
        "Bay layouts that do not meet dimensional or accessibility codes.",
        "Markings that fail on polished concrete or poorly prepared asphalt.",
        "Inconsistent symbols and arrows across a multi-zone car park.",
        "Pedestrian routes not separated from vehicle lanes, creating safety risk.",
      ],
      selection: [
        "Thermoplastic for high-turnover outdoor car parks.",
        "Cold plastic / MMA for indoor and polished-concrete decks.",
        "Epoxy or polyurea for high-wear and chemical-exposure zones.",
        "Preformed symbols for disabled, EV, parent-and-child and directional markings.",
      ],
      methodology: [
        "Layout set-out from approved drawings, confirming bay count and dimensions.",
        "Surface preparation appropriate to substrate (asphalt or concrete).",
        "Line application with controlled geometry and width.",
        "Symbol and arrow application using preformed or screeded thermoplastic.",
        "Colour coding for zones, pedestrian routes and accessibility bays.",
      ],
      qaqc: [
        "Bay dimensions and aisle widths verified against the approved layout.",
        "Line width, thickness and appearance inspected.",
        "Symbol orientation and placement verified.",
        "Accessibility-bay dimensions confirmed against the applicable code.",
      ],
      procurement: [
        "Provide the approved layout drawing and bay schedule.",
        "Confirm surface type (asphalt / concrete) and condition.",
        "State required bay types: standard, disabled, EV, parent-and-child, motorcycle.",
        "Confirm accessibility code and any operator-specific requirements.",
      ],
      faqs: [
        { q: "Can you mark EV charging bays and accessibility bays?", a: "Yes. Disabled, EV charging, parent-and-child and other designated bays are set out with the correct symbols and dimensions per the applicable code." },
        { q: "What system is best for an indoor car park?", a: "Cold plastic (MMA) or epoxy systems are typically preferred for indoor and polished-concrete decks because of cure, adhesion and slip-resistance. The selection matrix on the Technical Resources page compares options." },
      ],
    },
    {
      slug: "road-studs",
      icon: "CircleDot",
      image: "/images/road-stud-installation.jpg",
      navLabel: "Road Studs & RPMs",
      title: "Road Studs & Raised Pavement Markers",
      h1: "Road stud and raised pavement marker installation",
      intro: "Reflective and solar road studs that supplement line marking for night-time visibility on highways, curves, tunnel approaches and hazard zones.",
      directAnswer: "Road studs (raised pavement markers) supplement line markings to improve night-time and wet-weather visibility. Gulf Seismic installs reflective and solar road studs with the correct adhesive, spacing and embedment, aligned to the specified standard.",
      problem: [
        "Studs that detach under traffic because the wrong adhesive or poor surface prep was used.",
        "Incorrect spacing and offset, reducing effectiveness.",
        "Studs specified for the wrong environment (solar where shaded, non-reflective where high reflectivity is needed).",
        "Studs installed over fresh thermoplastic before cure, causing movement.",
      ],
      selection: [
        "Reflective road studs (single- or double-sided) per reflectivity and colour requirement.",
        "Solar road studs for enhanced visibility on unlit highways and hazard zones.",
        "Adhesive selected for substrate and traffic loading (bituminous or epoxy).",
        "Spacing and offset per the specified standard and road geometry.",
      ],
      methodology: [
        "Confirm line marking is complete and cured before stud installation.",
        "Mark stud positions from approved set-out.",
        "Surface preparation: clean, dry, free of dust and loose material.",
        "Adhesive applied and stud placed, aligned and pressed to correct embedment.",
        "Cure time observed before reopening to traffic.",
      ],
      qaqc: [
        "Stud type, colour and reflectivity verified against specification.",
        "Adhesive type and cure confirmed.",
        "Spacing, offset and alignment checked.",
        "Adhesion and embedment inspected; loose studs replaced.",
      ],
      procurement: [
        "Provide the standard, spacing and offset requirements.",
        "Confirm stud type (reflective / solar), colour and reflectivity class.",
        "State surface type and traffic loading for adhesive selection.",
        "Confirm sequence relative to line marking.",
      ],
      faqs: [
        { q: "Reflective vs solar road studs?", a: "Reflective studs rely on vehicle headlights; solar studs actively emit light for enhanced visibility on unlit roads and hazard zones. The Road Stud Selection Guide on the Technical Resources page compares them." },
        { q: "Why do road studs come loose?", a: "The most common causes are the wrong adhesive for the substrate, poor surface preparation, or installation before the line marking has cured. We address all three in the method statement." },
      ],
    },
    {
      slug: "industrial-safety",
      icon: "ShieldAlert",
      image: "/images/industrial-safety-marking.jpg",
      navLabel: "Industrial Safety Marking",
      title: "Industrial Safety Marking",
      h1: "Industrial safety marking for warehouses, logistics and facilities",
      intro: "Floor marking for pedestrian routes, forklift lanes, hazard zones, storage bays and emergency egress — designed to code and built to withstand industrial traffic.",
      directAnswer: "Industrial safety marking designates pedestrian walkways, vehicle lanes, hazard zones, storage and emergency routes on facility floors. Gulf Seismic applies epoxy, polyurea and thermoplastic systems selected for the substrate, traffic and chemical exposure, with layout designed for code compliance.",
      problem: [
        "Floor markings that fail under forklift traffic and chemical exposure.",
        "Layouts that do not meet pedestrian-segregation or egress requirements.",
        "Inconsistent colour coding across zones, reducing comprehension.",
        "Slip-resistant surface not specified where required, creating risk.",
      ],
      selection: [
        "Epoxy floor marking for general industrial floors.",
        "Polyurea / MMA for fast-cure and high-wear applications.",
        "Thermoplastic for outdoor yards and loading areas.",
        "Anti-slip additives where pedestrian traffic is present.",
      ],
      methodology: [
        "Layout design: pedestrian routes, vehicle lanes, hazard zones, storage bays, emergency egress.",
        "Surface preparation: grinding, cleaning, moisture test for concrete floors.",
        "Primer and system application per manufacturer specification.",
        "Colour coding and symbol application per the facility standard.",
        "Cure time and traffic reintroduction sequence.",
      ],
      qaqc: [
        "Layout verified against the approved floor-plan and code.",
        "Adhesion, film thickness and appearance inspected.",
        "Anti-slip performance verified where specified.",
        "Colour and symbol consistency checked across zones.",
      ],
      procurement: [
        "Provide the floor plan and required zoning.",
        "Confirm substrate (concrete / asphalt / existing coating) and condition.",
        "State traffic type (pedestrian / forklift / HGV) and chemical exposure.",
        "Confirm applicable code and any operator-specific requirements.",
      ],
      faqs: [
        { q: "What colours should we use for safety marking?", a: "Colour conventions vary by code and operator standard. We design the layout to the applicable code and confirm colour coding in the layout proposal. Generic conventions (yellow for hazard, white for traffic, green for safety, red for fire/first-aid) are a starting point only." },
        { q: "Can you work without shutting down the facility?", a: "Where possible we phase the work in zones using fast-cure systems (MMA / polyurea) so operations continue. The phasing plan is part of the method statement." },
      ],
    },
    {
      slug: "line-removal",
      icon: "Eraser",
      image: "/images/line-removal.jpg",
      navLabel: "Line Removal & Remarking",
      title: "Line Removal & Remarking",
      h1: "Line removal and remarking services",
      intro: "Controlled removal of existing road markings — by water-blasting, scarifying or burning — followed by remarking, without damaging the substrate.",
      directAnswer: "Line removal is required when layouts change, markings are illegible, or before resurfacing. Gulf Seismic removes markings by water-blasting, scarifying or burning selected to protect the substrate, then remarks to the new layout.",
      problem: [
        "Removal methods that damage the substrate (grooving too deep, burning too hot).",
        "Ghost lines — old markings visible through the new coating, confusing drivers.",
        "Removal sequenced poorly relative to remarking, leaving the road without guidance.",
        "Debris and water not managed, creating environmental and safety hazards.",
      ],
      selection: [
        "High-pressure water-blasting for non-destructive removal on most surfaces.",
        "Scarifying / grinding for thick thermoplastic where substrate tolerates it.",
        "Hot-air / burning for paint removal where suitable.",
        "Black-out masking tape / coating as a temporary alternative where removal is not possible.",
      ],
      methodology: [
        "Assess marking type, thickness and substrate to select the removal method.",
        "Remove markings to the target level without substrate damage.",
        "Clean the surface and remove debris and water.",
        "Inspect for ghost lines and substrate integrity.",
        "Remark to the new layout using the specified system.",
      ],
      qaqc: [
        "Removal depth controlled to avoid substrate damage.",
        "Ghost-line presence checked after removal.",
        "Substrate integrity inspected before remarking.",
        "New marking inspected per the applicable service QA/QC.",
      ],
      procurement: [
        "Provide the existing marking type and the new layout drawing.",
        "Confirm substrate type and condition.",
        "State whether temporary black-out is acceptable or full removal is required.",
        "Confirm programme and traffic-management sequence.",
      ],
      faqs: [
        { q: "Will line removal damage the asphalt?", a: "Method selection controls this. Water-blasting is non-destructive on most surfaces; scarifying is used only where the substrate tolerates it. We inspect substrate integrity before remarking." },
        { q: "Can you remove markings at night?", a: "Yes — water-blasting and scarifying can be sequenced into night works windows with appropriate traffic management." },
      ],
    },
  ],
  industries: {
    h1: "Industries we serve",
    sub: "Marking systems specified for the buyer, the surface and the operating environment — not generic layouts.",
    items: [
      { slug: "highways", icon: "Route", title: "Highways & Roads", summary: "High-volume highway and urban road marking with thermoplastic, studs and documented QA/QC.", bullets: ["Thermoplastic line marking", "Reflective road studs", "Method statements & ITPs", "Retroreflectivity testing"] },
      { slug: "airports", icon: "Plane", title: "Airports & Aviation", summary: "Runway, taxiway and apron marking to aviation standards with precision survey and airside coordination.", bullets: ["Runway centreline & threshold", "Touchdown zone marking", "Rubber removal", "Airside works windows"] },
      { slug: "industrial", icon: "Factory", title: "Industrial & Warehousing", summary: "Warehouse and logistics floor marking for segregation, safety and storage zoning.", bullets: ["Pedestrian & forklift segregation", "Hazard & storage zones", "Epoxy & polyurea systems", "Anti-slip options"] },
      { slug: "parking", icon: "ParkingSquare", title: "Parking & Commercial", summary: "Retail, commercial and residential car parks with accessibility and EV bays.", bullets: ["Bay & aisle marking", "Disabled & EV bays", "Directional symbols", "Layout to code"] },
      { slug: "ports", icon: "Ship", title: "Ports & Logistics", summary: "Heavy-duty marking for container yards, quayside and port logistics zones.", bullets: ["High-wear thermoplastic", "Container & lane marking", "Chemical-resistant systems", "Phased execution"] },
      { slug: "communities", icon: "Building2", title: "Residential & Communities", summary: "Community and residential marking — speed calming, parking, pedestrian routes.", bullets: ["Parking bays", "Pedestrian routes", "Speed humps & rumble strips", "Play-zone markings"] },
    ],
  },
  projects: {
    h1: "Projects & capability",
    sub: "A directory of our service scope and capability. Where a project is verified it is presented as a Case Study; where data is not yet verified it is presented as a Capability Example.",
  },
  caseStudies: {
    h1: "Case studies & capability examples",
    sub: "Every entry is labelled by evidence status. We do not present capability examples as completed projects.",
    disclaimer: "Items marked 'Capability Example' describe our standard scope and method, not a specific completed contract. They become Case Studies only when project data, client permission and verification are complete.",
    items: [
      {
        slug: "highway-thermoplastic-capability",
        category: "capability-example",
        title: "Highway thermoplastic remarking — capability example",
        clientType: "Road authority / main contractor",
        location: "GCC region",
        challenge: "Existing highway markings had lost retroreflectivity across multiple kilometres, requiring removal and remarking under traffic management with short night-closure windows.",
        scope: "Line removal, thermoplastic line and edge marking, reflective road stud installation over a multi-kilometre highway section.",
        solution: "Phased night works with water-blasting removal followed by hot thermoplastic application and stud installation, sequenced to keep at least one lane open.",
        materials: "Hot thermoplastic, drop-on glass beads, bituminous adhesive, reflective road studs.",
        equipment: "Thermoplastic kettle, screed/extrusion applicator, bead dispenser, water-blaster, line-removal scarifier, reflectometer.",
        result: "Documented retroreflectivity, thickness and adhesion; as-built and inspection records issued. Specific quantities and outcomes are confirmed per project once scope is reviewed.",
        image: "/images/hero-highway.jpg",
      },
      {
        slug: "airport-runway-capability",
        category: "capability-example",
        title: "Airport runway remarking — capability example",
        clientType: "Airport operator / aviation consultant",
        location: "GCC region",
        challenge: "Runway markings required remarking with aviation-approved materials, within night works windows and with strict dimensional survey control.",
        scope: "Rubber removal, removal of old markings, runway centreline, threshold, touchdown zone and taxiway marking.",
        solution: "Airside coordination with operations, surface preparation, precision set-out survey, application of aviation-approved material with reflective media, final survey inspection.",
        materials: "Aviation-approved MMA / solvent paint, aviation glass beads.",
        equipment: "Airside marking equipment, set-out survey, reflectometer, rubber-removal unit.",
        result: "Survey-accepted markings with documented retroreflectivity, dimensions and material conformity. Specifics confirmed per project.",
        image: "/images/airport-runway-marking.jpg",
      },
      {
        slug: "warehouse-safety-capability",
        category: "capability-example",
        title: "Warehouse safety marking — capability example",
        clientType: "Logistics operator / facility manager",
        location: "GCC region",
        challenge: "A busy warehouse needed pedestrian segregation, forklift lanes and hazard zoning without full operational shutdown.",
        scope: "Layout design, surface preparation, epoxy floor marking with anti-slip in pedestrian zones, colour-coded zoning and symbols.",
        solution: "Phased zone-by-zone execution using fast-cure systems, with pedestrian routing maintained throughout.",
        materials: "Epoxy / MMA floor marking, anti-slip additive, preformed symbols.",
        equipment: "Surface grinder, line-tape applicator, marking equipment.",
        result: "Code-compliant layout with documented adhesion and anti-slip performance. Specifics confirmed per project.",
        image: "/images/industrial-safety-marking.jpg",
      },
    ],
  },
  resources: {
    h1: "Technical resources & standards",
    sub: "Procurement-support resources. Every item shows source, jurisdiction, reviewer status and a disclaimer. Standards content requires reviewer validation before use.",
    items: [
      {
        slug: "rfq-checklist",
        icon: "ListChecks",
        title: "Saudi road marking RFQ checklist",
        summary: "The information a procurement team should assemble before issuing a road-marking RFQ in Saudi Arabia.",
        type: "Checklist",
        source: "Gulf Seismic procurement practice",
        jurisdiction: "Saudi Arabia / GCC",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "This checklist is a procurement aid, not a substitute for the client's specification or the governing standard. Confirm the applicable standard before use.",
        items: [
          "Approved drawing set with line types, widths and symbols",
          "Governing standard and any project-specific specification",
          "Quantities (linear metres, symbols, studs)",
          "Surface type, age and condition",
          "Existing markings to be removed or overlaid",
          "Programme and lane-closure / works windows",
          "Traffic management responsibility",
          "Acceptance criteria: thickness, retroreflectivity, adhesion, dimensions",
          "Inspection authority and required documentation",
          "Saudi operating-route requirement (direct / partner-led / project-specific)",
        ],
      },
      {
        slug: "thermoplastic-matrix",
        icon: "TableProperties",
        title: "Thermoplastic system selection matrix",
        summary: "A comparison of thermoplastic, cold plastic (MMA), paint and preformed systems by application, durability, cure and cost.",
        type: "Matrix",
        source: "Gulf Seismic technical practice",
        jurisdiction: "General",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "Selection depends on the specified standard, substrate, climate and traffic. Confirm with the material manufacturer's datasheet and the governing standard.",
        items: [
          "Hot thermoplastic — high-volume highways, high durability, embedded beads, ~180–220°C application",
          "Cold plastic (MMA) — fast cure, thin film, colour stability, chemical resistance, indoor use",
          "Solvent / waterborne paint — temporary or low-volume roads, low cost, short life",
          "Preformed thermoplastic — symbols, legends, short-run special markings",
          "Epoxy / polyurea — industrial floors, high wear, chemical exposure",
        ],
      },
      {
        slug: "itp-checklist",
        icon: "ClipboardCheck",
        title: "Inspection and Test Plan (ITP) checklist",
        summary: "The hold, witness and review points a road-marking ITP should cover.",
        type: "Checklist",
        source: "Gulf Seismic QA/QC practice",
        jurisdiction: "General",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "ITP content must align with the client's specification and the governing standard. This is a starting structure, not an approved ITP.",
        items: [
          "Material approval and certificate of conformity (hold)",
          "Surface preparation and moisture check (witness)",
          "Application temperature at kettle and at surface (witness)",
          "Dry-film thickness (witness)",
          "Glass-bead rate and embedment (witness)",
          "Retroreflectivity RL measurement (hold)",
          "Adhesion test (hold)",
          "Dimensional tolerance check (witness)",
          "Non-conformance and rectification record (review)",
          "As-built and handover documentation (hold)",
        ],
      },
      {
        slug: "method-statement-guide",
        icon: "FileText",
        title: "Marking method statement guide",
        summary: "The structure a marking method statement should follow to satisfy consultants and principals.",
        type: "Guide",
        source: "Gulf Seismic technical practice",
        jurisdiction: "General",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "A method statement must be project-specific and approved by the client's engineer. This guide is a structural reference only.",
        items: [
          "Scope and references (drawings, specifications, standards)",
          "Resources: crew, equipment, materials",
          "Surface preparation method",
          "Application method and parameters (temperature, thickness, bead rate)",
          "Traffic management and HSE controls",
          "QA/QC and inspection regime (linked to the ITP)",
          "Non-conformance and rectification",
          "Handover and documentation",
        ],
      },
      {
        slug: "road-stud-guide",
        icon: "CircleDot",
        title: "Road stud selection guide",
        summary: "How to select reflective vs solar road studs by road type, lighting and hazard.",
        type: "Guide",
        source: "Gulf Seismic technical practice",
        jurisdiction: "General",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "Spacing, offset and type must follow the governing standard. Confirm with the road authority before use.",
        items: [
          "Reflective studs — supplement line marking on lit and unlit roads",
          "Solar studs — enhanced visibility on unlit highways, curves and hazard zones",
          "Adhesive selection — bituminous for asphalt, epoxy for concrete",
          "Spacing and offset per standard and road geometry",
          "Install only after line marking is cured",
        ],
      },
      {
        slug: "line-removal-guide",
        icon: "Eraser",
        title: "Line removal & remarking decision guide",
        summary: "When to remove vs black-out, and which removal method protects the substrate.",
        type: "Guide",
        source: "Gulf Seismic technical practice",
        jurisdiction: "General",
        reviewer: "Pending technical reviewer validation",
        disclaimer: "Removal method depends on marking type, thickness and substrate. Inspect substrate integrity before remarking.",
        items: [
          "Water-blasting — non-destructive, most surfaces",
          "Scarifying — thick thermoplastic where substrate tolerates it",
          "Hot-air / burning — paint removal where suitable",
          "Black-out masking — temporary only, not a permanent solution",
          "Ghost-line inspection and substrate check before remarking",
        ],
      },
    ],
  },
  saudiPresence: {
    h1: "Saudi presence — a transparent market-access programme",
    sub: "Compliance and operating route come before large Saudi investment. We publish what is verified, planned and in progress — nothing invented.",
    intro: "Gulf Seismic General Contracting LLC is headquartered in Abu Dhabi, UAE. Our Saudi Arabia market-access programme is structured, sequenced and honest. We do not claim Saudi registrations, offices, staff, clients or projects we do not hold. Where a Saudi operating route is commercially justified, we deliver through partner-led or project-specific routes. This page is the execution plan, not a claim of presence.",
    gateTitle: "Phase 0 gate — verified status",
    gateIntro: "Before any Saudi commercial claim is published, each item below must be verified. Items not yet verified are shown as planned or in progress.",
    gate: [
      { item: "Saudi Commercial Registration (CR)", status: "Planned" },
      { item: "MISA authorization / license", status: "Planned" },
      { item: "Saudi Contractors Authority registration / classification", status: "Planned" },
      { item: "Etimad registration", status: "Planned" },
      { item: "Saudi phone number", status: "Planned" },
      { item: "Saudi partner", status: "In progress — under evaluation" },
      { item: "Saudi office / address", status: "Planned" },
      { item: "Saudi staff or deployable crew", status: "Project-specific mobilization" },
      { item: "Saudi clients, projects, RFQs, tenders or proposals", status: "Qualified opportunities in pipeline" },
    ],
    planTitle: "Market-access execution plan",
    plan: [
      { phase: "Phase 1", title: "Partner selection & due diligence", body: "Identify and qualify a Saudi partner with compatible scope, integrity and capacity. Legal and commercial due diligence before any commitment." },
      { phase: "Phase 2", title: "Registration & licensing", body: "Saudi Commercial Registration, MISA authorization where required, Saudi Contractors Authority classification, and Etimad registration for government procurement eligibility." },
      { phase: "Phase 3", title: "Operating infrastructure", body: "Saudi phone, address, banking and insurance; deployable crew and equipment plan; compliance with Saudization and labour requirements." },
      { phase: "Phase 4", title: "Pipeline & proof", body: "Convert qualified opportunities into RFQs, proposals and contracts; build verified case studies with client permission; publish only verified proof." },
    ],
    routeTitle: "Saudi delivery routes",
    routes: [
      { name: "Partner-led delivery", body: "A qualified Saudi partner holds the principal contract and local compliance; Gulf Seismic delivers the marking scope under a subcontract or joint arrangement. Used where Saudi presence is not yet established but a real opportunity exists." },
      { name: "Project-specific route", body: "A single project is executed under a project-specific arrangement with local sponsorship, registration and compliance scoped to that project. Used for large, defined opportunities." },
      { name: "Direct presence (planned)", body: "Established only when CR, MISA, Saudi Contractors Authority classification and Etimad registration are complete and commercially justified. Until then, partner-led and project-specific routes are used." },
    ],
    faqs: [
      { q: "Are you registered in Saudi Arabia?", a: "Not yet. Our registrations are planned or in progress, as shown on the Phase 0 gate. We deliver through partner-led or project-specific routes until direct presence is established." },
      { q: "Can you bid for Saudi government tenders?", a: "Government procurement eligibility requires Etimad registration and Saudi Contractors Authority classification. Until these are complete, we pursue private-sector opportunities and partner-led routes for government-adjacent work." },
      { q: "Why don't you publish a Saudi phone and office?", a: "Because we do not yet hold them. Publishing contact details we do not operate would be a false claim. A Saudi phone and office will be published when they are live." },
    ],
  },
  saudiMobilization: {
    h1: "Saudi subcontracting & mobilization",
    sub: "How Gulf Seismic mobilizes for a Saudi marking package through partner-led or project-specific routes.",
    intro: "Where a Saudi operating route is commercially justified, mobilization follows a controlled sequence. We do not imply we can mobilize anywhere, anytime — every mobilization depends on partner status, registrations, and the project's commercial and compliance profile.",
    steps: [
      { title: "1. Opportunity qualification", body: "We qualify the opportunity: client type, scope, value, programme, location and procurement stage. A-grade opportunities (active project, decision-maker, drawings, deadline) advance immediately." },
      { title: "2. Route selection", body: "We select the delivery route: partner-led, project-specific, or (where registered) direct. The route determines compliance, contracting and risk allocation." },
      { title: "3. Partner & compliance setup", body: "Where partner-led, the Saudi partner holds the principal contract and local compliance; Gulf Seismic holds the marking subcontract. Where project-specific, sponsorship and project-scoped registration are arranged." },
      { title: "4. Technical proposal", body: "Method statement, ITP, materials, equipment, crew, programme and price are issued for the specific scope." },
      { title: "5. Mobilization", body: "Materials approved, equipment and crew mobilized, traffic management and HSE established on site, in coordination with the partner and the client." },
      { title: "6. Execution & handover", body: "Marking applied per method; QA/QC documented; rectification and handover with as-built and inspection records." },
    ],
    partners: [
      "Saudi partners are qualified through legal and commercial due diligence before commitment.",
      "Partner-led delivery uses a verified Saudi principal for local compliance.",
      "Project-specific routes scope sponsorship and registration to the project.",
      "Direct presence is used only when registrations are complete and commercially justified.",
    ],
    faqs: [
      { q: "How quickly can you mobilize in Saudi Arabia?", a: "Mobilization time depends on the route, partner status and the project's compliance profile. For a qualified opportunity with a partner-led route, mobilization follows the steps above once the technical proposal is accepted." },
      { q: "Do you need a Saudi partner?", a: "Until direct registration is complete, partner-led or project-specific routes are used. A qualified Saudi partner is therefore required for most Saudi engagements today." },
    ],
  },
  gcc: {
    h1: "GCC coverage",
    sub: "Our marking capability extends across the GCC through partner-led routes, with honest coverage claims.",
    intro: "Gulf Seismic is headquartered in the UAE and serves GCC markets through partner-led and project-specific routes. We do not claim offices in every GCC country. Coverage is real where we can respond, quote and mobilize through a verified route.",
    countries: [
      { name: "United Arab Emirates", code: "AE", note: "Home market — direct execution." },
      { name: "Saudi Arabia", code: "SA", note: "Partner-led and project-specific routes; direct presence planned." },
      { name: "Qatar", code: "QA", note: "Partner-led route for qualified opportunities." },
      { name: "Oman", code: "OM", note: "Project-specific route on request." },
      { name: "Kuwait", code: "KW", note: "Project-specific route on request." },
      { name: "Bahrain", code: "BH", note: "Project-specific route on request." },
    ],
    faqs: [
      { q: "Do you have offices in every GCC country?", a: "No. We are headquartered in the UAE and serve other GCC markets through partner-led and project-specific routes. We publish coverage only where we can respond, quote and mobilize through a verified route." },
      { q: "Can you quote for a Qatar or Oman project?", a: "Yes, for qualified opportunities, through a partner-led or project-specific route. Submit an RFQ and we will confirm the route and response." },
    ],
  },
  about: {
    h1: "About Gulf Seismic",
    sub: "A specialist road marking and infrastructure contractor headquartered in Abu Dhabi, executing a structured Saudi and GCC market-access programme.",
    story: [
      "Gulf Seismic General Contracting LLC is a road marking and infrastructure contractor based in Abu Dhabi, United Arab Emirates. Our core discipline is marking — thermoplastic road marking, airport and runway marking, parking marking, road studs, industrial safety marking and line removal.",
      "We are executing a structured Saudi Arabia and GCC market-access programme. Compliance and operating route come before large investment, and we publish only verified status. Where direct presence is not yet established, we deliver through partner-led and project-specific routes.",
      "Our commercial model is built on scope review, method statements, ITPs, documented QA/QC and a procurement-ready RFQ process. We measure success in qualified RFQs, proposals and contracts — not in page views.",
    ],
    values: [
      { icon: "ShieldCheck", title: "Compliance first", body: "We do not claim registrations, offices, clients or projects we do not hold. Market access is earned, not implied." },
      { icon: "FileCheck2", title: "Technical proof", body: "Method statements, ITPs, equipment and crew proof, and documented QA/QC on every package." },
      { icon: "ClipboardCheck", title: "Scope before price", body: "We review drawings, specifications and site conditions before quoting — so the price reflects the real scope." },
      { icon: "Gauge", title: "Measured outcomes", body: "We track qualified RFQs, proposals and contracts — not vanity metrics." },
    ],
    capabilities: [
      "Thermoplastic and cold plastic road marking",
      "Airport, runway, taxiway and apron marking",
      "Parking bay, symbol and pedestrian-route marking",
      "Road stud and raised pavement marker installation",
      "Industrial safety and warehouse floor marking",
      "Line removal and remarking",
      "Method statements, ITPs and documented QA/QC",
      "Procurement-ready RFQ response with drawing/specification upload",
    ],
    compliance: [
      "Phase 0 gate: verified status of every Saudi registration before any claim",
      "No invented clients, projects, certifications or approvals",
      "Partner-led and project-specific Saudi delivery routes",
      "Standards content cited with source, jurisdiction and reviewer status",
    ],
  },
  contactRfq: {
    h1: "Contact & request a technical RFQ",
    sub: "Upload drawings and specifications. Receive a scope-reviewed technical response, not a generic quote.",
    formTitle: "Request a Technical RFQ",
    fields: {
      name: "Full name",
      company: "Company",
      role: "Role",
      email: "Email",
      phone: "Phone / WhatsApp",
      country: "Country",
      city: "City",
      projectName: "Project name",
      clientType: "Client type",
      service: "Service required",
      quantity: "Quantity (linear metres / units)",
      surface: "Surface type & condition",
      completionDate: "Required completion date",
      procurementStage: "Procurement stage",
      saudiRoute: "Saudi operating-route requirement",
      preferredContact: "Preferred contact method",
      message: "Project brief",
      attachments: "Upload drawings / specifications",
      consent: "I consent to Gulf Seismic contacting me about this RFQ and storing the details provided.",
      submit: "Submit RFQ",
      success: "RFQ received. A-grade enquiries receive a technical response within one working day.",
    },
    options: {
      clientType: ["Consultant", "Main contractor", "EPC", "Facility owner", "Government / authority", "Other"],
      service: [
        "Road & highway marking",
        "Thermoplastic road marking",
        "Airport & runway marking",
        "Parking marking",
        "Road studs & RPMs",
        "Industrial safety marking",
        "Line removal & remarking",
        "Multiple / not sure",
      ],
      procurementStage: ["Budgeting", "Tendering", "Award", "Mobilization", "Information only"],
      saudiRoute: ["Direct", "Partner-led", "Project-specific", "Unsure"],
      preferredContact: ["Email", "Phone", "WhatsApp"],
    },
    assistantTitle: "AI RFQ assistant",
    assistantSub: "Ask a technical question about scope, materials, method or standards. The assistant helps you assemble an RFQ-ready brief.",
    analyzerTitle: "Drawing / specification analyzer",
    analyzerSub: "Upload a drawing or specification extract. The analyzer reads the image and summarizes line types, materials and inspection points to inform your RFQ.",
    gradesTitle: "How we classify enquiries",
    grades: [
      { grade: "A", label: "Active project", body: "Decision-maker, drawings/specification available, real deadline. Technical response within one working day." },
      { grade: "B", label: "Clear need", body: "Clear requirement but incomplete scope or timing. We help complete the scope before a technical response." },
      { grade: "C", label: "Information", body: "General information, no project authority or timing. We share capability and resources." },
    ],
    slaTitle: "Response SLA",
    slaBody: "A-grade RFQs receive a technical response within one working day. B-grade enquiries receive a scope-completion response within two working days. C-grade enquiries receive capability information within three working days.",
  },
};

// Arabic content — full visible chrome, hero, service summaries, FAQs and page intros.
// Deeply technical standards content carries a reviewer disclaimer (per SKILL.md).
const ar: Content = {
  dir: "rtl",
  brand: {
    name: "جلف سيسمك",
    tagline: "تنفيذ علامات الطرق والبنية التحتية — المملكة العربية السعودية ودول الخليج",
  },
  nav: [
    { id: "home", label: "الرئيسية" },
    { id: "services", label: "الخدمات" },
    { id: "industries", label: "القطاعات" },
    { id: "projects", label: "المشاريع" },
    { id: "case-studies", label: "دراسات الحالة" },
    { id: "resources", label: "الموارد الفنية" },
    { id: "saudi-presence", label: "التواجد في السعودية" },
    { id: "gcc", label: "دول الخليج" },
    { id: "about", label: "من نحن" },
    { id: "contact", label: "اتصل واطلب عرض سعر" },
  ],
  navGroups: [
    {
      label: "الشركة",
      items: [
        { id: "about", label: "من نحن" },
        { id: "projects", label: "المشاريع" },
        { id: "case-studies", label: "دراسات الحالة" },
      ],
    },
    {
      label: "القدرات",
      items: [
        {
          id: "services",
          label: "الخدمات",
          sub: [
            { slug: "road-marking", label: "علامات الطرق والطرق السريعة" },
            { slug: "thermoplastic", label: "علامات الثرموبلاستيك" },
            { slug: "airport-runway", label: "علامات المطارات والمدرجات" },
            { slug: "parking-marking", label: "علامات المواقف" },
            { slug: "road-studs", label: "عواكس الطرق" },
            { slug: "industrial-safety", label: "علامات السلامة الصناعية" },
            { slug: "line-removal", label: "إزالة وإعادة العلامات" },
          ],
        },
        { id: "industries", label: "القطاعات" },
        { id: "resources", label: "الموارد الفنية" },
      ],
    },
    {
      label: "السعودية والخليج",
      items: [
        { id: "saudi-presence", label: "التواجد في السعودية" },
        { id: "saudi-mobilization", label: "المقاولة من الباطن والتعبئة" },
        { id: "gcc", label: "تغطية الخليج" },
      ],
    },
  ],
  cta: {
    rfq: "اطلب عرض سعر فني",
    callback: "اطلب مكالمة",
    whatsapp: "راسلنا عبر واتساب بملخص المشروع",
    phone: "اتصل بنا",
    download: "حمّل بيان القدرات",
    consult: "احجز استشارة فنية",
  },
  contact: {
    email: "roadmarking@gulfseismic.com",
    phone: "+971 2 555 5769",
    phoneAlt: "+971 54 997 0833",
    whatsapp: "+971 54 447 2908",
    addressLine: "أبوظبي، الإمارات العربية المتحدة",
    sla: "طلبات العرض من الفئة (أ) تتلقى رداً فنياً خلال يوم عمل واحد.",
  },
  footer: {
    about:
      "شركة جلف سيسمك العامة للمقاولات هي مقاول متخصص في علامات الطرق والبنية التحتية، مقرها في أبوظبي، الإمارات، وتنفذ برنامجاً منظماً للوصول إلى السوق السعودية والخليجية.",
    columns: [
      {
        title: "الخدمات",
        links: [
          { slug: "road-marking", label: "علامات الطرق والطرق السريعة" },
          { slug: "thermoplastic", label: "علامات الثرموبلاستيك" },
          { slug: "airport-runway", label: "علامات المطارات والمدرجات" },
          { slug: "parking-marking", label: "علامات المواقف" },
          { slug: "road-studs", label: "عواكس الطرق" },
          { slug: "industrial-safety", label: "علامات السلامة الصناعية" },
          { slug: "line-removal", label: "إزالة وإعادة العلامات" },
        ],
      },
      {
        title: "السعودية والخليج",
        links: [
          { id: "saudi-presence", label: "التواجد في السعودية" },
          { id: "saudi-mobilization", label: "المقاولة من الباطن والتعبئة" },
          { id: "gcc", label: "تغطية الخليج" },
        ],
      },
      {
        title: "الشركة",
        links: [
          { id: "about", label: "من نحن" },
          { id: "projects", label: "المشاريع" },
          { id: "case-studies", label: "دراسات الحالة" },
          { id: "resources", label: "الموارد الفنية" },
          { id: "contact", label: "اتصل واطلب عرض سعر" },
        ],
      },
    ],
    legal: "© شركة جلف سيسمك العامة للمقاولات. جميع الحقوق محفوظة.",
    note: "يُعرض حالة الوصول إلى السوق والتسجيلات والشهادات فقط عند التحقق منها. تُوصف البنود غير المتحقق منها على أنها مخطط لها أو خاصة بمشروع محدد.",
  },
  home: {
    badge: "المقر في الإمارات • برنامج الوصول إلى السوق السعودية والخليجية",
    h1: "مقاول متخصص في علامات الطرق والبنية التحتية للمملكة العربية السعودية والخليج",
    sub: "علامات الثرموبلاستيك، علامات المطارات والمدرجات، عواكس الطرق، علامات السلامة الصناعية وإزالة العلامات — تُنفّذ وفق المواصفات، مع كشوف طرق وخطط فحص وعملية طلب عرض سعر جاهزة للمشتريات.",
    heroPoints: [
      "مراجعة النطاق قبل التسعير",
      "كشوف طرق وخطط فحص لكل حزمة",
      "إثبات للطاقم والمعدات والمواد",
      "رد على طلب العرض جاهز للمشتريات",
    ],
    trustStrip: [
      "علامات الثرموبلاستيك والباردة",
      "علامات المطارات والمدرجات",
      "عواكس الطرق والعواكس المرتفعة",
      "علامات السلامة الصناعية",
      "إزالة وإعادة العلامات",
      "الفحص والإصلاح والتسليم",
    ],
    servicesTitle: "الخدمات التجارية",
    servicesSub: "تخصصات العلامات مبنية على نية الباحث والمشتري والمتطلبات الفنية — لا على حجم عام للمقاول.",
    whyTitle: "لماذا تختار فرق المشتريات جلف سيسمك",
    whySub: "تُبنى الثقة الفنية على مراجعة النطاق والطريقة والإثبات ونموذج تشغيل شفاف — لا على ادعاءات.",
    whyCards: [
      { icon: "ClipboardCheck", title: "مراجعة النطاق قبل التسعير", body: "نراجع المخططات والمواصفات وحالة الموقع قبل التسعير — ليعكس السعر النطاق والمواد والجدول الزمني الحقيقي." },
      { icon: "FileCheck2", title: "كشوف طرق وخطط فحص", body: "تدعم كل حزمة كشف طريقة وخطة فحص وت اختبار (ITP) متوافقة مع المعيار المحدد ومتطلبات جودة العميل." },
      { icon: "HardHat", title: "إثبات الطاقم والمعدات والمواد", body: "نقدّم قوائم المعدات وتشكيل الطاقم وبيانات المواد والموافقات — إثبات يمكنك تقديمه للاستشاريين وأصحاب العمل." },
      { icon: "ShieldCheck", title: "ضوابط السلامة والمرور والدخول", body: "تُخطط إدارة المرور وإغلاق المسارات وتصاريح الدخول وضوابط الصحة والسلامة ضمن البرنامج، لا تُضاف لاحقاً." },
      { icon: "Search", title: "الفحص والإصلاح والتسليم", body: "تُوثّق سماكة الخط والانعكاسية والالتصاق والأبعاد. تُصلح العيوب قبل التسليم." },
      { icon: "RefreshCw", title: "خيارات الصيانة ودورة الحياة", body: "ننصح بكلفة دورة الحياة — الثرموبلاستيك مقابل البلاستيك البارد، دورات إعادة التطبيق وأنظمة الصيانة — لتحديد النظام المناسب." },
    ],
    processTitle: "كيف تُنفّذ حزمة لدى جلف سيسمك",
    processSub: "تسلسل مُحكم وقابل للتدقيق من طلب العرض حتى التسليم.",
    process: [
      { step: "01", title: "طلب العرض ومراجعة النطاق", body: "نستلم طلب العرض والمخططات والمواصفات، ثم نراجع النطاق والسطح والكميات والجدول والدخول قبل أي تسعير." },
      { step: "02", title: "العرض الفني", body: "تستلم عرضاً فنياً: اختيار النظام، كشف الطريقة، خطة الفحص، المواد، المعدات، الطاقم، الجدول والسعر." },
      { step: "03", title: "التعبئة", body: "تُعتمد المواد، وتُعبّأ المعدات والطاقم، وتُؤسس إدارة المرور وضوابط الصحة والسلامة في الموقع." },
      { step: "04", title: "التنفيذ وضمان الجودة", body: "تُطبّق العلامات وفق الطريقة المعتمدة؛ وتُفحص السماكة والانعكاسية والالتصاق والأبعاد وتُسجّل." },
      { step: "05", title: "الإصلاح والتسليم", body: "تُصلح العيوب، وتُسلّم سجلات التنفيذ وتقارير الفحص، وتُسلّم الحزمة مع إرشادات الصيانة." },
    ],
    proofTitle: "إثبات لا ادعاءات",
    proofSub: "حيثما لا تكون بيانات المشروع متحققة بعد، نقدّم أمثلة قدرات — لا دراسات حالة مختلقة.",
    saudiTitle: "برنامج منظّم للوصول إلى السوق السعودية",
    saudiSub: "تسبق الامتثال ونموذج التشغيل الاستثمار السعودي الكبير. لا نوحي بتسجيلات أو مكاتب أو مشاريع لا نملكها.",
    saudiPoints: [
      "خطة تنفيذ الوصول للسوق: السجل التجاري، MISA، هيئة المقاولين السعوديين، اعتماد",
      "مسارات تسليم بقيادة شريك أو خاصة بمشروع، حيثما كان مبرراً تجارياً",
      "فرص مؤهلة تُحوّل عبر عملية طلب عرض و CRM حقيقية",
      "لا تواجد سعودي أو عملاء أو موافقات مختلقة — إطلاقاً",
    ],
    rfqTitle: "اطلب عرض سعر فني",
    rfqSub: "ارفع المخططات والمواصفات. استلم رداً فنياً بعد مراجعة النطاق، لا عرضاً عاماً.",
    faqTitle: "الأسئلة الشائعة",
    faqs: [
      { q: "هل أنتم شركة مسجلة في السعودية؟", a: "مقر جلف سيسمك العامة للمقاولات في أبوظبي، الإمارات. يُوصف برنامج الوصول إلى السوق السعودية بشفافية في صفحة التواجد في السعودية، بما في ذلك ما هو مخطط أو قيد التنفيذ أو مكتمل. لا نوحي بحالة لم نحققها." },
      { q: "هل تقدّمون كشوف طرق وخطط فحص؟", a: "نعم. كل حزمة تجارية تدعمها كشف طريقة وخطة فحص وت اختبار متوافقة مع المعيار المحدد ومتطلبات جودة العميل." },
      { q: "هل يمكنكم التعبئة للمشاريع السعودية؟", a: "حيثما يكون مسار التشغيل السعودي مبرراً تجارياً، نسلّم عبر مسارات بقيادة شريك أو خاصة بمشروع. راجع المقاولة من الباطن والتعبئة لتسلسل التعبئة والتبعيات." },
      { q: "ما المعلومات المطلوبة للتسعير؟", a: "المخططات، المواصفات، الكميات، نوع السطح وحالته، الجدول الزمني، قيود الدخول ومرحلة المشتريات. يستقبل نموذج طلب العرض كل ذلك ويدعم رفع المخططات والمواصفات." },
      { q: "كم سرعة استجابتكم؟", a: "طلبات العرض من الفئة (أ) — مشروع نشط، صانع قرار، مخططات/مواصفات وddl حقيقي — تتلقى رداً فنياً خلال يوم عمل واحد." },
    ],
  },
  servicesHub: {
    h1: "خدمات العلامات التجارية",
    sub: "كل صفحة خدمة مبنية حول نية البحث والمشتري والمتطلبات الفنية — مع نطاق فني وطريقة وضمان جودة ومسار طلب عرض.",
  },
  services: [
    {
      slug: "road-marking",
      icon: "Route",
      image: "/images/hero-highway.jpg",
      navLabel: "علامات الطرق والطرق السريعة",
      title: "علامات الطرق والطرق السريعة",
      h1: "مقاول علامات الطرق والطرق السريعة للمملكة العربية السعودية والخليج",
      intro: "علامات خطوط دائمة عاكسة للطرق السريعة والطرق الحضرية والتقاطعات — تُطبّق وفق المواصفات، مع تحكم موثّق في السماكة والالتصاق والأبعاد.",
      directAnswer: "تطبّق جلف سيسمك علامات الثرموبلاستيك الساخن والبلاستيك البارد على الطرق السريعة والحضرية، مع كشوف طرق وخطط فحص وضمان جودة موثّق، لمشاريع السعودية والخليج حيث يكون مسار التشغيل مبرراً تجارياً.",
      problem: [
        "علامات تفقد انعكاسيتها خلال أشهر من الافتتاح، مما يخلق خطراً ليلياً وفي الطقس المبلل.",
        "خطوط تُطبّق دون تحضير السطح أو البرايمر، مما يؤدي إلى فشل الالتصاق وتقشير مبكر.",
        "حزم تُسعّر دون مراجعة النطاق، فلا تعكس الكميات وحالة السطح وقيود الدخول.",
        "سجلات فحص مفقودة عند التسليم، مما يؤخر القبول والدفع.",
      ],
      selection: [
        "الثرموبلاستيك (ساخن) للطرق السريعة عالية الحركة — متانة وخرزات عاكسة مدمجة.",
        "البلاستيك البارد (MMA) للمناطق التي تتطلب شفاءً سريعاً أو ثبات لون أو تطبيقات رقيقة.",
        "طلاء مذيب/مائي للعلامات المؤقتة أو الطرق منخفضة الحركة.",
        "ثرموبلاستيك جاهز للرموز والأشكال والعلامات الخاصة قصيرة المدى.",
      ],
      methodology: [
        "مسح السطح: النظافة والرطوبة ودرجة الحرارة وحالة العلامات الموجودة وعمر الأسفلت.",
        "إزالة الخطوط أو التحزيز حيث تتعارض العلامات الموجودة.",
        "تطبيق البرايمر حيث حدد أو حيث تتطلب حالة السطح ذلك.",
        "تطبيق الثرموبلاستيك الساخن عند درجة حرارة مضبوطة مع رش الخرزات العاكسة.",
        "التحكم الأبعادي: عرض الخط والإزاحة والتباعد ونصف القطر من المخططات المعتمدة.",
        "فحوصات أثناء التنفيذ: السماكة وتضمين الخرزات والالتصاق والمظهر.",
        "إدارة المرور ووقت الشفاء قبل إعادة فتح الطريق.",
      ],
      qaqc: [
        "تُقدّم بيانات المواد والموافقات قبل التطبيق.",
        "تُقاس وتُسجّل سماكة الفيلم الرطب/الجاف.",
        "تُقاس الانعكاسية (RL) بعاكس في مواقع تمثيلية.",
        "يُختبر الالتصاق وفق الطريقة المحددة.",
        "يُتحقق من التفاوت الأبعادي مقابل المخططات المعتمدة.",
        "تُصلح حالات عدم المطابقة قبل التسليم؛ تُصدر السجلات.",
      ],
      procurement: [
        "قدّم المخططات المعتمدة والمواصفات والمعيار الحاكم.",
        "أكّد الكميات ونوع السطح وحالته وقيود الدخول.",
        "حدّد الجدول ونوافذ إغلاق المسارات ومسؤولية إدارة المرور.",
        "أكّد معايير القبول: السماكة والانعكاسية والالتصاق والأبعاد.",
        "حدّد جهة الفحص والوثائق المطلوبة.",
      ],
      faqs: [
        { q: "ما المعيار الذي تُطبّقون وفقًه علامات الطرق؟", a: "نطبّق وفق معيار العميل المحدد. حيث لا يحدد العميل، نرجع إلى معايير علامات طرق معترف بها ونؤكد الوثيقة الحاكمة في كشف الطريقة. يُذكر محتوى المعايير بالمصدر والإصدار والاختصاص في صفحات الموارد الفنية." },
        { q: "هل توفّرون المواد والمعدات؟", a: "نعم. نوفّر مادة الثرموبلاستيك والخرزات العاكسة والبرايمر ومعدات التطبيق والطاقم. تُقدّم بيانات المواد وقوائم المعدات مع العرض الفني." },
        { q: "هل تعملون ليلاً؟", a: "نعم — العمل الليلي وإغلاق المسارات يُخطط ضمن خطة إدارة المرور حيثما يتطلبه الجدول أو جهة الطرق." },
      ],
    },
    {
      slug: "thermoplastic",
      icon: "Flame",
      image: "/images/thermoplastic-application.jpg",
      navLabel: "علامات الثرموبلاستيك",
      title: "علامات الثرموبلاستيك",
      h1: "خدمات علامات الثرموبلاستيك في السعودية والخليج",
      intro: "ثرموبلاستيك ساخن مع خرزات زجاجية عاكسة — النظام المتين عالي الانعكاسية للطرق السريعة والتقاطعات والمواقع عالية الاحتكاك.",
      directAnswer: "علامات الثرموبلاستيك مادة ساخنة (~180–220°م) مع خرزات عاكسة مدمجة، توفّر متانة عالية ورؤية ليلية للطرق عالية الحركة. تُطبّقها جلف سيسمك بدرجة حرارة وسماكة وتضمين خرزات مضبوط وموثّق عبر خطة فحص.",
      problem: [
        "ثرموبلاستيك يُطبّق خارج نطاق الحرارة، مما يسبب ضعف التصاق وتفقيعاً.",
        "خرزات زجاجية غير مدمجة جيداً — تتساقط تحت الحركة وتنهار الانعكاسية.",
        "سماكة فيلم غير كافية تقلل العمر عن المواصفات.",
        "تلوث السطح والرطوبة غير معالجين، مما يسبب التقشير.",
      ],
      selection: [
        "ثرموبلاستيك نوع I/II/III وفق المعيار المحدد وحجم الحركة.",
        "خرزات تناثر: معامل انكسار وتدرّج وفق المواصفات.",
        "برايمر/طبقة لاصقة للخرسانة أو الأسفلت القديم.",
        "ثرموبلاستيك جاهز للرموز وأشرطة التوقف والعلامات الخاصة.",
      ],
      methodology: [
        "تحضير السطح: تنظيف وتجفيف وإزالة المواد السائبة والعلامات المتعارضة.",
        "تسخين المادة في قدر مضبوط لدرجة حرارة التطبيق للشركة المصنّعة.",
        "تطبيق بمعدات الجرف أو الرش البثق للسماكة المحددة.",
        "رش الخرزات بالمعدل والتضمين الصحيحين بينما المادة منصهرة.",
        "هندسة الخط مضبوطة من التخطيط المعتمد؛ التقاطعات والرموز منفصلة.",
        "وقت الشفاء وتأكيد عدم الالتصاق قبل إعادة فتح الطريق.",
      ],
      qaqc: [
        "تُسجّل درجة حرارة المادة عند القدر وعند التطبيق.",
        "تُقاس وتُسجّل سماكة الفيلم الجاف مقابل المواصفات.",
        "يُتحقق من تضمين ومعدل الخرزات بصرياً وبالعينة.",
        "تُقاس الانعكاسية بعاكس.",
        "يُفحص الالتصاق والمظهر؛ تُصلح حالات عدم المطابقة.",
      ],
      procurement: [
        "أكّد نوع الثرموبلاستيك ومواصفات الخرزات ومتطلب البرايمر.",
        "قدّم الكميات وأنواع الخطوط ومجموعة المخططات المعتمدة.",
        "حدّد نوع السطح وحالته وأي علامات موجودة لإزالتها.",
        "أكّد الجدول ونوافذ الإغلاق ومعايير القبول.",
      ],
      faqs: [
        { q: "كم يدوم الثرموبلاستيك؟", a: "يعتمد العمر على حجم الحركة وحالة السطح ونوع المادة والمناخ. في ظروف طرق سريعة نموذجية يمكن لخط الثرموبلاستيك الصحيح أن يوفّر عدة سنوات من الخدمة؛ ننصح بالعمر المتوقع لموقعك بعد مراجعة النطاق." },
        { q: "ثرموبلاستيك مقابل بلاستيك بارد — أيهما أحدد؟", a: "الثرموبلاستيك مفضل للطرق السريعة عالية الحركة للمتانة واحتفاظ الخرزات. البلاستيك البارد (MMA) يناسب المناطق التي تحتاج شفاءً سريعاً أو فيلماً رقيقاً أو ثبات لون أو مقاومة كيميائية. تتضمن صفحة الموارد الفنية مصفوفة اختيار." },
        { q: "هل تقيسون الانعكاسية؟", a: "نعم. تُقاس الانعكاسية بعاكس في مواقع تمثيلية وتُسجّل في وثائق الفحص." },
      ],
    },
    {
      slug: "airport-runway",
      icon: "Plane",
      image: "/images/airport-runway-marking.jpg",
      navLabel: "علامات المطارات والمدرجات",
      title: "علامات المطارات والمدرجات",
      h1: "علامات المطارات والمدرجات لمطارات السعودية والخليج",
      intro: "علامات مدارج دقيقة — خط الوسط والعتبة ومنطقة اللمس وخطوط الممرات والمواقف — تُطبّق وفق معايير الطيران مع تحكم صارم في الأبعاد والمواد.",
      directAnswer: "تتطلب علامات المطارات هندسة دقيقة ومواد معتمدة للطيران وضمان جودة موثّق. تُطبّق جلف سيسمك علامات المدرجات والممرات والمواقف بكشوف طرق وخطط فحص متوافقة مع المعيار الحاكم، للمشاريع حيث يكون مسار التشغيل مبرراً تجارياً.",
      problem: [
        "علامات مدرج بضعف انعكاسية في ظروف الرؤية المنخفضة والمبللة.",
        "أخطاء أبعاد في عتبة المدرج ومنطقة اللمس تسبب رفض المسح.",
        "مواد غير معتمدة للطيران تخاطر بعدم المطابقة وإعادة العمل.",
        "عمل يُسلسل دون تنسيق مع العمليات الجوية يسبب توقفًا.",
      ],
      selection: [
        "مواد علامات معتمدة للطيران (عادة MMA/طلاء مذيب وفق معيار المطار).",
        "خرزات زجاجية نوع I/III وفق مواصفات خرزات الطيران.",
        "إزالة رواسب المطاط والعلامات القديمة قبل التطبيق.",
        "ثرموبلاستيك جاهز لبعض علامات المواقف حيث سُمح.",
      ],
      methodology: [
        "تنسيق الجانب الجوي: نوافذ العمل وNOTAM والدخول والمرافقة.",
        "تحضير السطح: إزالة المطاط والتنظيف والتجفيف وإزالة العلامات الموجودة.",
        "مسح تخطيط لخط الوسط والعتبة ومنطقة اللمس ونقطة التصويب وعلامات الممرات.",
        "تطبيق الطلاء والوسائط العاكسة في ظروف مضبوطة.",
        "فحص أثناء التنفيذ ونهائي مقابل المعيار المعتمد.",
        "استعادة الرصيف للحالة التشغيلية قبل الإعادة.",
      ],
      qaqc: [
        "تُقدّم موافقات المواد وشهادات المطابقة.",
        "يُتحقق من التفاوت الأبعادي بالمسح.",
        "تُقاس سماكة الفيلم الجاف واللون والانعكاسية وتُسجّل.",
        "يُؤكد الالتصاق ومقاومة وقود وزيوت الطيران وفق المواصفات.",
        "تُصدر سجلات الفحص ووثائق التنفيذ لقبول المسح.",
      ],
      procurement: [
        "قدّم معيار المطار وأي مواصفات خاصة بالمشروع.",
        "أكّد دخول الجانب الجوي ونوافذ العمل ومتطلبات المرافقة/التصاريح.",
        "قدّم مخططات التخطيط المعتمدة ومتطلبات المسح.",
        "حدّد جهة القبول والوثائق المطلوبة.",
      ],
      faqs: [
        { q: "هل تعملون خلال ساعات تشغيل المطار؟", a: "يُسلسل العمل الجانب الجوي ضمن نوافذ عمل معتمدة، عادة إغلاقات ليلية، مع NOTAM وتنسيق مرافقة. يُتفق على التسلسل الدقيق مع عمليات المطار في كشف الطريقة." },
        { q: "ما المواد التي تستخدمونها على المدرجات؟", a: "مواد معتمدة للطيران وفق معيار المطار — عادة MMA أو طلاء مذيب مع خرزات طيران. لا نستبدل المواد؛ تُقدّم الموافقات وشهادات المطابقة قبل التطبيق." },
        { q: "هل تزيلون رواسب المطاط؟", a: "نعم. إزالة المطاط والعلامات الموجودة جزء من تسلسل تحضير السطح حيثما لزم." },
      ],
    },
    {
      slug: "parking-marking",
      icon: "ParkingSquare",
      image: "/images/parking-marking.jpg",
      navLabel: "علامات المواقف",
      title: "علامات المواقف",
      h1: "خدمات علامات مواقف السيارات",
      intro: "علامات مواقف حادة ومتينة — مواقف قياسية ومعاقين وأم وأطفال وشحن EV وأسهم اتجاهية ومسارات مشاة — لمواقف التجزئة والتجارية والسكنية والبلدية.",
      directAnswer: "تشمل علامات المواقف خطوط الخلج والرموز والأسهم ومواقف المعاقين وEV ومسارات المشاة. تُطبّق جلف سيسمك أنظمة الثرموبلاستيك أو البلاستيك البارد أو الطلاء المختارة للسطح والحركة والمتانة المطلوبة، مع تحكم هندسي موثّق.",
      problem: [
        "تخطيطات خلج لا تفي بالأبعاد أو أكواد إمكانية الوصول.",
        "علامات تفشل على الخرسانة المصقولة أو الأسفلت ضعيف التحضير.",
        "رموز وأسهم غير متسقة عبر مواقف متعددة المناطق.",
        "مسارات مشاة غير مفصولة عن حارات المركبات تخلق خطراً.",
      ],
      selection: [
        "ثرموبلاستيك للمواقف الخارجية عالية الدوران.",
        "بلاستيك بارد/MMA للأقبية والأسطح الخرسانية المصقولة.",
        "إيبوكسي أو بوليوريا للمناطق عالية الاحتكاك والتعرض الكيميائي.",
        "رموز جاهزة لمعاقين وEV وأم وأطفال والاتجاهية.",
      ],
      methodology: [
        "تخطيط من المخططات المعتمدة، تأكيد عدد الخلج والأبعاد.",
        "تحضير السطح ملاءمة للركيزة (أسفلت/خرسانة).",
        "تطبيق الخط بهندسة وعرض مضبوطين.",
        "تطبيق الرموز والأسهم بثرموبلاستيك جاهز أو جرف.",
        "ترميز لوني للمناطق ومسارات المشاة وخلج إمكانية الوصول.",
      ],
      qaqc: [
        "يُتحقق من أبعاد الخلج وعرض الممر مقابل التخطيط المعتمد.",
        "يُفحص عرض الخط وسماكته ومظهره.",
        "يُتحقق من اتجاه الرمز ووضعه.",
        "تُؤكد أبعاد خلج إمكانية الوصول مقابل الكود المطبّق.",
      ],
      procurement: [
        "قدّم مخطط التخطيط المعتمد وجدول الخلج.",
        "أكّد نوع السطح (أسفلت/خرسانة) وحالته.",
        "حدّد أنواع الخلج المطلوبة: قياسي، معاقين، EV، أم وأطفال، دراجة.",
        "أكّد كود إمكانية الوصول وأي متطلبات خاصة بالمشغّل.",
      ],
      faqs: [
        { q: "هل يمكنكم تمييز خلج EV وخلج المعاقين؟", a: "نعم. خلج المعاقين وEV وأم وأطفال وغيرها تُخطّط بالرموز والأبعاد الصحيحة وفق الكود المطبّق." },
        { q: "ما أفضل نظام لموقف داخلي؟", a: "عادة تُفضل أنظمة البلاستيك البارد (MMA) أو الإيبوكسي للأقبية والأسطح الخرسانية المصقولة بسبب الشفاء والالتصاق ومقاومة الانزلاق. تقارن مصفوفة الاختيار في الموارد الفنية الخيارات." },
      ],
    },
    {
      slug: "road-studs",
      icon: "CircleDot",
      image: "/images/road-stud-installation.jpg",
      navLabel: "عواكس الطرق",
      title: "عواكس الطرق والعواكس المرتفعة",
      h1: "تركيب عواكس الطرق والعواكس المرتفعة",
      intro: "عواكس عاكسة وشمسية تكمّل علامات الخط للرؤية الليلية على الطرق السريعة والمنحنيات ومقارب الأنفاق ومناطق الخطر.",
      directAnswer: "تكمّل عواكس الطرق (العواكس المرتفعة) علامات الخط لتحسين الرؤية الليلية والمبللة. تُركّب جلف سيسمك عواكس عاكسة وشمسية باللاصق والمسافات والتضمين الصحيح، متوافقة مع المعيار المحدد.",
      problem: [
        "عواكس تنفصل تحت الحركة بسبب لاصق خاطئ أو تحضير سطح سيء.",
        "مسافات وإزاحة غير صحيحة تقلل الفعالية.",
        "عواكس محددة لبيئة خاطئة (شمسية حيث ظل، غير عاكسة حيث عالية الانعكاسية مطلوبة).",
        "عواكس مركّبة على ثرموبلاستيك طازج قبل الشفاء تتحرك.",
      ],
      selection: [
        "عواكس عاكسة (أحادية/ثنائية الوجه) وفق متطلب الانعكاسية واللون.",
        "عواكس شمسية لرؤية معززة على طرق غير مضاءة ومناطق خطر.",
        "لاصق مختار للركيزة والحركة (بيتوميني أو إيبوكسي).",
        "مسافات وإزاحة وفق المعيار وهندسة الطريق.",
      ],
      methodology: [
        "تأكيد اكتمال علامات الخط وشفائها قبل تركيب العواكس.",
        "تعليم مواقع العواكس من التخطيط المعتمد.",
        "تحضير السطح: تنظيف وتجفيف وخالٍ من الغبار.",
        "تطبيق اللاصق ووضع العكس وضبطه وضغطه للتضمين الصحيح.",
        "مراعاة وقت الشفاء قبل إعادة فتح الطريق.",
      ],
      qaqc: [
        "يُتحقق من نوع العكس ولونه وانعكاسيته مقابل المواصفات.",
        "يُؤكد نوع اللاصق وشفاؤه.",
        "تُفحص المسافات والإزاحة والمحاذاة.",
        "يُفحص الالتصاق والتضمين؛ تُستبدل العواكس الرخوة.",
      ],
      procurement: [
        "قدّم المعيار ومتطلبات المسافات والإزاحة.",
        "أكّد نوع العكس (عاكس/شمسي) واللون وفئة الانعكاسية.",
        "حدّد نوع السطح وحجم الحركة لاختيار اللاصق.",
        "أكّد التسلسل نسبةً لعلامات الخط.",
      ],
      faqs: [
        { q: "عواكس عاكسة مقابل شمسية؟", a: "العواكس العاكسة تعتمد على أضواء المركبات؛ العواكس الشمسية تبعث ضوءاً نشطاً لرؤية معززة على الطرق غير المضاءة ومناطق الخطر. يقارن دليل اختيار العواكس في الموارد الفنية بينها." },
        { q: "لماذا تنفصل العواكس؟", a: "الأسباب الشائعة: لاصق خاطئ للركيزة، تحضير سطح سيء، أو تركيب قبل شفاء علامة الخط. نعالج الثلاثة في كشف الطريقة." },
      ],
    },
    {
      slug: "industrial-safety",
      icon: "ShieldAlert",
      image: "/images/industrial-safety-marking.jpg",
      navLabel: "علامات السلامة الصناعية",
      title: "علامات السلامة الصناعية",
      h1: "علامات السلامة الصناعية للمستودعات واللوجستيات والمنشآت",
      intro: "علامات أرضية لمسارات المشاة وحارات الرافعات الشوكية ومناطق الخطر وخلیج التخزين ومخارج الطوارئ — مصممة للكود ومبنية لتحمل الحركة الصناعية.",
      directAnswer: "تحدّد علامات السلامة الصناعية مسارات المشاة وحارات المركبات ومناطق الخطر والتخزين ومسارات الطوارئ على أرضيات المنشآت. تُطبّق جلف سيسمك أنظمة إيبوكسي وبوليوريا وثرموبلاستيك مختارة للركيزة والحركة والتعرض الكيميائي، مع تخطيط هندسي للامتثال للكود.",
      problem: [
        "علامات أرضية تفشل تحت حركة الرافعات الشوكية والتعرض الكيميائي.",
        "تخطيطات لا تفي بمتطلبات فصل المشاة أو المخارج.",
        "ترميز لوني غير متسق عبر المناطق يقلل الفهم.",
        "سطح مقاوم للانزلاق غير محدد حيثما لزم يخلق خطراً.",
      ],
      selection: [
        "إيبوكسي للأرضيات الصناعية العامة.",
        "بوليوريا/MMA للتطبيقات سريعة الشفاء وعالية الاحتكاك.",
        "ثرموبلاستيك للساحات الخارجية ومناطق التحميل.",
        "إضافات مقاومة للانزلاق حيثما يوجد مشاة.",
      ],
      methodology: [
        "تصميم التخطيط: مسارات مشاة، حارات مركبات، مناطق خطر، خلیج تخزين، مخارج طوارئ.",
        "تحضير السطح: طحن وتنظيف واختبار رطوبة للأرضيات الخرسانية.",
        "تطبيق البرايمر والنظام وفق مواصفات المصنّع.",
        "ترميز لوني وتطبيق رموز وفق معيار المنشأة.",
        "وقت الشفاء وتسلسل إعادة الحركة.",
      ],
      qaqc: [
        "يُتحقق من التخطيط مقابل المخطط المعتمد والكود.",
        "يُفحص الالتصاق وسماكة الفيلم والمظهر.",
        "يُتحقق من أداء مقاومة الانزلاق حيثما حدد.",
        "يُتحقق من اتساق اللون والرمز عبر المناطق.",
      ],
      procurement: [
        "قدّم مخطط الأرضية والمناطق المطلوبة.",
        "أكّد الركيزة (خرسانة/أسفلت/طلاء موجود) وحالتها.",
        "حدّد نوع الحركة (مشاة/رافعة شوكية/HGV) والتعرض الكيميائي.",
        "أكّد الكود المطبّق وأي متطلبات خاصة بالمشغّل.",
      ],
      faqs: [
        { q: "ما الألوان التي نستخدمها لعلامات السلامة؟", a: "تختلف اصطلاحات الألوان حسب الكود ومعيار المشغّل. نصمم التخطيط وفق الكود المطبّق ونؤكد الترميز في عرض التخطيط. الاصطلاحات العامة (أصفر للخطر، أبيض للحركة، أخضر للسلامة، أحمر للحريق/الإسعاف) نقطة بداية فقط." },
        { q: "هل تعملون دون إغلاق المنشأة؟", a: "حيثما أمكن نُقسّم العمل بمناطق باستخدام أنظمة سريعة الشفاء (MMA/بوليوريا) لاستمرار العمليات. خطة التقسيم جزء من كشف الطريقة." },
      ],
    },
    {
      slug: "line-removal",
      icon: "Eraser",
      image: "/images/line-removal.jpg",
      navLabel: "إزالة وإعادة العلامات",
      title: "إزالة وإعادة العلامات",
      h1: "خدمات إزالة العلامات وإعادة التمييز",
      intro: "إزالة مضبوطة للعلامات الموجودة — بالغسل بالماء أو التحزيز أو الحرق — تليها إعادة التمييز، دون إتلاف الركيزة.",
      directAnswer: "إزالة العلامات مطلوبة عند تغير التخطيطات أو عدم وضوح العلامات أو قبل إعادة الرصف. تزيل جلف سيسمك العلامات بالغسل بالماء أو التحزيز أو الحرق المختار لحماية الركيزة، ثم تعيد التمييز للتخطيط الجديد.",
      problem: [
        "طرق إزالة تتلف الركيزة (تحزيز عميق جداً، حرق ساخن جداً).",
        "خطوط شبحية — علامات قديمة مرئية عبر الطلاء الجديد تربك السائقين.",
        "إزالة مُسلسلة بشكل سيء نسبةً لإعادة التمييز تترك الطريق بلا توجيه.",
        "حطام وماء غير مُدارين يخلقان مخاطر بيئية وسلامة.",
      ],
      selection: [
        "غسل بماء عالي الضغط لإزالة غير مدمرة على معظم الأسطح.",
        "تحزيز/طحن للثرموبلاستيك السميك حيث تتحمله الركيزة.",
        "هواء ساخن/حرق لإزالة الطلاء حيثما يناسب.",
        "شريط/طلاء تغطية كحل بديل مؤقت حيث الإزالة غير ممكنة.",
      ],
      methodology: [
        "تقييم نوع العلامة وسماكتها والركيزة لاختيار طريقة الإزالة.",
        "إزالة العلامات للمستوى المستهدف دون إتلاف الركيزة.",
        "تنظيف السطح وإزالة الحطام والماء.",
        "فحص الخطوط الشبحية وسلامة الركيزة.",
        "إعادة التمييز للتخطيط الجديد بالنظام المحدد.",
      ],
      qaqc: [
        "عمق الإزالة مضبوط لتجنب إتلاف الركيزة.",
        "يُفحص وجود الخطوط الشبحية بعد الإزالة.",
        "تُفحص سلامة الركيزة قبل إعادة التمييز.",
        "تُفحص العلامة الجديدة وفق ضمان جودة الخدمة المطبّق.",
      ],
      procurement: [
        "قدّم نوع العلامة الموجودة ومخطط التخطيط الجديد.",
        "أكّد نوع السطح وحالته.",
        "حدّد ما إذا كانت التغطية المؤقتة مقبولة أو الإزالة الكاملة مطلوبة.",
        "أكّد الجدول وتسلسل إدارة المرور.",
      ],
      faqs: [
        { q: "هل ستتلف الإزالة الأسفلت؟", a: "يتحكم اختيار الطريقة في ذلك. الغسل بالماء غير مدمّر على معظم الأسطح؛ يُستخدم التحزيز فقط حيث تتحمله الركيزة. نتفحص سلامة الركيزة قبل إعادة التمييز." },
        { q: "هل تزيلون العلامات ليلاً؟", a: "نعم — يمكن تسلسل الغسل بالماء والتحزيز ضمن نوافذ عمل ليلية مع إدارة مرور مناسبة." },
      ],
    },
  ],
  industries: {
    h1: "القطاعات التي نخدمها",
    sub: "أنظمة علامات محددة للمشتري والسطح وبيئة التشغيل — لا تخطيطات عامة.",
    items: [
      { slug: "highways", icon: "Route", title: "الطرق والطرق السريعة", summary: "علامات طرق سريعة وحضرية عالية الحركة بالثرموبلاستيك والعواكس وضمان جودة موثّق.", bullets: ["علامات الثرموبلاستيك", "عواكس عاكسة", "كشوف طرق وخطط فحص", "اختبار الانعكاسية"] },
      { slug: "airports", icon: "Plane", title: "المطارات والطيران", summary: "علامات مدرج وممرات ومواقف وفق معايير الطيران مع مسح دقيق وتنسيق جانب جوي.", bullets: ["خط الوسط والعتبة", "علامات منطقة اللمس", "إزالة المطاط", "نوافذ عمل جانب جوي"] },
      { slug: "industrial", icon: "Factory", title: "الصناعة والمستودعات", summary: "علامات أرضية مستودعات ولوجستيات للفصل والسلامة وتقسيم التخزين.", bullets: ["فصل مشاة ورافعات", "مناطق خطر وتخزين", "أنظمة إيبوكسي وبوليوريا", "خيارات مقاومة الانزلاق"] },
      { slug: "parking", icon: "ParkingSquare", title: "المواقف والتجاري", summary: "مواقف تجزئة وتجارية وسكنية مع خلج معاقين وEV.", bullets: ["علامات خلج وممر", "خلج معاقين وEV", "رموز اتجاهية", "تخطيط وفق الكود"] },
      { slug: "ports", icon: "Ship", title: "الموانئ واللوجستيات", summary: "علامات متينة لساحات الحاويات والرصيف ومناطق لوجستيات الموانئ.", bullets: ["ثرموبلاستيك عالي الاحتكاك", "علامات حاويات وحارات", "أنظمة مقاومة كيميائياً", "تنفيذ مُقسّم"] },
      { slug: "communities", icon: "Building2", title: "السكن والمجتمعات", summary: "علامات مجتمعات وسكنية — تهدئة سرعة، مواقف، مسارات مشاة.", bullets: ["خلج مواقف", "مسارات مشاة", "حدبات وخطوط اهتزاز", "علامات مناطق لعب"] },
    ],
  },
  projects: {
    h1: "المشاريع والقدرات",
    sub: "دليل لنطاق خدماتنا وقدراتنا. حيثما يُتحقق المشروع يُقدّم كدراسة حالة؛ حيثما لا تتحقق البيانات بعد يُقدّم كمثال قدرة.",
  },
  caseStudies: {
    h1: "دراسات حالة وأمثلة قدرات",
    sub: "كل إدخال مُعلم بحالة الإثبات. لا نقدّم أمثلة القدرات كمشاريع مكتملة.",
    disclaimer: "العناصر المعلمة بـ\"مثال قدرة\" تصف نطاقنا وطريقتنا القياسية، لا عقداً مكتملاً محدداً. تصبح دراسات حالة فقط عند اكتمال بيانات المشروع وإذن العميل والتحقق.",
    items: [
      {
        slug: "highway-thermoplastic-capability",
        category: "capability-example",
        title: "إعادة علامات ثرموبلاستيك للطرق السريعة — مثال قدرة",
        clientType: "جهة طرق / مقاول رئيسي",
        location: "منطقة الخليج",
        challenge: "فقدت علامات طريق سريع موجودة انعكاسيتها عبر عدة كيلومترات، مما تطلب الإزالة وإعادة التمييز تحت إدارة مرور بنوافذ ليلية قصيرة.",
        scope: "إزالة خطوط، علامات خط وحافة ثرموبلاستيك، تركيب عواكس عاكسة عبر قسم طريق سريع متعدد الكيلومترات.",
        solution: "عمل ليلي مُقسّم بإزالة بالغسل ثم تطبيق ثرموبلاستيك ساخن وتركيب عواكس، مُسلسل لإبقاء مسار واحد مفتوحاً على الأقل.",
        materials: "ثرموبلاستيك ساخن، خرزات تناثر، لاصق بيتوميني، عواكس عاكسة.",
        equipment: "قدر ثرموبلاستيك، جهاز تطبيق جرف/بثق، راشر خرزات، غسّال ماء، مُحزّ إزالة خطوط، عاكس.",
        result: "انعكاسية وسماكة والتصاق موثّقة؛ سجلات تنفيذ وفحص مُصدرة. تُؤكد الكميات والنتائج المحددة لكل مشروع بعد مراجعة النطاق.",
        image: "/images/hero-highway.jpg",
      },
      {
        slug: "airport-runway-capability",
        category: "capability-example",
        title: "إعادة علامات مدرج مطار — مثال قدرة",
        clientType: "مشغّل مطار / استشاري طيران",
        location: "منطقة الخليج",
        challenge: "تطلبت علامات المدرج إعادة تمييز بمواد معتمدة للطيران، ضمن نوافذ عمل ليلية وبتحكم مسح دقيق.",
        scope: "إزالة مطاط، إزالة علامات قديمة، خط وسط المدرج والعتبة ومنطقة اللمس وعلامات الممرات.",
        solution: "تنسيق جانب جوي مع العمليات، تحضير سطح، مسح تخطيط دقيق، تطبيق مادة معتمدة للطيران بوسائط عاكسة، فحص مسح نهائي.",
        materials: "طلاء MMA/مذيب معتمد للطيران، خرزات طيران.",
        equipment: "معدات علامات جانب جوي، مسح تخطيط، عاكس، وحدة إزالة مطاط.",
        result: "علامات مقبولة بالمسح بانعكاسية وأبعاد ومطابقة مواد موثّقة. التفاصيل تُؤكد لكل مشروع.",
        image: "/images/airport-runway-marking.jpg",
      },
      {
        slug: "warehouse-safety-capability",
        category: "capability-example",
        title: "علامات سلامة مستودع — مثال قدرة",
        clientType: "مشغّل لوجستي / مدير منشأة",
        location: "منطقة الخليج",
        challenge: "احتاج مستودع مزدحم لفصل المشاة وحارات الرافعات ومناطق الخطر دون إغلاق تشغيلي كامل.",
        scope: "تصميم تخطيط، تحضير سطح، علامات إيبوكسي مع مقاومة انزلاق في مناطق المشاة، تقسيم لوني ورموز.",
        solution: "تنفيذ مُقسّم منطقة تلو الأخرى باستخدام أنظمة سريعة الشفاء، مع الحفاظ على مسارات المشاة طوال الوقت.",
        materials: "علامات إيبوكسي/MMA، إضافة مقاومة انزلاق، رموز جاهزة.",
        equipment: "طاحن سطح، جهاز تطبيق شريط خطوط، معدات علامات.",
        result: "تخطيط متوافق مع الكود مع التصاق وأداء انزلاق موثّق. التفاصيل تُؤكد لكل مشروع.",
        image: "/images/industrial-safety-marking.jpg",
      },
    ],
  },
  resources: {
    h1: "الموارد الفنية والمعايير",
    sub: "موارد دعم المشتريات. كل عنصر يُظهر المصدر والاختصاص وحالة المراجع وإخلاء مسؤولية. محتوى المعايير يتطلب تحقق المراجع قبل الاستخدام.",
    items: [
      {
        slug: "rfq-checklist",
        icon: "ListChecks",
        title: "قائمة طلب عرض علامات طرق سعودية",
        summary: "المعلومات التي يجب أن يجمعها فريق المشتريات قبل إصدار طلب عرض علامات طرق في السعودية.",
        type: "قائمة",
        source: "ممارسة مشتريات جلف سيسمك",
        jurisdiction: "السعودية / الخليج",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "هذه القائمة أداة مشتريات، لا بديل عن مواصفات العميل أو المعيار الحاكم. أكّد المعيار المطبّق قبل الاستخدام.",
        items: [
          "مجموعة مخططات معتمدة بأنواع الخطوط والأعراض والرموز",
          "المعيار الحاكم وأي مواصفات خاصة بالمشروع",
          "الكميات (أمتار خطية، رموز، عواكس)",
          "نوع السطح وعمره وحالته",
          "علامات موجودة للإزالة أو التغطية",
          "الجدول ونوافذ الإغلاق/العمل",
          "مسؤولية إدارة المرور",
          "معايير القبول: السماكة، الانعكاسية، الالتصاق، الأبعاد",
          "جهة الفحص والوثائق المطلوبة",
          "متطلب مسار التشغيل السعودي (مباشر/بقيادة شريك/خاص بمشروع)",
        ],
      },
      {
        slug: "thermoplastic-matrix",
        icon: "TableProperties",
        title: "مصفوفة اختيار نظام الثرموبلاستيك",
        summary: "مقارنة الثرموبلاستيك والبلاستيك البارد (MMA) والطلاء والأنظمة الجاهزة بالتطبيق والمتانة والشفاء والتكلفة.",
        type: "مصفوفة",
        source: "ممارسة جلف سيسمك الفنية",
        jurisdiction: "عام",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "يعتمد الاختيار على المعيار المحدد والركيزة والمناخ والحركة. أكّد ببيانات المصنّع والمعيار الحاكم.",
        items: [
          "ثرموبلاستيك ساخن — طرق سريعة عالية الحركة، متانة عالية، خرزات مدمجة، ~180–220°م",
          "بلاستيك بارد (MMA) — شفاء سريع، فيلم رقيق، ثبات لون، مقاومة كيميائية، استخدام داخلي",
          "طلاء مذرب/مائي — طرق مؤقتة أو منخفضة الحركة، تكلفة منخفضة، عمر قصير",
          "ثرموبلاستيك جاهز — رموز وأشكال وعلامات خاصة قصيرة المدى",
          "إيبوكسي/بوليوريا — أرضيات صناعية، احتكاك عالٍ، تعرض كيميائي",
        ],
      },
      {
        slug: "itp-checklist",
        icon: "ClipboardCheck",
        title: "قائمة خطة الفحص والاختبار (ITP)",
        summary: "نقاط الإمساك والشهود والمراجعة التي يجب أن تغطيها خطة فحص علامات الطرق.",
        type: "قائمة",
        source: "ممارسة ضمان الجودة لدى جلف سيسمك",
        jurisdiction: "عام",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "يجب أن يتوافق محتوى ITP مع مواصفات العميل والمعيار الحاكم. هذا هيكل بداية، لا ITP معتمد.",
        items: [
          "موافقة المواد وشهادة المطابقة (إمساك)",
          "تحضير السطح وفحص الرطوبة (شهود)",
          "درجة حرارة التطبيق عند القدر وعند السطح (شهود)",
          "سماكة الفيلم الجاف (شهود)",
          "معدل وتضمين الخرزات (شهود)",
          "قياس انعكاسية RL (إمساك)",
          "اختبار الالتصاق (إمساك)",
          "فحص التفاوت الأبعادي (شهود)",
          "سجل عدم المطابقة والإصلاح (مراجعة)",
          "وثائق التنفيذ والتسليم (إمساك)",
        ],
      },
      {
        slug: "method-statement-guide",
        icon: "FileText",
        title: "دليل كشف طريقة العلامات",
        summary: "الهيكل الذي يجب أن يتبعه كشف طريقة العلامات لإرضاء الاستشاريين وأصحاب العمل.",
        type: "دليل",
        source: "ممارسة جلف سيسمك الفنية",
        jurisdiction: "عام",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "يجب أن يكون كشف الطريقة خاصاً بالمشروع ومعتمداً من مهندس العميل. هذا الدليل مرجع هيكلي فقط.",
        items: [
          "النطاق والمراجع (المخططات، المواصفات، المعايير)",
          "الموارد: الطاقم، المعدات، المواد",
          "طريقة تحضير السطح",
          "طريقة التطبيق والمعاملات (الحرارة، السماكة، معدل الخرزات)",
          "إدارة المرور وضوابط الصحة والسلامة",
          "نظام ضمان الجودة والفحص (مرتبط بـ ITP)",
          "عدم المطابقة والإصلاح",
          "التسليم والوثائق",
        ],
      },
      {
        slug: "road-stud-guide",
        icon: "CircleDot",
        title: "دليل اختيار عواكس الطرق",
        summary: "كيفية اختيار العواكس العاكسة مقابل الشمسية حسب نوع الطريق والإضاءة والخطر.",
        type: "دليل",
        source: "ممارسة جلف سيسمك الفنية",
        jurisdiction: "عام",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "يجب أن تتبع المسافات والإزاحة والنوع المعيار الحاكم. أكّد مع جهة الطرق قبل الاستخدام.",
        items: [
          "عواكس عاكسة — تكمل علامات الخط على الطرق المضاءة وغير المضاءة",
          "عواكس شمسية — رؤية معززة على طرق سريعة غير مضاءة ومنحنيات ومناطق خطر",
          "اختيار اللاصق — بيتوميني للأسفلت، إيبوكسي للخرسانة",
          "المسافات والإزاحة وفق المعيار وهندسة الطريق",
          "ركّب فقط بعد شفاء علامات الخط",
        ],
      },
      {
        slug: "line-removal-guide",
        icon: "Eraser",
        title: "دليل قرار إزالة وإعادة العلامات",
        summary: "متى تُزال مقابل التغطية، وأي طريقة إزالة تحمي الركيزة.",
        type: "دليل",
        source: "ممارسة جلف سيسمك الفنية",
        jurisdiction: "عام",
        reviewer: "بانتظار تحقق المراجع الفني",
        disclaimer: "تعتمد طريقة الإزالة على نوع العلامة وسماكتها والركيزة. افحص سلامة الركيزة قبل إعادة التمييز.",
        items: [
          "غسل بماء عالي الضغط — غير مدمّر، معظم الأسطح",
          "تحزيز — ثرموبلاستيك سميك حيث تتحمله الركيزة",
          "هواء ساخن/حرق — إزالة طلاء حيثما يناسب",
          "تغطية — مؤقت فقط، لا حل دائم",
          "فحص الخطوط الشبحية والركيزة قبل إعادة التمييز",
        ],
      },
    ],
  },
  saudiPresence: {
    h1: "التواجد في السعودية — برنامج وصول شفاف للسوق",
    sub: "يسبق الامتثال ونموذج التشغيل الاستثمار السعودي الكبير. ننشر ما هو متحقق ومخطط وقيد التنفيذ — لا شيء مختلق.",
    intro: "مقر شركة جلف سيسمك العامة للمقاولات في أبوظبي، الإمارات. برنامجنا للوصول إلى السوق السعودية منظّم ومُسلسل وصادق. لا ندّعي تسجيلات أو مكاتب أو طاقماً أو عملاء أو مشاريع سعودية لا نملكها. حيثما يكون مسار التشغيل السعودي مبرراً تجارياً، نسلّم عبر مسارات بقيادة شريك أو خاصة بمشروع. هذه الصفحة هي خطة التنفيذ، لا ادعاء تواجد.",
    gateTitle: "بوابة المرحلة 0 — الحالة المتحققة",
    gateIntro: "قبل نشر أي ادعاء تجاري سعودي، يجب التحقق من كل بند أدناه. تُعرض البنود غير المتحققة كمخطط أو قيد التنفيذ.",
    gate: [
      { item: "السجل التجاري السعودي (CR)", status: "مخطط" },
      { item: "تفويض/ترخيص MISA", status: "مخطط" },
      { item: "تسجيل/تصنيف هيئة المقاولين السعوديين", status: "مخطط" },
      { item: "تسجيل اعتماد", status: "مخطط" },
      { item: "رقم هاتف سعودي", status: "مخطط" },
      { item: "شريك سعودي", status: "قيد التنفيذ — قيد التقييم" },
      { item: "مكتب/عنوان سعودي", status: "مخطط" },
      { item: "طاقم سعودي أو قابل للتعبئة", status: "تعبئة خاصة بالمشروع" },
      { item: "عملاء/مشاريع/طلبات/عطاءات/عروض سعودية", status: "فرص مؤهلة في خط الأنابيب" },
    ],
    planTitle: "خطة تنفيذ الوصول إلى السوق",
    plan: [
      { phase: "المرحلة 1", title: "اختيار الشريك والعناية الواجبة", body: "تحديد وتأهيل شريك سعودي بنطاق متوافق ونزاهة وقدرة. عناية قانونية وتجارية قبل أي التزام." },
      { phase: "المرحلة 2", title: "التسجيل والترخيص", body: "السجل التجاري السعودي، تفويض MISA حيثما لزم، تصنيف هيئة المقاولين السعوديين، وتسجيل اعتماد لأهلية المشتريات الحكومية." },
      { phase: "المرحلة 3", title: "البنية التشغيلية", body: "هاتف وعنوان وبنك وتأمين سعودي؛ خطة طاقم ومعدات قابلة للتعبئة؛ الامتثال للسعودة ومتطلبات العمل." },
      { phase: "المرحلة 4", title: "خط الأنابيب والإثبات", body: "تحويل الفرص المؤهلة إلى طلبات وعروض وعقود؛ بناء دراسات حالة متحققة بإذن العميل؛ نشر الإثبات المتحقق فقط." },
    ],
    routeTitle: "مسارات التسليم السعودي",
    routes: [
      { name: "تسليم بقيادة شريك", body: "يحمل شريك سعودي مؤهّل العقد الرئيسي والامتثال المحلي؛ تسلّم جلف سيسمك نطاق العلامات تحت مقاولة من الباطن أو ترتيب مشترك. يُستخدم حيث لم يُؤسس التواجد السعودي بعد لكن توجد فرصة حقيقية." },
      { name: "مسار خاص بمشروع", body: "يُنفّذ مشروع واحد بترتيب خاص بمشروع بكفالة محلية وتسجيل وامتثال محدود بذلك المشروع. يُستخدم للفرص الكبيرة المحددة." },
      { name: "تواجد مباشر (مخطط)", body: "يُؤسس فقط عند اكتمال CR وMISA وتصنيف هيئة المقاولين السعوديين وتسجيل اعتماد وأن يكون مبرراً تجارياً. حتى ذلك الحين تُستخدم المسارات بقيادة شريك والخاصة بمشروع." },
    ],
    faqs: [
      { q: "هل أنتم مسجلون في السعودية؟", a: "ليس بعد. تسجيلاتنا مخططة أو قيد التنفيذ، كما هو موضح في بوابة المرحلة 0. نسلّم عبر مسارات بقيادة شريك أو خاصة بمشروع حتى يُؤسس التواجد المباشر." },
      { q: "هل يمكنكم التقدم لعطاءات حكومية سعودية؟", a: "تتطلب أهلية المشتريات الحكومية تسجيل اعتماد وتصنيف هيئة المقاولين السعوديين. حتى اكتمالها، نسعى للفرص الخاصة وطرق بقيادة شريك للعمل المتاخم للحكومة." },
      { q: "لماذا لا تنشرون هاتفاً ومكتباً سعودياً؟", a: "لأننا لا نملكهما بعد. نشر تفاصيل اتصال لا نشغّلها ادعاء كاذب. سيُنشر هاتف ومكتب سعودي عند تفعيلهما." },
    ],
  },
  saudiMobilization: {
    h1: "المقاولة من الباطن والتعبئة السعودية",
    sub: "كيف تُعبّئ جلف سيسمك لحزمة علامات سعودية عبر مسارات بقيادة شريك أو خاصة بمشروع.",
    intro: "حيثما يكون مسار التشغيل السعودي مبرراً تجارياً، تتبع التعبئة تسلسلاً مضبوطاً. لا نوحي بأننا نستطيع التعبئة في أي مكان وأي وقت — كل تعبئة تعتمد على حالة الشريك والتسجيلات والملف التجاري والامتثالي للمشروع.",
    steps: [
      { title: "1. تأهيل الفرصة", body: "نؤهّل الفرصة: نوع العميل، النطاق، القيمة، الجدول، الموقع ومرحلة المشتريات. تتقدم فرص الفئة (أ) فوراً." },
      { title: "2. اختيار المسار", body: "نختار مسار التسليم: بقيادة شريك، خاص بمشروع، أو (حيث مسجل) مباشر. يحدد المسار الامتثال والتعاقد وتوزيع المخاطر." },
      { title: "3. إعداد الشريك والامتثال", body: "حيث بقيادة شريك، يحمل الشريك السعودي العقد الرئيسي والامتثال المحلي؛ تحمل جلف سيسمك مقاولة العلامات من الباطن. حيث خاص بمشروع، تُرتب الكفالة والتسجيل محدوداً بالمشروع." },
      { title: "4. العرض الفني", body: "يُصدر كشف طريقة، خطة فحص، مواد، معدات، طاقم، جدول وسعر للنطاق المحدد." },
      { title: "5. التعبئة", body: "تُعتمد المواد، تُعبّأ المعدات والطاقم، تُؤسس إدارة المرور والصحة والسلامة في الموقع، بالتنسيق مع الشريك والعميل." },
      { title: "6. التنفيذ والتسليم", body: "تُطبّق العلامات وفق الطريقة؛ يُوثّق ضمان الجودة؛ الإصلاح والتسليم بسجلات تنفيذ وفحص." },
    ],
    partners: [
      "يُؤهّل الشركاء السعوديون بعناية قانونية وتجارية قبل الالتزام.",
      "يستخدم التسليم بقيادة شريك أصلاً سعودياً متحققاً للامتثال المحلي.",
      "تحدد المسارات الخاصة بمشروع الكفالة والتسليم للمشروع.",
      "يُستخدم التواجد المباشر فقط عند اكتمال التسجيلات وأن يكون مبرراً تجارياً.",
    ],
    faqs: [
      { q: "ما سرعة تعبئتكم في السعودية؟", a: "يعتمد وقت التعبئة على المسار وحالة الشريك والملف الامتثالي للمشروع. لفرصة مؤهلة بمسار بقيادة شريك، تتبع التعبئة الخطوات أعلاه بعد قبول العرض الفني." },
      { q: "هل تحتاجون شريكاً سعودياً؟", a: "حتى اكتمال التسجيل المباشر، تُستخدم مسارات بقيادة شريك أو خاصة بمشروع. لذا يلزم شريك سعودي مؤهّل لمعظم التعاملات السعودية اليوم." },
    ],
  },
  gcc: {
    h1: "تغطية الخليج",
    sub: "تمتد قدرات العلامات عبر الخليج عبر مسارات بقيادة شريك، بادعاءات تغطية صادقة.",
    intro: "مقر جلف سيسمك في الإمارات وتخدم أسواق الخليج عبر مسارات بقيادة شريك وخاصة بمشروع. لا ندّعي مكاتب في كل دولة خليجية. التغطية حقيقية حيثما نستطيع الرد والتسعير والتعبئة عبر مسار متحقق.",
    countries: [
      { name: "الإمارات العربية المتحدة", code: "AE", note: "السوق الرئيسي — تنفيذ مباشر." },
      { name: "المملكة العربية السعودية", code: "SA", note: "مسارات بقيادة شريك وخاصة بمشروع؛ تواجد مباشر مخطط." },
      { name: "قطر", code: "QA", note: "مسار بقيادة شريك للفرص المؤهلة." },
      { name: "عُمان", code: "OM", note: "مسار خاص بمشروع عند الطلب." },
      { name: "الكويت", code: "KW", note: "مسار خاص بمشروع عند الطلب." },
      { name: "البحرين", code: "BH", note: "مسار خاص بمشروع عند الطلب." },
    ],
    faqs: [
      { q: "هل لديكم مكاتب في كل دول الخليج؟", a: "لا. مقرنا في الإمارات ونعمل في أسواق خليجية أخرى عبر مسارات بقيادة شريك وخاصة بمشروع. ننشر التغطية فقط حيثما نستطيع الرد والتسعير والتعبئة عبر مسار متحقق." },
      { q: "هل تسعّرون لمشروع قطري أو عماني؟", a: "نعم، للفرص المؤهلة، عبر مسار بقيادة شريك أو خاص بمشروع. أرسل طلب عرض ونؤكد المسار والرد." },
    ],
  },
  about: {
    h1: "من نحن — جلف سيسمك",
    sub: "مقاول متخصص في علامات الطرق والبنية التحتية مقره أبوظبي، ينفذ برنامجاً منظماً للوصول إلى السوق السعودية والخليجية.",
    story: [
      "شركة جلف سيسمك العامة للمقاولات هي مقاول علامات طرق وبنية تحتية مقره أبوظبي، الإمارات. تخصصنا الأساسي هو العلامات — ثرموبلاستيك الطرق، علامات المطارات والمدرجات، علامات المواقف، عواكس الطرق، علامات السلامة الصناعية وإزالة العلامات.",
      "ننفذ برنامجاً منظماً للوصول إلى السوق السعودية والخليجية. يسبق الامتثال ونموذج التشغيل الاستثمار الكبير، ولا ننشر سوى الحالة المتحققة. حيث لا يكون التواجد المباشر مؤسساً بعد، نسلّم عبر مسارات بقيادة شريك وخاصة بمشروع.",
      "نموذجنا التجاري مبني على مراجعة النطاق وكشوف الطرق وخطط الفحص وضمان الجودة الموثّق وعملية طلب عرض جاهزة للمشتريات. نقيس النجاح بالطلبات والعروض والعقود المؤهلة — لا بمشاهدات الصفحات.",
    ],
    values: [
      { icon: "ShieldCheck", title: "الامتثال أولاً", body: "لا ندّعي تسجيلات أو مكاتب أو عملاء أو مشاريع لا نملكها. الوصول للسوق يُكتسب لا يُوحى." },
      { icon: "FileCheck2", title: "إثبات فني", body: "كشوف طرق وخطط فحص وإثبات معدات وطاقم وضمان جودة موثّق لكل حزمة." },
      { icon: "ClipboardCheck", title: "النطاق قبل السعر", body: "نراجع المخططات والمواصفات وحالة الموقع قبل التسعير — ليعكس السعر النطاق الحقيقي." },
      { icon: "Gauge", title: "نتائج مُقاسة", body: "نتتبع الطلبات والعروض والعقود المؤهلة — لا مقاييس الزخم." },
    ],
    capabilities: [
      "علامات طرق ثرموبلاستيك وبلاستيك بارد",
      "علامات مطار ومدرج وممرات ومواقف",
      "علامات خلج مواقف ورموز ومسارات مشاة",
      "تركيب عواكس طرق وعواكس مرتفعة",
      "علامات سلامة صناعية وأرضيات مستودعات",
      "إزالة علامات وإعادة تمييز",
      "كشوف طرق وخطط فحص وضمان جودة موثّق",
      "رد طلب عرض جاهز للمشتريات مع رفع مخططات/مواصفات",
    ],
    compliance: [
      "بوابة المرحلة 0: حالة متحققة لكل تسجيل سعودي قبل أي ادعاء",
      "لا عملاء أو مشاريع أو شهادات أو موافقات مختلقة",
      "مسارات تسليم سعودية بقيادة شريك وخاصة بمشروع",
      "محتوى المعايير مذكور بالمصدر والاختصاص وحالة المراجع",
    ],
  },
  contactRfq: {
    h1: "اتصل واطلب عرض سعر فني",
    sub: "ارفع المخططات والمواصفات. استلم رداً فنياً بعد مراجعة النطاق، لا عرضاً عاماً.",
    formTitle: "اطلب عرض سعر فني",
    fields: {
      name: "الاسم الكامل",
      company: "الشركة",
      role: "المسمى الوظيفي",
      email: "البريد الإلكتروني",
      phone: "الهاتف / واتساب",
      country: "الدولة",
      city: "المدينة",
      projectName: "اسم المشروع",
      clientType: "نوع العميل",
      service: "الخدمة المطلوبة",
      quantity: "الكمية (أمتار خطية / وحدات)",
      surface: "نوع السطح وحالته",
      completionDate: "تاريخ الإكمال المطلوب",
      procurementStage: "مرحلة المشتريات",
      saudiRoute: "متطلب مسار التشغيل السعودي",
      preferredContact: "طريقة الاتصال المفضلة",
      message: "ملخص المشروع",
      attachments: "ارفع المخططات / المواصفات",
      consent: "أوافق على أن تتواصل معي جلف سيسمك بخصوص طلب العرض هذا وتخزن التفاصيل المقدمة.",
      submit: "إرسال طلب العرض",
      success: "تم استلام طلب العرض. تستلم استفسارات الفئة (أ) رداً فنياً خلال يوم عمل واحد.",
    },
    options: {
      clientType: ["استشاري", "مقاول رئيسي", "EPC", "مالك منشأة", "حكومة / جهة", "أخرى"],
      service: [
        "علامات طرق وطرق سريعة",
        "علامات ثرموبلاستيك",
        "علامات مطار ومدرج",
        "علامات مواقف",
        "عواكس طرق",
        "علامات سلامة صناعية",
        "إزالة وإعادة علامات",
        "متعدد / غير متأكد",
      ],
      procurementStage: ["ميزانية", "مناقصة", "ترسية", "تعبئة", "معلومات فقط"],
      saudiRoute: ["مباشر", "بقيادة شريك", "خاص بمشروع", "غير متأكد"],
      preferredContact: ["بريد إلكتروني", "هاتف", "واتساب"],
    },
    assistantTitle: "مساعد طلب العرض بالذكاء الاصطناعي",
    assistantSub: "اطرح سؤالاً فنياً عن النطاق أو المواد أو الطريقة أو المعايير. يساعدك المساعد في تجميع ملخص جاهز لطلب العرض.",
    analyzerTitle: "محلل المخططات / المواصفات",
    analyzerSub: "ارفع مخططاً أو مقتطفاً من المواصفات. يقرأ المحلل الصورة ويلخّص أنواع الخطوط والمواد ونقاط الفحص لإعلام طلب عرضك.",
    gradesTitle: "كيف نصنّف الاستفسارات",
    grades: [
      { grade: "A", label: "مشروع نشط", body: "صانع قرار، مخططات/مواصفات متاحة، ddl حقيقي. رد فني خلال يوم عمل واحد." },
      { grade: "B", label: "حاجة واضحة", body: "متطلب واضح لكن النطاق أو التوقيت غير مكتمل. نساعد في إكمال النطاق قبل الرد الفني." },
      { grade: "C", label: "معلومات", body: "معلومات عامة، لا سلطة مشروع أو توقيت. نشارك القدرات والموارد." },
    ],
    slaTitle: "اتفاقية مستوى الخدمة للرد",
    slaBody: "تتلقى طلبات الفئة (أ) رداً فنياً خلال يوم عمل واحد. تتلقى استفسارات الفئة (ب) رد إكمال نطاق خلال يومي عمل. تتلقى استفسارات الفئة (ج) معلومات قدرات خلال ثلاثة أيام عمل.",
  },
};

export function getContent(lang: Lang): Content {
  return lang === "ar" ? ar : en;
}

export const servicesOrder = [
  "road-marking",
  "thermoplastic",
  "airport-runway",
  "parking-marking",
  "road-studs",
  "industrial-safety",
  "line-removal",
] as const;
