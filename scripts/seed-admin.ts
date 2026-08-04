/**
 * Seed the default admin user.
 * Run: bun run scripts/seed-admin.ts
 *
 * Default credentials:
 *   Email: admin@gulfseismic.com
 *   Password: gulf-seismic-2026
 *
 * CHANGE THE PASSWORD immediately after first login via Settings.
 */
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

async function main() {
  const email = "admin@gulfseismic.com";
  const password = "gulf-seismic-2026";
  const name = "Gulf Seismic Admin";

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    console.log("To reset the password, delete the user first or update via Settings.");
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.create({
    data: { email, name, passwordHash: hash, role: "admin" },
  });

  console.log("=".repeat(50));
  console.log("  Admin user created");
  console.log("=".repeat(50));
  console.log(`  Email:    ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${user.role}`);
  console.log("=".repeat(50));
  console.log("  ⚠️  Change this password immediately via Settings!");
  console.log("=".repeat(50));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
