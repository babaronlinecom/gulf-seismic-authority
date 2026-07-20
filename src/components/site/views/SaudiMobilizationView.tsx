"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useContent, useGo, SectionHeading, Card, CtaBand, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export function SaudiMobilizationView() {
  const t = useContent();
  const { setView } = useGo();
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: t.saudiMobilization.h1, path: "/#saudi-mobilization" }]),
        faqSchema(t.saudiMobilization.faqs),
      ]} />
      <PageHero
        eyebrow={t.nav[6].label}
        title={t.saudiMobilization.h1}
        subtitle={t.saudiMobilization.intro}
        image="/images/crew-team.jpg"
      >
        <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
          {t.cta.rfq}
        </Button>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <SectionHeading eyebrow="Mobilization sequence" title="From opportunity to handover" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.saudiMobilization.steps.map((s, i) => (
            <Card key={s.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-sm leading-snug">{s.title.replace(/^\d+\.\s*/, "")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <SectionHeading title="Partner & compliance principles" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.saudiMobilization.partners.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-brand mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/90">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <SectionHeading center eyebrow="FAQ" title={t.home.faqTitle} />
        <Accordion type="single" collapsible className="mt-8">
          {t.saudiMobilization.faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-start hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
