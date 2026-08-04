import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Hero } from "@/components/gulf/hero";
import { ServicesGrid } from "@/components/gulf/services-grid";
import { AuthorityGraph } from "@/components/gulf/authority-graph";
import { CitiesSection } from "@/components/gulf/cities-section";
import { ProjectsShowcase } from "@/components/gulf/projects-showcase";
import { IndustriesGrid } from "@/components/gulf/industries-grid";
import { ProcessSection } from "@/components/gulf/process-section";
import { CaseStudiesSection } from "@/components/gulf/case-studies-section";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { TrustScroll } from "@/components/gulf/trust-scroll";
import { Button } from "@/components/ui/button";
import { company, services } from "@/lib/gulf-data";
import { getSiteSettings, getHero } from "@/lib/cms";

export default async function Home() {
  const [settings, hero] = await Promise.all([
    getSiteSettings(),
    getHero("home"),
  ]);

  return (
    <>
      <Hero hero={hero} settings={settings} />

      {/* Trust strip — infinite right-to-left scroll */}
      <TrustScroll />

      <ServicesGrid />

      <AuthorityGraph />

      <CitiesSection />

      <ProcessSection />

      <ProjectsShowcase />

      <IndustriesGrid />

      <CaseStudiesSection />

      <LeadCtaSection />

      {/* Final CTA band */}
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl">
            Ready to mark your next project to Gulf-spec quality?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/70">
            Talk to a Gulf Seismic specialist today. We respond within 1 business hour.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
            >
              <Link href="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/services/road-marking">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
