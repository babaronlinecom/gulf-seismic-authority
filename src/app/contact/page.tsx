"use client";

import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { LeadForm } from "@/components/gulf/lead-form";
import { company } from "@/lib/gulf-data";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your marking project"
        description="Get a free, no-obligation quote from Gulf Seismic specialists. We respond within 1 business hour during working days."
        crumbs={[{ name: "Contact", url: "/contact" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Contact options */}
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366] text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${company.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-brand hover:underline"
                    >
                      Chat now →
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Phone</h3>
                    <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-xs text-amber-brand hover:underline">
                      {company.phone}
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Email</h3>
                    <a href={`mailto:${company.email}`} className="text-xs text-amber-brand hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Head Office</h3>
                    <p className="text-xs text-muted-foreground">{company.headquarters.address}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Working Hours</h3>
                    <p className="text-xs text-muted-foreground">Sat–Thu, 8:00–18:00 (Gulf Standard Time)</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold">Request a Free Quote</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form below and a Gulf Seismic specialist will contact you within 1
                business hour.
              </p>
              <div className="mt-6">
                <LeadForm source="contact-page" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
