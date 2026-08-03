"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { services, cities, company } from "@/lib/gulf-data";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-primary">
            <div className="absolute inset-0 road-stripe-h opacity-90" />
            <span className="relative font-bold text-sm text-primary-foreground">GS</span>
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-foreground">Gulf Seismic</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Road & Industrial Marking
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* Services dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="block rounded-md p-3 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium text-sm text-foreground">{s.name}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">
                        {s.tagline}
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* UAE dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <span className="mr-1">🇦🇪</span> UAE
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[480px] gap-1 p-4 md:grid-cols-2">
                  <Link
                    href="/uae"
                    className="col-span-2 mb-1 block rounded-md bg-accent p-2 text-sm font-medium"
                  >
                    All UAE Cities →
                  </Link>
                  {cities
                    .filter((c) => c.country === "uae")
                    .map((c) => (
                      <Link
                        key={c.slug}
                        href={`/uae/${c.slug}`}
                        className="block rounded-md p-2 text-sm hover:bg-accent"
                      >
                        {c.name}
                      </Link>
                    ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Saudi dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <span className="mr-1">🇸🇦</span> Saudi Arabia
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[480px] gap-1 p-4 md:grid-cols-2">
                  <Link
                    href="/saudi-arabia"
                    className="col-span-2 mb-1 block rounded-md bg-accent p-2 text-sm font-medium"
                  >
                    All Saudi Cities →
                  </Link>
                  {cities
                    .filter((c) => c.country === "saudi-arabia")
                    .map((c) => (
                      <Link
                        key={c.slug}
                        href={`/saudi-arabia/${c.slug}`}
                        className="block rounded-md p-2 text-sm hover:bg-accent"
                      >
                        {c.name}
                      </Link>
                    ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/projects" className={navigationMenuTriggerStyle()}>
                  Projects
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/industries" className={navigationMenuTriggerStyle()}>
                  Industries
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
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
                <SheetTitle className="text-left">Gulf Seismic</SheetTitle>
              </SheetHeader>
              <MobileNav onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("services");
  return (
    <nav className="mt-4 flex flex-col gap-1 px-2">
      <MobileGroup
        label="Services"
        open={expanded === "services"}
        onToggle={() => setExpanded(expanded === "services" ? null : "services")}
        items={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))}
        onNavigate={onNavigate}
      />
      <MobileGroup
        label="🇦🇪 UAE Cities"
        open={expanded === "uae"}
        onToggle={() => setExpanded(expanded === "uae" ? null : "uae")}
        items={[
          { label: "All UAE", href: "/uae" },
          ...cities
            .filter((c) => c.country === "uae")
            .map((c) => ({ label: c.name, href: `/uae/${c.slug}` })),
        ]}
        onNavigate={onNavigate}
      />
      <MobileGroup
        label="🇸🇦 Saudi Cities"
        open={expanded === "saudi"}
        onToggle={() => setExpanded(expanded === "saudi" ? null : "saudi")}
        items={[
          { label: "All Saudi Arabia", href: "/saudi-arabia" },
          ...cities
            .filter((c) => c.country === "saudi-arabia")
            .map((c) => ({ label: c.name, href: `/saudi-arabia/${c.slug}` })),
        ]}
        onNavigate={onNavigate}
      />
      {[
        { label: "Projects", href: "/projects" },
        { label: "Industries", href: "/industries" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {item.label}
        </Link>
      ))}
      <div className="mt-4 flex flex-col gap-2">
        <Button asChild className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Link href="/contact" onClick={onNavigate}>
            Get a Free Quote
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
            <Phone className="mr-2 h-4 w-4" /> {company.phone}
          </a>
        </Button>
      </div>
    </nav>
  );
}

function MobileGroup({
  label,
  open,
  onToggle,
  items,
  onNavigate,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  items: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-border/40 pb-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 pb-2 pl-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
