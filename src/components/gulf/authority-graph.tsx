"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { countries, cities, services, industries, projects, caseStudies, blogPosts } from "@/lib/gulf-data";

const NODES = [
  { label: "Country", count: countries.length, color: "bg-primary text-primary-foreground" },
  { label: "City", count: cities.length, color: "bg-amber-brand text-amber-foreground" },
  { label: "Service", count: services.length, color: "bg-primary text-primary-foreground" },
  { label: "Industry", count: industries.length, color: "bg-amber-brand text-amber-foreground" },
  { label: "Project", count: projects.length, color: "bg-primary text-primary-foreground" },
  { label: "Case Study", count: caseStudies.length, color: "bg-amber-brand text-amber-foreground" },
  { label: "Blog", count: blogPosts.length, color: "bg-primary text-primary-foreground" },
];

export function AuthorityGraph() {
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium">
            The Authority Graph
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            One connected platform, dozens of authority nodes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our content is structured as a graph — Country → City → Service → Industry → Project →
            Case Study → Blog — so every page reinforces topical authority and routes link equity
            where it converts.
          </p>
        </div>

        {/* Graph nodes */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {NODES.map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className={`rounded-xl px-5 py-4 text-center shadow-sm ${node.color}`}>
                <div className="text-2xl font-bold">{node.count}</div>
                <div className="text-xs font-medium uppercase tracking-wide opacity-80">
                  {node.label}
                </div>
              </div>
              {i < NODES.length - 1 && (
                <ChevronRight className="hidden h-5 w-5 text-muted-foreground sm:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Programmatic SEO callout */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-background p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold">
                128 commercial service-city pages
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                8 services × 16 cities = 128 unique landing pages, each targeting high-intent local
                search demand across UAE &amp; Saudi Arabia.
              </p>
            </div>
            <Link
              href="/uae/abu-dhabi/thermoplastic-road-marking"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-brand px-4 py-2.5 text-sm font-semibold text-amber-foreground hover:bg-[var(--amber-dark)]"
            >
              See example page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
