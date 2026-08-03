"use client";

import * as React from "react";
import { Phone, MessageCircle, Mail, Clock, Sparkles, ScanText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent, useGo, SectionHeading, Card, Badge, RoadLine } from "../shared";
import { PageHero } from "../PageHero";
import { JsonLd } from "../JsonLd";
import { breadcrumbSchema, contactPageSchema } from "@/lib/schema";
import { RfqForm } from "../rfq/RfqForm";
import { RfqAssistant } from "../rfq/RfqAssistant";
import { DrawingAnalyzer } from "../rfq/DrawingAnalyzer";
import { LeadPipeline } from "../rfq/LeadPipeline";

export function ContactRfqView() {
  const t = useContent();
  const c = t.contactRfq;
  const [refreshSignal, setRefreshSignal] = React.useState(0);
  const onRfqSubmitted = React.useCallback(() => setRefreshSignal((n) => n + 1), []);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: t.nav[9].label, path: "/#contact" }]), contactPageSchema()]} />
      <PageHero
        eyebrow={t.nav[9].label}
        title={c.h1}
        subtitle={c.sub}
        image="/images/qa-inspection.jpg"
      />

      {/* Quick contact strip */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href={`mailto:${t.contact.email}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-brand/40">
            <Mail className="h-5 w-5 text-brand" />
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium truncate">{t.contact.email}</div>
            </div>
          </a>
          <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-brand/40">
            <Phone className="h-5 w-5 text-brand" />
            <div>
              <div className="text-xs text-muted-foreground">{t.cta.phone}</div>
              <div className="text-sm font-medium">{t.contact.phone}</div>
            </div>
          </a>
          <a href={`https://wa.me/${t.contact.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-brand/40">
            <MessageCircle className="h-5 w-5 text-brand" />
            <div>
              <div className="text-xs text-muted-foreground">WhatsApp</div>
              <div className="text-sm font-medium">{t.contact.whatsapp}</div>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4">
            <Clock className="h-5 w-5 text-brand" />
            <div>
              <div className="text-xs text-muted-foreground">{c.slaTitle}</div>
              <div className="text-sm font-medium">1 working day (A-grade)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main: form + AI tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand" />
              <h2 className="text-2xl font-bold">{c.formTitle}</h2>
            </div>
            <Card>
              <RfqForm onSubmitted={onRfqSubmitted} />
            </Card>
          </div>

          {/* AI tools */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">{c.assistantTitle}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{c.assistantSub}</p>
            </div>
            <RfqAssistant />
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <ScanText className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold">{c.analyzerTitle}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{c.analyzerSub}</p>
            </div>
            <DrawingAnalyzer />
          </div>
        </div>
      </section>

      {/* Lead grades */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
          <SectionHeading eyebrow="Lead classification" title={c.gradesTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {c.grades.map((g) => (
              <Card key={g.grade}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${g.grade === "A" ? "bg-brand text-brand-foreground" : g.grade === "B" ? "bg-brand-2 text-brand-2-foreground" : "bg-muted text-muted-foreground"}`}>
                    {g.grade}
                  </span>
                  <h3 className="font-semibold">{g.label}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{g.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SLA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <Card className="border-brand/30 bg-brand/5">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-brand mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold">{c.slaTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.slaBody}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Live pipeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <SectionHeading eyebrow="CRM" title="Live RFQ pipeline" subtitle="Every submitted RFQ is classified A/B/C and tracked here. This is the conversion engine — Leads → RFQs → Proposals → Contracts." />
        <div className="mt-8">
          <LeadPipeline refreshSignal={refreshSignal} />
        </div>
      </section>

      <RoadLine />
    </>
  );
}
