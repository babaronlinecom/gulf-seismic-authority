import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Ruler, Filter } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  services,
  cities,
  countries,
} from "@/lib/gulf-data";
import { allProjects } from "@/lib/gulf-content-merged";
import { DynamicIcon } from "@/components/gulf/dynamic-icon";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { projectCollectionSchema } from "@/lib/aeo-geo";

// Map project slugs to their generated images
const projectImageMap: Record<string, string> = {
  "abu-dhabi-highway-thermoplastic": "/images/projects/highway-thermoplastic.jpg",
  "dubai-mall-parking-marking": "/images/projects/mall-parking.jpg",
  "riyadh-warehouse-epoxy-marking": "/images/projects/warehouse-epoxy.jpg",
  "jubail-petrochemical-hazard-marking": "/images/projects/petrochemical-marking.jpg",
  "dammam-airport-taxiway-marking": "/images/projects/airport-taxiway.jpg",
  "sharjah-factory-epoxy-floor": "/images/projects/factory-epoxy-floor.jpg",
};

// ISR: revalidate every 5 minutes (fetches live CMS data at runtime,
// but uses seed data during build to avoid CMS fetch during SSG)
export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Marking Projects Portfolio | Road, Parking, Warehouse, Airport Case Studies",
  description:
    "Browse Gulf Seismic's delivered marking projects across UAE and Saudi Arabia — highways, malls, warehouses, plants and airports with real results.",
  path: "/projects",
});

export default async function ProjectsPage() {
  // Use merged seed data (50 projects) at build time.
  // ISR (revalidate=300) will fetch live CMS data at runtime.
  const projectCount = allProjects.length;
  const displayProjects = allProjects;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Projects", url: "/projects" },
          ]),
          projectCollectionSchema(projectCount),
        ]}
      />
      <PageHero
        eyebrow="Project Authority"
        title="Delivered marking projects across the Gulf"
        description="Real projects, real results. Browse our portfolio of highway, parking, warehouse, plant and airport marking work in the UAE and Saudi Arabia."
        crumbs={[{ name: "Projects", url: "/projects" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filter strip (visual) */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              All projects ({displayProjects.length})
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              {countries.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:border-amber-brand hover:text-amber-brand"
                >
                  {c.flag} {c.shortName}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((project) => {
              const service = services.find((s) => s.slug === project.service);
              const city = cities.find((c) => c.slug === project.city);
              const projectImg = projectImageMap[project.slug] || `/images/services/${project.service || "road-marking"}.jpg`;
              return (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-amber-brand hover:shadow-lg">
                    <div className="relative h-36 overflow-hidden bg-primary">
                      <img
                        src={projectImg}
                        alt={`${project.title} — ${service?.name || "marking"} in ${city?.name || ""}`}
                        className="h-full w-full object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          {service && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                              <DynamicIcon name={service.icon} className="h-5 w-5" />
                            </div>
                          )}
                          <Badge className="bg-amber-brand text-amber-foreground hover:bg-amber-brand">
                            {project.year}
                          </Badge>
                        </div>
                        <span className="text-2xl">
                          {project.country === "uae" ? "🇦🇪" : "🇸🇦"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-amber-brand">
                        {project.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {city?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {project.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {project.area}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {project.challenge}
                      </p>
                      <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-amber-brand">
                        View case study
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
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
