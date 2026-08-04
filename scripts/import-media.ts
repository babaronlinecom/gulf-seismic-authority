/**
 * Import ALL generated images from /public/images/ into the Media Library database.
 * Reads file metadata (size, dimensions via sharp), assigns titles, alt text,
 * OG metadata, SEO fields, and social captions based on folder + filename.
 *
 * Run: DATABASE_URL="..." bun run scripts/import-media.ts
 */
import { db } from "../src/lib/db";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

// Metadata templates per image (folder/filename → full metadata)
const METADATA: Record<string, {
  title: string;
  alt: string;
  seoTitle: string;
  seoAlt: string;
  seoCaption: string;
  ogTitle: string;
  ogDescription: string;
  socialCaption: string;
  socialHashtags: string;
  gradientOverlay: string;
  resizeNote: string;
}> = {
  // Hero
  "hero/home-hero.jpg": {
    title: "Highway Road Marking at Golden Hour — UAE",
    alt: "Gulf Seismic road marking professionals applying thermoplastic lines on a UAE highway at golden hour",
    seoTitle: "Road Marking UAE Highway — Gulf Seismic Thermoplastic Application",
    seoAlt: "Thermoplastic road marking application on UAE highway at dusk by Gulf Seismic",
    seoCaption: "Gulf Seismic applying thermoplastic road markings on a UAE highway — municipal-spec quality for RTA compliance.",
    ogTitle: "Gulf Seismic — Road & Industrial Marking Authority",
    ogDescription: "Professional thermoplastic road marking across UAE and Saudi Arabia. 850+ projects, 16 cities, ISO 9001 certified.",
    socialCaption: "Precision thermoplastic road marking on a UAE highway at golden hour. Gulf Seismic — marking the Gulf's future. 🛣️🇦🇪",
    socialHashtags: "#RoadMarking #ThermoplasticMarking #UAEConstruction #GulfSeismic #HighwaySafety",
    gradientOverlay: "dark",
    resizeNote: "Hero: 1344x768. Thumbnail: 400x225. Mobile: 768x432.",
  },
  // Services
  "services/road-marking.jpg": {
    title: "Road Marking Service — Thermoplastic Line Application",
    alt: "Close-up of hot thermoplastic road line marking being applied on a highway with bright yellow line and glass beads",
    seoTitle: "Road Marking Service — Hot Thermoplastic Line Application | Gulf Seismic",
    seoAlt: "Professional road marking contractor applying hot thermoplastic line marking with glass beads on highway",
    seoCaption: "Gulf Seismic road marking: hot-applied thermoplastic with glass bead reflectivity for night visibility.",
    ogTitle: "Road Marking Contractors — Thermoplastic Line Marking",
    ogDescription: "Professional road marking with hot-applied thermoplastic. RTA & MOMRA compliant. 5-7 year durability.",
    socialCaption: "Crisp, reflective thermoplastic road lines applied to municipal spec. 🛣️ #RoadMarking",
    socialHashtags: "#RoadMarking #Thermoplastic #LineMarking #UAE #SaudiArabia",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/thermoplastic-road-marking.jpg": {
    title: "Thermoplastic Road Marking — Hot-Applied Application",
    alt: "Thermoplastic road marking machine heating and applying yellow line markings on asphalt with smoke rising",
    seoTitle: "Thermoplastic Road Marking Application — Hot-Applied | Gulf Seismic",
    seoAlt: "Thermoplastic road marking application machine applying yellow lines on asphalt road",
    seoCaption: "Hot thermoplastic (180-200°C) fused to asphalt for 5-7 year durability.",
    ogTitle: "Thermoplastic Road Marking — Durable, Reflective, Compliant",
    ogDescription: "Hot-applied thermoplastic line marking fused to the road surface for 5-7 year durability with glass bead reflectivity.",
    socialCaption: "180°C thermoplastic, fused to asphalt, built to survive Gulf heat. 🔥🛣️",
    socialHashtags: "#ThermoplasticMarking #RoadSafety #ConstructionUAE",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/parking-lot-marking.jpg": {
    title: "Parking Lot Marking — Organized Bay Layout",
    alt: "Aerial view of a well-marked parking lot with crisp white and yellow lines, organized parking bays, and directional arrows",
    seoTitle: "Parking Lot Marking — Bay Layout & Line Striping | Gulf Seismic",
    seoAlt: "Aerial view of parking lot with white and yellow bay markings, disabled access symbols, and arrows",
    seoCaption: "Parking lot marking optimized for capacity — up to 15% more bays with proper layout.",
    ogTitle: "Parking Lot Marking — Maximize Capacity & Safety",
    ogDescription: "Precision parking bay marking, accessibility stencils, and directional arrows for malls and offices.",
    socialCaption: "Every bay counts. We optimized this lot for 15% more capacity. 🅿️📐",
    socialHashtags: "#ParkingMarking #ParkingLot #LineStriping #FacilityManagement",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/warehouse-marking.jpg": {
    title: "Warehouse Floor Marking — 5S Color-Coded Zones",
    alt: "Modern warehouse interior with green pedestrian walkways, yellow forklift lanes, red hazard zones, and white storage bay lines",
    seoTitle: "Warehouse Floor Marking — 5S Safety Zones | Gulf Seismic",
    seoAlt: "Warehouse floor with color-coded safety markings — green pedestrian lanes, yellow forklift aisles, red hazard zones",
    seoCaption: "5S warehouse floor marking: green pedestrian, yellow forklift, red hazard, white storage.",
    ogTitle: "Warehouse Marking — Forklift-Grade Safety & 5S",
    ogDescription: "Industrial floor marking for warehouses — polyurea and epoxy systems for pedestrian-MHE segregation.",
    socialCaption: "Green = walk. Yellow = forklift. Red = hazard. Simple, safe, 5S-compliant. 🏭",
    socialHashtags: "#WarehouseMarking #5S #IndustrialSafety #FloorMarking",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/airport-marking.jpg": {
    title: "Airport Runway Marking — ICAO Annex 14 Compliant",
    alt: "Airport runway with precision yellow and white taxiway markings viewed from above, ICAO Annex 14 compliant",
    seoTitle: "Airport Runway Marking — ICAO Annex 14 | Gulf Seismic",
    seoAlt: "Airport runway yellow and white taxiway markings from above, ICAO compliant",
    seoCaption: "ICAO Annex 14 compliant runway markings — Type III MMA, jet-blast resistant.",
    ogTitle: "Airport Marking — ICAO Annex 14 Airside Precision",
    ogDescription: "Runway, taxiway and apron marking compliant with ICAO Annex 14. MMA Type III systems.",
    socialCaption: "Precision runway markings to ICAO Annex 14. Zero compromise on airside safety. ✈️🛬",
    socialHashtags: "#AirportMarking #ICAO #RunwayMarking #AviationSafety",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/industrial-marking.jpg": {
    title: "Industrial Marking — Chemical-Resistant Safety Zones",
    alt: "Industrial factory floor with chemical-resistant yellow and red safety zone markings and pipe identification bands",
    seoTitle: "Industrial Floor Marking — Chemical & Heat Resistant | Gulf Seismic",
    seoAlt: "Industrial factory floor with yellow and red safety zone markings and pipe identification",
    seoCaption: "Chemical-resistant industrial marking — novolac epoxy for petrochemical plants.",
    ogTitle: "Industrial Marking — Chemical, Heat & Impact Resistant",
    ogDescription: "Heavy-duty floor marking for factories and plants. Polyurea and novolac epoxy systems.",
    socialCaption: "Chemical-resistant, heat-tolerant, impact-proof. Built for heavy industry. 🏭⚠️",
    socialHashtags: "#IndustrialMarking #SafetyZones #Petrochemical #PlantSafety",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/safety-signage.jpg": {
    title: "Safety Signage — ISO 7010 Reflective Signs",
    alt: "Professional safety signage installation on industrial site with reflective yellow warning signs and mandatory action signs",
    seoTitle: "Safety Signage — ISO 7010 Reflective Signs | Gulf Seismic",
    seoAlt: "Reflective safety signs mounted on galvanized posts at industrial site, ISO 7010 compliant",
    seoCaption: "ISO 7010 safety signage — reflective, UV-stable, weather-resistant.",
    ogTitle: "Safety Signage — ISO 7010 Compliant Visual Safety",
    ogDescription: "Reflective traffic signs, hazard signage and wayfinding systems. ISO 7010 compliant.",
    socialCaption: "Every sign saves a life. ISO 7010 compliant, reflective, built for Gulf UV. 🚧",
    socialHashtags: "#SafetySignage #ISO7010 #SafetyFirst #IndustrialSigns",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  "services/epoxy-flooring.jpg": {
    title: "Epoxy Flooring — Seamless Industrial Floor System",
    alt: "Seamless glossy grey epoxy floor in a modern warehouse with reflective surface",
    seoTitle: "Epoxy Flooring — Seamless Industrial System | Gulf Seismic",
    seoAlt: "Seamless glossy grey epoxy floor in modern warehouse, professional installation",
    seoCaption: "Self-levelling epoxy floor — seamless, chemical-resistant, 10-15 year life.",
    ogTitle: "Epoxy Flooring — Seamless, Durable, Decorative",
    ogDescription: "Self-levelling epoxy and polyurethane floor systems for warehouses and factories.",
    socialCaption: "Seamless, glossy, built to last 15 years. This is epoxy done right. ✨🏭",
    socialHashtags: "#EpoxyFlooring #IndustrialFlooring #SeamlessFloor #Warehouse",
    gradientOverlay: "none",
    resizeNote: "Card: 1024x1024. Thumbnail: 300x300.",
  },
  // Projects
  "projects/highway-thermoplastic.jpg": {
    title: "Abu Dhabi Highway Thermoplastic Project — Night Shift",
    alt: "Night-time highway thermoplastic road marking application in UAE with machine applying bright reflective yellow lines under work lights",
    seoTitle: "Abu Dhabi Highway Thermoplastic Marking — Night Shift Project",
    seoAlt: "Night shift thermoplastic road marking on Abu Dhabi highway with reflective yellow lines",
    seoCaption: "42 km highway marked in 28 night shifts — zero daytime disruption.",
    ogTitle: "Highway Thermoplastic Marking — 42km Night Shift Project",
    ogDescription: "Gulf Seismic marked 42km of highway with R3 reflectivity — zero daytime lane closures.",
    socialCaption: "42km of highway, 28 night shifts, zero daytime disruption. 🌙🛣️ #ProjectSuccess",
    socialHashtags: "#HighwayMarking #NightShift #Thermoplastic #UAE",
    gradientOverlay: "dark",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  "projects/mall-parking.jpg": {
    title: "Dubai Mall Parking Deck Marking Project",
    alt: "Multi-level parking deck of Dubai shopping mall with freshly painted white and yellow parking bay lines and color-coded zones",
    seoTitle: "Dubai Mall Parking Deck Marking — 320 Bay Project",
    seoAlt: "Dubai mall parking deck with white and yellow bay markings, color-coded zones",
    seoCaption: "+240 bays added (7.5% capacity gain) with zero mall downtime.",
    ogTitle: "Mall Parking Marking — +240 Bays, Zero Downtime",
    ogDescription: "Gulf Seismic added 240 parking bays to a Dubai mall deck without closing the mall.",
    socialCaption: "240 more parking bays, zero mall closures. That's precision planning. 🅿️🏗️",
    socialHashtags: "#ParkingMarking #DubaiMall #CapacityOptimisation",
    gradientOverlay: "light",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  "projects/warehouse-epoxy.jpg": {
    title: "Riyadh Warehouse Polyurea Marking Project",
    alt: "Large logistics warehouse in Saudi Arabia with polyurea floor markings — green pedestrian lanes and yellow forklift aisles",
    seoTitle: "Riyadh Warehouse Polyurea Marking — 22,000 m² Project",
    seoAlt: "Riyadh warehouse with polyurea floor markings, green pedestrian lanes, yellow forklift aisles",
    seoCaption: "22,000 m² warehouse marked with <2hr downtime per zone.",
    ogTitle: "Warehouse Marking — 22,000m² Zero-Downtime Project",
    ogDescription: "Gulf Seismic marked a 22,000m² logistics hub with polyurea — less than 2 hours downtime per zone.",
    socialCaption: "22,000 m² of warehouse floor, marked with under 2 hours downtime per zone. 🏭⏱️",
    socialHashtags: "#WarehouseMarking #Polyurea #Riyadh #Logistics",
    gradientOverlay: "light",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  "projects/petrochemical-marking.jpg": {
    title: "Jubail Petrochemical Plant Hazard Marking",
    alt: "Petrochemical plant in Jubail with industrial hazard zone floor markings and pipe identification bands",
    seoTitle: "Jubail Petrochemical Plant — Hazard Zone Marking Project",
    seoAlt: "Petrochemical plant floor with hazard zone markings and pipe identification bands",
    seoCaption: "18,000 m² petrochemical plant marked — ATEX compliant, 14km pipework identified.",
    ogTitle: "Petrochemical Plant Marking — ATEX Compliant",
    ogDescription: "Gulf Seismic marked 18,000m² of petrochemical plant with novolac epoxy — ATEX zones compliant.",
    socialCaption: "ATEX-compliant marking in a live petrochemical plant. Safety first, always. 🏭⚠️",
    socialHashtags: "#Petrochemical #IndustrialMarking #Jubail #Safety",
    gradientOverlay: "dark",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  "projects/airport-taxiway.jpg": {
    title: "Dammam Airport Taxiway Marking Project",
    alt: "Airport taxiway at night with MMA cold plastic yellow centreline markings being applied by ground crew",
    seoTitle: "Dammam Airport Taxiway — MMA Marking Project",
    seoAlt: "Night shift MMA taxiway marking at Dammam airport with yellow centreline",
    seoCaption: "6.4km taxiway marked in 18 NOTAM windows — 30-min cure per shift.",
    ogTitle: "Airport Taxiway Marking — ICAO Annex 14 Project",
    ogDescription: "Gulf Seismic marked 6.4km of taxiway at Dammam Airport in 18 night-shift NOTAM windows.",
    socialCaption: "6.4km of taxiway, 18 night shifts, ICAO Annex 14 compliant. ✈️🌙",
    socialHashtags: "#AirportMarking #Taxiway #ICAO #Dammam",
    gradientOverlay: "dark",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  "projects/factory-epoxy-floor.jpg": {
    title: "Sharjah Factory Epoxy Floor Installation",
    alt: "Seamless self-levelling epoxy floor installation in a manufacturing facility in Sharjah with glossy grey surface",
    seoTitle: "Sharjah Factory Epoxy Floor — 4,500 m² Installation",
    seoAlt: "Self-levelling epoxy floor in Sharjah manufacturing facility, glossy grey surface",
    seoCaption: "4,500 m² epoxy floor installed in 2 weekend shutdowns — 12-15 year life.",
    ogTitle: "Factory Epoxy Floor — 4,500m² Seamless Installation",
    ogDescription: "Gulf Seismic installed 4,500m² of self-levelling epoxy in a Sharjah factory — 12-15 year service life.",
    socialCaption: "4,500 m² of seamless epoxy, installed in 2 weekends. Built for 15 years. ✨🏭",
    socialHashtags: "#EpoxyFlooring #Sharjah #IndustrialFloor #Manufacturing",
    gradientOverlay: "light",
    resizeNote: "Project card: 1344x768. Thumbnail: 400x225.",
  },
  // Blog
  "blog/thermoplastic-vs-cold-paint.jpg": {
    title: "Thermoplastic vs Cold Paint — Comparison Guide",
    alt: "Split comparison showing durable thermoplastic road marking left vs faded cold paint right on highway",
    seoTitle: "Thermoplastic vs Cold Paint Road Marking — Comparison",
    seoAlt: "Comparison of thermoplastic road marking vs old faded cold paint on highway surface",
    seoCaption: "Thermoplastic lasts 5-10x longer than cold paint. See the difference.",
    ogTitle: "Thermoplastic vs Cold Paint — Which Lasts Longer?",
    ogDescription: "A technical comparison of thermoplastic and cold paint systems under Gulf climate conditions.",
    socialCaption: "Thermoplastic vs cold paint: 5-7 years vs 6-12 months. The difference is clear. 📊🛣️",
    socialHashtags: "#Thermoplastic #RoadMarking #Comparison #TechnicalGuide",
    gradientOverlay: "none",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  "blog/parking-optimisation.jpg": {
    title: "Parking Lot Capacity Optimisation Guide",
    alt: "Aerial view of optimized parking lot layout showing how proper bay marking increases capacity",
    seoTitle: "Parking Lot Capacity Optimisation — Layout Guide",
    seoAlt: "Aerial view of parking lot with optimized bay layout for maximum capacity",
    seoCaption: "Proper bay layout can add 15% more parking capacity.",
    ogTitle: "How to Add 15% More Parking Bays",
    ogDescription: "The geometry and layout strategies that maximise parking capacity without expanding the deck.",
    socialCaption: "Want 15% more parking bays? It's all in the layout. 🅿️📐",
    socialHashtags: "#ParkingOptimisation #ParkingLot #Capacity #Layout",
    gradientOverlay: "none",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  "blog/warehouse-5s-guide.jpg": {
    title: "Warehouse 5S Floor Marking Guide",
    alt: "Modern warehouse interior with 5S floor marking system showing color-coded zones and labeled storage areas",
    seoTitle: "Complete 5S Warehouse Floor Marking Guide",
    seoAlt: "Warehouse with 5S floor marking — color-coded zones, labeled storage, pedestrian walkways",
    seoCaption: "The complete 5S warehouse floor marking guide — colors, lanes, zones.",
    ogTitle: "The Complete 5S Warehouse Floor Marking Guide",
    ogDescription: "Colour codes, lane widths and zone strategies for an HSE-compliant and 5S-optimised warehouse.",
    socialCaption: "5S floor marking: the visual workplace that drives safety and efficiency. 🏭✅",
    socialHashtags: "#5S #WarehouseMarking #LeanManufacturing #Safety",
    gradientOverlay: "none",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  "blog/icao-annex-14.jpg": {
    title: "ICAO Annex 14 Airport Marking Explained",
    alt: "Airport runway threshold markings from above with precision yellow and white bars",
    seoTitle: "ICAO Annex 14 Airport Marking — Field Guide",
    seoAlt: "Airport runway threshold markings from above, yellow and white precision bars",
    seoCaption: "ICAO Annex 14 runway, taxiway and apron marking requirements explained.",
    ogTitle: "ICAO Annex 14 Airport Marking — A Contractor's Guide",
    ogDescription: "Runway, taxiway and apron marking requirements explained — dimensions, colours, reflectivity.",
    socialCaption: "ICAO Annex 14 decoded: everything you need to know about airport markings. ✈️📋",
    socialHashtags: "#ICAO #AirportMarking #Aviation #Annex14",
    gradientOverlay: "none",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  "blog/epoxy-vs-polyurea.jpg": {
    title: "Epoxy vs Polyurea — Industrial Floor Comparison",
    alt: "Close-up comparison of epoxy floor coating vs polyurea line marking on warehouse floor",
    seoTitle: "Epoxy vs Polyurea — Which Industrial Floor System?",
    seoAlt: "Comparison of epoxy floor coating and polyurea line marking on warehouse floor",
    seoCaption: "Epoxy vs polyurea: chemical resistance, cure time, service life compared.",
    ogTitle: "Epoxy vs Polyurea — Choosing the Right Floor System",
    ogDescription: "Chemical resistance, cure time and service life compared for industrial floor systems.",
    socialCaption: "Epoxy or polyurea? Here's how to choose the right industrial floor system. 🏭📊",
    socialHashtags: "#Epoxy #Polyurea #IndustrialFlooring #Comparison",
    gradientOverlay: "none",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  "blog/saudi-vision-2030.jpg": {
    title: "Saudi Vision 2030 — Road Marking Opportunities",
    alt: "Saudi Arabia desert landscape with modern highway infrastructure construction and road marking work",
    seoTitle: "Saudi Vision 2030 — Road Marking Opportunities",
    seoAlt: "Saudi Arabia highway construction with road marking work in progress, Vision 2030 development",
    seoCaption: "How Vision 2030 megaprojects are driving demand for marking contractors in Saudi Arabia.",
    ogTitle: "Saudi Vision 2030 — Road Marking Opportunities",
    ogDescription: "How megaprojects, NEOM and urban expansion are driving demand for marking contractors.",
    socialCaption: "Vision 2030 is creating massive opportunities for road marking in Saudi Arabia. 🇸🇦🏗️",
    socialHashtags: "#Vision2030 #SaudiArabia #RoadMarking #Infrastructure",
    gradientOverlay: "dark",
    resizeNote: "Blog header: 1344x768. Thumbnail: 400x225.",
  },
  // OG
  "og/default-og.jpg": {
    title: "Default Social Share Image — Gulf Seismic",
    alt: "Aerial view of highway with bright yellow road lines and UAE desert landscape for Gulf Seismic social sharing",
    seoTitle: "Gulf Seismic — Social Share Image",
    seoAlt: "Gulf Seismic road marking company social share image with highway and desert landscape",
    seoCaption: "Default OG image for social media sharing across Facebook, Twitter, LinkedIn.",
    ogTitle: "Gulf Seismic | Road & Industrial Marking Authority",
    ogDescription: "The Gulf's authority in road and industrial marking. 850+ projects, 16 cities, ISO 9001 certified.",
    socialCaption: "Gulf Seismic — marking the Gulf's future. 🛣️🇦🇪🇸🇦",
    socialHashtags: "#GulfSeismic #RoadMarking #UAE #SaudiArabia",
    gradientOverlay: "dark",
    resizeNote: "OG: 1344x768 (social share). Twitter card: same.",
  },
};

async function getDimensions(filePath: string): Promise<{ width: number; height: number }> {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch {
    return { width: 0, height: 0 };
  }
}

async function main() {
  console.log("→ Importing images into Media Library...\n");

  let count = 0;
  let skipped = 0;

  // Walk all subdirectories
  const categories = ["hero", "services", "projects", "blog", "og"];
  for (const category of categories) {
    const dir = path.join(IMAGES_DIR, category);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    for (const file of files) {
      const relativePath = `${category}/${file}`;
      const fullPath = path.join(dir, file);
      const url = `/images/${relativePath}`;
      const stats = fs.statSync(fullPath);
      const { width, height } = await getDimensions(fullPath);
      const meta = METADATA[relativePath] || {
        title: file.replace(/\.[^.]+$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        alt: file.replace(/\.[^.]+$/, "").replace(/-/g, " "),
        seoTitle: file.replace(/\.[^.]+$/, "").replace(/-/g, " "),
        seoAlt: file.replace(/\.[^.]+$/, "").replace(/-/g, " "),
        seoCaption: "",
        ogTitle: "",
        ogDescription: "",
        socialCaption: "",
        socialHashtags: "",
        gradientOverlay: "none",
        resizeNote: "",
      };

      // Check if already imported (by URL)
      const existing = await db.mediaItem.findFirst({ where: { url } });
      if (existing) {
        // Update with full metadata
        await db.mediaItem.update({
          where: { id: existing.id },
          data: {
            title: meta.title,
            alt: meta.alt,
            seoTitle: meta.seoTitle,
            seoAlt: meta.seoAlt,
            seoCaption: meta.seoCaption,
            ogTitle: meta.ogTitle,
            ogDescription: meta.ogDescription,
            socialCaption: meta.socialCaption,
            socialHashtags: meta.socialHashtags,
            gradientOverlay: meta.gradientOverlay,
            resizeNote: meta.resizeNote,
            width, height,
            size: stats.size,
            mimeType: file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg",
            folder: category,
          },
        });
        skipped++;
        continue;
      }

      await db.mediaItem.create({
        data: {
          filename: file,
          title: meta.title,
          url,
          alt: meta.alt,
          mimeType: file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg",
          size: stats.size,
          width, height,
          folder: category,
          seoTitle: meta.seoTitle,
          seoAlt: meta.seoAlt,
          seoCaption: meta.seoCaption,
          ogTitle: meta.ogTitle,
          ogDescription: meta.ogDescription,
          socialCaption: meta.socialCaption,
          socialHashtags: meta.socialHashtags,
          gradientOverlay: meta.gradientOverlay,
          resizeNote: meta.resizeNote,
          lazyLoad: true,
        },
      });
      count++;
      console.log(`  ✓ ${relativePath} (${width}x${height}, ${(stats.size / 1024).toFixed(0)} KB)`);
    }
  }

  const total = await db.mediaItem.count();
  console.log(`\n${"=".repeat(50)}`);
  console.log(`  Media Library import complete!`);
  console.log(`  New: ${count} | Updated: ${skipped} | Total in DB: ${total}`);
  console.log(`${"=".repeat(50)}`);
}

main().catch(console.error).finally(() => db.$disconnect());
