"use client";

import { CheckCircle2, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import { company } from "@/lib/gulf-data";

export function TrustScroll() {
  const items = [...company.certifications, ...company.certifications];
  const icons = [CheckCircle2, ShieldCheck, Award, BadgeCheck];

  return (
    <section className="border-b border-border bg-background py-4 overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-scroll-rtl gap-8 px-4">
          {items.map((cert, i) => {
            const Icon = icons[i % icons.length];
            return (
              <span key={`${cert}-${i}`} className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                <Icon className="h-3.5 w-3.5 text-amber-brand" />
                {cert}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
