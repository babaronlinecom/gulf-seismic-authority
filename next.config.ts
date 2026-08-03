import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel handles Next.js output natively — no standalone needed */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
