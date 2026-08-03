"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/gulf-data";
import { getIcon } from "@/lib/icons";

export function ServicesGrid() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Our Services
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Eight specialised marking disciplines
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every service is engineered for Gulf conditions — extreme heat, UV exposure and heavy
            traffic — and compliant with local RTA, DoT and MOMRA specifications.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/services/${service.slug}`} className="group block h-full">
                  <Card className="relative h-full overflow-hidden p-0 transition-all hover:border-amber-brand hover:shadow-lg">
                    {/* Service image */}
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={`/images/services/${service.slug}.jpg`}
                        alt={`${service.name} — ${service.tagline}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                      <div className="absolute bottom-2 left-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm text-primary-foreground">{service.name}</h3>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {service.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-amber-brand">
                        Learn more
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
