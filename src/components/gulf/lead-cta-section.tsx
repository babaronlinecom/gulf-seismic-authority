"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/gulf-data";
import { LeadForm } from "./lead-form";

export function LeadCtaSection() {
  return (
    <section id="quote" className="bg-secondary py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: funnel options */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium">
              Get a Quote
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Start your marking project today
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose the channel that suits you. Our specialists respond within 1 business hour
              during working days.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/${company.whatsapp}?text=Hello%20Gulf%20Seismic,%20I%20would%20like%20a%20quote.`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-[#25D366] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366] text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">WhatsApp Funnel</div>
                  <div className="text-xs text-muted-foreground">Instant response</div>
                </div>
              </a>

              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-amber-brand hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Call Funnel</div>
                  <div className="text-xs text-muted-foreground">{company.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-amber-brand hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Email Funnel</div>
                  <div className="text-xs text-muted-foreground">{company.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Tender Funnel</div>
                  <div className="text-xs text-muted-foreground">RFQ via form →</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-5">
              <h3 className="font-semibold">Why Gulf Seismic?</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>✓ 10+ years delivering marking projects in the Gulf</li>
                <li>✓ ISO 9001 certified, RTA & MOMRA compliant</li>
                <li>✓ ICAO Annex 14 trained aviation crews</li>
                <li>✓ 850+ projects across 16 cities</li>
              </ul>
            </div>
          </motion.div>

          {/* Right: RFQ form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <LeadForm source="homepage-cta" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
