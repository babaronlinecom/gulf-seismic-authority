"use client";

import * as React from "react";
import { useSite } from "@/lib/store";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HomeView } from "./views/HomeView";
import { ServicesView } from "./views/ServicesView";
import { IndustriesView } from "./views/IndustriesView";
import { ProjectsView } from "./views/ProjectsView";
import { CaseStudiesView } from "./views/CaseStudiesView";
import { ResourcesView } from "./views/ResourcesView";
import { SaudiPresenceView } from "./views/SaudiPresenceView";
import { SaudiMobilizationView } from "./views/SaudiMobilizationView";
import { GccView } from "./views/GccView";
import { AboutView } from "./views/AboutView";
import { ContactRfqView } from "./views/ContactRfqView";

export function SiteShell() {
  const { view, lang, theme } = useSite();

  // Apply lang dir + theme class on mount and whenever they change.
  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <React.Suspense fallback={<div className="h-64" />}>
          {view === "home" && <HomeView />}
          {view === "services" && <ServicesView />}
          {view === "industries" && <IndustriesView />}
          {view === "projects" && <ProjectsView />}
          {view === "case-studies" && <CaseStudiesView />}
          {view === "resources" && <ResourcesView />}
          {view === "saudi-presence" && <SaudiPresenceView />}
          {view === "saudi-mobilization" && <SaudiMobilizationView />}
          {view === "gcc" && <GccView />}
          {view === "about" && <AboutView />}
          {view === "contact" && <ContactRfqView />}
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
