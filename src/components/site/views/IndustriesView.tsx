"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent, useGo, Icon, SectionHeading, Card, CtaBand, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function IndustriesView() {
  const t = useContent();
  const { setView } = useGo();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: t.nav[2].label, path: "/#industries" }])} />
      <PageHero
        eyebrow={t.nav[2].label}
        title={t.industries.h1}
        subtitle={t.industries.sub}
        image="/images/industrial-safety-marking.jpg"
      >
        <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
          {t.cta.rfq}
        </Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.industries.items.map((ind) => (
            <Card key={ind.slug} className="group cursor-pointer flex flex-col" as="button" onClick={() => setView("services")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-brand">
                <Icon name={ind.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold group-hover:text-brand transition">{ind.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ind.summary}</p>
              <ul className="mt-4 space-y-1.5">
                {ind.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> {b}
                  </li>
                ))}
              </ul>
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
