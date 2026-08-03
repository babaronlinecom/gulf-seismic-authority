"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { industries } from "@/lib/gulf-data";
import { getIcon } from "@/lib/icons";

export function IndustriesGrid() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Industries We Serve
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Marking expertise for every sector
          </h2>
          <p className="mt-4 text-muted-foreground">
            From highways to hospitals, each industry has unique marking challenges. We engineer
            solutions specific to your environment and compliance requirements.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry, i) => {
            const Icon = getIcon(industry.icon);
            return (
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link href={`/industries/${industry.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col items-center p-5 text-center transition-all hover:border-amber-brand hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-amber-brand group-hover:text-amber-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-tight">{industry.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {industry.description}
                    </p>
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
