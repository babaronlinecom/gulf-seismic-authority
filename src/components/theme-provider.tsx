"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const apply = (t: string) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    };
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("gs-theme");
    } catch {}
    const initial =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      let s: string | null = null;
      try {
        s = localStorage.getItem("gs-theme");
      } catch {}
      if (!s) apply(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <>{children}</>;
}
