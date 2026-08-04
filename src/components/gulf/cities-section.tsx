"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { countries, cities, getCitiesByCountry } from "@/lib/gulf-data";

export function CitiesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Coverage
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            16 cities. Two nations. One standard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From Abu Dhabi to Madinah, we deliver the same municipal-spec quality on every project —
            whether it&apos;s a highway, a warehouse or an airport runway.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {countries.map((country) => {
            const countryCities = getCitiesByCountry(country.slug);
            return (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <Link
                    href={`/${country.slug}`}
                    className="flex items-center justify-between border-b border-border bg-primary px-5 py-4 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-bold">{country.name}</div>
                        <div className="text-xs text-primary-foreground/60">
                          {countryCities.length} cities served
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <div className="grid grid-cols-2 gap-1 p-4 sm:grid-cols-3">
                    {countryCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${country.slug}/${city.slug}`}
                        className="flex items-center gap-2 rounded-md p-2.5 text-sm transition-colors hover:bg-accent"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-brand" />
                        <span className="truncate">{city.name}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
