import type { MetadataRoute } from "next";
import { company } from "@/lib/gulf-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/admin/login"],
      },
    ],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
