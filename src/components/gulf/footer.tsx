"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { company, services, countries, cities } from "@/lib/gulf-data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-amber-brand">
                <div className="absolute inset-0 road-stripe-h opacity-40" />
                <span className="relative font-bold text-sm text-amber-foreground">GS</span>
              </div>
              <div>
                <div className="font-bold">Gulf Seismic</div>
                <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60">
                  Road & Industrial Marking
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
              {company.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {company.certifications.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-primary-foreground/20 px-3 py-1 text-[11px] text-primary-foreground/80"
                >
                  {cert}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={company.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-primary-foreground/70 hover:text-amber-brand transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Regions
            </h3>
            <ul className="space-y-2">
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-sm font-medium text-primary-foreground/80 hover:text-amber-brand"
                  >
                    {c.flag} {c.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/projects"
                  className="text-sm text-primary-foreground/70 hover:text-amber-brand"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/industries"
                  className="text-sm text-primary-foreground/70 hover:text-amber-brand"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-primary-foreground/70 hover:text-amber-brand"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-foreground/70 hover:text-amber-brand"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="flex items-start gap-2 text-primary-foreground/70 hover:text-amber-brand"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{company.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-start gap-2 text-primary-foreground/70 hover:text-amber-brand"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{company.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{company.headquarters.address}</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-1 rounded-md bg-amber-brand px-4 py-2 text-sm font-semibold text-amber-foreground hover:bg-[var(--amber-dark)] transition-colors"
            >
              Request a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* City strip */}
        <div className="mt-10 border-t border-primary-foreground/10 pt-6">
          <p className="mb-3 text-[11px] uppercase tracking-widest text-primary-foreground/50">
            Serving 16 cities across the Gulf
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.country}/${c.slug}`}
                className="text-xs text-primary-foreground/60 hover:text-amber-brand"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6 sm:flex-row">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-primary-foreground/50">
            <Link href="/privacy" className="hover:text-amber-brand">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-brand">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-amber-brand">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
