"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Route, Flame, Plane, ParkingSquare, CircleDot, ShieldAlert, Eraser,
  ClipboardCheck, FileCheck2, HardHat, ShieldCheck, Search, RefreshCw,
  ListChecks, TableProperties, FileText, Factory, Ship, Building2, Gauge,
  type LucideIcon,
} from "lucide-react";
import { useSite, type ViewId } from "@/lib/store";
import { getContent } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  Route, Flame, Plane, ParkingSquare, CircleDot, ShieldAlert, Eraser,
  ClipboardCheck, FileCheck2, HardHat, ShieldCheck, Search, RefreshCw,
  ListChecks, TableProperties, FileText, Factory, Ship, Building2, Gauge,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Route;
  return <C className={className} />;
}

/** Amber dashed road-line divider. */
export function RoadLine({ className }: { className?: string }) {
  return <div className={cn("road-line", className)} aria-hidden />;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center mx-auto max-w-3xl", "space-y-3", className)}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "brand" | "outline" }) {
  const styles = {
    default: "bg-secondary text-secondary-foreground border-border",
    brand: "bg-brand/15 text-brand border-brand/30",
    outline: "border-border text-foreground bg-transparent",
  }[variant];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", styles)}>
      {children}
    </span>
  );
}

/** Sticky-bottom CTA band used at the end of views. */
export function CtaBand({
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  subtitle: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="brand-surface topo-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h3>
              <p className="text-foreground/80 text-base sm:text-lg">{subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={onPrimary}
                className="amber-glow inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition hover:brightness-105 active:scale-[0.99]"
              >
                {primaryLabel}
              </button>
              {secondaryLabel && onSecondary && (
                <button
                  onClick={onSecondary}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
                >
                  {secondaryLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Card with consistent padding and hover. */
export function Card({
  children,
  className,
  as: Comp = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Comp
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground p-6 transition hover:border-brand/40 hover:shadow-sm",
        className
      )}
    >
      {children}
    </Comp>
  );
}

/** Navigates via the store (works from anywhere). */
export function useGo() {
  const setView = useSite((s) => s.setView);
  const openService = useSite((s) => s.openService);
  const openCase = useSite((s) => s.openCase);
  const openResource = useSite((s) => s.openResource);
  return { setView: (v: ViewId) => setView(v), openService, openCase, openResource };
}

/** Trust strip marquee for hero. */
export function TrustMarquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border bg-secondary/50">
      <div className="flex w-max animate-marquee gap-10 py-3">
        {doubled.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
            <span className="h-1 w-1 rounded-full bg-brand" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Small stat block. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function useContent() {
  const lang = useSite((s) => s.lang);
  const t = React.useMemo(() => getContent(lang), [lang]);
  return t;
}
