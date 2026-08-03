"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/gulf-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Road stripe accent */}
      <div className="absolute inset-x-0 top-0 h-1.5 road-stripe-h opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 road-stripe-h opacity-40" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium text-primary-foreground/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-brand" />
              </span>
              Serving 16 cities across UAE & Saudi Arabia
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The Gulf&apos;s Authority in{" "}
              <span className="text-amber-brand">Road &amp; Industrial Marking</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-primary-foreground/70 sm:text-lg">
              From thermoplastic highway lines to airport runways, warehouse floors and epoxy
              systems — Gulf Seismic delivers municipal-spec marking quality engineered for the
              extreme Gulf climate.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
              >
                <Link href="/contact">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {company.phone}
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-brand" />
                ISO 9001 Certified
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-brand" />
                850+ Projects Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-brand" />
                UAE & Saudi Arabia
              </span>
            </div>
          </motion.div>

          {/* Right: visual / stats card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-primary-foreground">Gulf Seismic at a Glance</h3>
                <span className="rounded-full bg-amber-brand px-2.5 py-0.5 text-xs font-bold text-amber-foreground">
                  10+ YEARS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {company.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4"
                  >
                    <div className="text-2xl font-bold text-amber-brand sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-primary-foreground/60">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini authority graph preview */}
              <div className="mt-5 rounded-xl bg-primary-foreground/5 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
                  Authority Graph
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {["Country", "City", "Service", "Industry", "Project", "Case Study"].map(
                    (node, i, arr) => (
                      <div key={node} className="flex items-center gap-2">
                        <span className="rounded-md bg-primary-foreground/10 px-2 py-1 text-primary-foreground/80">
                          {node}
                        </span>
                        {i < arr.length - 1 && (
                          <span className="text-amber-brand">→</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
