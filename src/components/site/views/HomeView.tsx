"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight, CheckCircle2, Phone, MessageCircle, Download, FileText,
  ChevronDown,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/store";
import { useContent, useGo, Icon, RoadLine, SectionHeading, Card, TrustMarquee, CtaBand, Badge } from "../shared";
import { JsonLd } from "../JsonLd";
import { orgSchema, websiteSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";

export function HomeView() {
  const t = useContent();
  const { setView, openService } = useGo();

  return (
    <>
      <JsonLd data={[orgSchema(t), websiteSchema(t), faqSchema(t.home.faqs), breadcrumbSchema([{ name: t.nav[0].label, path: "/" }])]} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-highway.jpg"
            alt="Desert highway with thermoplastic road markings at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <Badge variant="brand">{t.home.badge}</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              {t.home.h1}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t.home.sub}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={() => setView("contact")} className="amber-glow bg-brand text-brand-foreground hover:brightness-105">
                {t.cta.rfq}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView("services")}>
                {t.nav[1].label}
              </Button>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 pt-2">
              {t.home.heroPoints.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RoadLine className="absolute bottom-0 left-0 right-0" />
      </section>

      <TrustMarquee items={t.home.trustStrip} />

      {/* SERVICES PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading
          eyebrow={t.nav[1].label}
          title={t.home.servicesTitle}
          subtitle={t.home.servicesSub}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.slice(0, 6).map((s) => (
            <Card key={s.slug} className="group cursor-pointer flex flex-col" as="button" onClick={() => openService(s.slug)}>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div className="space-y-1.5 text-start">
                  <h3 className="font-semibold text-foreground group-hover:text-brand transition">{s.navLabel}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.intro}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand">
                {t.cta.rfq}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setView("services")}>
            {t.servicesHub.h1}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading eyebrow={t.about.h1.split("—")[0].trim()} title={t.home.whyTitle} subtitle={t.home.whySub} />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.whyCards.map((c) => (
              <Card key={c.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-brand">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading eyebrow="Method" title={t.home.processTitle} subtitle={t.home.processSub} />
        <div className="mt-10 grid gap-5 md:grid-cols-5">
          {t.home.process.map((p, i) => (
            <div key={p.step} className="relative space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-bold">
                  {p.step}
                </span>
                {i < t.home.process.length - 1 && (
                  <span className="hidden md:block h-px flex-1 bg-gradient-to-r from-brand/60 to-transparent" />
                )}
              </div>
              <h3 className="font-semibold text-sm leading-snug">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAUDI PRESENCE SUMMARY */}
      <section className="relative overflow-hidden border-y border-border">
        <div className="absolute inset-0">
          <Image src="/images/saudi-infrastructure.jpg" alt="Saudi infrastructure highway interchange" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <Badge variant="brand">{t.nav[6].label}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.home.saudiTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.home.saudiSub}</p>
            <ul className="space-y-2.5">
              {t.home.saudiPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => setView("saudi-presence")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
                {t.nav[6].label}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button variant="outline" onClick={() => setView("saudi-mobilization")}>
                {t.saudiMobilization.h1}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF / CASE STUDIES TEASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t.nav[4].label} title={t.home.proofTitle} subtitle={t.home.proofSub} />
          <Button variant="outline" onClick={() => setView("case-studies")} className="self-start sm:self-auto shrink-0">
            {t.nav[4].label}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.caseStudies.items.map((c) => (
            <Card key={c.slug} className="overflow-hidden p-0 group cursor-pointer flex flex-col" as="button" onClick={() => useSite.getState().openCase(c.slug)}>
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

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading center eyebrow="FAQ" title={t.home.faqTitle} />
          <Accordion type="single" collapsible className="mt-10">
            {t.home.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT QUICK STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4" as="button" onClick={() => setView("contact")}>
            <Phone className="h-6 w-6 text-brand" />
            <div className="text-start">
              <div className="text-xs text-muted-foreground">{t.cta.phone}</div>
              <div className="font-semibold text-sm">{t.contact.phone}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4" as="button" onClick={() => setView("contact")}>
            <MessageCircle className="h-6 w-6 text-brand" />
            <div className="text-start">
              <div className="text-xs text-muted-foreground">{t.cta.whatsapp}</div>
              <div className="font-semibold text-sm">{t.contact.whatsapp}</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4" as="button" onClick={() => setView("resources")}>
            <Download className="h-6 w-6 text-brand" />
            <div className="text-start">
              <div className="text-xs text-muted-foreground">{t.cta.download}</div>
              <div className="font-semibold text-sm">{t.nav[5].label}</div>
            </div>
          </Card>
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
