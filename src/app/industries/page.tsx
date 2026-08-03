import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/gulf/json-ld";
import { industries } from "@/lib/gulf-data";
import { getIcon } from "@/lib/icons";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve | Road & Industrial Marking by Sector",
  description:
    "Gulf Seismic serves highways, commercial, industrial, logistics, aviation, oil & gas, residential, healthcare, energy and retail sectors with sector-specific marking solutions.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
        ])}
      />
      <PageHero
        eyebrow="Industries"
        title="Marking expertise for every sector"
        description="Each industry has unique marking challenges — from forklift traffic to jet blast, chemical exposure to pilgrimage surges. We engineer solutions specific to your sector."
        crumbs={[{ name: "Industries", url: "/industries" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = getIcon(industry.icon);
              return (
                <Link key={industry.slug} href={`/industries/${industry.slug}`} className="group">
                  <Card className="h-full p-6 transition-all hover:border-amber-brand hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-amber-brand group-hover:text-amber-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold">{industry.name}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{industry.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {industry.services.slice(0, 3).map((ss) => (
                        <span key={ss} className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] text-accent-foreground">
                          {ss.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
