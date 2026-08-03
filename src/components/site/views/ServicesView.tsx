"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ClipboardList, Beaker, FileCheck2,
  ShieldCheck, Phone, MessageCircle,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/store";
import { useContent, useGo, Icon, RoadLine, SectionHeading, Card, CtaBand, Badge } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export function ServicesView() {
  const t = useContent();
  const { setView, openService } = useGo();
  const serviceSlug = useSite((s) => s.serviceSlug);
  const service = t.services.find((s) => s.slug === serviceSlug);

  if (!service) {
    return (
      <>
        <JsonLd data={breadcrumbSchema([{ name: t.nav[1].label, path: "/#services" }])} />
        <PageHero eyebrow={t.nav[1].label} title={t.servicesHub.h1} subtitle={t.servicesHub.sub} image="/images/thermoplastic-application.jpg">
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
              {t.cta.rfq}
            </Button>
            <Button variant="outline" onClick={() => setView("industries")}>{t.nav[2].label}</Button>
          </div>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.map((s) => (
              <Card key={s.slug} className="group cursor-pointer overflow-hidden p-0 flex flex-col" as="button" onClick={() => openService(s.slug)}>
                <div className="relative h-40 w-full overflow-hidden">
                  <Image src={s.image} alt={s.navLabel} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className="absolute bottom-3 start-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="space-y-2 p-5 text-start">
                  <h3 className="font-semibold group-hover:text-brand transition">{s.navLabel}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.intro}</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand pt-1">
                    {t.cta.rfq}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <CtaBand
          title={t.home.rfqTitle}
          subtitle={t.home.rfqSub}
          primaryLabel={t.cta.rfq}
          onPrimary={() => setView("contact")}
          secondaryLabel={t.cta.consult}
          onSecondary={() => setView("about")}
        />
      </>
    );
  }

  // ---- Service detail ----
  const related = t.services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const idx = t.services.findIndex((s) => s.slug === service.slug);

  return (
    <>
      <JsonLd data={[
        serviceSchema(service),
        faqSchema(service.faqs),
        breadcrumbSchema([
          { name: t.nav[1].label, path: "/#services" },
          { name: service.navLabel, path: `/#services` },
        ]),
      ]} />

      <PageHero
        eyebrow={t.nav[1].label}
        title={service.h1}
        subtitle={service.intro}
        image={service.image}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button variant="outline" onClick={() => openService(t.services[(idx - 1 + t.services.length) % t.services.length].slug)}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button variant="outline" onClick={() => openService(t.services[(idx + 1) % t.services.length].slug)}>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </PageHero>

      {/* Direct answer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <Card className="border-brand/30 bg-brand/5">
          <div className="flex items-start gap-3">
            <Beaker className="h-5 w-5 text-brand mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">{t.nav[5].label}</div>
              <p className="text-base text-foreground leading-relaxed">{service.directAnswer}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Problem + selection */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading title={t.home.whyTitle.replace("Why procurement teams choose Gulf Seismic", "Common problems we solve")} />
          <ul className="space-y-2.5">
            {service.problem.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-2 shrink-0" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <SectionHeading title="System selection" />
          <ul className="space-y-2.5">
            {service.selection.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <SectionHeading eyebrow="Method" title="Execution methodology" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {service.methodology.map((m, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-brand text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QA/QC + procurement */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <h2 className="text-2xl font-bold">QA / QC &amp; handover</h2>
          </div>
          <ul className="space-y-2.5">
            {service.qaqc.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <FileCheck2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-brand" />
            <h2 className="text-2xl font-bold">Procurement checklist</h2>
          </div>
          <ul className="space-y-2.5">
            {service.procurement.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
          <Card className="bg-brand/5 border-brand/30">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand" />
              <p className="text-sm text-foreground">{t.contact.sla}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
          <SectionHeading center eyebrow="FAQ" title="Service FAQs" />
          <Accordion type="single" collapsible className="mt-8">
            {service.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-start hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <SectionHeading title="Related services" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {related.map((s) => (
            <Card key={s.slug} className="group cursor-pointer" as="button" onClick={() => openService(s.slug)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold group-hover:text-brand transition">{s.navLabel}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{s.intro}</p>
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
        secondaryLabel={t.cta.whatsapp}
        onSecondary={() => setView("contact")}
      />
    </>
  );
}
