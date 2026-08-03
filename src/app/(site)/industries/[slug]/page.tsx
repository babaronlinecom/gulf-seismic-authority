import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  industries,
  services,
  projects,
  getServicesByIndustry,
} from "@/lib/gulf-data";
import { DynamicIcon } from "@/components/gulf/dynamic-icon";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  if (!i) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: `${i.name} Marking Solutions | Sector Specialists`,
    description: i.description,
    path: `/industries/${i.slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  if (!i) notFound();

  const path = `/industries/${i.slug}`;
  const industryServices = getServicesByIndustry(i.slug);
  const industryProjects = projects.filter((p) => p.industry === i.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
          { name: i.name, url: path },
        ])}
      />
      <PageHero
        eyebrow="Industry"
        title={`${i.name} marking solutions`}
        description={i.description}
        crumbs={[
          { name: "Industries", url: "/industries" },
          { name: i.name, url: path },
        ]}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-brand text-amber-foreground">
          <DynamicIcon name={i.icon} className="h-7 w-7" />
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Challenges */}
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <AlertTriangle className="h-6 w-6 text-amber-brand" />
                Industry challenges
              </h2>
              <div className="mt-4 space-y-3">
                {i.challenges.map((c) => (
                  <div key={c} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                    <span className="text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <CheckCircle2 className="h-6 w-6 text-amber-brand" />
                Our solutions
              </h2>
              <div className="mt-4 space-y-3">
                {i.solutions.map((s) => (
                  <div key={s} className="flex items-start gap-2 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services for this industry */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Services for {i.name.toLowerCase()}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industryServices.map((s) => {
                return (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="group">
                    <Card className="h-full p-5 transition-all hover:border-amber-brand hover:shadow-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <DynamicIcon name={s.icon} className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 font-semibold text-sm">{s.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {s.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-brand">
                        Learn more <ArrowRight className="h-3 w-3" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Projects */}
          {industryProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold">{i.name} projects</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {industryProjects.map((p) => (
                  <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                    <Card className="h-full p-4 transition-all hover:border-amber-brand hover:shadow-md">
                      <h3 className="font-semibold text-sm group-hover:text-amber-brand">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.challenge}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <LeadCtaSection source={`industry-page-${i.slug}`} />
    </>
  );
}
