"use client";

import * as React from "react";
import { Mail, Phone, MessageCircle, MapPin, ShieldCheck } from "lucide-react";
import { useSite, type ViewId } from "@/lib/store";
import { useContent } from "./shared";
import { cn } from "@/lib/utils";

export function Footer() {
  const t = useContent();
  const { setView, openService } = useSite();

  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 sm:py-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand col */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-foreground">
                <span className="absolute inset-x-1.5 top-2 h-0.5 rounded-full bg-brand" />
                <span className="absolute inset-x-1.5 top-4 h-0.5 rounded-full bg-background/80" />
                <span className="absolute inset-x-3 top-6 h-0.5 rounded-full bg-brand/70" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold">{t.brand.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Saudi & GCC
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.about}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <span>{t.footer.note}</span>
            </div>
          </div>

          {/* Link columns */}
          {t.footer.columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        if (link.slug) openService(link.slug);
                        else if (link.id) setView(link.id as ViewId);
                      }}
                      className="text-start text-sm text-muted-foreground transition hover:text-brand"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact col (replaces 4th when only 3 columns) — appended */}
        </div>

        {/* Contact strip */}
        <div className="grid gap-4 border-t border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
          <a href={`mailto:${t.contact.email}`} className="flex items-center gap-3 text-sm hover:text-brand transition">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <span className="truncate">{t.contact.email}</span>
          </a>
          <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm hover:text-brand transition">
            <Phone className="h-4 w-4 text-brand shrink-0" />
            <span>{t.contact.phone}</span>
          </a>
          <a href={`https://wa.me/${t.contact.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-brand transition">
            <MessageCircle className="h-4 w-4 text-brand shrink-0" />
            <span>{t.contact.whatsapp}</span>
          </a>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-brand shrink-0" />
            <span>{t.contact.addressLine}</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">{t.footer.legal}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button onClick={() => setView("saudi-presence")} className="hover:text-brand transition">
              {t.saudiPresence.navLabel ?? "Saudi Presence"}
            </button>
            <button onClick={() => setView("about")} className="hover:text-brand transition">
              {t.about.h1.split("—")[0].trim()}
            </button>
            <button onClick={() => setView("contact")} className="hover:text-brand transition">
              {t.contactRfq.h1.split("—")[0].trim()}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
