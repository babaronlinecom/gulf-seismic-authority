import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Quote, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/gulf/json-ld";
import { getProject, cities, countries, type Project } from "@/lib/gulf-data";
import { allCaseStudies, allProjects } from "@/lib/gulf-content-merged";
import { buildMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";

export async function generateStaticParams() {
  return allCaseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = allCaseStudies.find((x) => x.slug === slug);
  if (!cs) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: `${cs.title} | Case Study`,
    description: cs.summary,
    path: `/case-studies/${cs.slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = allCaseStudies.find((x) => x.slug === slug);
  if (!cs) notFound();

  const path = `/case-studies/${cs.slug}`;
  const project = getProject(cs.projectSlug) ?? allProjects.find((p) => p.slug === cs.projectSlug);
  const city = project ? cities.find((c) => c.slug === project.city) : null;
  const country = project ? countries.find((c) => c.slug === project.country) : null;

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: cs.slug,
            title: cs.title,
            excerpt: cs.summary,
            date: "2024-06-01",
            author: "Gulf Seismic",
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Case Studies", url: "/case-studies" },
            { name: cs.title, url: path },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Case Study"
        title={cs.title}
        description={cs.summary}
        crumbs={[
          { name: "Case Studies", url: "/case-studies" },
          { name: cs.title, url: path },
        ]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {project && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{country?.flag} {city?.name}</span>
              <span>·</span>
              <span>{project.duration}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>
          )}

          {/* Outcomes */}
          <div>
            <h2 className="text-2xl font-bold">Outcomes</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cs.outcomes.map((o) => (
                <div key={o} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                  <span className="text-sm">{o}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {cs.testimonial && (
            <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-8">
              <Quote className="h-10 w-10 text-amber-brand/40" />
              <p className="mt-4 text-xl italic text-foreground leading-relaxed">
                {cs.testimonial.quote}
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                — <span className="font-semibold text-foreground">{cs.testimonial.author}</span>,{" "}
                {cs.testimonial.role}
              </div>
            </div>
          )}

          {/* Link to project */}
          {project && (
            <div className="mt-10">
              <Card className="p-6">
                <h3 className="font-bold">View the full project</h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.title}</p>
                <Button asChild className="mt-4 bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                  <Link href={`/projects/${project.slug}`}>
                    View Project Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          )}
        </div>
      </section>

      <LeadCtaSection source={`case-study-${cs.slug}`} />
    </>
  );
}
