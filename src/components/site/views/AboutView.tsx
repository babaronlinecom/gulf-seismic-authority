"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent, useGo, Icon, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function AboutView() {
  const t = useContent();
  const { setView } = useGo();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: t.nav[8].label, path: "/#about" }])} />
      <PageHero
        eyebrow={t.nav[8].label}
        title={t.about.h1}
        subtitle={t.about.sub}
        image="/images/crew-team.jpg"
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
          </Button>
          <Button variant="outline" onClick={() => setView("saudi-presence")}>{t.nav[6].label}</Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-14 space-y-6">
        <SectionHeading eyebrow="Our story" title="A specialist marking contractor" />
        {t.about.story.map((p, i) => (
          <p key={i} className="text-muted-foreground text-lg leading-relaxed">{p}</p>
        ))}
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <SectionHeading title="What we stand for" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.values.map((v) => (
              <Card key={v.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-brand">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading title="Capabilities" />
          <ul className="space-y-2.5">
            {t.about.capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <SectionHeading title="Compliance posture" />
          <ul className="space-y-2.5">
            {t.about.compliance.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
          <Card className="bg-brand/5 border-brand/30">
            <Badge variant="brand">Phase 0 gate</Badge>
            <p className="mt-2 text-sm text-foreground leading-relaxed">
              Every Saudi claim is gated behind verified status. See the {t.nav[6].label} page for the live status of each registration.
            </p>
            <Button variant="link" className="mt-2 h-auto p-0 text-brand" onClick={() => setView("saudi-presence")}>
              View Saudi Presence →
            </Button>
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
