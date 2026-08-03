/**
 * Generate ALL website images for Gulf Seismic.
 * Saves to /public/images/{hero,services,projects,blog,og}/
 *
 * Run: bun run scripts/generate-images.ts
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUTPUT_BASE = path.join(process.cwd(), "public", "images");

const IMAGE_JOBS: { category: string; filename: string; prompt: string; size: string }[] = [
  // === HERO (homepage) ===
  {
    category: "hero",
    filename: "home-hero.jpg",
    prompt: "Professional aerial view of highway road marking work in progress at dusk in the UAE desert, thermoplastic line marking machine applying bright yellow road lines on dark asphalt, dramatic golden hour lighting, modern infrastructure, high quality professional photography",
    size: "1344x768",
  },

  // === SERVICES (8 images, square for cards) ===
  {
    category: "services",
    filename: "road-marking.jpg",
    prompt: "Close-up of hot thermoplastic road line marking being applied on a highway, bright yellow line with glass beads reflecting light, professional road marking equipment, daytime, high quality photography",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "thermoplastic-road-marking.jpg",
    prompt: "Thermoplastic road marking application machine heating and applying yellow line markings on asphalt road, smoke rising from hot material, professional industrial photography, high quality",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "parking-lot-marking.jpg",
    prompt: "Aerial view of a well-marked parking lot with crisp white and yellow lines, organized parking bays, disabled access symbols, directional arrows, modern shopping mall parking, professional photography",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "warehouse-marking.jpg",
    prompt: "Interior of a modern warehouse with brightly colored floor markings — green pedestrian walkways, yellow forklift lanes, red hazard zones, white storage bay lines, industrial facility, professional photography",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "airport-marking.jpg",
    prompt: "Airport runway with precision yellow and white taxiway markings, viewed from above, ICAO Annex 14 compliant lines and holding position markers, professional aviation photography, high quality",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "industrial-marking.jpg",
    prompt: "Industrial factory floor with chemical-resistant yellow and red safety zone markings, pipe identification bands, hazard warning lines, professional industrial facility photography, high quality",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "safety-signage.jpg",
    prompt: "Professional safety signage installation on an industrial site — reflective yellow warning signs, mandatory action signs, prohibition signs mounted on galvanized posts, ISO 7010 compliant, professional photography",
    size: "1024x1024",
  },
  {
    category: "services",
    filename: "epoxy-flooring.jpg",
    prompt: "Seamless glossy grey epoxy floor in a modern warehouse, reflective surface, clean and professional, industrial flooring installation, professional photography, high quality",
    size: "1024x1024",
  },

  // === PROJECTS (6 featured project images) ===
  {
    category: "projects",
    filename: "highway-thermoplastic.jpg",
    prompt: "Night-time highway thermoplastic road marking application in the UAE, machine applying bright reflective yellow lines under work lights, multiple lanes, professional construction photography, high quality",
    size: "1344x768",
  },
  {
    category: "projects",
    filename: "mall-parking.jpg",
    prompt: "Multi-level parking deck of a Dubai shopping mall with freshly painted white and yellow parking bay lines, color-coded zones, professional aerial photography, high quality",
    size: "1344x768",
  },
  {
    category: "projects",
    filename: "warehouse-epoxy.jpg",
    prompt: "Large logistics warehouse in Saudi Arabia with polyurea floor markings — green pedestrian lanes, yellow forklift aisles, organized storage zones, professional industrial photography, high quality",
    size: "1344x768",
  },
  {
    category: "projects",
    filename: "petrochemical-marking.jpg",
    prompt: "Petrochemical plant in Jubail with industrial hazard zone floor markings, pipe identification bands, safety walkways, ATEX compliant environment, professional industrial photography, high quality",
    size: "1344x768",
  },
  {
    category: "projects",
    filename: "airport-taxiway.jpg",
    prompt: "Airport taxiway at night with MMA cold plastic yellow centreline markings being applied, ground crew with safety vests, runway lights, professional aviation photography, high quality",
    size: "1344x768",
  },
  {
    category: "projects",
    filename: "factory-epoxy-floor.jpg",
    prompt: "Seamless self-levelling epoxy floor installation in a manufacturing facility in Sharjah, glossy grey surface with coved skirting, professional installation, high quality photography",
    size: "1344x768",
  },

  // === BLOG (6 featured post images) ===
  {
    category: "blog",
    filename: "thermoplastic-vs-cold-paint.jpg",
    prompt: "Split comparison image showing thermoplastic road marking (left, durable bright yellow) vs old faded cold paint (right), highway road surface, professional technical photography, high quality",
    size: "1344x768",
  },
  {
    category: "blog",
    filename: "parking-optimisation.jpg",
    prompt: "Aerial view of an optimized parking lot layout showing how proper bay marking increases capacity, white lines on dark asphalt, professional architectural photography, high quality",
    size: "1344x768",
  },
  {
    category: "blog",
    filename: "warehouse-5s-guide.jpg",
    prompt: "Modern warehouse interior with 5S floor marking system — color-coded zones, labeled storage areas, pedestrian walkways, clean and organized industrial space, professional photography",
    size: "1344x768",
  },
  {
    category: "blog",
    filename: "icao-annex-14.jpg",
    prompt: "Airport runway threshold markings from above, precision yellow and white bars, ICAO compliant aviation markings, professional aerial photography, high quality",
    size: "1344x768",
  },
  {
    category: "blog",
    filename: "epoxy-vs-polyurea.jpg",
    prompt: "Close-up comparison of epoxy floor coating (glossy smooth) versus polyurea line marking (textured durable) on a warehouse floor, professional industrial photography, high quality",
    size: "1344x768",
  },
  {
    category: "blog",
    filename: "saudi-vision-2030.jpg",
    prompt: "Saudi Arabia desert landscape with modern highway infrastructure construction, road marking work in progress, Vision 2030 development, dramatic sky, professional photography, high quality",
    size: "1344x768",
  },

  // === OG / Social Share ===
  {
    category: "og",
    filename: "default-og.jpg",
    prompt: "Professional branded image for Gulf Seismic road marking company, aerial view of highway with bright yellow road lines, UAE desert landscape, modern infrastructure, professional corporate photography, high quality",
    size: "1344x768",
  },
];

async function main() {
  // Ensure directories exist
  for (const cat of ["hero", "services", "projects", "blog", "og"]) {
    const dir = path.join(OUTPUT_BASE, cat);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`→ Generating ${IMAGE_JOBS.length} images...\n`);

  const zai = await ZAI.create();
  let success = 0;
  let failed = 0;

  for (let i = 0; i < IMAGE_JOBS.length; i++) {
    const job = IMAGE_JOBS[i];
    const outputPath = path.join(OUTPUT_BASE, job.category, job.filename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  [${i + 1}/${IMAGE_JOBS.length}] SKIP (exists): ${job.category}/${job.filename}`);
      success++;
      continue;
    }

    try {
      console.log(`  [${i + 1}/${IMAGE_JOBS.length}] Generating: ${job.category}/${job.filename} (${job.size})`);
      const response = await zai.images.generations.create({
        prompt: job.prompt,
        size: job.size as any,
      });

      const base64 = response.data[0].base64;
      const buffer = Buffer.from(base64, "base64");
      fs.writeFileSync(outputPath, buffer);

      console.log(`    ✓ Saved (${(buffer.length / 1024).toFixed(0)} KB)`);
      success++;
    } catch (err) {
      console.error(`    ✗ Failed: ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`  Image generation complete!`);
  console.log(`  Success: ${success}/${IMAGE_JOBS.length}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`${"=".repeat(50)}`);
}

main().catch(console.error);
