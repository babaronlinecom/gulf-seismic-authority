import { db } from "../src/lib/db";

async function main() {
  const competitors = [
    { name: "Al Naboodah Road Marking", url: "https://example.com", country: "UAE", services: ["Road Marking", "Thermoplastic"], strengths: "Established UAE presence, strong RTA relationships", weaknesses: "Limited Saudi operations, no airport marking", ranking: 3 },
    { name: "Saudi Road Marking Co", url: "https://example.com", country: "Saudi Arabia", services: ["Road Marking", "Safety Signage"], strengths: "MOMRA contracts, Vision 2030 projects", weaknesses: "No epoxy flooring, limited digital presence", ranking: 4 },
    { name: "Gulf Marking Services", url: "https://example.com", country: "UAE", services: ["Parking Marking", "Warehouse Marking"], strengths: "Competitive pricing, fast turnaround", weaknesses: "No airport certification, smaller team", ranking: 5 },
  ];
  for (const c of competitors) {
    const existing = await db.competitor.findFirst({ where: { name: c.name } });
    if (!existing) {
      await db.competitor.create({ data: { ...c, services: JSON.stringify(c.services) } });
      console.log(`  ✓ ${c.name}`);
    }
  }
  console.log("Done!");
}
main().catch(console.error).finally(() => db.$disconnect());
