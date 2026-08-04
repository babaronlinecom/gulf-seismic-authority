/**
 * Seed default CMS content: site settings, header/footer menus, homepage hero.
 * Run: DATABASE_URL="..." bun run scripts/seed-cms.ts
 */
import { db } from "../src/lib/db";

async function main() {
  console.log("→ Seeding CMS content...");

  // --- Site Settings ---
  const settings: Record<string, unknown> = {
    siteName: "Gulf Seismic",
    tagline: "The Gulf's Authority in Road & Industrial Marking",
    logoText: "GS",
    phone: "+971 4 000 0000",
    whatsapp: "97150000000",
    email: "info@gulfseismic.com",
    address: "Dubai, United Arab Emirates",
    linkedin: "https://www.linkedin.com/company/gulf-seismic",
    instagram: "https://www.instagram.com/gulfseismic",
    workingHours: "Sat–Thu, 08:00–18:00",
    footerAbout: "Gulf Seismic is the UAE and Saudi Arabia authority for thermoplastic road marking, parking lot marking, warehouse marking, airport marking, industrial marking, safety signage and epoxy flooring.",
    certifications: ["ISO 9001", "ICAO Annex 14", "OSHA / HSE", "RTA & MOMRA Compliant"],
  };

  for (const [key, value] of Object.entries(settings)) {
    await db.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log(`  ✓ ${Object.keys(settings).length} site settings`);

  // --- Header Menu ---
  const headerMenu = [
    { label: "Services", url: "#services", location: "header", order: 1 },
    { label: "🇦🇪 UAE", url: "/uae", location: "header", order: 2 },
    { label: "🇸🇦 Saudi Arabia", url: "/saudi-arabia", location: "header", order: 3 },
    { label: "Projects", url: "/projects", location: "header", order: 4 },
    { label: "Industries", url: "/industries", location: "header", order: 5 },
    { label: "Blog", url: "/blog", location: "header", order: 6 },
    { label: "About", url: "/about", location: "header", order: 7 },
  ];
  for (const item of headerMenu) {
    const exists = await db.menuItem.findFirst({ where: { label: item.label, location: "header" } });
    if (!exists) await db.menuItem.create({ data: item });
  }
  console.log(`  ✓ ${headerMenu.length} header menu items`);

  // --- Footer Menu ---
  const footerMenu = [
    { label: "About Us", url: "/about", location: "footer", order: 1 },
    { label: "Projects", url: "/projects", location: "footer", order: 2 },
    { label: "Industries", url: "/industries", location: "footer", order: 3 },
    { label: "Case Studies", url: "/case-studies", location: "footer", order: 4 },
    { label: "Blog", url: "/blog", location: "footer", order: 5 },
    { label: "Contact", url: "/contact", location: "footer", order: 6 },
    { label: "Privacy Policy", url: "/privacy", location: "footer", order: 7 },
    { label: "Terms", url: "/terms", location: "footer", order: 8 },
  ];
  for (const item of footerMenu) {
    const exists = await db.menuItem.findFirst({ where: { label: item.label, location: "footer" } });
    if (!exists) await db.menuItem.create({ data: item });
  }
  console.log(`  ✓ ${footerMenu.length} footer menu items`);

  // --- Homepage Hero ---
  const homeHero = await db.heroSection.findFirst({ where: { page: "home" } });
  if (!homeHero) {
    await db.heroSection.create({
      data: {
        page: "home",
        eyebrow: "Serving 16 cities across UAE & Saudi Arabia",
        heading: "The Gulf's Authority in Road & Industrial Marking",
        subheading: "From thermoplastic highway lines to airport runways, warehouse floors and epoxy systems — Gulf Seismic delivers municipal-spec marking quality engineered for the extreme Gulf climate.",
        ctaLabel: "Get a Free Quote",
        ctaUrl: "/contact",
        cta2Label: "Explore Services",
        cta2Url: "/services/road-marking",
        stats: JSON.stringify([
          { label: "Cities served", value: "16" },
          { label: "km of lines applied", value: "2,400+" },
          { label: "Projects delivered", value: "850+" },
          { label: "Years in the Gulf", value: "10" },
        ]),
        order: 0,
      },
    });
    console.log("  ✓ Homepage hero");
  }

  console.log("\n✅ CMS content seeded successfully.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
