import sharp from "sharp";
import fs from "fs";

const logo = fs.readFileSync("public/logo.png");

const sizes = [
  { size: 16, name: "favicon-16.png" },
  { size: 32, name: "favicon-32.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192.png" },
  { size: 512, name: "android-chrome-512.png" },
];

async function main() {
  for (const { size, name } of sizes) {
    await sharp(logo)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(`public/${name}`);
    console.log(`✓ ${name} (${size}x${size})`);
  }
  await sharp(logo)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile("public/favicon.ico");
  console.log("✓ favicon.ico (32x32)");
  console.log("Done!");
}

main().catch(console.error);
