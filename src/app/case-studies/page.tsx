import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/gulf/json-ld";
import { getProject } from "@/lib/gulf-data";
import { allCaseStudies } from "@/lib/gulf-content-merged";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies | Marking Project Results & Client Testimonials",
  description:
    "Real outcomes from Gulf Seismic marking projects — capacity gains, zero-downtime delivery, night-shift highway marking and more, in our clients' words.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Case Studies", url: "/case-studies" },
        ])}
      />
      <PageHero
        eyebrow="Case Studies"
        title="Proven outcomes, in our clients' words"
        description="Browse our case studies to see the measurable results we deliver — from capacity gains to zero-downtime operations and R3 reflectivity."
        crumbs={[{ name: "Case Studies", url: "/case-studies" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allCaseStudies.map((cs) => {
              const project = getProject(cs.projectSlug);
              return (
                <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col p-6 transition-all hover:border-amber-brand hover:shadow-lg">
                    <Quote className="h-8 w-8 text-amber-brand/40" />
                    <h3 className="mt-3 font-semibold leading-tight group-hover:text-amber-brand">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{cs.summary}</p>
                    {cs.testimonial && (
                      <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-3">
                        <p className="text-xs italic">&ldquo;{cs.testimonial.quote}&rdquo;</p>
                      </div>
                    )}
                    <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-amber-brand">
                      Read case study <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
