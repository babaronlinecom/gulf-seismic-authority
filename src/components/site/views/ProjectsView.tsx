"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent, useGo, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function ProjectsView() {
  const t = useContent();
  const { setView, openCase } = useGo();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: t.nav[3].label, path: "/#projects" }])} />
      <PageHero
        eyebrow={t.nav[3].label}
        title={t.projects.h1}
        subtitle={t.projects.sub}
        image="/images/crew-team.jpg"
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
          </Button>
          <Button variant="outline" onClick={() => setView("case-studies")}>{t.nav[4].label}</Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <SectionHeading eyebrow={t.nav[4].label} title={t.caseStudies.h1} subtitle={t.caseStudies.sub} />
        <div className="mt-8 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm text-foreground">
          {t.caseStudies.disclaimer}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {t.caseStudies.items.map((c) => (
            <Card key={c.slug} className="overflow-hidden p-0 group cursor-pointer flex flex-col" as="button" onClick={() => openCase(c.slug)}>
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={c.image} alt={c.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-2 start-2">
                  <Badge variant={c.category === "verified-project" ? "brand" : "outline"}>
                    {c.category === "verified-project" ? "Verified Project" : "Capability Example"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 p-5 text-start">
                <h3 className="font-semibold leading-snug group-hover:text-brand transition">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.clientType} • {c.location}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{c.challenge}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <RoadLine />
      <CtaBand
        title={t.home.rfqTitle}
        subtitle={t.home.rfqSub}
        primaryLabel={t.cta.rfq}
        onPrimary={() => setView("contact")}
      />
    </>
  );
}
