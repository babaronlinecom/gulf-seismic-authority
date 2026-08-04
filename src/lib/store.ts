"use client";

import { create } from "zustand";

export type ViewId =
  | "home"
  | "services"
  | "industries"
  | "projects"
  | "case-studies"
  | "resources"
  | "saudi-presence"
  | "saudi-mobilization"
  | "gcc"
  | "about"
  | "contact";

export type Lang = "en" | "ar";
export type Theme = "light" | "dark";

interface SiteState {
  view: ViewId;
  lang: Lang;
  theme: Theme;
  serviceSlug: string | null; // when navigating into a specific service detail
  caseSlug: string | null;
  resourceSlug: string | null;
  setView: (v: ViewId) => void;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
  openService: (slug: string) => void;
  openCase: (slug: string) => void;
  openResource: (slug: string) => void;
  resetDetail: () => void;
}

export const useSite = create<SiteState>((set, get) => ({
  view: "home",
  lang: "en",
  theme:
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  serviceSlug: null,
  caseSlug: null,
  resourceSlug: null,
  setView: (v) => {
    set({ view: v, serviceSlug: null, caseSlug: null, resourceSlug: null });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      const hash = v === "home" ? "#/" : `#/${v}`;
      history.replaceState(null, "", hash);
    }
  },
  setLang: (l) => {
    set({ lang: l });
    if (typeof window !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  },
  setTheme: (t) => {
    set({ theme: t });
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", t === "dark");
      try {
        localStorage.setItem("gs-theme", t);
      } catch {}
    }
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  toggleLang: () => get().setLang(get().lang === "en" ? "ar" : "en"),
  openService: (slug) => {
    set({ view: "services", serviceSlug: slug, caseSlug: null, resourceSlug: null });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  },
  openCase: (slug) => {
    set({ view: "case-studies", caseSlug: slug, serviceSlug: null, resourceSlug: null });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  },
  openResource: (slug) => {
    set({ view: "resources", resourceSlug: slug, serviceSlug: null, caseSlug: null });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  },
  resetDetail: () => set({ serviceSlug: null, caseSlug: null, resourceSlug: null }),
}));

/** Apply persisted theme/lang on first client mount. */
export function hydrateSite() {
  if (typeof window === "undefined") return;
  try {
    const t = localStorage.getItem("gs-theme") as Theme | null;
    if (t) useSite.getState().setTheme(t);
    else useSite.getState().setTheme(useSite.getState().theme);
  } catch {}
  // Read initial view from hash
  const h = window.location.hash.replace(/^#\/?/, "");
  const valid: ViewId[] = [
    "home", "services", "industries", "projects", "case-studies",
    "resources", "saudi-presence", "saudi-mobilization", "gcc", "about", "contact",
  ];
  if ((valid as string[]).includes(h)) useSite.setState({ view: h as ViewId });
}
