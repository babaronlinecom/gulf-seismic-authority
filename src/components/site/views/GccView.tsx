"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useContent, useGo, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export function GccView() {
  const t = useContent();
  const { setView } = useGo();
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: t.nav[7].label, path: "/#gcc" }]),
        faqSchema(t.gcc.faqs),
      ]} />
      <PageHero
        eyebrow={t.nav[7].label}
        title={t.gcc.h1}
        subtitle={t.gcc.intro}
        image="/images/saudi-infrastructure.jpg"
      >
        <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
          {t.cta.rfq}
        </Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.gcc.countries.map((c) => (
            <Card key={c.code}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <MapPin className="h-5 w-5" />
                </span>
                <Badge variant={c.code === "AE" ? "brand" : "outline"}>{c.code === "AE" ? "Home market" : c.code === "SA" ? "Priority" : "On request"}</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
          <SectionHeading center eyebrow="FAQ" title={t.home.faqTitle} />
          <Accordion type="single" collapsible className="mt-8">
            {t.gcc.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-start hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <RoadLine />
      <CtaBand
        title={t.home.rfqTitle}
        subtitle={t.home.rfqSub}
        primaryLabel={t.cta.rfq}
        onPrimary={() => setView("contact")}
        secondaryLabel={t.nav[6].label}
        onSecondary={() => setView("saudi-presence")}
      />
    </>
  );
}
