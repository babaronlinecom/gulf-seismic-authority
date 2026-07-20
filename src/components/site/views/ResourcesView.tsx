"use client";

import * as React from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, BookOpen, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/store";
import { useContent, useGo, Icon, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function ResourcesView() {
  const t = useContent();
  const { setView, openResource } = useGo();
  const resourceSlug = useSite((s) => s.resourceSlug);
  const item = t.resources.items.find((r) => r.slug === resourceSlug);

  if (!item) {
    return (
      <>
        <JsonLd data={breadcrumbSchema([{ name: t.nav[5].label, path: "/#resources" }])} />
        <PageHero
          eyebrow={t.nav[5].label}
          title={t.resources.h1}
          subtitle={t.resources.sub}
          image="/images/qa-inspection.jpg"
        >
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
          </Button>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.resources.items.map((r) => (
              <Card key={r.slug} className="group cursor-pointer flex flex-col" as="button" onClick={() => openResource(r.slug)}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/15 text-brand">
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <Badge variant="outline">{r.type}</Badge>
                </div>
                <h3 className="mt-4 font-semibold group-hover:text-brand transition">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand">
                  {t.cta.download}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
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

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: t.nav[5].label, path: "/#resources" },
        { name: item.title, path: "/#resources" },
      ])} />
      <PageHero eyebrow={t.nav[5].label} title={item.title} subtitle={item.summary} image="/images/qa-inspection.jpg">
        <Button variant="outline" onClick={() => openResource(t.resources.items[0].slug)}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.nav[5].label}
        </Button>
      </PageHero>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {/* Provenance */}
        <Card className="border-brand/30 bg-brand/5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Source</div>
              <div className="text-sm font-medium">{item.source}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Jurisdiction</div>
              <div className="text-sm font-medium">{item.jurisdiction}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Type</div>
              <div className="text-sm font-medium">{item.type}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Reviewer</div>
              <div className="text-sm font-medium text-brand">{item.reviewer}</div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-background/60 p-3">
            <ShieldAlert className="h-4 w-4 text-brand-2 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{item.disclaimer}</p>
          </div>
        </Card>

        {/* Items */}
        <div className="mt-8 space-y-3">
          {item.items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-brand text-xs font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">{it}</p>
            </div>
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
