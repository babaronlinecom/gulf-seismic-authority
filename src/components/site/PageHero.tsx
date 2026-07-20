"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "./shared";

/** Standard inner-page hero with optional background image. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  badge,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {image && (
        <div className="absolute inset-0">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/55" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl space-y-4">
          {(badge || eyebrow) && <Badge variant="brand">{badge || eyebrow}</Badge>}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>
          {subtitle && <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
