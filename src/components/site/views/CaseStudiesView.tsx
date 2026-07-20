"use client";

import Image from "next/image";
import { ArrowRight, ArrowLeft, CheckCircle2, Beaker, Wrench, Layers, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/store";
import { useContent, useGo, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function CaseStudiesView() {
  const t = useContent();
  const { setView, openCase } = useGo();
  const caseSlug = useSite((s) => s.caseSlug);
  const item = t.caseStudies.items.find((c) => c.slug === caseSlug);

  if (!item) {
    return (
      <>
        <JsonLd data={breadcrumbSchema([{ name: t.nav[4].label, path: "/#case-studies" }])} />
        <PageHero
          eyebrow={t.nav[4].label}
          title={t.caseStudies.h1}
          subtitle={t.caseStudies.sub}
          image="/images/qa-inspection.jpg"
        >
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm text-foreground">
            {t.caseStudies.disclaimer}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <div className="grid gap-5 md:grid-cols-3">
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

        <CtaBand
          title={t.home.rfqTitle}
          subtitle={t.home.rfqSub}
          primaryLabel={t.cta.rfq}
          onPrimary={() => setView("contact")}
        />
      </>
    );
  }

  const rows: { icon: typeof Beaker; label: string; value: string }[] = [
    { icon: Beaker, label: t.caseStudies.items[0] ? "Client type" : "Client type", value: item.clientType },
    { icon: Layers, label: "Location", value: item.location },
    { icon: Target, label: "Scope", value: item.scope },
    { icon: Wrench, label: "Materials", value: item.materials },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: t.nav[4].label, path: "/#case-studies" },
        { name: item.title, path: "/#case-studies" },
      ])} />
      <PageHero
        eyebrow={t.nav[4].label}
        title={item.title}
        subtitle={item.challenge}
        image={item.image}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button variant="outline" onClick={() => openCase(t.caseStudies.items[0].slug)}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.nav[4].label}
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r) => (
            <Card key={r.label}>
              <r.icon className="h-5 w-5 text-brand" />
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{r.label}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{r.value}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading title="Challenge" />
          <p className="text-muted-foreground leading-relaxed">{item.challenge}</p>
          <SectionHeading title="Scope & quantities" />
          <p className="text-muted-foreground leading-relaxed">{item.scope}</p>
        </div>
        <div className="space-y-4">
          <SectionHeading title="Solution" />
          <p className="text-muted-foreground leading-relaxed">{item.solution}</p>
          <SectionHeading title="Equipment" />
          <p className="text-muted-foreground leading-relaxed">{item.equipment}</p>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <SectionHeading eyebrow="Result" title="Measurable result" />
          <Card className="mt-6 border-brand/30 bg-brand/5">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-brand mt-0.5 shrink-0" />
              <p className="text-foreground leading-relaxed">{item.result}</p>
            </div>
          </Card>
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
