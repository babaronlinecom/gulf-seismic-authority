"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { caseStudies, getProject } from "@/lib/gulf-data";

export function CaseStudiesSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Case Studies
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Proven outcomes, in our clients&apos; words
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-amber-brand hover:underline"
          >
            All case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {caseStudies.map((cs, i) => {
            const project = getProject(cs.projectSlug);
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/case-studies/${cs.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col p-6 transition-all hover:border-amber-brand hover:shadow-lg">
                    <Quote className="h-8 w-8 text-amber-brand/40" />
                    <h3 className="mt-3 font-semibold leading-tight group-hover:text-amber-brand">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{cs.summary}</p>

                    {cs.testimonial && (
                      <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-4">
                        <p className="text-sm italic text-foreground">
                          &ldquo;{cs.testimonial.quote}&rdquo;
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          — {cs.testimonial.author}, {cs.testimonial.role}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {cs.outcomes.slice(0, 2).map((o) => (
                        <span
                          key={o}
                          className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground"
                        >
                          {o}
                        </span>
                      ))}
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
