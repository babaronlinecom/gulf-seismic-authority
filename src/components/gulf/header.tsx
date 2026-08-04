"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { services, cities } from "@/lib/gulf-data";
import type { SiteSettings, MenuLink } from "@/lib/cms";

interface HeaderProps {
  settings: SiteSettings;
  menuItems: MenuLink[];
}

export function Header({ settings, menuItems }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — real Gulf Seismic logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={settings.logoUrl || "/logo.png"}
            alt={`${settings.siteName} logo`}
            className="h-10 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-foreground">{settings.siteName}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Road & Industrial Marking
            </div>
          </div>
        </Link>

        {/* Desktop nav — render menu items from DB */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => {
            // Check if this is the Services dropdown trigger
            if (item.label === "Services") {
              return <ServicesDropdown key={item.id} />;
            }
            if (item.label.includes("UAE")) {
              return <CountryDropdown key={item.id} label={item.label} flag="🇦🇪" country="uae" />;
            }
            if (item.label.includes("Saudi")) {
              return <CountryDropdown key={item.id} label={item.label} flag="🇸🇦" country="saudi-arabia" />;
            }
            return (
              <Link
                key={item.id}
                href={item.url}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button asChild size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <Link href="/contact">Get a Quote</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">{settings.siteName}</SheetTitle>
              </SheetHeader>
              <MobileNav menuItems={menuItems} onNavigate={() => setOpen(false)} phone={settings.phone} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ServicesDropdown() {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground">
        Services
        <ChevronDown className="h-4 w-4" />
      </button>
      <div className="invisible absolute left-0 top-full w-[600px] gap-3 rounded-md border border-border bg-popover p-4 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="block rounded-md p-3 hover:bg-accent transition-colors"
            >
              <div className="font-medium text-sm">{s.name}</div>
              <div className="line-clamp-1 text-xs text-muted-foreground">{s.tagline}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountryDropdown({ label, flag, country }: { label: string; flag: string; country: string }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground">
        <span className="mr-1">{flag}</span>
        {label.replace(flag, "").trim()}
        <ChevronDown className="h-4 w-4" />
      </button>
      <div className="invisible absolute left-0 top-full w-[480px] gap-1 rounded-md border border-border bg-popover p-4 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 md:grid-cols-2">
        <Link href={`/${country}`} className="col-span-2 mb-1 block rounded-md bg-accent p-2 text-sm font-medium">
          All Cities →
        </Link>
        {cities.filter((c) => c.country === country).map((c) => (
          <Link key={c.slug} href={`/${country}/${c.slug}`} className="block rounded-md p-2 text-sm hover:bg-accent">
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileNav({ menuItems, onNavigate, phone }: { menuItems: MenuLink[]; onNavigate: () => void; phone: string }) {
  return (
    <nav className="mt-4 flex flex-col gap-1 px-2">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.url}
          onClick={onNavigate}
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {item.label}
        </Link>
      ))}
      <div className="mt-4 flex flex-col gap-2">
        <Button asChild className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Link href="/contact" onClick={onNavigate}>Get a Free Quote</Link>
        </Button>
        <Button asChild variant="outline">
          <a href={`tel:${phone.replace(/\s/g, "")}`}>
            <Phone className="mr-2 h-4 w-4" /> {phone}
          </a>
        </Button>
      </div>
    </nav>
  );
}
