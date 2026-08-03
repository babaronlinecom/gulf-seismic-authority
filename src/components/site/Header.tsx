"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Menu, X, Sun, Moon, Languages, ChevronDown, Phone, MessageCircle,
} from "lucide-react";
import { useSite, hydrateSite, type ViewId } from "@/lib/store";
import { useContent } from "./shared";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useContent();
  const { view, lang, theme, setView, toggleTheme, toggleLang, openService } = useSite();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    hydrateSite();
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = t.nav;

  const go = (v: ViewId) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-border supports-[backdrop-filter]:bg-background/70"
          : "bg-background border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => go("home")}
            className="flex items-center gap-2.5 shrink-0"
            aria-label={t.brand.name}
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-foreground">
              <span className="absolute inset-x-1.5 top-2 h-0.5 rounded-full bg-brand" />
              <span className="absolute inset-x-1.5 top-4 h-0.5 rounded-full bg-background/80" />
              <span className="absolute inset-x-3 top-6 h-0.5 rounded-full bg-brand/70" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">{t.brand.name}</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-muted-foreground">
                Road Marking • Saudi & GCC
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const hasSub = item.id === "services" || item.id === "saudi-presence";
              const active = view === item.id;
              if (item.id === "services") {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition",
                          active ? "text-brand" : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>{t.servicesHub.h1}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => go("services")} className="cursor-pointer font-medium">
                        <span className="flex-1">{t.servicesHub.h1}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {t.services.map((s) => (
                        <DropdownMenuItem
                          key={s.slug}
                          onClick={() => openService(s.slug)}
                          className="cursor-pointer"
                        >
                          <span className="flex-1">{s.navLabel}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              if (item.id === "saudi-presence") {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition",
                          active || view === "saudi-mobilization" ? "text-brand" : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuItem onClick={() => go("saudi-presence")} className="cursor-pointer">
                        {t.saudiPresence.h1.split("—")[0].trim()}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => go("saudi-mobilization")} className="cursor-pointer">
                        {t.saudiMobilization.h1}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => go("gcc")} className="cursor-pointer">
                        {t.gcc.h1}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id as ViewId)}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition",
                    active ? "text-brand" : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleLang}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-semibold transition hover:bg-secondary"
              aria-label="Toggle language"
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "AR" : "EN"}
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border transition hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              size="sm"
              onClick={() => go("contact")}
              className="hidden sm:inline-flex amber-glow bg-brand text-brand-foreground hover:brightness-105"
            >
              {t.cta.rfq}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side={lang === "ar" ? "right" : "left"} className="w-[300px] sm:w-[340px] overflow-y-auto scroll-area">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-foreground">
                      <span className="absolute inset-x-1.5 top-1.5 h-0.5 rounded-full bg-brand" />
                      <span className="absolute inset-x-1.5 top-3.5 h-0.5 rounded-full bg-background/80" />
                      <span className="absolute inset-x-3 top-5.5 h-0.5 rounded-full bg-brand/70" />
                    </span>
                    {t.brand.name}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => go(item.id as ViewId)}
                      className={cn(
                        "block w-full rounded-md px-3 py-2 text-start text-sm font-medium transition",
                        view === item.id ? "bg-brand/15 text-brand" : "hover:bg-secondary"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="my-3 h-px bg-border" />
                  <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.servicesHub.h1}
                  </div>
                  {t.services.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => { openService(s.slug); setMobileOpen(false); }}
                      className="block w-full rounded-md px-3 py-2 text-start text-sm text-foreground/80 transition hover:bg-secondary"
                    >
                      {s.navLabel}
                    </button>
                  ))}
                  <div className="my-3 h-px bg-border" />
                  <button
                    onClick={() => go("saudi-mobilization")}
                    className="block w-full rounded-md px-3 py-2 text-start text-sm text-foreground/80 transition hover:bg-secondary"
                  >
                    {t.saudiMobilization.h1}
                  </button>
                  <div className="mt-4 grid gap-2">
                    <Button onClick={() => go("contact")} className="amber-glow bg-brand text-brand-foreground hover:brightness-105 w-full">
                      {t.cta.rfq}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => go("contact")}>
                        <Phone className="h-3.5 w-3.5" /> {t.cta.phone}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => go("contact")}>
                        <MessageCircle className="h-3.5 w-3.5" /> {t.cta.whatsapp.split(" ")[0]}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
