"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  url?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      <Link href="/" className="flex items-center hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.url && i < items.length - 1 ? (
            <Link href={item.url} className="hover:text-foreground">
              {item.name}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
