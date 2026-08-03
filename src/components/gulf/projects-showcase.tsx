"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projects, services, cities } from "@/lib/gulf-data";
import { getIcon } from "@/lib/icons";

export function ProjectsShowcase() {
  const featured = projects.slice(0, 6);
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium">
              Project Authority
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Real projects. Real results.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Browse a selection of our delivered marking projects across highways, malls, warehouses,
              plants and airports in the UAE and Saudi Arabia.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-amber-brand hover:underline"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => {
            const service = services.find((s) => s.slug === project.service);
            const city = cities.find((c) => c.slug === project.city);
            const ServiceIcon = service ? getIcon(service.icon) : null;
            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-amber-brand hover:shadow-lg">
                    {/* Visual header */}
                    <div className="relative h-32 overflow-hidden bg-primary">
                      <div className="absolute inset-0 road-stripe-h opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          {ServiceIcon && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                              <ServiceIcon className="h-5 w-5" />
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
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-brand">
                        View case study
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
