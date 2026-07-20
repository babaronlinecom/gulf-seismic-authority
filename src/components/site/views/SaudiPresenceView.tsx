"use client";

import { CheckCircle2, CircleDashed, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useContent, useGo, SectionHeading, Card, CtaBand, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes("in progress") || s.includes("قيد التنفيذ") || s.includes("pipeline") || s.includes("خط الأنابيب") || s.includes("project-specific") || s.includes("خاصة بالمشروع") || s.includes("مشاريع") || s.includes("فرص") || s.includes("تعبئة")) return "progress";
  if (s.includes("planned") || s.includes("مخطط")) return "planned";
  return "planned";
}

export function SaudiPresenceView() {
  const t = useContent();
  const { setView } = useGo();

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: t.nav[6].label, path: "/#saudi-presence" }]),
        faqSchema(t.saudiPresence.faqs),
      ]} />
      <PageHero
        eyebrow={t.nav[6].label}
        title={t.saudiPresence.h1}
        subtitle={t.saudiPresence.intro}
        image="/images/saudi-infrastructure.jpg"
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={() => setView("contact")} className="bg-brand text-brand-foreground hover:brightness-105 amber-glow">
            {t.cta.rfq}
          </Button>
          <Button variant="outline" onClick={() => setView("saudi-mobilization")}>{t.saudiMobilization.h1}</Button>
        </div>
      </PageHero>

      {/* Phase 0 gate */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <SectionHeading eyebrow="Phase 0 gate" title={t.saudiPresence.gateTitle} subtitle={t.saudiPresence.gateIntro} />
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">Item</th>
                <th className="px-4 py-3 text-start font-semibold w-[40%]">Verified status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {t.saudiPresence.gate.map((g) => {
                const kind = statusIcon(g.status);
                return (
                  <tr key={g.item} className="bg-card">
                    <td className="px-4 py-3 font-medium">{g.item}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        {kind === "progress" ? (
                          <Clock className="h-4 w-4 text-brand-2" />
                        ) : (
                          <CircleDashed className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-muted-foreground">{g.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/5 p-3 text-xs text-foreground">
          <ShieldCheck className="h-4 w-4 text-brand mt-0.5 shrink-0" />
          <span>We do not publish Saudi contact details, offices, clients or projects we do not hold. Each row above moves to "Verified" only when documented evidence exists.</span>
        </div>
      </section>

      {/* Execution plan */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <SectionHeading eyebrow="Execution plan" title={t.saudiPresence.planTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {t.saudiPresence.plan.map((p) => (
              <Card key={p.phase}>
                <Badge variant="brand">{p.phase}</Badge>
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery routes */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <SectionHeading eyebrow="Delivery routes" title={t.saudiPresence.routeTitle} />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {t.saudiPresence.routes.map((r) => (
            <Card key={r.name}>
              <h3 className="font-semibold text-brand">{r.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
          <SectionHeading center eyebrow="FAQ" title={t.home.faqTitle} />
          <Accordion type="single" collapsible className="mt-8">
            {t.saudiPresence.faqs.map((f, i) => (
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
        secondaryLabel={t.saudiMobilization.h1}
        onSecondary={() => setView("saudi-mobilization")}
      />
    </>
  );
}
