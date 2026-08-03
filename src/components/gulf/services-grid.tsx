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
                  <Card className="relative h-full overflow-hidden p-5 transition-all hover:border-amber-brand hover:shadow-lg">
                    <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-amber-brand/10 transition-transform group-hover:translate-x-6 group-hover:-translate-y-6" />
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold leading-tight">{service.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {service.shortDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-brand">
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
