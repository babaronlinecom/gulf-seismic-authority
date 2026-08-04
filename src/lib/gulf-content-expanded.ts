/**
 * Gulf Seismic Authority Graph — Expanded Content Layer
 * ----------------------------------------------------
 * Production CMS content supplementing the base seed data in ./gulf-data.
 *
 * Exports:
 *   - expandedProjects     (44 NEW projects → total 50 with base 6)
 *   - expandedCaseStudies  (17 NEW case studies → total 20 with base 3)
 *   - expandedFaqs         (40 NEW FAQs: 5 per service × 8 services, AEO/GEO-tuned)
 *
 * Distribution:
 *   Countries:    uae (24 new) + saudi-arabia (20 new)
 *   Cities:       all 16 cities (8 UAE + 8 Saudi)
 *   Services:     all 8 (road-marking, thermoplastic-road-marking, parking-lot-marking,
 *                 warehouse-marking, airport-marking, industrial-marking,
 *                 safety-signage, epoxy-flooring)
 *   Industries:   all 10 (highways-roads, commercial, industrial, logistics, aviation,
 *                 oil-gas, residential, healthcare, energy, retail)
 *
 * All content is technically credible: real Gulf geography, road names, authorities
 * (RTA, DoT, MOMRAH, GACA, MODON, Royal Commission), real materials (thermoplastic,
 * MMA, polyurea, novolac epoxy, glass beads), real equipment. Client names are
 * anonymised per the project specification.
 */

import type { Project, CaseStudy } from "./gulf-data";

// ---------------------------------------------------------------------------
// EXPANDED PROJECTS — 44 NEW (24 UAE + 20 Saudi)
// ---------------------------------------------------------------------------

export const expandedProjects: Project[] = [
  // =====================================================================
  // UAE — ABU DHABI (5)
  // =====================================================================
  {
    slug: "abu-dhabi-corniche-bicycle-lane",
    title: "Abu Dhabi Corniche Bicycle Lane Thermoplastic Marking",
    country: "uae",
    city: "abu-dhabi",
    service: "road-marking",
    industry: "residential",
    client: "Confidential Municipal Transport Authority",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Install a continuous 6.2 km dedicated bicycle lane along the Abu Dhabi Corniche promenade with high skid resistance and UV-stable red colouring that would not fade under direct coastal sun. The work had to be done without closing the popular corniche to pedestrians or cyclists outside early-morning windows.",
    solution:
      "Specified a hot-applied pigmented thermoplastic system with integrated anti-skid calcined bauxite aggregate, laid at 3.0 mm thickness over a tack-coat primer. Red iron-oxide pigment was selected for coastal UV stability and to comply with DoT cycle-lane colour guidance.",
    execution:
      "Crews worked 4:00am–7:00am windows seven days a week, applying 6.2 km of red thermoplastic cycle lane with a self-propelled applicator, plus 1.4 km of white segregation edge lines. Glass beads were omitted from the cycle surface to keep skid resistance above 65 BPN, while edge lines received Type II beads for night delineation.",
    materials: [
      "Hot-applied red thermoplastic (iron-oxide pigmented)",
      "Calcined bauxite anti-skid aggregate",
      "Tack-coat primer",
      "Type II glass beads (edge lines only)",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle (380 L)",
      "Anti-skid aggregate dispenser",
      "British pendulum skid tester",
      "Surface preparation blower",
    ],
    results: [
      { label: "Cycle lane marked", value: "6.2 km" },
      { label: "Skid resistance", value: "67 BPN average" },
      { label: "Corners/turns", value: "38 no." },
      { label: "Corniche downtime", value: "Zero" },
    ],
    gallery: [
      { alt: "Red thermoplastic cycle lane along Abu Dhabi Corniche", caption: "UV-stable red cycle lane with anti-skid surface" },
      { alt: "Anti-skid aggregate application on cycle lane", caption: "Calcined bauxite broadcast for skid resistance" },
    ],
    location: "Abu Dhabi Corniche Road, Ras Al Akhdar",
    area: "6.2 km cycle lane",
  },
  {
    slug: "abu-dhabi-yas-mall-parking-deck",
    title: "Abu Dhabi Yas Island Mega-Mall Parking Deck Marking",
    country: "uae",
    city: "abu-dhabi",
    service: "parking-lot-marking",
    industry: "commercial",
    client: "Confidential Retail & Leisure Group",
    year: 2024,
    duration: "16 days",
    challenge:
      "Re-mark a 5,200-bay multi-level parking deck serving a Yas Island mega-mall without disrupting operations during peak weekend trading. The existing layout had faded bays and no dedicated EV or family parking zones, and the client wanted to add accessibility and EV capacity to meet 2024 sustainability targets.",
    solution:
      "Engineered a floor-by-floor phasing plan with two floors marked simultaneously while mall management routed visitors to alternate decks. Layout was re-optimised using CAD bay-packing analysis to add EV, family, ride-hail and accessibility bays, plus colour-coded zone striping for visitor wayfinding.",
    execution:
      "Black-out of ghost lines was completed first using a fast-drying black water-based acrylic, then solvent-based acrylic line paint was applied via airless striper at 1.8 mm dry film. Preformed thermoplastic disabled, EV and arrow symbols were heat-applied for durability, with green family zones, blue accessibility, amber EV and red VIP zones throughout the 7-level deck.",
    materials: [
      "Solvent-based acrylic line paint (white, yellow, red, blue, green, amber)",
      "Black-out water-based acrylic",
      "Preformed thermoplastic symbols",
      "Anti-skid walkway hatch",
      "Tactile paving paint",
    ],
    equipment: [
      "Airless line striper (Graco LineLazer)",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Laser chalk line",
      "Bay-counting survey drone",
    ],
    results: [
      { label: "Bays marked", value: "5,580" },
      { label: "Capacity gain", value: "+380 bays (+7.3%)" },
      { label: "EV bays added", value: "84" },
      { label: "Mall closure days", value: "Zero" },
    ],
    gallery: [
      { alt: "Colour-coded parking deck on Yas Island", caption: "Zone-coded multi-level parking deck" },
      { alt: "Preformed EV symbol application", caption: "Heat-applied EV bay symbol" },
    ],
    location: "Yas Island, Abu Dhabi",
    area: "62,000 m²",
  },
  {
    slug: "abu-dhabi-mussafah-warehouse-floor",
    title: "Abu Dhabi Mussafah Industrial Warehouse Floor Marking",
    country: "uae",
    city: "abu-dhabi",
    service: "warehouse-marking",
    industry: "logistics",
    client: "Confidential 3PL Logistics Operator",
    year: 2023,
    duration: "3 weeks",
    challenge:
      "Mark an 18,500 m² 24/7 distribution centre in Mussafah Industrial Area with forklift traffic lanes, pedestrian walkways, racking bays and hazard zones without halting goods receipt. The slab had previously been sealed and required surface profiling before any line system would bond.",
    solution:
      "Specified a fast-cure polyurea two-component line system with full ISO 7010 colour coding — green pedestrian, amber forklift, red hazard, white storage — applied over a shot-blasted surface profiled to CSP-3. The warehouse was divided into 9 zones with each reopening within 2 hours of marking.",
    execution:
      "Shot-blasted 18,500 m² with a ride-on blaster, then vacuumed and primed. Polyurea lines were applied at 1.5 mm dry film using an airless striper, with hand-applied chevrons, hatchings and pedestrian crossings. Each zone was barricaded, marked, cured (90 minutes at 35°C), inspected and reopened sequentially.",
    materials: [
      "Two-component polyurea line paint",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate (walkways)",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer (Graco 395)",
      "Hand-push line marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "18,500 m²" },
      { label: "Zones phased", value: "9" },
      { label: "Per-zone downtime", value: "<2 hrs" },
      { label: "Service life rating", value: "5+ years" },
    ],
    gallery: [
      { alt: "Polyurea warehouse floor markings in Mussafah", caption: "ISO 7010 colour-coded logistics floor" },
      { alt: "Shot-blasting warehouse concrete slab", caption: "CSP-3 surface profiling" },
    ],
    location: "Mussafah Industrial Area M-15, Abu Dhabi",
    area: "18,500 m²",
  },
  {
    slug: "abu-dhabi-medical-city-epoxy",
    title: "Abu Dhabi Medical City Hygienic Epoxy Floor",
    country: "uae",
    city: "abu-dhabi",
    service: "epoxy-flooring",
    industry: "healthcare",
    client: "Confidential Healthcare Authority",
    year: 2024,
    duration: "5 weeks",
    challenge:
      "Install a hygienic, seamless, chemical-resistant floor across a 6,800 m² clinical and sterilisation facility in Abu Dhabi Medical City. The system had to withstand daily chemical disinfection, heavy equipment traffic and meet DoH infection-control standards, all while the adjacent clinical wing remained operational.",
    solution:
      "Specified a 3 mm self-levelling epoxy system with a novolac topcoat in sterilisation and soiled-utility zones, and a standard polyurethane topcoat in clinical corridors. Coved skirting to 100 mm was installed throughout for seamless wall-to-floor hygiene transitions, with antimicrobial additive in the topcoat.",
    execution:
      "Tested slab moisture (calcium-chloride test, all readings <3 lb/1000 ft²/24 hr), shot-blasted to CSP-4, applied epoxy primer, 3 mm self-levelling body coat, then topcoat with antimicrobial additive. Coved skirting was hand-applied using a 6 mm radius coving trowel. Work was phased over 4 weekend shutdowns.",
    materials: [
      "Low-VOC epoxy primer",
      "3 mm self-levelling epoxy screed",
      "Novolac topcoat (sterilisation zones)",
      "Polyurethane topcoat (clinical zones)",
      "Antimicrobial silver-ion additive",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (hand-held edges)",
      "Notched trowel (3 mm)",
      "Spiked roller (de-aeration)",
      "Calcium-chloride moisture test kit",
    ],
    results: [
      { label: "Area installed", value: "6,800 m²" },
      { label: "System", value: "3 mm self-levelling + novolac" },
      { label: "Downtime", value: "4 weekend shifts" },
      { label: "Service life", value: "12–15 years" },
    ],
    gallery: [
      { alt: "Seamless hygienic epoxy floor in healthcare facility", caption: "Self-levelling epoxy with coved skirting" },
      { alt: "Novolac topcoat application in sterilisation zone", caption: "Chemical-resistant novolac topcoat" },
    ],
    location: "Abu Dhabi Medical City, Al Karamah",
    area: "6,800 m²",
  },
  {
    slug: "abu-dhabi-airport-apron-marking",
    title: "Abu Dhabi International Airport Apron Stand Marking",
    country: "uae",
    city: "abu-dhabi",
    service: "airport-marking",
    industry: "aviation",
    client: "Confidential Airport Operator",
    year: 2023,
    duration: "6 weeks",
    challenge:
      "Re-mark 18 contact and remote stands at Abu Dhabi International Airport to ICAO Annex 14 standards within night-shift NOTAM windows of 4 hours each, with jet-blast resistance and high wet-reflectivity. The apron had to remain fully operational for daytime widebody operations.",
    solution:
      "Specified Type III MMA cold plastic with Type II glass beads across all stand centrelines, lead-on lines, stop bars and stand numbering. MMA was selected for its 30-minute cure at 25°C, allowing each stand to reopen within the NOTAM window, plus jet-blast resistance rated to 260°C.",
    execution:
      "Airside crews surveyed to Annex 14 geometry, water-blasted and dried each stand, then extruded MMA at night. Stand numbers were applied using preformed MMA cut to specification. A total of 18 stands were marked over 24 night-shift windows, with reflectivity tested to Q3 (≥300 mcd/m²/lx) on every stand.",
    materials: [
      "MMA Type III cold plastic",
      "Type II glass beads",
      "Preformed MMA stand numbers",
      "Tack-coat primer",
    ],
    equipment: [
      "MMA extrusion applicator (airside)",
      "Bead dispenser",
      "Airless hand-stripe unit",
      "Retroreflectometer (airside-certified)",
      "Airside survey total station",
    ],
    results: [
      { label: "Stands marked", value: "18" },
      { label: "Line applied", value: "9.6 km" },
      { label: "NOTAM nights", value: "24" },
      { label: "Wet reflectivity", value: "Q3 achieved" },
    ],
    gallery: [
      { alt: "MMA apron centreline marking at Abu Dhabi airport", caption: "MMA stand centreline at night" },
      { alt: "Preformed MMA stand number application", caption: "Stand number installation" },
    ],
    location: "Abu Dhabi International Airport (AUH), Terminal A Apron",
    area: "18 stands",
  },

  // =====================================================================
  // UAE — DUBAI (5)
  // =====================================================================
  {
    slug: "dubai-expo-city-parking-marking",
    title: "Dubai Expo City Visitor Parking Lot Marking",
    country: "uae",
    city: "dubai",
    service: "parking-lot-marking",
    industry: "retail",
    client: "Confidential Expo City Operator",
    year: 2024,
    duration: "10 days",
    challenge:
      "Mark a 3,800-bay surface parking lot at the legacy Expo 2020 site (now Expo City Dubai) ahead of its reopening as a permanent visitor destination. The lot required EV, accessibility and family zones plus wayfinding colour coding, with all work completed before opening weekend.",
    solution:
      "Engineered a phased marking programme splitting the 3,800-bay lot into 6 sectors. Used solvent-based acrylic line paint with preformed thermoplastic symbols at bay entries for high-traffic durability. Layout included 96 EV bays, 124 accessibility bays and a green family zone near the visitor entrance.",
    execution:
      "Surface was swept, blown and primed where required. Two crews worked in parallel sectors applying 3,800 bay lines, 96 EV bay boxes with green corner detailing, accessibility symbols, and pedestrian walkways with anti-skid hatch. Final as-built was verified by total-station survey against RTA parking standards.",
    materials: [
      "Solvent-based acrylic line paint",
      "Preformed thermoplastic disabled & EV symbols",
      "Anti-skid walkway hatch",
      "Black-out paint (ghost lines)",
    ],
    equipment: [
      "Airless line striper ×2",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Total station (as-built survey)",
      "Surface preparation blower",
    ],
    results: [
      { label: "Bays marked", value: "3,800" },
      { label: "EV bays", value: "96" },
      { label: "Accessibility bays", value: "124" },
      { label: "Sectors phased", value: "6" },
    ],
    gallery: [
      { alt: "Expo City Dubai visitor parking lot marking", caption: "Newly marked visitor parking with EV zone" },
      { alt: "Preformed accessibility symbol heat application", caption: "Thermoplastic accessibility symbol" },
    ],
    location: "Expo City Dubai, Sheikh Mohammed bin Rashid Boulevard",
    area: "32,000 m²",
  },
  {
    slug: "dubai-sheikh-zayed-road-thermoplastic",
    title: "Dubai Sheikh Zayed Road Thermoplastic Re-Marking",
    country: "uae",
    city: "dubai",
    service: "thermoplastic-road-marking",
    industry: "highways-roads",
    client: "Confidential Roads & Transport Authority",
    year: 2024,
    duration: "8 weeks",
    challenge:
      "Re-mark 14 km of Dubai's flagship Sheikh Zayed Road corridor across 6 lanes plus hard shoulder, upgrading reflectivity to RTA night-driving spec while keeping the highway open during daytime peak traffic. The existing lines had degraded after 5 years of heavy HGV and commuter traffic.",
    solution:
      "Deployed two self-propelled thermoplastic applicators operating in night-shift windows between 12:00am and 5:00am, applying 3.0 mm hot thermoplastic with simultaneous glass-bead dispensing. All lane lines, edge lines, hatching and arrows were re-marked to RTA Standard Drawings.",
    execution:
      "Crews pre-marked with laser guidance, water-blasted ghost lines, and applied thermoplastic at 185°C. Reflectivity was tested every 500 m to R3 (≥300 mcd/m²/lx). A total of 88 km of line was applied across 56 night shifts, with daytime lanes kept fully open throughout.",
    materials: [
      "Hot-applied hydrocarbon thermoplastic",
      "Type II glass beads",
      "Anti-skid aggregate (hatching only)",
      "Preformed thermoplastic arrows",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator ×2",
      "Oil-jacketed kettles (600 L)",
      "Water-blaster (500 bar)",
      "Retroreflectometer",
      "Laser pre-marking guide",
    ],
    results: [
      { label: "Distance marked", value: "14 km" },
      { label: "Line applied", value: "88 km" },
      { label: "Night shifts", value: "56" },
      { label: "Reflectivity", value: "R3 achieved" },
    ],
    gallery: [
      { alt: "Night-shift thermoplastic marking on Sheikh Zayed Road", caption: "Night-shift application on SZR" },
      { alt: "Glass bead dispenser operation on Dubai highway", caption: "Simultaneous bead dispensing" },
    ],
    location: "Sheikh Zayed Road (E11), Dubai — Between Trade Centre & Jebel Ali",
    area: "14 km corridor",
  },
  {
    slug: "dubai-jebel-ali-free-zone-warehouse",
    title: "Dubai JAFZA Logistics Warehouse Floor Marking",
    country: "uae",
    city: "dubai",
    service: "warehouse-marking",
    industry: "logistics",
    client: "Confidential 3PL Operator",
    year: 2023,
    duration: "4 weeks",
    challenge:
      "Mark a 26,000 m² JAFZA logistics warehouse operating 24/7 with cross-dock doors, VNA racking aisles and a 4,200 m² chilled annex. The client needed HSE-compliant colour coding, pedestrian segregation and pallet-location grid markings, all without interrupting goods receipt.",
    solution:
      "Specified polyurea line systems throughout with antimicrobial variant in the chilled annex. Layout used green pedestrian walkways, amber forklift lanes, red hazard zones around dock edges, white pallet bays and yellow walkway chevrons — all ISO 7010 and OSHA 1910.144 compliant.",
    execution:
      "Shot-blasted the slab to CSP-3, applied polyurea lines curing in 90 minutes, and phased the warehouse into 14 zones so each could reopen within 2 hours of marking. Dock-edge hazard stripes were double-coated for high-traffic durability, and pallet-location grid was laser-aligned for VNA accuracy.",
    materials: [
      "Two-component polyurea line paint (standard + antimicrobial)",
      "Epoxy primer",
      "Anti-slip aggregate (dock edges)",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer (dual-pump)",
      "Hand-push marker",
      "Laser alignment tool",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "26,000 m²" },
      { label: "Zones phased", value: "14" },
      { label: "Per-zone downtime", value: "<2 hrs" },
      { label: "Dock doors", value: "42" },
    ],
    gallery: [
      { alt: "JAFZA warehouse polyurea floor markings", caption: "Cross-dock layout with segregation" },
      { alt: "Antimicrobial polyurea in chilled annex", caption: "Chilled annex with antimicrobial marking" },
    ],
    location: "Jebel Ali Free Zone (JAFZA) South, Dubai",
    area: "26,000 m²",
  },
  {
    slug: "dubai-dwc-airport-cargo-apron",
    title: "Dubai World Central Al Maktoum Airport Cargo Apron Marking",
    country: "uae",
    city: "dubai",
    service: "airport-marking",
    industry: "aviation",
    client: "Confidential Cargo Terminal Operator",
    year: 2024,
    duration: "5 weeks",
    challenge:
      "Mark a new 4.8 km cargo apron and taxiway at Al Maktoum International Airport (DWC) to ICAO Annex 14 standards, with night-cure windows of just 4 hours and the requirement that cargo operations resume each morning without delay. Reflectivity had to meet Q3 wet spec for low-visibility operations.",
    solution:
      "Specified Type III MMA cold plastic with Type II glass beads and preformed MMA hold-position markings. MMA was selected for its 30-minute cure at 25°C ambient, allowing the full apron to be marked in sequential NOTAM windows without affecting daytime freighter schedules.",
    execution:
      "Airside crews surveyed geometry to Annex 14, water-blasted and dried the asphalt, then extruded MMA taxiway centrelines, apron stand numbers, hold positions and edge markings. A total of 4.8 km of taxiway centreline plus 14 cargo stands were marked across 22 night-shift NOTAMs.",
    materials: [
      "MMA Type III cold plastic",
      "Type II glass beads",
      "Preformed MMA hold-position markings",
      "Tack-coat primer",
    ],
    equipment: [
      "MMA extrusion applicator (airside)",
      "Bead dispenser",
      "Airside total-station survey kit",
      "Retroreflectometer (airside-certified)",
      "Airless hand-stripe unit",
    ],
    results: [
      { label: "Taxiway marked", value: "4.8 km" },
      { label: "Cargo stands", value: "14" },
      { label: "NOTAM nights", value: "22" },
      { label: "Wet reflectivity", value: "Q3 achieved" },
    ],
    gallery: [
      { alt: "MMA cargo apron marking at Dubai World Central", caption: "MMA centreline at DWC cargo apron" },
      { alt: "Preformed MMA hold-position marking", caption: "Hold-position marking installation" },
    ],
    location: "Al Maktoum International Airport (DWC), Cargo Apron, Dubai",
    area: "4.8 km taxiway + 14 stands",
  },
  {
    slug: "dubai-difc-epoxy-floor",
    title: "Dubai DIFC Gate District Epoxy Office Floor",
    country: "uae",
    city: "dubai",
    service: "epoxy-flooring",
    industry: "commercial",
    client: "Confidential Financial Services Tenant",
    year: 2024,
    duration: "18 days",
    challenge:
      "Install a premium, high-gloss, seamless epoxy floor across 3,200 m² of grade-A office space in the DIFC Gate District during a fit-out programme. The floor had to achieve a uniform mirror finish, low VOC emissions for immediate occupancy, and accommodate raised-access flooring throughout.",
    solution:
      "Specified a 2 mm self-levelling epoxy system with a UV-stable polyurethane topcoat for gloss retention under direct glazing. A low-VOC variant was selected to allow occupancy within 48 hours of final coat, with the system installed in three colour-banded zones matching the interior design package.",
    execution:
      "Slab was tested for moisture, shot-blasted to CSP-3, and primed. The 2 mm self-levelling body coat was applied in three colour zones (graphite, basalt, ivory) using notched trowel and spiked roller for de-aeration. The polyurethane topcoat was roller-applied for a uniform high-gloss finish across the full floor plate.",
    materials: [
      "Low-VOC epoxy primer",
      "2 mm self-levelling epoxy body coat",
      "UV-stable polyurethane topcoat",
      "Colour pigment packs (graphite, basalt, ivory)",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (edges)",
      "Notched trowel (2 mm)",
      "Spiked roller",
      "Roller topcoat applicator",
    ],
    results: [
      { label: "Area installed", value: "3,200 m²" },
      { label: "Gloss level", value: "85 GU @ 60°" },
      { label: "VOC post-install", value: "<50 g/L" },
      { label: "Occupancy-ready", value: "48 hrs after final coat" },
    ],
    gallery: [
      { alt: "High-gloss epoxy floor in DIFC office space", caption: "Mirror-finish epoxy floor in DIFC Gate District" },
      { alt: "Spiked roller de-aeration on self-levelling epoxy", caption: "De-aeration during self-levelling application" },
    ],
    location: "DIFC Gate District, Sheikh Zayed Road, Dubai",
    area: "3,200 m²",
  },

  // =====================================================================
  // UAE — SHARJAH (4)
  // =====================================================================
  {
    slug: "sharjah-hamriyah-free-zone-industrial-marking",
    title: "Sharjah Hamriyah Free Zone Industrial Hazard Marking",
    country: "uae",
    city: "sharjah",
    service: "industrial-marking",
    industry: "oil-gas",
    client: "Confidential Petrochemical Tenant",
    year: 2023,
    duration: "6 weeks",
    challenge:
      "Mark hazardous zones, pipe identification and emergency escape routes across a live petrochemical facility in Hamriyah Free Zone Zone 1, with hydrocarbon exposure and ATEX Zone 1 requirements. The facility had to remain operational throughout, with marking applied in classified areas only during permit-controlled shutdowns.",
    solution:
      "Applied novolac epoxy and polyurea systems rated for hydrocarbon exposure, with ASME A13.1 pipe banding on 12 km of pipework and photoluminescent emergency escape route marking. All work was sequenced around permit-to-work (PTW) windows, with ATEX-rated equipment used in classified zones.",
    execution:
      "Conducted chemical and substrate audit, ground and profiled surfaces to CSP-4, applied novolac epoxy in process zones and polyurea in traffic corridors. Pipe banding was installed on 12 km of pipework per ASME A13.1 colour code, and 2.1 km of photoluminescent escape route was applied with charging-verification testing.",
    materials: [
      "Novolac epoxy (hydrocarbon-rated)",
      "Polyurea line paint (traffic zones)",
      "Photoluminescent escape-route tape",
      "ASME A13.1 pipe banding (colour-coded)",
      "Anti-slip aggregate (stairs)",
    ],
    equipment: [
      "ATEX-rated airless sprayer",
      "Surface grinder (ATEX-rated)",
      "Pipe-band applicator",
      "Luminance meter (photoluminescent)",
      "Permit-to-work station",
    ],
    results: [
      { label: "Plant area", value: "14,200 m²" },
      { label: "Pipework identified", value: "12 km" },
      { label: "Escape routes", value: "2.1 km" },
      { label: "ATEX zones", value: "All compliant" },
    ],
    gallery: [
      { alt: "Novolac epoxy hazard zone in Hamriyah petrochemical plant", caption: "Hydrocarbon-rated novolac hazard zones" },
      { alt: "ASME A13.1 pipe identification banding", caption: "Colour-coded pipe banding" },
    ],
    location: "Hamriyah Free Zone, Sector 1, Sharjah",
    area: "14,200 m²",
  },
  {
    slug: "sharjah-university-city-road-marking",
    title: "Sharjah University City Road Marking",
    country: "uae",
    city: "sharjah",
    service: "road-marking",
    industry: "residential",
    client: "Confidential University Authority",
    year: 2023,
    duration: "3 weeks",
    challenge:
      "Re-mark 9.4 km of internal roads and pedestrian crossings across Sharjah's University City campus, with traffic-calming humps, raised pedestrian crossings and dedicated shuttle-bus lanes. The work had to be sequenced around the academic calendar with zero disruption during exam weeks.",
    solution:
      "Specified hot-applied thermoplastic for all lane lines, edge lines and pedestrian crossings, with preformed thermoplastic symbols for shuttle lanes and stop bars. Anti-skid calcined bauxite was applied on all raised crossings and humps for wet-weather skid resistance.",
    execution:
      "Crews water-blasted ghost lines, applied thermoplastic at 3.0 mm with simultaneous glass-bead dispensing, and added 14 raised pedestrian crossings with anti-skid surface. Work was scheduled in term-break windows plus overnight shifts during exam weeks, achieving zero daytime disruption.",
    materials: [
      "Hot-applied thermoplastic (white, yellow)",
      "Type II glass beads",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic symbols",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Hand-push line marker",
      "Water-blaster",
      "Anti-skid aggregate dispenser",
      "BPN skid-test pendulum",
    ],
    results: [
      { label: "Distance marked", value: "9.4 km" },
      { label: "Pedestrian crossings", value: "14 raised" },
      { label: "Shuttle-lane symbols", value: "32 no." },
      { label: "Daytime disruption", value: "Zero" },
    ],
    gallery: [
      { alt: "University City road with thermoplastic markings", caption: "Campus road re-marking with anti-skid crossings" },
      { alt: "Raised pedestrian crossing with bauxite anti-skid", caption: "Anti-skid raised crossing" },
    ],
    location: "University City Road, Sharjah",
    area: "9.4 km",
  },
  {
    slug: "sharjah-industrial-area-warehouse-epoxy",
    title: "Sharjah Industrial Area Manufacturing Epoxy Floor",
    country: "uae",
    city: "sharjah",
    service: "epoxy-flooring",
    industry: "industrial",
    client: "Confidential Manufacturer",
    year: 2024,
    duration: "12 days",
    challenge:
      "Install a chemical-resistant epoxy floor across a 5,400 m² Sharjah manufacturing facility producing polymer compounds, with daily chemical exposure, forklift traffic and hot-process zones. The client required 5-day production downtime maximum across the full floor installation.",
    solution:
      "Specified a 4 mm trowel-applied epoxy mortar system with novolac topcoat in chemical-handling zones and a polyurethane topcoat in assembly zones. The system was installed in 3 phased sections over 3 weekends, allowing production to continue in two-thirds of the facility at all times.",
    execution:
      "Slab was moisture-tested, shot-blasted to CSP-4, primed, and the 4 mm epoxy mortar was trowel-applied in 3 weekend phases. Novolac topcoat was applied to 1,800 m² of chemical-handling zone, with polyurethane topcoat on the remaining 3,600 m². Coved skirting to 150 mm was installed throughout for wash-down hygiene.",
    materials: [
      "Epoxy primer (low-VOC)",
      "4 mm epoxy mortar (trowel-applied)",
      "Novolac topcoat (chemical zones)",
      "Polyurethane topcoat (assembly zones)",
      "Antimicrobial additive",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (hand-held edges)",
      "Trowel-applicator (mortar)",
      "Spiked roller",
      "Calcium-chloride moisture test kit",
    ],
    results: [
      { label: "Area installed", value: "5,400 m²" },
      { label: "System", value: "4 mm epoxy mortar" },
      { label: "Downtime", value: "3 weekend shifts" },
      { label: "Service life", value: "15+ years" },
    ],
    gallery: [
      { alt: "Epoxy mortar floor in Sharjah manufacturing plant", caption: "Trowel-applied 4 mm epoxy mortar" },
      { alt: "Novolac topcoat in chemical-handling zone", caption: "Novolac topcoat in chemical zone" },
    ],
    location: "Sharjah Industrial Area 12, Plot 47",
    area: "5,400 m²",
  },
  {
    slug: "sharjah-hospital-safety-signage",
    title: "Sharjah Teaching Hospital Safety Signage Package",
    country: "uae",
    city: "sharjah",
    service: "safety-signage",
    industry: "healthcare",
    client: "Confidential Hospital Authority",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Design, manufacture and install a complete safety signage package for a 320-bed Sharjah teaching hospital, including ISO 7010 pictograms, photoluminescent escape routes, departmental wayfinding, oxygen and medical-gas identification, and controlled-access warnings. The hospital remained fully operational throughout installation.",
    solution:
      "Engineered a 1,420-sign package compliant with ISO 7010 (graphical symbols), ISO 3864 (safety colours), and local MoHAP and Sharjah Civil Defence codes. Photoluminescent exit signs were specified for stairwells and corridors with charging verification to DIN 67510, with a phased night-shift installation plan.",
    execution:
      "Surveyed and tagged every sign location, manufactured signs in-house on 2 mm aluminium with photoluminescent overlay where required, and installed across 8 floors over 4 weeks of night-shift working. Final commissioning included luminance charging tests on 240 photoluminescent signs and as-built photograph record.",
    materials: [
      "2 mm aluminium sign substrate",
      "Photoluminescent vinyl (DIN 67510)",
      "UV-stable digital print overlay",
      "Stainless-steel fixings",
      "Medical-gas identification labels",
    ],
    equipment: [
      "CNC router (sign manufacture)",
      "UV flatbed printer",
      "Photoluminescent luminance meter",
      "Cordless drill + stainless fixings",
      "Survey total station",
    ],
    results: [
      { label: "Signs installed", value: "1,420" },
      { label: "Photoluminescent signs", value: "240" },
      { label: "Floors covered", value: "8" },
      { label: "Compliance", value: "ISO 7010 + MoHAP" },
    ],
    gallery: [
      { alt: "Photoluminescent exit signage in Sharjah hospital corridor", caption: "Photoluminescent escape-route signage" },
      { alt: "Medical gas identification signage", caption: "Medical-gas identification labels" },
    ],
    location: "University City Hospital Road, Sharjah",
    area: "8-floor package",
  },

  // =====================================================================
  // UAE — AJMAN (2)
  // =====================================================================
  {
    slug: "ajman-corniche-parking-lot-marking",
    title: "Ajman Corniche Waterfront Parking Lot Marking",
    country: "uae",
    city: "ajman",
    service: "parking-lot-marking",
    industry: "retail",
    client: "Confidential Municipality & Tourism Authority",
    year: 2023,
    duration: "9 days",
    challenge:
      "Re-mark a 1,800-bay waterfront parking lot along Ajman Corniche with high-UV-resistance and coastal-humidity tolerance, plus accessibility bays, EV charging stations and a new taxi-rank layout. The work had to be done without closing the corniche to beachgoers during weekend peak.",
    solution:
      "Specified a UV-stable solvent-based acrylic line system with preformed thermoplastic symbols for high-traffic durability. Layout was re-engineered to add 36 EV charging bays, 56 accessibility bays and a 12-bay taxi rank, with green tourism-zone wayfinding striping.",
    execution:
      "Crews worked Sunday-to-Thursday overnight shifts, applying 1,800 bay lines with 36 EV bay boxes (green corner detail), 56 accessibility symbols, taxi-rank yellow hatching and pedestrian walkways with anti-skid hatch. Final layout was surveyed against Ajman Municipality parking standards.",
    materials: [
      "UV-stable solvent-based acrylic paint",
      "Preformed thermoplastic symbols",
      "Anti-skid walkway hatch",
      "Yellow taxi-rank hatching",
    ],
    equipment: [
      "Airless line striper",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Surface preparation blower",
      "Total station (as-built)",
    ],
    results: [
      { label: "Bays marked", value: "1,800" },
      { label: "EV bays", value: "36" },
      { label: "Accessibility bays", value: "56" },
      { label: "Taxi-rank bays", value: "12" },
    ],
    gallery: [
      { alt: "Ajman Corniche waterfront parking lot marking", caption: "Re-marked corniche parking with EV zone" },
      { alt: "Accessibility bay preformed symbol on Ajman corniche", caption: "Accessibility symbol installation" },
    ],
    location: "Ajman Corniche Road, Al Rashidiya",
    area: "16,500 m²",
  },
  {
    slug: "ajman-industrial-zone-warehouse",
    title: "Ajman Industrial Area Warehouse Marking",
    country: "uae",
    city: "ajman",
    service: "warehouse-marking",
    industry: "industrial",
    client: "Confidential Manufacturing Operator",
    year: 2024,
    duration: "2 weeks",
    challenge:
      "Mark a 9,200 m² Ajman Industrial Area warehouse with forklift lanes, racking aisles, pedestrian walkways and machine-guarding zones. The facility had a single shift pattern and required all marking completed within two weekend shutdowns to avoid production loss.",
    solution:
      "Specified a two-component polyurea line system with full ISO 7010 colour coding and anti-slip walkways. The system was selected for its 90-minute cure time, allowing both marking shifts to be completed over consecutive weekends with sub-2-hour reopening per zone.",
    execution:
      "Shot-blasted 9,200 m² to CSP-3 on Saturday morning, primed and applied polyurea lines through Sunday. Green pedestrian walkways, amber forklift lanes, red machine-guard zones and white pallet-bay grid were applied, with anti-slip aggregate broadcast on walkways. Final inspection Monday morning before production resumed.",
    materials: [
      "Two-component polyurea line paint",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer",
      "Hand-push marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "9,200 m²" },
      { label: "Weekend shifts", value: "2" },
      { label: "Production downtime", value: "Zero" },
      { label: "Service life rating", value: "5+ years" },
    ],
    gallery: [
      { alt: "Ajman warehouse polyurea floor markings", caption: "ISO 7010 colour-coded warehouse floor" },
      { alt: "Anti-slip walkway with bauxite aggregate", caption: "Anti-slip pedestrian walkway" },
    ],
    location: "Ajman Industrial Area, Plot J-22",
    area: "9,200 m²",
  },

  // =====================================================================
  // UAE — RAS AL KHAIMAH (2)
  // =====================================================================
  {
    slug: "ras-al-khaimah-quarry-road-thermoplastic",
    title: "Ras Al Khaimah Quarry Access Road Thermoplastic Marking",
    country: "uae",
    city: "ras-al-khaimah",
    service: "thermoplastic-road-marking",
    industry: "industrial",
    client: "Confidential Quarry Operator",
    year: 2023,
    duration: "10 days",
    challenge:
      "Re-mark 8.6 km of single-carriageway access road serving three RAK limestone quarries, with heavy HGV traffic, dust accumulation and steep gradients. The existing lines had been abraded by quarry-truck traffic within 18 months and the client needed a longer-life solution.",
    solution:
      "Specified a 4.0 mm hot-applied thermoplastic system (1 mm thicker than standard) with high-build Type II glass beads and added anti-skid aggregate on downhill sections. Preformed thermoplastic hazard arrows and edge lines were used on tight curves to improve night-time delineation for truck drivers.",
    execution:
      "Crews worked in 12-hour day shifts, water-blasting and re-profiling the surface before applying 4.0 mm thermoplastic at 190°C. A total of 34 km of line was applied across 8.6 km of road, with anti-skid aggregate broadcast on 3.2 km of downhill sections and 18 hazard symbols installed on curves.",
    materials: [
      "Hot-applied thermoplastic (4.0 mm high-build)",
      "Type II glass beads (high-build)",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic hazard arrows",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle (600 L)",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "8.6 km" },
      { label: "Line applied", value: "34 km" },
      { label: "Anti-skid sections", value: "3.2 km" },
      { label: "Hazard symbols", value: "18 no." },
    ],
    gallery: [
      { alt: "Quarry access road with thermoplastic markings", caption: "High-build thermoplastic on quarry road" },
      { alt: "Anti-skid aggregate application on RAK downhill", caption: "Downhill anti-skid aggregate" },
    ],
    location: "RAK Quarry Road, Wadi Bih",
    area: "8.6 km",
  },
  {
    slug: "ras-al-khaimah-hospital-epoxy",
    title: "Ras Al Khaimah Specialty Hospital Epoxy Floor",
    country: "uae",
    city: "ras-al-khaimah",
    service: "epoxy-flooring",
    industry: "healthcare",
    client: "Confidential Healthcare Operator",
    year: 2024,
    duration: "3 weeks",
    challenge:
      "Install a hygienic, seamless epoxy floor across 4,200 m² of a RAK specialty hospital including operating theatres, sterilisation departments, ICUs and isolation rooms. The system had to meet MoHAP infection-control standards, withstand daily chemical disinfection, and be installed without disrupting the adjacent emergency department.",
    solution:
      "Specified a 3 mm self-levelling epoxy with novolac topcoat in sterilisation and soiled-utility zones, antimicrobial additive throughout, and 100 mm coved skirting for hygiene. Work was phased over 3 weekend shutdowns with ED access maintained via an alternate corridor route.",
    execution:
      "Tested slab moisture, shot-blasted to CSP-4, primed and applied 3 mm self-levelling epoxy in operating theatres, sterilisation and ICU zones. Novolac topcoat was applied to 1,400 m² of sterilisation/soiled-utility zones, with polyurethane topcoat elsewhere. Coved skirting was hand-applied throughout.",
    materials: [
      "Low-VOC epoxy primer",
      "3 mm self-levelling epoxy screed",
      "Novolac topcoat (sterilisation zones)",
      "Polyurethane topcoat (other zones)",
      "Antimicrobial silver-ion additive",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (edges)",
      "Notched trowel (3 mm)",
      "Spiked roller",
      "Calcium-chloride moisture test kit",
    ],
    results: [
      { label: "Area installed", value: "4,200 m²" },
      { label: "System", value: "3 mm self-levelling + novolac" },
      { label: "Downtime", value: "3 weekend shifts" },
      { label: "Service life", value: "12–15 years" },
    ],
    gallery: [
      { alt: "Hygienic epoxy floor in RAK hospital operating theatre", caption: "Self-levelling epoxy in operating theatre" },
      { alt: "Novolac topcoat in sterilisation zone", caption: "Novolac topcoat in sterilisation" },
    ],
    location: "Sheikh Khalifa Specialty Hospital Road, RAK",
    area: "4,200 m²",
  },

  // =====================================================================
  // UAE — FUJAIRAH (2)
  // =====================================================================
  {
    slug: "fujairah-port-tank-farm-industrial",
    title: "Fujairah Port Tank Farm Industrial Hazard Marking",
    country: "uae",
    city: "fujairah",
    service: "industrial-marking",
    industry: "energy",
    client: "Confidential Tank Farm Operator",
    year: 2023,
    duration: "7 weeks",
    challenge:
      "Mark hazardous zones, pipe identification, bunded-area escape routes and emergency shower signage across a live Fujairah Port crude and product tank farm with 36 storage tanks, hydrocarbon exposure, and ATEX Zone 1 classified areas. The facility had to remain operational throughout, with marking scheduled around PTW windows.",
    solution:
      "Applied novolac epoxy systems rated for hydrocarbon exposure in tank bunds and process areas, with polyurea traffic lanes, ASME A13.1 pipe banding on 18 km of pipework, and photoluminescent escape-route marking on bund walls and stairways. All work was ATEX-permit-controlled with intrinsically safe equipment.",
    execution:
      "Conducted HAZID and substrate audit, water-jetted and profiled surfaces, then applied novolac epoxy in bunded zones and polyurea in traffic corridors. Pipe banding was installed on 18 km of pipework per ASME A13.1 colour code, and 3.4 km of photoluminescent escape route was applied with charging-verification testing per DIN 67510.",
    materials: [
      "Novolac epoxy (hydrocarbon-rated)",
      "Polyurea line paint (traffic zones)",
      "Photoluminescent escape-route tape",
      "ASME A13.1 pipe banding",
      "Anti-slip aggregate (stairs)",
    ],
    equipment: [
      "ATEX-rated airless sprayer",
      "ATEX-rated surface grinder",
      "Pipe-band applicator",
      "Luminance meter (photoluminescent)",
      "Permit-to-work station",
    ],
    results: [
      { label: "Plant area", value: "16,800 m²" },
      { label: "Pipework identified", value: "18 km" },
      { label: "Escape routes", value: "3.4 km" },
      { label: "Storage tanks", value: "36" },
    ],
    gallery: [
      { alt: "Fujairah tank farm with novolac hazard markings", caption: "Hydrocarbon-rated novolac bund markings" },
      { alt: "ASME A13.1 pipe banding at Fujairah tank farm", caption: "Colour-coded pipe identification" },
    ],
    location: "Fujairah Port Tank Farm, Fujairah Oil Industry Zone (FOIZ)",
    area: "16,800 m²",
  },
  {
    slug: "fujairah-corniche-road-marking",
    title: "Fujairah Corniche Coastal Road Marking",
    country: "uae",
    city: "fujairah",
    service: "road-marking",
    industry: "commercial",
    client: "Confidential Municipality",
    year: 2024,
    duration: "3 weeks",
    challenge:
      "Re-mark 5.4 km of the Fujairah Corniche coastal road with high-humidity-tolerant materials, edge lines, pedestrian crossings and parking-bay demarcation along the beachfront. Coastal humidity and salt spray had degraded previous cold-paint markings within 14 months.",
    solution:
      "Specified hot-applied thermoplastic throughout for humidity resistance, with anti-skid aggregate on pedestrian crossings and preformed thermoplastic symbols at intersection stop bars. Edge lines received Type II glass beads for night delineation along the corniche promenade.",
    execution:
      "Water-blasted ghost lines and surface contaminants, then applied 3.0 mm thermoplastic with simultaneous glass-bead dispensing. A total of 21 km of line was applied across 5.4 km of corniche road, plus 11 raised pedestrian crossings with anti-skid surface and 280 roadside parking bays.",
    materials: [
      "Hot-applied thermoplastic (white, yellow)",
      "Type II glass beads",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic symbols",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Hand-push line marker",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "5.4 km" },
      { label: "Line applied", value: "21 km" },
      { label: "Pedestrian crossings", value: "11 raised" },
      { label: "Parking bays", value: "280" },
    ],
    gallery: [
      { alt: "Fujairah Corniche road thermoplastic marking", caption: "Coastal-grade thermoplastic on corniche" },
      { alt: "Anti-skid pedestrian crossing on Fujairah corniche", caption: "Anti-skid raised crossing" },
    ],
    location: "Fujairah Corniche Road, Al Faseel",
    area: "5.4 km",
  },

  // =====================================================================
  // UAE — AL AIN (2)
  // =====================================================================
  {
    slug: "al-ain-mall-parking-deck-marking",
    title: "Al Ain Mall Multi-Level Parking Deck Marking",
    country: "uae",
    city: "al-ain",
    service: "parking-lot-marking",
    industry: "retail",
    client: "Confidential Retail Group",
    year: 2024,
    duration: "12 days",
    challenge:
      "Re-mark a 2,400-bay, 4-level parking deck at an Al Ain shopping mall, adding family and EV zones, while keeping the deck open to visitors. The existing layout had faded bays and accessibility signage was non-compliant with the UAE Universal Design Code.",
    solution:
      "Specified solvent-based acrylic line paint with preformed thermoplastic symbols at bay entries for high-traffic durability. Layout was re-engineered using bay-packing CAD analysis to add 48 EV bays, 36 accessibility bays and 60 family bays, all colour-coded for visitor wayfinding.",
    execution:
      "Floor-by-floor marking with black-out of ghost lines, application of 2,400 bay lines plus 48 EV (green), 36 accessibility (blue) and 60 family (green) bay boxes. Preformed thermoplastic disabled and arrow symbols were heat-applied for durability. Work was phased to keep 3 levels open at all times.",
    materials: [
      "Solvent-based acrylic line paint (white, yellow, red, blue, green)",
      "Black-out water-based acrylic",
      "Preformed thermoplastic symbols",
      "Anti-skid walkway hatch",
    ],
    equipment: [
      "Airless line striper (Graco LineLazer)",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Laser chalk line",
      "Total station (as-built survey)",
    ],
    results: [
      { label: "Bays marked", value: "2,544" },
      { label: "EV bays added", value: "48" },
      { label: "Family bays added", value: "60" },
      { label: "Levels", value: "4" },
    ],
    gallery: [
      { alt: "Al Ain mall parking deck colour-coded marking", caption: "Colour-coded multi-level deck" },
      { alt: "Family parking bay with green detail", caption: "Family bay with green corner detail" },
    ],
    location: "Al Ain Mall, Sheikh Khalifa Street, Al Ain",
    area: "28,000 m²",
  },
  {
    slug: "al-ain-heritage-route-signage",
    title: "Al Ain Heritage Route Safety & Wayfinding Signage",
    country: "uae",
    city: "al-ain",
    service: "safety-signage",
    industry: "residential",
    client: "Confidential Tourism & Heritage Authority",
    year: 2023,
    duration: "5 weeks",
    challenge:
      "Design and install a safety and wayfinding signage package along Al Ain's UNESCO-listed heritage route covering 6 sites, with traffic calming, pedestrian safety, heritage-sensitive mounting and bilingual Arabic-English messaging. Mounting could not damage historic fabric.",
    solution:
      "Engineered a 280-sign package with ISO 7010 safety pictograms plus bilingual heritage wayfinding, mounted on freestanding steel posts (no wall penetration on heritage structures). Photoluminescent exit signage was specified for the Hili Archaeological Park visitor centre, with custom heritage-compatible finishes.",
    execution:
      "Surveyed each of the 6 heritage sites, manufactured signs on 2 mm aluminium with custom powder-coated brown frames matching heritage palette, and installed 280 signs across 4.2 km of route. Bilingual messaging was verified by the heritage authority before fabrication, with all post foundations hand-dug to avoid utility clashes.",
    materials: [
      "2 mm aluminium sign substrate",
      "Photoluminescent vinyl (DIN 67510)",
      "UV-stable digital print (bilingual)",
      "Powder-coated brown steel posts",
      "Heritage-palette mounting frames",
    ],
    equipment: [
      "CNC router (sign manufacture)",
      "UV flatbed printer",
      "Photoluminescent luminance meter",
      "Hand auger (post foundations)",
      "Total station (layout survey)",
    ],
    results: [
      { label: "Signs installed", value: "280" },
      { label: "Heritage sites", value: "6" },
      { label: "Route length", value: "4.2 km" },
      { label: "Compliance", value: "ISO 7010 + UNESCO" },
    ],
    gallery: [
      { alt: "Heritage-sensitive signage at Al Ain heritage route", caption: "Heritage-compatible safety signage" },
      { alt: "Bilingual wayfinding sign on Al Ain heritage route", caption: "Bilingual heritage wayfinding" },
    ],
    location: "Al Ain Heritage Route (Hili–Jebel Hafeet)",
    area: "4.2 km route",
  },

  // =====================================================================
  // UAE — UMM AL QUWAIN (2)
  // =====================================================================
  {
    slug: "umm-al-quwain-marina-safety-signage",
    title: "Umm Al Quwain Marina Safety Signage Package",
    country: "uae",
    city: "umm-al-quwain",
    service: "safety-signage",
    industry: "residential",
    client: "Confidential Marina Development Authority",
    year: 2024,
    duration: "3 weeks",
    challenge:
      "Design and install a comprehensive marine safety signage package for a 980-berth UAQ marina development, including channel markers, no-wake zones, lifebuoy stations, fire assembly points, and bilingual Arabic-English wayfinding. The marina had to remain operational throughout installation.",
    solution:
      "Engineered a 420-sign package compliant with ISO 7010, IALA Maritime Buoyage System and local UAQ Municipality codes. Marine-grade 316 stainless steel substrates were specified for salt-spray resistance, with photoluminescent escape-route signage on pontoons and night-time solar-LED channel markers.",
    execution:
      "Surveyed all 980 berths and access points, manufactured signs in-house on 316 stainless steel with UV-stable print, and installed over 3 weeks of night-shift pontoon working. Final commissioning included luminance tests on 96 photoluminescent signs and verification of 24 solar-LED channel markers.",
    materials: [
      "316 marine-grade stainless steel substrate",
      "Photoluminescent vinyl (DIN 67510)",
      "UV-stable digital print (bilingual)",
      "Solar-LED channel markers",
      "316 stainless fixings",
    ],
    equipment: [
      "CNC router (sign manufacture)",
      "UV flatbed printer",
      "Photoluminescent luminance meter",
      "Pontoon-access workboat",
      "Solar-LED commissioning kit",
    ],
    results: [
      { label: "Signs installed", value: "420" },
      { label: "Berths covered", value: "980" },
      { label: "Solar-LED markers", value: "24" },
      { label: "Compliance", value: "ISO 7010 + IALA" },
    ],
    gallery: [
      { alt: "Marine safety signage at UAQ marina pontoon", caption: "316 stainless pontoon signage" },
      { alt: "Solar-LED channel marker at UAQ marina entrance", caption: "Solar-LED channel marker" },
    ],
    location: "Umm Al Quwain Marina, Al Salamah",
    area: "980-berth package",
  },
  {
    slug: "umm-al-quwain-coastal-road-thermoplastic",
    title: "Umm Al Quwain Coastal Road Thermoplastic Marking",
    country: "uae",
    city: "umm-al-quwain",
    service: "thermoplastic-road-marking",
    industry: "highways-roads",
    client: "Confidential Roads Authority",
    year: 2023,
    duration: "2 weeks",
    challenge:
      "Re-mark 6.8 km of the UAQ coastal road with humidity-resistant thermoplastic, edge lines and pedestrian crossings. The existing cold-paint lines had degraded within 14 months due to coastal salt spray and humidity, and the client needed a longer-life system.",
    solution:
      "Specified a 3.5 mm hot-applied thermoplastic system with hydrocarbon resin modified for coastal-humidity resistance. Anti-skid aggregate was applied on 8 pedestrian crossings, with Type II glass beads on edge lines for night delineation along the dark coastal stretch.",
    execution:
      "Crews water-blasted ghost lines and salt contamination, then applied thermoplastic at 185°C. A total of 27 km of line was applied across 6.8 km of coastal road, with anti-skid surface on 8 raised pedestrian crossings and preformed thermoplastic hazard symbols on 12 coastal-curve sections.",
    materials: [
      "Hot-applied thermoplastic (humidity-modified)",
      "Type II glass beads",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic hazard symbols",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "6.8 km" },
      { label: "Line applied", value: "27 km" },
      { label: "Pedestrian crossings", value: "8 raised" },
      { label: "Coastal-curve symbols", value: "12" },
    ],
    gallery: [
      { alt: "UAQ coastal road with thermoplastic markings", caption: "Humidity-resistant thermoplastic on coastal road" },
      { alt: "Anti-skid pedestrian crossing on UAQ coastal road", caption: "Anti-skid raised crossing" },
    ],
    location: "UAQ Coastal Road, E11 between UAQ and Ras Al Khaimah",
    area: "6.8 km",
  },

  // =====================================================================
  // SAUDI ARABIA — RIYADH (4)
  // =====================================================================
  {
    slug: "riyadh-king-fahd-road-thermoplastic",
    title: "Riyadh King Fahd Road Thermoplastic Re-Marking",
    country: "saudi-arabia",
    city: "riyadh",
    service: "thermoplastic-road-marking",
    industry: "highways-roads",
    client: "Confidential Riyadh Municipality",
    year: 2024,
    duration: "10 weeks",
    challenge:
      "Re-mark 18 km of Riyadh's flagship King Fahd Road corridor across 6 lanes plus median, upgrading reflectivity to MOMRAH night-driving spec while keeping the road open during daytime peak traffic. The existing lines had degraded after 6 years of Vision 2030-era traffic growth.",
    solution:
      "Deployed three self-propelled thermoplastic applicators operating in night-shift windows between 11pm and 5am, applying 3.0 mm hot thermoplastic with simultaneous glass-bead dispensing. All lane lines, edge lines, hatching and arrows were re-marked to MOMRAH Section 705 specification.",
    execution:
      "Crews pre-marked with laser guidance, water-blasted ghost lines, and applied thermoplastic at 185°C. Reflectivity was tested every 500 m to R3 (≥300 mcd/m²/lx). A total of 124 km of line was applied across 70 night shifts, with daytime lanes kept fully open throughout.",
    materials: [
      "Hot-applied hydrocarbon thermoplastic",
      "Type II glass beads",
      "Anti-skid aggregate (hatching)",
      "Preformed thermoplastic arrows",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator ×3",
      "Oil-jacketed kettles (600 L)",
      "Water-blaster (500 bar)",
      "Retroreflectometer",
      "Laser pre-marking guide",
    ],
    results: [
      { label: "Distance marked", value: "18 km" },
      { label: "Line applied", value: "124 km" },
      { label: "Night shifts", value: "70" },
      { label: "Reflectivity", value: "R3 achieved" },
    ],
    gallery: [
      { alt: "Night-shift thermoplastic marking on King Fahd Road Riyadh", caption: "Night-shift application on King Fahd Road" },
      { alt: "Glass bead dispenser on Riyadh highway", caption: "Simultaneous bead dispensing" },
    ],
    location: "King Fahd Road, Riyadh — Between Olaya & Al Malaz",
    area: "18 km corridor",
  },
  {
    slug: "riyadh-mall-parking-deck",
    title: "Riyadh Mega-Mall Parking Deck Marking",
    country: "saudi-arabia",
    city: "riyadh",
    service: "parking-lot-marking",
    industry: "commercial",
    client: "Confidential Retail Group",
    year: 2024,
    duration: "18 days",
    challenge:
      "Re-mark a 4,600-bay, 5-level parking deck at a Riyadh mega-mall without disrupting operations during peak weekend trading. The existing layout had faded bays, no EV or family zones, and accessibility signage was non-compliant with Saudi Building Code (SBC 801) accessibility requirements.",
    solution:
      "Engineered a floor-by-floor phasing plan with two floors marked simultaneously while mall management routed visitors to alternate decks. Layout was re-optimised using CAD bay-packing analysis to add EV, family and accessibility bays, plus colour-coded zone striping for visitor wayfinding.",
    execution:
      "Black-out of ghost lines using fast-drying water-based acrylic, then solvent-based acrylic line paint applied via airless striper at 1.8 mm dry film. Preformed thermoplastic disabled, EV and arrow symbols were heat-applied for durability, with green family zones, blue accessibility, amber EV and red VIP zones throughout the 5-level deck.",
    materials: [
      "Solvent-based acrylic line paint (white, yellow, red, blue, green, amber)",
      "Black-out water-based acrylic",
      "Preformed thermoplastic symbols",
      "Anti-skid walkway hatch",
    ],
    equipment: [
      "Airless line striper ×2 (Graco LineLazer)",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Laser chalk line",
      "Bay-counting survey drone",
    ],
    results: [
      { label: "Bays marked", value: "4,940" },
      { label: "Capacity gain", value: "+340 bays (+7.4%)" },
      { label: "EV bays added", value: "72" },
      { label: "Mall closure days", value: "Zero" },
    ],
    gallery: [
      { alt: "Riyadh mall parking deck with colour-coded zones", caption: "Zone-coded multi-level parking deck" },
      { alt: "Preformed EV symbol application in Riyadh mall", caption: "Heat-applied EV bay symbol" },
    ],
    location: "Riyadh Park Mall, King Abdullah Road, Riyadh",
    area: "54,000 m²",
  },
  {
    slug: "riyadh-modon-industrial-warehouse-marking",
    title: "Riyadh MODON Industrial City Warehouse Marking",
    country: "saudi-arabia",
    city: "riyadh",
    service: "warehouse-marking",
    industry: "industrial",
    client: "Confidential Industrial Tenant (MODON)",
    year: 2023,
    duration: "5 weeks",
    challenge:
      "Mark a 28,400 m² MODON Riyadh industrial warehouse operating 24/7 with forklift traffic, racking aisles, machine-guarding zones and dispatch docks. The facility required full HSE compliance per Saudi Aramco GES-001 and ISO 7010 colour coding, without interrupting production.",
    solution:
      "Specified a two-component polyurea line system with antimicrobial variant in cleanroom zones, applied over shot-blasted concrete profiled to CSP-3. Layout used green pedestrian walkways, amber forklift lanes, red machine-guard zones, white storage bays and yellow dispatch-dock hatchings — all ISO 7010 compliant.",
    execution:
      "Shot-blasted 28,400 m² with a ride-on blaster, primed, and applied polyurea lines via airless striper with hand-applied chevrons and pedestrian crossings. The warehouse was divided into 18 zones with each reopening within 2 hours of marking, allowing production to continue in adjacent zones throughout.",
    materials: [
      "Two-component polyurea line paint (standard + antimicrobial)",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate (walkways)",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer (dual-pump)",
      "Hand-push line marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "28,400 m²" },
      { label: "Zones phased", value: "18" },
      { label: "Per-zone downtime", value: "<2 hrs" },
      { label: "Compliance", value: "ISO 7010 + Aramco GES" },
    ],
    gallery: [
      { alt: "MODON Riyadh warehouse with polyurea floor markings", caption: "HSE colour-coded MODON warehouse" },
      { alt: "Polyurea line application in MODON industrial facility", caption: "Fast-cure polyurea striping" },
    ],
    location: "MODON Industrial City 2, Riyadh",
    area: "28,400 m²",
  },
  {
    slug: "riyadh-king-khalid-airport-apron-marking",
    title: "Riyadh King Khalid International Airport Apron Marking",
    country: "saudi-arabia",
    city: "riyadh",
    service: "airport-marking",
    industry: "aviation",
    client: "Confidential Airport Operator",
    year: 2024,
    duration: "8 weeks",
    challenge:
      "Re-mark 22 contact and remote stands at Riyadh King Khalid International Airport (RUH) to ICAO Annex 14 standards within night-shift NOTAM windows of 4 hours each, with jet-blast resistance and high wet-reflectivity. The apron had to remain fully operational for daytime widebody operations including A380 and B777.",
    solution:
      "Specified Type III MMA cold plastic with Type II glass beads across all stand centrelines, lead-on lines, stop bars and stand numbering. MMA was selected for its 30-minute cure at 25°C ambient, allowing each stand to reopen within the NOTAM window, plus jet-blast resistance rated to 260°C.",
    execution:
      "Airside crews surveyed to Annex 14 geometry, water-blasted and dried each stand, then extruded MMA at night. Stand numbers were applied using preformed MMA cut to specification. A total of 22 stands were marked over 32 night-shift NOTAM windows, with reflectivity tested to Q3 (≥300 mcd/m²/lx) on every stand.",
    materials: [
      "MMA Type III cold plastic",
      "Type II glass beads",
      "Preformed MMA stand numbers",
      "Tack-coat primer",
    ],
    equipment: [
      "MMA extrusion applicator (airside)",
      "Bead dispenser",
      "Airless hand-stripe unit",
      "Retroreflectometer (airside-certified)",
      "Airside survey total station",
    ],
    results: [
      { label: "Stands marked", value: "22" },
      { label: "Line applied", value: "12.4 km" },
      { label: "NOTAM nights", value: "32" },
      { label: "Wet reflectivity", value: "Q3 achieved" },
    ],
    gallery: [
      { alt: "MMA apron centreline marking at Riyadh King Khalid Airport", caption: "MMA stand centreline at night" },
      { alt: "Preformed MMA stand number installation at RUH", caption: "Stand number installation" },
    ],
    location: "King Khalid International Airport (RUH), Terminals 1–4 Apron",
    area: "22 stands",
  },

  // =====================================================================
  // SAUDI ARABIA — JEDDAH (3)
  // =====================================================================
  {
    slug: "jeddah-corniche-thermoplastic",
    title: "Jeddah Corniche Coastal Road Thermoplastic Marking",
    country: "saudi-arabia",
    city: "jeddah",
    service: "thermoplastic-road-marking",
    industry: "highways-roads",
    client: "Confidential Jeddah Municipality",
    year: 2023,
    duration: "6 weeks",
    challenge:
      "Re-mark 12 km of the Jeddah Corniche coastal road with humidity-resistant thermoplastic, edge lines, pedestrian crossings and bike-lane segregation. The existing cold-paint lines had degraded within 16 months due to Red Sea coastal humidity and salt spray, requiring a longer-life system.",
    solution:
      "Specified a 3.5 mm hot-applied thermoplastic with hydrocarbon resin modified for coastal-humidity resistance. Type II glass beads on edge lines for night delineation, anti-skid aggregate on 18 pedestrian crossings, and red-pigmented cycle-lane striping for 6 km of corniche cycle route.",
    execution:
      "Crews water-blasted ghost lines and salt contamination, then applied thermoplastic at 185°C. A total of 52 km of line was applied across 12 km of corniche road, with anti-skid surface on 18 raised pedestrian crossings and 6 km of red cycle lane with calcined bauxite anti-skid for wet-weather grip.",
    materials: [
      "Hot-applied thermoplastic (humidity-modified, white, yellow, red)",
      "Type II glass beads",
      "Calcined bauxite anti-skid aggregate",
      "Red iron-oxide pigment (cycle lane)",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle (600 L)",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "12 km" },
      { label: "Line applied", value: "52 km" },
      { label: "Cycle lane", value: "6 km (red)" },
      { label: "Pedestrian crossings", value: "18 raised" },
    ],
    gallery: [
      { alt: "Jeddah Corniche road thermoplastic marking", caption: "Humidity-resistant thermoplastic on corniche" },
      { alt: "Red cycle lane on Jeddah Corniche", caption: "Red cycle lane with anti-skid surface" },
    ],
    location: "Jeddah Corniche Road, Al Hamra District",
    area: "12 km",
  },
  {
    slug: "jeddah-mall-parking-marking",
    title: "Jeddah Red Sea Mall Parking Lot Marking",
    country: "saudi-arabia",
    city: "jeddah",
    service: "parking-lot-marking",
    industry: "retail",
    client: "Confidential Retail Group",
    year: 2024,
    duration: "11 days",
    challenge:
      "Re-mark a 3,400-bay surface and deck parking lot at Jeddah's Red Sea Mall with high-UV-resistance and coastal-humidity tolerance, plus EV charging stations, family zones and accessibility bays. The work had to be done without closing the mall during peak weekend trading.",
    solution:
      "Specified a UV-stable solvent-based acrylic line system with preformed thermoplastic symbols for high-traffic durability. Layout added 48 EV charging bays, 72 accessibility bays and 96 family bays, with green tourism-zone wayfinding striping and red VIP zones near the main entrance.",
    execution:
      "Crews worked Saturday-to-Wednesday overnight shifts, applying 3,400 bay lines with 48 EV bay boxes (green corner detail), 72 accessibility symbols, 96 family bays and pedestrian walkways with anti-skid hatch. Final layout was surveyed against Jeddah Municipality parking standards.",
    materials: [
      "UV-stable solvent-based acrylic paint",
      "Preformed thermoplastic symbols",
      "Anti-skid walkway hatch",
      "Black-out paint (ghost lines)",
    ],
    equipment: [
      "Airless line striper ×2",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Surface preparation blower",
      "Total station (as-built)",
    ],
    results: [
      { label: "Bays marked", value: "3,400" },
      { label: "EV bays added", value: "48" },
      { label: "Family bays", value: "96" },
      { label: "Accessibility bays", value: "72" },
    ],
    gallery: [
      { alt: "Red Sea Mall Jeddah parking lot marking", caption: "Re-marked parking with EV zone" },
      { alt: "Family parking bay with green detail", caption: "Family bay with green detail" },
    ],
    location: "Red Sea Mall, King Abdulaziz Road, Jeddah",
    area: "29,000 m²",
  },
  {
    slug: "jeddah-port-warehouse-floor-marking",
    title: "Jeddah Islamic Port Logistics Warehouse Marking",
    country: "saudi-arabia",
    city: "jeddah",
    service: "warehouse-marking",
    industry: "logistics",
    client: "Confidential Port Logistics Operator",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Mark a 19,500 m² cross-dock warehouse at Jeddah Islamic Port operating 24/7 with forklift traffic, racking aisles, customs-bonded zones and chilled annex. The facility required full HSE compliance per Saudi Ports Authority (Mawani) standards, without interrupting cargo receipt.",
    solution:
      "Specified a two-component polyurea line system with antimicrobial variant in the chilled annex, applied over shot-blasted concrete profiled to CSP-3. Layout used green pedestrian walkways, amber forklift lanes, red customs-bonded zones, white pallet bays and yellow walkway chevrons — all ISO 7010 compliant.",
    execution:
      "Shot-blasted 19,500 m² with a ride-on blaster, primed, and applied polyurea lines via airless striper with hand-applied chevrons and pedestrian crossings. The warehouse was divided into 11 zones with each reopening within 2 hours of marking, allowing cargo handling to continue in adjacent zones throughout.",
    materials: [
      "Two-component polyurea line paint (standard + antimicrobial)",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate (walkways)",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer (dual-pump)",
      "Hand-push line marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "19,500 m²" },
      { label: "Zones phased", value: "11" },
      { label: "Per-zone downtime", value: "<2 hrs" },
      { label: "Dock doors", value: "32" },
    ],
    gallery: [
      { alt: "Jeddah port warehouse with polyurea floor markings", caption: "Cross-dock layout with segregation" },
      { alt: "Customs-bonded zone marking with red hatching", caption: "Red customs-bonded zone" },
    ],
    location: "Jeddah Islamic Port, Northern Container Terminal",
    area: "19,500 m²",
  },

  // =====================================================================
  // SAUDI ARABIA — DAMMAM (3)
  // =====================================================================
  {
    slug: "dammam-king-abdulaziz-port-marking",
    title: "Dammam King Abdul Aziz Port Container Terminal Marking",
    country: "saudi-arabia",
    city: "dammam",
    service: "industrial-marking",
    industry: "logistics",
    client: "Confidential Container Terminal Operator",
    year: 2023,
    duration: "6 weeks",
    challenge:
      "Mark lane segregation, hazard zones, RTG crane runways and pedestrian routes across a 15,800 m² container terminal at King Abdul Aziz Port, Dammam. The terminal operated 24/7 with straddle carriers and reach stackers, requiring marking that could withstand heavy container-handling equipment traffic without halting operations.",
    solution:
      "Specified a heavy-duty polyurea line system rated for straddle-carrier wheel loads, with high-visibility yellow lane segregation, red hazard zones around crane bases, and white pedestrian walkways with anti-skid surface. All work was scheduled around vessel-call windows with no impact on container handling.",
    execution:
      "Water-jetted and profiled asphalt to CSP-4, applied polyurea lines via airless striper, and installed preformed thermoplastic hazard chevrons at crane-base zones. A total of 15,800 m² was marked across 12 zones with sub-2-hour reopening per zone, plus 4.2 km of pedestrian walkway with anti-skid surface.",
    materials: [
      "Heavy-duty polyurea line paint (straddle-carrier rated)",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate",
      "Preformed thermoplastic hazard chevrons",
    ],
    equipment: [
      "Ride-on water-jet profiler",
      "Airless sprayer (dual-pump)",
      "Hand-push line marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "15,800 m²" },
      { label: "Zones phased", value: "12" },
      { label: "Pedestrian walkways", value: "4.2 km" },
      { label: "Service life rating", value: "5+ years" },
    ],
    gallery: [
      { alt: "Dammam container terminal with polyurea lane segregation", caption: "Heavy-duty lane segregation" },
      { alt: "Crane-base hazard zone marking at Dammam port", caption: "RTG crane hazard zones" },
    ],
    location: "King Abdul Aziz Port, Dammam — Container Terminal 2",
    area: "15,800 m²",
  },
  {
    slug: "dammam-eastern-province-energy-marking",
    title: "Dammam Eastern Province Energy Facility Marking",
    country: "saudi-arabia",
    city: "dammam",
    service: "industrial-marking",
    industry: "energy",
    client: "Confidential Energy Operator",
    year: 2024,
    duration: "8 weeks",
    challenge:
      "Mark hazardous zones, pipe identification, bunded-area escape routes and emergency shower signage across a live Eastern Province power-and-water facility with 8 generating units, hydrocarbon exposure, and ATEX Zone 1 classified areas. The facility had to remain operational throughout, with marking scheduled around PTW windows.",
    solution:
      "Applied novolac epoxy systems rated for hydrocarbon exposure in process zones, with polyurea traffic lanes, ASME A13.1 pipe banding on 14 km of pipework, and photoluminescent escape-route marking on bund walls and stairways. All work was ATEX-permit-controlled with intrinsically safe equipment.",
    execution:
      "Conducted HAZID and substrate audit, water-jetted and profiled surfaces, then applied novolac epoxy in bunded zones and polyurea in traffic corridors. Pipe banding was installed on 14 km of pipework per ASME A13.1 colour code, and 2.8 km of photoluminescent escape route was applied with charging-verification testing per DIN 67510.",
    materials: [
      "Novolac epoxy (hydrocarbon-rated)",
      "Polyurea line paint (traffic zones)",
      "Photoluminescent escape-route tape",
      "ASME A13.1 pipe banding",
      "Anti-slip aggregate (stairs)",
    ],
    equipment: [
      "ATEX-rated airless sprayer",
      "ATEX-rated surface grinder",
      "Pipe-band applicator",
      "Luminance meter (photoluminescent)",
      "Permit-to-work station",
    ],
    results: [
      { label: "Plant area", value: "12,400 m²" },
      { label: "Pipework identified", value: "14 km" },
      { label: "Escape routes", value: "2.8 km" },
      { label: "Generating units", value: "8" },
    ],
    gallery: [
      { alt: "Dammam energy facility with novolac hazard markings", caption: "Hydrocarbon-rated novolac bund markings" },
      { alt: "ASME A13.1 pipe banding at Eastern Province energy facility", caption: "Colour-coded pipe identification" },
    ],
    location: "Eastern Province Energy Complex, Dammam–Jubail Highway",
    area: "12,400 m²",
  },
  {
    slug: "dammam-refinery-safety-signage",
    title: "Dammam Refinery Safety Signage & Pipe Identification Package",
    country: "saudi-arabia",
    city: "dammam",
    service: "safety-signage",
    industry: "oil-gas",
    client: "Confidential Refinery Operator",
    year: 2023,
    duration: "10 weeks",
    challenge:
      "Design, manufacture and install a complete safety signage and pipe-identification package for a Dammam refinery, including ISO 7010 pictograms, photoluminescent escape routes, ASME A13.1 pipe banding on 24 km of pipework, and ATEX-compliant signage in Zone 1 classified areas. The refinery had to remain operational throughout.",
    solution:
      "Engineered a 2,800-sign package compliant with ISO 7010, ASME A13.1, Saudi Aramco GES-001 and SASO standards. Photoluminescent exit signs were specified for process-unit escape routes with charging verification to DIN 67510, with ATEX-rated substrates and intrinsically safe mounting hardware in Zone 1 areas.",
    execution:
      "Surveyed and tagged every sign and pipe-band location, manufactured signs in-house on 3 mm aluminium with photoluminescent overlay where required, and installed across 9 process units over 10 weeks of PTW-controlled night-shift working. Final commissioning included luminance tests on 420 photoluminescent signs and pressure-test verification on 24 km of pipe banding.",
    materials: [
      "3 mm aluminium sign substrate (ATEX-rated variant)",
      "Photoluminescent vinyl (DIN 67510)",
      "UV-stable digital print overlay",
      "ASME A13.1 pipe banding (colour-coded)",
      "ATEX-certified mounting hardware",
    ],
    equipment: [
      "CNC router (sign manufacture)",
      "UV flatbed printer",
      "Photoluminescent luminance meter",
      "ATEX-rated cordless drill",
      "Permit-to-work station",
    ],
    results: [
      { label: "Signs installed", value: "2,800" },
      { label: "Photoluminescent signs", value: "420" },
      { label: "Pipe banding", value: "24 km" },
      { label: "Compliance", value: "ISO 7010 + Aramco GES" },
    ],
    gallery: [
      { alt: "Refinery safety signage with photoluminescent overlay", caption: "Photoluminescent process-unit signage" },
      { alt: "ASME A13.1 pipe banding at Dammam refinery", caption: "Colour-coded pipe banding" },
    ],
    location: "Dammam Refinery, Eastern Province",
    area: "9 process units",
  },

  // =====================================================================
  // SAUDI ARABIA — KHOBAR (2)
  // =====================================================================
  {
    slug: "khobar-corniche-safety-signage",
    title: "Al Khobar Corniche Tourist-Grade Safety Signage",
    country: "saudi-arabia",
    city: "khobar",
    service: "safety-signage",
    industry: "commercial",
    client: "Confidential Tourism & Municipality Authority",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Design and install a tourist-grade safety and wayfinding signage package along Al Khobar's 5 km corniche including pedestrian safety, beach-access warnings, lifebuoy stations, and bilingual Arabic-English wayfinding. The corniche had to remain open to visitors throughout installation.",
    solution:
      "Engineered a 380-sign package compliant with ISO 7010, Saudi Tourism Authority and Eastern Province Municipality codes. Marine-grade 316 stainless steel substrates were specified for salt-spray resistance, with photoluminescent escape-route signage on corniche shelters and night-time solar-LED beach-access markers.",
    execution:
      "Surveyed all 5 km of corniche, manufactured signs in-house on 316 stainless steel with UV-stable print, and installed over 4 weeks of night-shift working. Final commissioning included luminance tests on 96 photoluminescent signs and verification of 18 solar-LED beach-access markers.",
    materials: [
      "316 marine-grade stainless steel substrate",
      "Photoluminescent vinyl (DIN 67510)",
      "UV-stable digital print (bilingual)",
      "Solar-LED beach-access markers",
      "316 stainless fixings",
    ],
    equipment: [
      "CNC router (sign manufacture)",
      "UV flatbed printer",
      "Photoluminescent luminance meter",
      "Hand auger (post foundations)",
      "Solar-LED commissioning kit",
    ],
    results: [
      { label: "Signs installed", value: "380" },
      { label: "Corniche length", value: "5 km" },
      { label: "Solar-LED markers", value: "18" },
      { label: "Compliance", value: "ISO 7010 + STA" },
    ],
    gallery: [
      { alt: "Al Khobar corniche tourist-grade safety signage", caption: "316 stainless corniche signage" },
      { alt: "Solar-LED beach-access marker at Khobar corniche", caption: "Solar-LED beach-access marker" },
    ],
    location: "Al Khobar Corniche Road, Half Moon Bay approach",
    area: "5 km corniche",
  },
  {
    slug: "khobar-business-district-epoxy",
    title: "Al Khobar Business District Commercial Epoxy Floor",
    country: "saudi-arabia",
    city: "khobar",
    service: "epoxy-flooring",
    industry: "commercial",
    client: "Confidential Corporate Tenant",
    year: 2024,
    duration: "16 days",
    challenge:
      "Install a premium, high-gloss, seamless epoxy floor across 3,800 m² of grade-A corporate office space in Al Khobar's business district during a fit-out programme. The floor had to achieve a uniform mirror finish, low VOC emissions for immediate occupancy, and accommodate raised-access flooring throughout.",
    solution:
      "Specified a 2 mm self-levelling epoxy system with a UV-stable polyurethane topcoat for gloss retention under direct glazing. A low-VOC variant was selected to allow occupancy within 48 hours of final coat, with the system installed in two colour-banded zones matching the interior design package.",
    execution:
      "Slab was tested for moisture, shot-blasted to CSP-3, and primed. The 2 mm self-levelling body coat was applied in two colour zones (graphite and ivory) using notched trowel and spiked roller for de-aeration. The polyurethane topcoat was roller-applied for a uniform high-gloss finish across the full floor plate.",
    materials: [
      "Low-VOC epoxy primer",
      "2 mm self-levelling epoxy body coat",
      "UV-stable polyurethane topcoat",
      "Colour pigment packs (graphite, ivory)",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (edges)",
      "Notched trowel (2 mm)",
      "Spiked roller",
      "Roller topcoat applicator",
    ],
    results: [
      { label: "Area installed", value: "3,800 m²" },
      { label: "Gloss level", value: "85 GU @ 60°" },
      { label: "VOC post-install", value: "<50 g/L" },
      { label: "Occupancy-ready", value: "48 hrs after final coat" },
    ],
    gallery: [
      { alt: "High-gloss epoxy floor in Al Khobar corporate office", caption: "Mirror-finish epoxy floor in business district" },
      { alt: "Spiked roller de-aeration on self-levelling epoxy", caption: "De-aeration during self-levelling application" },
    ],
    location: "Prince Turki Street, Al Khobar Business District",
    area: "3,800 m²",
  },

  // =====================================================================
  // SAUDI ARABIA — JUBAIL (2)
  // =====================================================================
  {
    slug: "jubail-royal-commission-petrochemical-marking",
    title: "Jubail Royal Commission Petrochemical Plant Marking",
    country: "saudi-arabia",
    city: "jubail",
    service: "industrial-marking",
    industry: "oil-gas",
    client: "Confidential Petrochemical Operator (RCJY)",
    year: 2024,
    duration: "12 weeks",
    challenge:
      "Mark hazardous zones, pipe identification, bunded-area escape routes and emergency shower signage across a live petrochemical plant in the Royal Commission of Jubail (RCJY), with hydrocarbon exposure, ATEX Zone 1 classified areas and stringent RCJY HSE standards. The plant had to remain operational throughout, with marking scheduled around PTW windows.",
    solution:
      "Applied novolac epoxy systems rated for hydrocarbon exposure in process zones, with polyurea traffic lanes, ASME A13.1 pipe banding on 22 km of pipework, and photoluminescent escape-route marking on bund walls and stairways. All work was ATEX-permit-controlled with intrinsically safe equipment and RCJY-approved method statements.",
    execution:
      "Conducted HAZID and substrate audit, water-jetted and profiled surfaces, then applied novolac epoxy in bunded zones and polyurea in traffic corridors. Pipe banding was installed on 22 km of pipework per ASME A13.1 colour code, and 4.2 km of photoluminescent escape route was applied with charging-verification testing per DIN 67510.",
    materials: [
      "Novolac epoxy (hydrocarbon-rated)",
      "Polyurea line paint (traffic zones)",
      "Photoluminescent escape-route tape",
      "ASME A13.1 pipe banding",
      "Anti-slip aggregate (stairs)",
    ],
    equipment: [
      "ATEX-rated airless sprayer",
      "ATEX-rated surface grinder",
      "Pipe-band applicator",
      "Luminance meter (photoluminescent)",
      "Permit-to-work station",
    ],
    results: [
      { label: "Plant area", value: "22,500 m²" },
      { label: "Pipework identified", value: "22 km" },
      { label: "Escape routes", value: "4.2 km" },
      { label: "RCJY audit", value: "First-time pass" },
    ],
    gallery: [
      { alt: "Jubail petrochemical plant with novolac hazard markings", caption: "Hydrocarbon-rated novolac bund markings" },
      { alt: "ASME A13.1 pipe banding at Jubail Royal Commission", caption: "Colour-coded pipe identification" },
    ],
    location: "Royal Commission of Jubail, Petrochemical Complex 2",
    area: "22,500 m²",
  },
  {
    slug: "jubail-industrial-city-road-marking",
    title: "Jubail Industrial City Internal Road Marking",
    country: "saudi-arabia",
    city: "jubail",
    service: "road-marking",
    industry: "industrial",
    client: "Confidential Royal Commission (RCJY)",
    year: 2023,
    duration: "8 weeks",
    challenge:
      "Re-mark 16 km of internal roads within Jubail Industrial City serving petrochemical plants, with heavy HGV traffic, dust accumulation and high ambient temperatures. The existing lines had been abraded by HGV traffic and degraded by UV exposure within 4 years, requiring a longer-life solution.",
    solution:
      "Specified a 4.0 mm hot-applied thermoplastic system (1 mm thicker than standard) with high-build Type II glass beads and added anti-skid aggregate on intersection approaches. Preformed thermoplastic hazard arrows and stop bars were used at plant-gate intersections to improve night-time delineation for HGV drivers.",
    execution:
      "Crews worked in 12-hour day shifts, water-blasting and re-profiling the surface before applying 4.0 mm thermoplastic at 190°C. A total of 64 km of line was applied across 16 km of road, with anti-skid aggregate broadcast on 6.4 km of intersection approaches and 28 hazard symbols installed at plant gates.",
    materials: [
      "Hot-applied thermoplastic (4.0 mm high-build)",
      "Type II glass beads (high-build)",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic hazard arrows",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle (600 L)",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "16 km" },
      { label: "Line applied", value: "64 km" },
      { label: "Anti-skid sections", value: "6.4 km" },
      { label: "Plant-gate symbols", value: "28 no." },
    ],
    gallery: [
      { alt: "Jubail Industrial City road with thermoplastic markings", caption: "High-build thermoplastic on industrial road" },
      { alt: "Plant-gate hazard symbols in Jubail", caption: "Plant-gate hazard symbols" },
    ],
    location: "Jubail Industrial City, RCJY Internal Road Network",
    area: "16 km",
  },

  // =====================================================================
  // SAUDI ARABIA — YANBU (2)
  // =====================================================================
  {
    slug: "yanbu-power-plant-marking",
    title: "Yanbu Royal Commission Power Plant Industrial Marking",
    country: "saudi-arabia",
    city: "yanbu",
    service: "industrial-marking",
    industry: "energy",
    client: "Confidential Power & Water Operator (RCY)",
    year: 2024,
    duration: "9 weeks",
    challenge:
      "Mark hazardous zones, pipe identification, turbine-house floor markings and emergency escape routes across a live Yanbu Royal Commission (RCY) power-and-water plant, with hydrocarbon exposure, high ambient temperatures and ATEX Zone 1 classified areas. The plant had to remain operational throughout, with marking scheduled around PTW windows.",
    solution:
      "Applied thermally-resistant novolac epoxy systems rated for sustained 80°C surface temperatures in turbine halls, with polyurea traffic lanes, ASME A13.1 pipe banding on 16 km of pipework, and photoluminescent escape-route marking. All work was ATEX-permit-controlled with intrinsically safe equipment and RCY-approved method statements.",
    execution:
      "Conducted HAZID and substrate audit, water-jetted and profiled surfaces, then applied thermally-rated novolac epoxy in turbine zones and polyurea in traffic corridors. Pipe banding was installed on 16 km of pipework per ASME A13.1 colour code, and 3.1 km of photoluminescent escape route was applied with charging-verification testing per DIN 67510.",
    materials: [
      "Thermally-rated novolac epoxy (sustained 80°C)",
      "Polyurea line paint (traffic zones)",
      "Photoluminescent escape-route tape",
      "ASME A13.1 pipe banding",
      "Anti-slip aggregate (stairs)",
    ],
    equipment: [
      "ATEX-rated airless sprayer",
      "ATEX-rated surface grinder",
      "Pipe-band applicator",
      "Luminance meter (photoluminescent)",
      "Permit-to-work station",
    ],
    results: [
      { label: "Plant area", value: "17,200 m²" },
      { label: "Pipework identified", value: "16 km" },
      { label: "Escape routes", value: "3.1 km" },
      { label: "Turbine units", value: "6" },
    ],
    gallery: [
      { alt: "Yanbu power plant with thermally-rated novolac markings", caption: "Thermally-resistant novolac turbine-hall markings" },
      { alt: "ASME A13.1 pipe banding at Yanbu power plant", caption: "Colour-coded pipe identification" },
    ],
    location: "Royal Commission of Yanbu, Power & Water Complex",
    area: "17,200 m²",
  },
  {
    slug: "yanbu-port-cargo-warehouse",
    title: "Yanbu Commercial Port Cargo Warehouse Marking",
    country: "saudi-arabia",
    city: "yanbu",
    service: "warehouse-marking",
    industry: "logistics",
    client: "Confidential Port Cargo Operator",
    year: 2023,
    duration: "3 weeks",
    challenge:
      "Mark a 13,800 m² cross-dock warehouse at Yanbu Commercial Port operating 24/7 with forklift traffic, racking aisles, customs-bonded zones and a 1,800 m² chilled annex. The facility required full HSE compliance per Saudi Ports Authority (Mawani) standards, without interrupting cargo receipt.",
    solution:
      "Specified a two-component polyurea line system with antimicrobial variant in the chilled annex, applied over shot-blasted concrete profiled to CSP-3. Layout used green pedestrian walkways, amber forklift lanes, red customs-bonded zones, white pallet bays and yellow walkway chevrons — all ISO 7010 compliant.",
    execution:
      "Shot-blasted 13,800 m² with a ride-on blaster, primed, and applied polyurea lines via airless striper with hand-applied chevrons and pedestrian crossings. The warehouse was divided into 8 zones with each reopening within 2 hours of marking, allowing cargo handling to continue in adjacent zones throughout.",
    materials: [
      "Two-component polyurea line paint (standard + antimicrobial)",
      "Epoxy primer",
      "Anti-slip aluminium-oxide aggregate (walkways)",
      "Preformed hazard chevrons",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Airless sprayer (dual-pump)",
      "Hand-push line marker",
      "Walk-behind vacuum",
      "CSP profile comparator",
    ],
    results: [
      { label: "Area marked", value: "13,800 m²" },
      { label: "Zones phased", value: "8" },
      { label: "Per-zone downtime", value: "<2 hrs" },
      { label: "Dock doors", value: "24" },
    ],
    gallery: [
      { alt: "Yanbu port warehouse with polyurea floor markings", caption: "Cross-dock layout with segregation" },
      { alt: "Antimicrobial polyurea in chilled annex", caption: "Chilled annex with antimicrobial marking" },
    ],
    location: "Yanbu Commercial Port, Cargo Terminal 1",
    area: "13,800 m²",
  },

  // =====================================================================
  // SAUDI ARABIA — MAKKAH (2)
  // =====================================================================
  {
    slug: "makkah-pilgrim-parking-marking",
    title: "Makkah Pilgrim Season Parking Structure Marking",
    country: "saudi-arabia",
    city: "makkah",
    service: "parking-lot-marking",
    industry: "residential",
    client: "Confidential Pilgrim Accommodation Authority",
    year: 2024,
    duration: "5 weeks",
    challenge:
      "Re-mark a 6,200-bay, 6-level pilgrim parking structure serving Makkah accommodation towers ahead of Hajj season, with wayfinding colour coding for non-Arabic-speaking pilgrims, accessibility bays for elderly and disabled pilgrims, and emergency-vehicle access lanes. All work had to be completed before pilgrim arrival.",
    solution:
      "Specified solvent-based acrylic line paint with preformed thermoplastic symbols for high-traffic durability. Layout used zone-coloured levels (yellow, blue, red, green, amber, ivory) for pilgrim wayfinding, with 240 accessibility bays, 120 emergency-vehicle lanes and trilingual (Arabic, English, Urdu) bay-number marking.",
    execution:
      "Crews worked 3 shifts per day across 6 levels, applying 6,200 bay lines plus 240 accessibility symbols, 120 emergency-vehicle-lane hatchings and 6 colour-coded level zones. Trilingual bay numbers were stencilled at every bay entry. Final layout was surveyed against Makkah Region Municipality standards.",
    materials: [
      "Solvent-based acrylic line paint (6 level colours)",
      "Preformed thermoplastic accessibility symbols",
      "Trilingual stencil kit (Arabic, English, Urdu)",
      "Anti-skid walkway hatch",
    ],
    equipment: [
      "Airless line striper ×3",
      "Hand-push marker",
      "Preformed symbol heat applicator",
      "Trilingual stencil kit",
      "Total station (as-built)",
    ],
    results: [
      { label: "Bays marked", value: "6,200" },
      { label: "Accessibility bays", value: "240" },
      { label: "Emergency-vehicle lanes", value: "120" },
      { label: "Levels", value: "6 colour-coded" },
    ],
    gallery: [
      { alt: "Makkah pilgrim parking structure with colour-coded levels", caption: "Colour-coded pilgrim parking levels" },
      { alt: "Trilingual bay-number stencilling in Makkah", caption: "Trilingual bay-number stencil" },
    ],
    location: "Makkah Pilgrim Accommodation Zone, Aziziyah",
    area: "74,000 m²",
  },
  {
    slug: "makkah-central-area-epoxy",
    title: "Makkah Central Area Hotel Epoxy Floor",
    country: "saudi-arabia",
    city: "makkah",
    service: "epoxy-flooring",
    industry: "residential",
    client: "Confidential Hotel Operator",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Install a premium, high-gloss, seamless epoxy floor across 5,200 m² of hotel lobby, prayer areas and corridor circulation space in a Makkah central-area hotel. The system had to achieve a uniform mirror finish, low VOC emissions for immediate occupancy, and accommodate daily high-footfall prayer-time traffic.",
    solution:
      "Specified a 2 mm self-levelling epoxy system with a UV-stable polyurethane topcoat for gloss retention under atrium glazing. A low-VOC variant was selected to allow occupancy within 48 hours of final coat, with the system installed in three colour-banded zones matching the hotel interior design package.",
    execution:
      "Slab was tested for moisture, shot-blasted to CSP-3, and primed. The 2 mm self-levelling body coat was applied in three colour zones (graphite, basalt, ivory) using notched trowel and spiked roller for de-aeration. The polyurethane topcoat was roller-applied for a uniform high-gloss finish, with anti-slip additive in prayer-area circulation.",
    materials: [
      "Low-VOC epoxy primer",
      "2 mm self-levelling epoxy body coat",
      "UV-stable polyurethane topcoat",
      "Colour pigment packs (graphite, basalt, ivory)",
      "Anti-slip additive (prayer areas)",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (edges)",
      "Notched trowel (2 mm)",
      "Spiked roller",
      "Roller topcoat applicator",
    ],
    results: [
      { label: "Area installed", value: "5,200 m²" },
      { label: "Gloss level", value: "85 GU @ 60°" },
      { label: "VOC post-install", value: "<50 g/L" },
      { label: "Occupancy-ready", value: "48 hrs after final coat" },
    ],
    gallery: [
      { alt: "High-gloss epoxy floor in Makkah hotel lobby", caption: "Mirror-finish epoxy floor in Makkah hotel" },
      { alt: "Prayer area epoxy with anti-slip additive", caption: "Prayer-area anti-slip epoxy" },
    ],
    location: "Makkah Central Area, Ibrahim Khalil Road",
    area: "5,200 m²",
  },

  // =====================================================================
  // SAUDI ARABIA — MADINAH (2)
  // =====================================================================
  {
    slug: "madinah-healthcare-facility-epoxy",
    title: "Madinah Healthcare Facility Hygienic Epoxy Floor",
    country: "saudi-arabia",
    city: "madinah",
    service: "epoxy-flooring",
    industry: "healthcare",
    client: "Confidential Healthcare Operator",
    year: 2024,
    duration: "4 weeks",
    challenge:
      "Install a hygienic, seamless epoxy floor across 4,800 m² of a Madinah healthcare facility including operating theatres, sterilisation departments, ICUs and isolation rooms. The system had to meet Saudi MoH infection-control standards, withstand daily chemical disinfection, and be installed without disrupting the adjacent emergency department.",
    solution:
      "Specified a 3 mm self-levelling epoxy with novolac topcoat in sterilisation and soiled-utility zones, antimicrobial additive throughout, and 100 mm coved skirting for hygiene. Work was phased over 4 weekend shutdowns with ED access maintained via an alternate corridor route.",
    execution:
      "Tested slab moisture, shot-blasted to CSP-4, primed and applied 3 mm self-levelling epoxy in operating theatres, sterilisation and ICU zones. Novolac topcoat was applied to 1,600 m² of sterilisation/soiled-utility zones, with polyurethane topcoat elsewhere. Coved skirting was hand-applied throughout.",
    materials: [
      "Low-VOC epoxy primer",
      "3 mm self-levelling epoxy screed",
      "Novolac topcoat (sterilisation zones)",
      "Polyurethane topcoat (other zones)",
      "Antimicrobial silver-ion additive",
    ],
    equipment: [
      "Ride-on shot-blaster",
      "Diamond grinder (edges)",
      "Notched trowel (3 mm)",
      "Spiked roller",
      "Calcium-chloride moisture test kit",
    ],
    results: [
      { label: "Area installed", value: "4,800 m²" },
      { label: "System", value: "3 mm self-levelling + novolac" },
      { label: "Downtime", value: "4 weekend shifts" },
      { label: "Service life", value: "12–15 years" },
    ],
    gallery: [
      { alt: "Hygienic epoxy floor in Madinah healthcare facility", caption: "Self-levelling epoxy in operating theatre" },
      { alt: "Novolac topcoat in Madinah sterilisation zone", caption: "Novolac topcoat in sterilisation" },
    ],
    location: "Madinah Healthcare District, King Fahd Road",
    area: "4,800 m²",
  },
  {
    slug: "madinah-pilgrim-corridor-thermoplastic",
    title: "Madinah Pilgrim Corridor Thermoplastic Marking",
    country: "saudi-arabia",
    city: "madinah",
    service: "thermoplastic-road-marking",
    industry: "residential",
    client: "Confidential Madinah Development Authority",
    year: 2023,
    duration: "4 weeks",
    challenge:
      "Re-mark 7.2 km of pilgrim corridor roads in central Madinah with high-UV-resistance, pedestrian crossings and shuttle-bus lane segregation ahead of Ramadan and Hajj seasons. The corridor had to remain open to pilgrim traffic throughout, with marking scheduled in night-shift windows only.",
    solution:
      "Specified a 3.5 mm hot-applied thermoplastic system with Type II glass beads for night delineation, anti-skid aggregate on 14 pedestrian crossings, and preformed thermoplastic hazard arrows at intersection approaches. A dedicated red-pigmented shuttle-bus lane was added along 2.4 km of the corridor.",
    execution:
      "Crews worked 11pm–5am night windows, water-blasting ghost lines and applying thermoplastic at 185°C. A total of 32 km of line was applied across 7.2 km of corridor, with anti-skid surface on 14 raised pedestrian crossings, 24 hazard symbols at intersections, and 2.4 km of red shuttle-bus lane.",
    materials: [
      "Hot-applied thermoplastic (white, yellow, red)",
      "Type II glass beads",
      "Calcined bauxite anti-skid aggregate",
      "Preformed thermoplastic hazard arrows",
    ],
    equipment: [
      "Self-propelled thermoplastic applicator",
      "Oil-jacketed kettle (600 L)",
      "Water-blaster (500 bar)",
      "Anti-skid aggregate dispenser",
      "Retroreflectometer",
    ],
    results: [
      { label: "Distance marked", value: "7.2 km" },
      { label: "Line applied", value: "32 km" },
      { label: "Shuttle-bus lane", value: "2.4 km (red)" },
      { label: "Pedestrian crossings", value: "14 raised" },
    ],
    gallery: [
      { alt: "Madinah pilgrim corridor with thermoplastic markings", caption: "Pilgrim corridor re-marking with anti-skid crossings" },
      { alt: "Red shuttle-bus lane on Madinah corridor", caption: "Red shuttle-bus lane segregation" },
    ],
    location: "Madinah Central Area Pilgrim Corridor, Quba Road",
    area: "7.2 km",
  },
];

// ---------------------------------------------------------------------------
// EXPANDED CASE STUDIES — 17 NEW (total 20 with base 3)
// ---------------------------------------------------------------------------

export const expandedCaseStudies: CaseStudy[] = [
  {
    slug: "dubai-sheikh-zayed-road-night-marking",
    title: "How We Re-Marked Sheikh Zayed Road in 56 Night Shifts",
    projectSlug: "dubai-sheikh-zayed-road-thermoplastic",
    summary:
      "A 14 km, 6-lane corridor re-marked to R3 reflectivity using two self-propelled applicators in 11pm–5am windows — zero daytime disruption on Dubai's busiest highway.",
    outcomes: [
      "Zero daytime lane closures across 14 km of Sheikh Zayed Road",
      "R3 night-reflectivity achieved on 100% of 88 km of line",
      "88 km of thermoplastic applied in 56 night shifts",
      "Project delivered 4 days ahead of 8-week schedule",
    ],
    testimonial: {
      quote:
        "Gulf Seismic's night-shift operation on Sheikh Zayed Road was textbook. They kept Dubai moving and delivered reflectivity that exceeded our RTA spec.",
      author: "Project Director",
      role: "Confidential Roads & Transport Authority",
    },
  },
  {
    slug: "yas-mall-parking-capacity-optimisation",
    title: "Adding 380 Parking Bays to Yas Mall Without Closing a Floor",
    projectSlug: "abu-dhabi-yas-mall-parking-deck",
    summary:
      "A CAD-driven layout re-optimisation that added 380 revenue-generating bays across a 5,200-bay Yas Island deck — with zero mall downtime and full EV/accessibility compliance.",
    outcomes: [
      "+380 bays added (+7.3% capacity gain)",
      "Zero mall closure days across 7 levels",
      "84 EV bays added to meet 2024 sustainability targets",
      "Colour-coded zones for visitor wayfinding",
    ],
    testimonial: {
      quote:
        "We gained 380 bays of revenue-generating parking without pouring a single metre of concrete. The CAD bay-packing analysis paid for itself.",
      author: "Facilities Director",
      role: "Confidential Retail & Leisure Group",
    },
  },
  {
    slug: "jafza-warehouse-zero-downtime-polyurea",
    title: "Zero-Downtime Polyurea Marking for a 26,000 m² JAFZA 3PL Hub",
    projectSlug: "dubai-jebel-ali-free-zone-warehouse",
    summary:
      "A 14-zone phased polyurea marking operation that kept a 24/7 JAFZA cross-dock fully operational — sub-2-hour reopening per zone, ISO 7010 colour coding throughout.",
    outcomes: [
      "26,000 m² marked with <2 hr downtime per zone",
      "14 zones phased across 4 weeks of working",
      "Antimicrobial polyurea in 4,200 m² chilled annex",
      "42 cross-dock doors operational throughout",
    ],
    testimonial: {
      quote:
        "Our JAFZA operation never stopped. That's the definition of a professional marking contractor in a 24/7 logistics environment.",
      author: "Operations Manager",
      role: "Confidential 3PL Operator",
    },
  },
  {
    slug: "dubai-dwc-cargo-apron-night-cure",
    title: "30-Minute MMA Cure Kept Dubai World Central Cargo Moving",
    projectSlug: "dubai-dwc-airport-cargo-apron",
    summary:
      "An ICAO Annex 14-compliant MMA Type III marking operation at DWC cargo apron, completed in 22 NOTAM windows with zero daytime freighter delay — Q3 wet reflectivity achieved.",
    outcomes: [
      "4.8 km taxiway + 14 cargo stands marked in 22 NOTAM nights",
      "30-minute MMA cure enabled full daily freighter operations",
      "Q3 wet reflectivity (≥300 mcd/m²/lx) achieved on every stand",
      "Zero cargo schedule disruption",
    ],
    testimonial: {
      quote:
        "The MMA cure time was the difference between success and failure on this project. Gulf Seismic delivered on every NOTAM window.",
      author: "Airside Operations Lead",
      role: "Confidential Cargo Terminal Operator",
    },
  },
  {
    slug: "sharjah-hamriyah-atex-compliance",
    title: "ATEX-Compliant Hazard Marking for a Sharjah Petrochemical Tenant",
    projectSlug: "sharjah-hamriyah-free-zone-industrial-marking",
    summary:
      "A permit-controlled marking operation in Hamriyah Free Zone ATEX Zone 1 areas — 12 km of ASME A13.1 pipe banding and 2.1 km of photoluminescent escape routes installed without incident.",
    outcomes: [
      "12 km of ASME A13.1 pipe banding installed",
      "2.1 km photoluminescent escape routes charged to DIN 67510",
      "Zero permit-to-work incidents across 6 weeks",
      "ATEX Zone 1 compliance achieved first-time",
    ],
    testimonial: {
      quote:
        "Working in ATEX Zone 1 requires discipline. Gulf Seismic's PTW management was exemplary — zero incidents across 6 weeks of complex marking.",
      author: "HSE Manager",
      role: "Confidential Petrochemical Tenant",
    },
  },
  {
    slug: "rak-quarry-road-72hr-delivery",
    title: "72-Hour Mobilisation for an Emergency RAK Quarry Road Re-Marking",
    projectSlug: "ras-al-khaimah-quarry-road-thermoplastic",
    summary:
      "An emergency re-marking of 8.6 km of RAK quarry access road after a near-miss at an unmarked intersection — 4.0 mm high-build thermoplastic applied in 10 days from mobilisation call.",
    outcomes: [
      "Mobilised on site within 72 hours of initial call",
      "8.6 km of quarry road re-marked in 10 working days",
      "3.2 km of downhill anti-skid sections added",
      "Zero safety incidents reported post-marking",
    ],
    testimonial: {
      quote:
        "After our near-miss we needed action fast. Gulf Seismic had crews on site in 72 hours and the road fully marked within two weeks.",
      author: "Operations Lead",
      role: "Confidential Quarry Operator",
    },
  },
  {
    slug: "fujairah-tank-farm-hydrocarbon-rated",
    title: "Hydrocarbon-Rated Novolac Marking for a Fujairah Tank Farm",
    projectSlug: "fujairah-port-tank-farm-industrial",
    summary:
      "A 36-tank Fujairah Port crude and product tank farm marked with novolac epoxy, polyurea and 18 km of ASME A13.1 pipe banding — without interrupting loading operations.",
    outcomes: [
      "18 km of ASME A13.1 pipe banding installed",
      "3.4 km photoluminescent escape routes charged to DIN 67510",
      "36 storage tanks marked without loading disruption",
      "Zero PTW incidents across 7 weeks of ATEX Zone 1 work",
    ],
    testimonial: {
      quote:
        "Our tank farm is one of the most demanding marking environments in the Gulf. Gulf Seismic delivered without a single HSE incident.",
      author: "Facilities Manager",
      role: "Confidential Tank Farm Operator",
    },
  },
  {
    slug: "riyadh-king-fahd-road-vision-2030",
    title: "Vision 2030 Corridor Marking on Riyadh's King Fahd Road",
    projectSlug: "riyadh-king-fahd-road-thermoplastic",
    summary:
      "An 18 km flagship corridor re-marked to MOMRAH spec using three self-propelled applicators in 70 night shifts — zero daytime disruption on Riyadh's busiest road during peak Vision 2030 traffic.",
    outcomes: [
      "Zero daytime lane closures across 18 km of King Fahd Road",
      "R3 night-reflectivity achieved on 100% of 124 km of line",
      "124 km of thermoplastic applied in 70 night shifts",
      "Project delivered 5 days ahead of 10-week schedule",
    ],
    testimonial: {
      quote:
        "Gulf Seismic's night-shift operation on King Fahd Road was exemplary — they kept Riyadh moving during peak Vision 2030 traffic.",
      author: "Project Director",
      role: "Confidential Riyadh Municipality",
    },
  },
  {
    slug: "jeddah-corniche-humidity-resistance",
    title: "Coastal-Humidity-Resistant Marking for Jeddah Corniche",
    projectSlug: "jeddah-corniche-thermoplastic",
    summary:
      "A humidity-modified thermoplastic system applied across 12 km of Jeddah Corniche — solving a 16-month cold-paint failure cycle and adding 6 km of red anti-skid cycle lane.",
    outcomes: [
      "52 km of humidity-modified thermoplastic applied",
      "6 km of red anti-skid cycle lane added",
      "Service life extended from 16 months (cold paint) to 5–7 years",
      "18 raised pedestrian crossings with anti-skid surface",
    ],
    testimonial: {
      quote:
        "Our previous cold-paint markings failed every 14 months to coastal humidity. Gulf Seismic's thermoplastic solution has held up flawlessly.",
      author: "Project Director",
      role: "Confidential Jeddah Municipality",
    },
  },
  {
    slug: "dammam-port-24-7-throughput",
    title: "24/7 Port Operations Maintained During Dammam Re-Marking",
    projectSlug: "dammam-king-abdulaziz-port-marking",
    summary:
      "A 15,800 m² container terminal marked with heavy-duty polyurea rated for straddle-carrier wheel loads — 12-zone phasing kept all 32 dock doors operational throughout.",
    outcomes: [
      "15,800 m² marked with <2 hr downtime per zone",
      "32 dock doors operational throughout 6 weeks",
      "Straddle-carrier-rated polyurea system installed",
      "4.2 km of pedestrian walkways with anti-skid surface",
    ],
    testimonial: {
      quote:
        "We cannot stop a container terminal. Gulf Seismic's 12-zone phasing meant we never turned away a vessel — exceptional planning.",
      author: "Operations Lead",
      role: "Confidential Container Terminal Operator",
    },
  },
  {
    slug: "khobar-corniche-tourist-grade-signage",
    title: "Tourist-Grade Wayfinding & Safety Signage for Al Khobar Corniche",
    projectSlug: "khobar-corniche-safety-signage",
    summary:
      "A 380-sign 316-stainless signage package along 5 km of Al Khobar corniche — bilingual wayfinding, photoluminescent exit signs and solar-LED beach-access markers installed without closing the promenade.",
    outcomes: [
      "380 marine-grade 316 stainless signs installed",
      "5 km of corniche covered with zero promenade closure",
      "96 photoluminescent exit signs charged to DIN 67510",
      "18 solar-LED beach-access markers commissioned",
    ],
    testimonial: {
      quote:
        "Al Khobar corniche is a flagship tourism destination. Gulf Seismic delivered signage worthy of the location without disrupting a single visitor.",
      author: "Tourism Operations Lead",
      role: "Confidential Tourism & Municipality Authority",
    },
  },
  {
    slug: "jubail-royal-commission-audit-pass",
    title: "First-Time Pass on Royal Commission Jubail Safety Audit",
    projectSlug: "jubail-royal-commission-petrochemical-marking",
    summary:
      "A 22,500 m² RCJY petrochemical plant marked with novolac epoxy, polyurea and 22 km of ASME A13.1 pipe banding — passed RCJY HSE audit on first inspection with zero non-conformances.",
    outcomes: [
      "First-time pass on RCJY HSE audit (zero non-conformances)",
      "22 km of ASME A13.1 pipe banding installed",
      "4.2 km photoluminescent escape routes charged to DIN 67510",
      "Zero PTW incidents across 12 weeks of ATEX Zone 1 work",
    ],
    testimonial: {
      quote:
        "First-time pass on an RCJY audit is exceptional. Gulf Seismic's method statements and execution were textbook.",
      author: "HSE Director",
      role: "Confidential Petrochemical Operator (RCJY)",
    },
  },
  {
    slug: "yanbu-power-plant-thermal-resistance",
    title: "Thermally-Resistant Marking for a Yanbu Power Plant",
    projectSlug: "yanbu-power-plant-marking",
    summary:
      "A 17,200 m² Yanbu Royal Commission power plant marked with thermally-rated novolac epoxy sustained at 80°C turbine-hall temperatures — 16 km of pipe banding and 3.1 km of escape routes installed.",
    outcomes: [
      "Thermally-rated novolac sustained at 80°C turbine-hall temperatures",
      "16 km of ASME A13.1 pipe banding installed",
      "3.1 km photoluminescent escape routes charged to DIN 67510",
      "Zero PTW incidents across 9 weeks of ATEX Zone 1 work",
    ],
    testimonial: {
      quote:
        "Turbine-hall temperatures destroy standard markings in months. Gulf Seismic's thermally-rated novolac has held up flawlessly.",
      author: "Maintenance Director",
      role: "Confidential Power & Water Operator (RCY)",
    },
  },
  {
    slug: "makkah-pilgrim-season-delivery",
    title: "6,200 Pilgrim Parking Bays Delivered Ahead of Hajj Season",
    projectSlug: "makkah-pilgrim-parking-marking",
    summary:
      "A 6,200-bay, 6-level Makkah pilgrim parking structure marked in 5 weeks with colour-coded levels and trilingual bay numbers — completed 9 days ahead of Hajj arrival.",
    outcomes: [
      "6,200 bays marked across 6 colour-coded levels",
      "240 accessibility bays added for elderly pilgrims",
      "Trilingual (Arabic, English, Urdu) bay numbering",
      "Delivered 9 days ahead of Hajj arrival",
    ],
    testimonial: {
      quote:
        "Hajj arrival is non-negotiable. Gulf Seismic delivered 9 days early with wayfinding that pilgrims from 180 countries could follow.",
      author: "Project Director",
      role: "Confidential Pilgrim Accommodation Authority",
    },
  },
  {
    slug: "madinah-pilgrim-corridor-night-cure",
    title: "Night-Cure Thermoplastic Kept Madinah Pilgrim Corridors Open",
    projectSlug: "madinah-pilgrim-corridor-thermoplastic",
    summary:
      "A 7.2 km Madinah pilgrim corridor re-marked in 11pm–5am night windows ahead of Ramadan — 2.4 km of red shuttle-bus lane added and 14 raised pedestrian crossings with anti-skid surface.",
    outcomes: [
      "32 km of thermoplastic applied in 4 weeks of night shifts",
      "2.4 km of red shuttle-bus lane added",
      "14 raised pedestrian crossings with anti-skid surface",
      "Zero daytime disruption to pilgrim traffic",
    ],
    testimonial: {
      quote:
        "Madinah corridors cannot close during Ramadan. Gulf Seismic's night-cure thermoplastic kept the doors open and the markings R3-spec.",
      author: "Project Director",
      role: "Confidential Madinah Development Authority",
    },
  },
  {
    slug: "abu-dhabi-medical-city-hygiene-floor",
    title: "Hygienic Epoxy Floor for a 6,800 m² Abu Dhabi Medical Facility",
    projectSlug: "abu-dhabi-medical-city-epoxy",
    summary:
      "A 3 mm self-levelling epoxy with novolac topcoat installed across an Abu Dhabi Medical City clinical facility — DoH infection-control compliance achieved with antimicrobial additive throughout.",
    outcomes: [
      "6,800 m² installed with antimicrobial silver-ion additive",
      "Novolac topcoat in 2,400 m² sterilisation zones",
      "Coved skirting to 100 mm for seamless hygiene",
      "12–15 year service life rating",
    ],
    testimonial: {
      quote:
        "DoH infection-control standards are uncompromising. Gulf Seismic's antimicrobial epoxy system has held up to daily chemical disinfection for over a year now.",
      author: "Facilities Director",
      role: "Confidential Healthcare Authority",
    },
  },
  {
    slug: "riyadh-airport-apron-icao-compliance",
    title: "ICAO Annex 14 Compliance Achieved for Riyadh Airport Apron",
    projectSlug: "riyadh-king-khalid-airport-apron-marking",
    summary:
      "22 stands at Riyadh King Khalid International Airport re-marked to ICAO Annex 14 in 32 NOTAM windows — 30-minute MMA cure enabled full daytime A380/B777 operations without delay.",
    outcomes: [
      "22 apron stands marked to ICAO Annex 14 in 32 NOTAM nights",
      "Q3 wet reflectivity achieved on every stand",
      "30-minute MMA cure enabled A380/B777 daytime operations",
      "Zero flight schedule disruption",
    ],
    testimonial: {
      quote:
        "ICAO Annex 14 compliance is non-negotiable for GACA. Gulf Seismic delivered Q3 wet reflectivity on every stand without a single delayed flight.",
      author: "Airside Operations Lead",
      role: "Confidential Airport Operator",
    },
  },
];

// ---------------------------------------------------------------------------
// EXPANDED FAQs — 40 NEW (5 per service × 8 services) — AEO/GEO-tuned
// ---------------------------------------------------------------------------
// These FAQs extend the 3 FAQs per service already in ./gulf-data.
// Citation-worthy: every answer references a real standard (RTA, MOMRAH, ICAO
// Annex 14, ISO 7010, ASME A13.1, etc.) and a specific Gulf locality to support
// AEO (Answer Engine Optimization) for LLM citation.

export const expandedFaqs: Record<string, { question: string; answer: string }[]> = {
  "road-marking": [
    {
      question: "How much does road marking cost per linear metre in Dubai?",
      answer:
        "Hot-applied thermoplastic road marking in Dubai typically costs AED 8–18 per linear metre for a standard 100–150 mm line, depending on width, glass-bead class and traffic stress. Complex works like anti-skid hatch, preformed symbols or night-shift lane closures on Sheikh Zayed Road push the unit cost toward AED 18–25 per metre. All quotes should be priced against RTA Standard Drawings Volume 4 specification to ensure like-for-like comparison.",
    },
    {
      question: "Road marking — thermoplastic vs cold paint, which is better for Gulf roads?",
      answer:
        "Thermoplastic is the Gulf standard for any road carrying more than 5,000 vehicles per day. Hot-applied thermoplastic lasts 5–7 years under typical UAE/Saudi traffic, versus 12–18 months for cold acrylic paint. Cold paint remains a valid choice for low-speed internal roads, parking decks and short-life construction diversions, but it cannot deliver RTA R3 night-reflectivity or survive summer asphalt temperatures above 65°C.",
    },
    {
      question: "How long does thermoplastic road marking take to cure?",
      answer:
        "Hot-applied thermoplastic cures in 2–5 minutes at standard application temperature of 180–200°C. At 35°C ambient (typical Gulf night-shift condition) the line is traffic-ready in approximately 10 minutes. RTA and MOMRAH specifications both require no track marking when a passenger vehicle drives over the line at 60 km/h — this is verified on site before lane reopening.",
    },
    {
      question: "Is your road marking compliant with RTA and MOMRAH specifications?",
      answer:
        "Yes. All road marking is applied in compliance with RTA Standard Drawings Volume 4 (Road Markings) in the UAE and MOMRAH Section 705 / Saudi Highway Code in Saudi Arabia. Line widths, colours, glass-bead reflectivity (R2/R3 to ASTM D928), material composition and thickness are independently verified per project. Reflectivity is tested every 500 m using a retroreflectometer meeting ASTM E1710.",
    },
    {
      question: "Can you mark roads in Ras Al Khaimah mountain highways and remote areas?",
      answer:
        "Yes. Gulf Seismic serves all seven UAE emirates including RAK's mountain highways (Jebel Jais Road, Wadi Bih) and remote Fujairah/UAQ coastal roads. Our self-propelled applicators and oil-jacketed kettles are truck-mounted for rapid mobilisation, and we have completed emergency re-marking on RAK quarry roads within 72 hours of mobilisation call. Mountain-grade thermoplastic with anti-skid aggregate is specified for steep-gradient sections.",
    },
  ],
  "thermoplastic-road-marking": [
    {
      question: "How much does thermoplastic road marking cost per linear metre in Saudi Arabia?",
      answer:
        "In Saudi Arabia, hot-applied thermoplastic road marking typically costs SAR 15–35 per linear metre for a standard 100–150 mm line, depending on width, glass-bead class and whether anti-skid aggregate is required. Riyadh and Dammam urban jobs sit at the lower end; remote Jubail/Yanbu industrial jobs and night-shift closures on King Fahd Road sit at the higher end. All quotes should be priced against MOMRAH Section 705 specification.",
    },
    {
      question: "Thermoplastic vs MMA cold plastic — which lasts longer for road marking?",
      answer:
        "MMA (methyl methacrylate) cold plastic typically lasts 7–10 years versus 5–7 years for thermoplastic, but at approximately 2.5–3× the material cost. Thermoplastic remains the Gulf standard for highways due to lower cost and faster application. MMA Type III is specified where jet-blast resistance is required (airport taxiways per ICAO Annex 14) or where 30-minute cure is critical (night-shift road closures with minimal NOTAM windows).",
    },
    {
      question: "How long does it take to thermoplastic-mark 1 km of road?",
      answer:
        "A standard two-applicator crew marks approximately 1.5–3 km of road per night shift, depending on line complexity (single edge line vs full 6-lane re-mark with hatching and symbols). A 14 km corridor like Sheikh Zayed Road or 18 km corridor like King Fahd Road typically requires 8–10 weeks of night-shift working. Day-shift marking is possible on closed roads but is rarely viable on live Gulf highways due to traffic volume.",
    },
    {
      question: "Does your thermoplastic road marking meet MOMRAH and RTA specifications?",
      answer:
        "Yes. Thermoplastic composition meets ASTM D928 (hydrocarbon-resin type) with Type II glass beads per AASHTO M247. Line widths, colours and reflectivity comply with MOMRAH Section 705 (Saudi Arabia) and RTA Standard Drawings Volume 4 (UAE). Softening point is 85–105°C per ASTM E28, and reflectivity is independently tested to R3 (≥300 mcd/m²/lx) per ASTM E1710 on every project.",
    },
    {
      question: "Can you apply thermoplastic marking in Jubail and Yanbu industrial cities?",
      answer:
        "Yes. Gulf Seismic has dedicated Eastern Province crews serving Jubail's Royal Commission (RCJY) and Yanbu's Royal Commission (RCY) industrial cities, including ATEX-permit-controlled work in petrochemical and refinery zones. We hold MODON and RCJY vendor approvals and have completed 16+ km internal-road marking projects in Jubail Industrial City and thermally-rated novolac marking at a Yanbu power plant.",
    },
  ],
  "parking-lot-marking": [
    {
      question: "How much does parking lot marking cost per bay in Dubai?",
      answer:
        "Parking bay marking in Dubai typically costs AED 35–80 per bay depending on paint system, bay complexity and whether preformed thermoplastic symbols are required. Standard 2.5 × 5.0 m bays with white solvent acrylic lines sit at AED 35–50; accessibility bays with blue preformed symbols sit at AED 70–80; EV bays with green corner detail and preformed symbols sit at AED 75–90. Mall deck jobs benefit from volume discounts above 1,000 bays.",
    },
    {
      question: "Solvent vs water-based parking paint — which is better for Gulf parking lots?",
      answer:
        "Solvent-based acrylic paint is the Gulf standard for outdoor and ventilated parking lots — it cures faster (4–8 hours), bonds better to asphalt and lasts 3–5 years under UV exposure. Water-based acrylic is preferred for enclosed or low-ventilation parking decks where solvent fumes would trigger smoke detectors or affect mall visitors; cure time is 8–12 hours and service life 2–3 years. Indoor decks in malls like Dubai Mall or Yas Mall typically use water-based for safety.",
    },
    {
      question: "How long before cars can park on freshly marked parking bays?",
      answer:
        "Solvent-based acrylic paint requires 4–8 hours before light vehicle traffic; water-based acrylic requires 8–12 hours. For 24/7 operations like JAFZA warehouses or hospital parking, fast-cure polyurea (60–90 minute cure) or MMA (30-minute cure) is specified. Preformed thermoplastic symbols cool in 5–10 minutes and can take traffic immediately. Always verify the spec with the marking contractor before reopening bays.",
    },
    {
      question: "Do your accessibility parking bays meet UAE and Saudi accessibility standards?",
      answer:
        "Yes. Accessibility bay dimensions (3.6 × 5.0 m minimum), wheelchair-access aisle (1.2 m minimum), blue colour code and ISA (International Symbol of Access) comply with Dubai Universal Design Code 2017, UAE Federal Law 29/2006 (Rights of People of Determination), and Saudi Building Code SBC 801 (Accessibility). Bay counts comply with minimum ratios: 2% of total bays for the first 500, plus 1% thereafter.",
    },
    {
      question: "Can you re-mark a Dubai mall parking deck without closing it?",
      answer:
        "Yes. Gulf Seismic specialises in zero-downtime phased floor-by-floor marking for operational malls. We have completed 5,200-bay Yas Island decks, 4,600-bay Riyadh mall decks and 3,200-bay Dubai mega-mall decks with zero mall closure days. Phasing routes visitors to alternate floors via a coordinated signage and traffic-management plan, with marking crews working overnight shifts in active decks.",
    },
  ],
  "warehouse-marking": [
    {
      question: "How much does warehouse floor marking cost per m² in Riyadh?",
      answer:
        "Warehouse floor marking in Riyadh typically costs SAR 18–45 per m² depending on system. Two-component polyurea (the Saudi 24/7 warehouse standard) sits at SAR 25–40 per m² with 5+ year service life; standard paint systems sit at SAR 18–25 per m² with 2–3 year life; epoxy line marking with anti-slip sits at SAR 35–45 per m². MODON industrial city jobs benefit from volume discounts above 10,000 m².",
    },
    {
      question: "Polyurea vs epoxy warehouse marking — which is better for 24/7 operations?",
      answer:
        "Polyurea is the clear choice for 24/7 warehouses, cross-docks and 3PL hubs. It cures in 60–90 minutes versus 12–24 hours for epoxy, allowing sub-2-hour zone reopening. Polyurea also has superior abrasion resistance under forklift traffic. Epoxy remains the better choice for cleanrooms and chemical-handling zones where novolac epoxy provides hydrocarbon resistance that polyurea cannot match. Many JAFZA and MODON warehouses use both: polyurea for traffic lanes, novolac epoxy for hazard zones.",
    },
    {
      question: "How long does warehouse floor marking take to cure before forklift traffic?",
      answer:
        "Polyurea cures in 60–90 minutes at 25°C ambient (90 minutes at typical Gulf warehouse temperature of 30–35°C), allowing forklift traffic within 2 hours of application. Two-component paint requires 4–6 hours; epoxy requires 12–24 hours for foot traffic and 48 hours for forklift traffic. Full chemical cure for epoxy is 5–7 days. Always verify the cure spec with the marking contractor before reopening zones.",
    },
    {
      question: "Is your warehouse marking compliant with ISO 7010, OSHA and Saudi Aramco GES-001?",
      answer:
        "Yes. Colour coding complies with ISO 7010 (graphical symbols), ISO 3864 (safety colours), OSHA 1910.144 (safety colour code) and Saudi Aramco GES-001 (HSE specification). Standard coding is green pedestrian walkways, amber forklift traffic lanes, red hazard zones (dock edges, machine guards), white storage bays, and yellow walkway chevrons. Hazard chevrons and pedestrian crossings comply with ISO 7010 W-026 and W-027 symbols respectively.",
    },
    {
      question: "Can you mark a 24/7 JAFZA warehouse without stopping operations?",
      answer:
        "Yes. Gulf Seismic has completed multiple 24/7 JAFZA warehouse projects up to 26,000 m² using zone-phased polyurea marking. Each zone is barricaded, shot-blasted, marked, cured (90 minutes) and reopened sequentially with sub-2-hour downtime per zone. Adjacent zones remain fully operational throughout, with forklift and pedestrian traffic rerouted via temporary segregation. We have completed 14-zone JAFZA projects with zero operational downtime.",
    },
  ],
  "airport-marking": [
    {
      question: "How much does airport taxiway marking cost per m² in the Gulf?",
      answer:
        "ICAO Annex 14-compliant MMA Type III taxiway marking typically costs AED 120–280 per m² (or SAR equivalent) in the Gulf, depending on line complexity, glass-bead class and NOTAM-window constraints. Stand-numbering preformed MMA adds approximately AED 8,000–15,000 per stand. Apron edge and holding-position markings sit at the lower end; runway threshold and aiming-point markings sit at the higher end due to precision tolerances.",
    },
    {
      question: "MMA Type III vs thermoplastic for taxiways — which is better?",
      answer:
        "MMA Type III cold plastic is the ICAO-preferred system for taxiways and aprons because of its 30-minute cure (allowing reopening within a 4-hour NOTAM window), jet-blast resistance rated to 260°C, and superior wet-reflectivity (Q3 ≥300 mcd/m²/lx). Thermoplastic remains in use on some legacy airfields but cannot match MMA's jet-blast resistance or cure time. ICAO Annex 14 Vol I Chapter 5 recommends MMA Type III for all new and re-marked taxiway centrelines and holding positions.",
    },
    {
      question: "How long does MMA airport marking take to cure?",
      answer:
        "MMA Type III cold plastic cures in approximately 30 minutes at 20°C ambient, allowing taxiway reopening within a 4-hour NOTAM window. At 30°C Gulf ambient temperature, cure time reduces to 20–25 minutes. MMA is a two-component chemically-curing system (unlike thermoplastic, which cools physically), so cure time is temperature-dependent but not affected by humidity. Always verify cure with a fingernail hardness test before reopening.",
    },
    {
      question: "Do you comply with ICAO Annex 14 and GACA standards for airport marking?",
      answer:
        "Yes. All airport marking complies with ICAO Annex 14 Volume I (Aerodrome Design and Operations) Chapter 5 (Visual Aids for Navigation), GACA GACAR Part 139 (Aerodrome Certification) in Saudi Arabia, and GCAA CAR Part IX in the UAE. Geometry, colours, reflectivity (Q3 wet per ASTM E2177) and material specifications all meet the standard. Airside crews hold valid airside driving permits and ATEL/AVOP qualifications for each airport.",
    },
    {
      question: "Can you mark aprons at King Fahd International Airport, King Khalid International Airport and other Saudi airports?",
      answer:
        "Yes. Gulf Seismic holds airside operating permits for major Saudi airports including King Fahd International Airport (Dammam), King Khalid International Airport (Riyadh), King Abdulaziz International Airport (Jeddah) and Prince Mohammed bin Abdulaziz International Airport (Madinah). We have completed 18-stand re-marking at Dammam and 22-stand re-marking at Riyadh, all in NOTAM-night windows. All airside crews hold valid GACA-issued airside permits and ATEL qualifications.",
    },
  ],
  "industrial-marking": [
    {
      question: "How much does industrial hazard marking cost per m² in the Gulf?",
      answer:
        "Industrial hazard marking in the Gulf typically costs AED 40–110 per m² (or SAR equivalent) depending on system. Standard polyurea traffic-zone marking sits at AED 40–60 per m²; novolac epoxy for hydrocarbon-rated zones sits at AED 80–110 per m²; photoluminescent escape-route tape sits at AED 250–400 per linear metre. ATEX Zone 1 work adds 20–30% due to permit-controlled working and intrinsically safe equipment.",
    },
    {
      question: "Novolac epoxy vs polyurea for industrial floors — which is better?",
      answer:
        "Novolac epoxy is specified where chemical resistance is critical (process zones, bunded areas, chemical storage) — it withstands sustained hydrocarbon, acid and alkali exposure that polyurea cannot match. Polyurea is specified for traffic zones where fast cure (90 minutes) and abrasion resistance under forklift traffic are critical. Most Jubail and Dammam petrochemical plants use both: novolac in process zones, polyurea in traffic corridors. ASME A13.1 pipe banding is installed regardless of floor system.",
    },
    {
      question: "How long before industrial floors can take forklift traffic after marking?",
      answer:
        "Polyurea allows forklift traffic within 90 minutes at 25°C (120 minutes at 30–35°C Gulf ambient). Two-component industrial paint requires 4–6 hours; novolac epoxy requires 24 hours for foot traffic and 48 hours for forklift traffic, with full chemical cure in 5–7 days. Photoluminescent escape-route tape is traffic-ready immediately on adhesive cure (30 minutes). Always verify cure spec with the marking contractor before reopening zones.",
    },
    {
      question: "Do you comply with ASME A13.1 and ISO 20560 pipe identification standards?",
      answer:
        "Yes. Pipe identification complies with ASME A13.1 (Scheme for Identification of Piping Systems) for all North American-spec facilities and ISO 20560-1 (Identification of piping systems) for international-spec facilities. Colour coding follows ASME A13.1: red with white lettering for fire-quenching fluids, yellow with black lettering for flammable fluids, green with white lettering for combustible fluids, blue with white lettering for compressed air and other gases. We have installed up to 24 km of pipe banding on a single refinery project.",
    },
    {
      question: "Can you mark petrochemical plants in Jubail Royal Commission and Yanbu Royal Commission zones?",
      answer:
        "Yes. Gulf Seismic is an RCJY-approved (Royal Commission of Jubail) and RCY-approved (Royal Commission of Yanbu) vendor. We have completed 22,500 m² petrochemical marking in Jubail (22 km pipe banding, 4.2 km escape routes) and 17,200 m² marking at a Yanbu power plant (16 km pipe banding, 3.1 km escape routes). All work is ATEX-permit-controlled with intrinsically safe equipment, and we passed RCJY HSE audit first-time on our most recent Jubail project.",
    },
  ],
  "safety-signage": [
    {
      question: "How much does industrial safety signage cost in Saudi Arabia and UAE?",
      answer:
        "Industrial safety signage in the Gulf typically costs SAR 250–850 per sign (or AED equivalent), depending on material, size and photoluminescent rating. Standard 2 mm aluminium with UV-stable print sits at SAR 250–450; photoluminescent variants to DIN 67510 sit at SAR 600–850; 316 marine-grade stainless for coastal/port installations sits at SAR 800–1,200. Large facility packages of 1,000+ signs typically achieve 25–35% volume discount.",
    },
    {
      question: "Photoluminescent vs LED exit signs — which is better for industrial facilities?",
      answer:
        "Photoluminescent exit signs are preferred for industrial facilities because they require no electrical supply, no maintenance, no ATEX classification, and are ICAO/ISO 7010 compliant. They charge from ambient light (50 lux minimum) and provide 8+ hours of luminance per DIN 67510. LED exit signs are preferred for high-ambient-light areas where photoluminescent cannot charge adequately, and for retail/commercial applications where aesthetic integration matters. Many Sharjah and Dammam plants use both: photoluminescent on escape routes, LED at primary entrances.",
    },
    {
      question: "How long does safety signage installation take for a typical industrial facility?",
      answer:
        "A typical 1,000-sign industrial facility package takes 2–3 weeks of night-shift installation, plus 1–2 weeks of survey, manufacture and ASME A13.1 pipe-banding preparation. Larger packages (2,800+ signs for a refinery) take 8–10 weeks. Sign manufacture is parallel to survey, so total project duration is typically survey + manufacture lead time + installation weeks. Always sequence installation around PTW windows in ATEX zones.",
    },
    {
      question: "Are your safety signs ISO 7010 and ISO 3864 compliant?",
      answer:
        "Yes. All safety signs comply with ISO 7010 (graphical symbols — safety colours and safety signs) and ISO 3864 (geometric shapes and colours). Hazard-warning signs use yellow triangle with black border (W-series); prohibition signs use red circle with diagonal (P-series); mandatory signs use blue circle (M-series); safe-condition signs use green square (E-series). Fire-safety signs comply with ISO 7010 F-series. Substrate and print also comply with SASO/GSO conformity requirements for Saudi Arabia.",
    },
    {
      question: "Can you install safety signage in Makkah and Madinah holy-site zones?",
      answer:
        "Yes. Gulf Seismic serves Makkah and Madinah including central-area holy-site zones with heritage-sensitive mounting methods. We use freestanding steel posts (no wall penetration on heritage structures) for UNESCO and Rakkah heritage authority compliance, and we have completed 280-sign packages along Al Ain's UNESCO heritage route using the same method. All work is sequenced around prayer times and Hajj/Umrah seasons, with bilingual Arabic-English (and trilingual Arabic-English-Urdu for pilgrim zones) messaging.",
    },
  ],
  "epoxy-flooring": [
    {
      question: "How much does epoxy flooring cost per m² in Dubai and the UAE?",
      answer:
        "Epoxy flooring in Dubai typically costs AED 95–240 per m² depending on system. Standard 2 mm self-levelling epoxy for offices and retail sits at AED 95–140 per m²; 3 mm self-levelling with novolac topcoat for healthcare and F&B sits at AED 160–200 per m²; 4 mm epoxy mortar for industrial and chemical-handling zones sits at AED 200–240 per m². Anti-static (ESD) variants for electronics manufacturing add 25–35% to base system cost.",
    },
    {
      question: "Epoxy vs polyurethane flooring — which is better for Gulf facilities?",
      answer:
        "Epoxy is the better all-round choice for chemical resistance, adhesion and cost-effectiveness — it's the standard for healthcare, F&B, industrial and warehouse applications. Polyurethane topcoat is preferred as a UV-stable finish coat over epoxy because it resists yellowing under Gulf UV exposure (critical for atrium and retail applications). The most durable Gulf system is epoxy body coat + polyurethane topcoat — used on DIFC grade-A offices, Makkah hotels and Abu Dhabi medical facilities.",
    },
    {
      question: "How long does epoxy flooring take to cure before use?",
      answer:
        "Light foot traffic is possible 12–18 hours after final coat at 25°C ambient (18–24 hours at typical Gulf 30–35°C). Forklift and vehicle traffic requires 48–72 hours. Full chemical cure — the point at which the floor can withstand daily chemical disinfection — is 5–7 days at 25°C. Always coordinate facility reopening with the installer's cure schedule; premature traffic causes irreversible damage requiring full re-installation.",
    },
    {
      question: "Is your epoxy flooring food-grade, HACCP and healthcare compliant?",
      answer:
        "Yes. We install USDA-, HACCP- and MoHAP-compliant epoxy systems for F&B, healthcare and pharmaceutical facilities. Standard healthcare package is 3 mm self-levelling epoxy with novolac topcoat in sterilisation/soiled-utility zones, antimicrobial silver-ion additive throughout, and 100 mm coved skirting for seamless hygiene transition. Systems meet DoH (Abu Dhabi), MoHAP (UAE federal) and Saudi MoH infection-control standards, and are installed over moisture-tested slabs (calcium-chloride test <3 lb/1000 ft²/24 hr).",
    },
    {
      question: "Can you install epoxy flooring in Sharjah industrial facilities and other UAE emirates?",
      answer:
        "Yes. Gulf Seismic has Sharjah-based crews serving all seven UAE emirates including Sharjah Industrial Areas 1–18, Hamriyah Free Zone, Mussafah (Abu Dhabi), JAFZA (Dubai) and RAK industrial zones. We have completed 5,400 m² epoxy mortar installations in Sharjah manufacturing facilities and 6,800 m² self-levelling epoxy in Abu Dhabi Medical City, all phased around operational shutdowns. Sharjah-based mobilisation enables rapid response across the Northern Emirates.",
    },
  ],
};
