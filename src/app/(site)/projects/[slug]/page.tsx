import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Calendar, Ruler, CheckCircle2, Wrench, Layers } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  services,
  industries,
  cities,
  countries,
} from "@/lib/gulf-data";
import { allProjects, allCaseStudies } from "@/lib/gulf-content-merged";
import { buildSeoMetadata, breadcrumbSchema, projectSchema } from "@/lib/seo";
import { db } from "@/lib/db";

export const revalidate = 300;

export async function generateStaticParams() {
  // Include both seed and DB projects for SSG
  let dbSlugs: { slug: string }[] = [];
  try {
    dbSlugs = await db.projectRecord.findMany({ where: { status: "published" }, select: { slug: true } });
  } catch {}
  const allSlugs = new Set([...allProjects.map((p) => p.slug), ...dbSlugs.map((p) => p.slug)]);
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = allProjects.find((x) => x.slug === slug);
  if (!p) return { title: "Not Found", robots: { index: false, follow: false } };
  return await buildSeoMetadata({
    path: `/projects/${p.slug}`,
    defaults: { title: `${p.title} | Case Study`, description: p.challenge.slice(0, 160) },
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Try DB first, fall back to seed
  let p = allProjects.find((x) => x.slug === slug);
  try {
    const dbProject = await db.projectRecord.findUnique({ where: { slug } });
    if (dbProject && dbProject.status === "published") {
      p = {
        slug: dbProject.slug, title: dbProject.title,
        country: dbProject.country as any, city: dbProject.city || "",
        service: dbProject.service || "", industry: dbProject.industry || "",
        client: dbProject.client || "", year: dbProject.year || new Date().getFullYear(),
        duration: dbProject.duration || "", challenge: dbProject.challenge || "",
        solution: dbProject.solution || "", execution: dbProject.execution || "",
        materials: dbProject.materials ? JSON.parse(dbProject.materials) : [],
        equipment: dbProject.equipment ? JSON.parse(dbProject.equipment) : [],
        results: dbProject.results ? JSON.parse(dbProject.results) : [],
        gallery: [], location: dbProject.location || "", area: dbProject.area || "",
      } as typeof p;
    }
  } catch {}
  if (!p) notFound();

  const path = `/projects/${p.slug}`;
  const service = services.find((s) => s.slug === p.service);
  const industry = industries.find((i) => i.slug === p.industry);
  const city = cities.find((c) => c.slug === p.city);
  const country = countries.find((c) => c.slug === p.country);
  const caseStudy = allCaseStudies.find((cs) => cs.projectSlug === p.slug);

  return (
    <>
      <JsonLd
        data={[
          projectSchema(p, path),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Projects", url: "/projects" },
            { name: p.title, url: path },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${country?.flag} ${city?.name} · ${service?.name}`}
        title={p.title}
        description={p.challenge}
        crumbs={[
          { name: "Projects", url: "/projects" },
          { name: p.title, url: path },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge className="bg-amber-brand text-amber-foreground hover:bg-amber-brand">
            {p.year}
          </Badge>
          <span className="flex items-center gap-1 text-primary-foreground/70">
            <MapPin className="h-4 w-4" />
            {p.location}
          </span>
          <span className="flex items-center gap-1 text-primary-foreground/70">
            <Calendar className="h-4 w-4" />
            {p.duration}
          </span>
          <span className="flex items-center gap-1 text-primary-foreground/70">
            <Ruler className="h-4 w-4" />
            {p.area}
          </span>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Challenge */}
              <div>
                <h2 className="text-2xl font-bold">The Challenge</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.challenge}</p>
              </div>

              {/* Solution */}
              <div>
                <h2 className="text-2xl font-bold">Our Solution</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.solution}</p>
              </div>

              {/* Execution */}
              <div>
                <h2 className="text-2xl font-bold">Execution</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.execution}</p>
              </div>

              {/* Gallery (visual placeholders) */}
              <div>
                <h2 className="text-2xl font-bold">Project Gallery</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {p.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground"
                    >
                      <div className="absolute inset-0 road-stripe-h opacity-20" />
                      <div className="relative text-center">
                        <Layers className="mx-auto h-8 w-8 text-amber-brand" />
                        <p className="mt-2 text-xs text-primary-foreground/70">{img.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {caseStudy?.testimonial && (
                <div className="rounded-xl border border-border bg-secondary/50 p-6">
                  <p className="text-lg italic text-foreground">
                    &ldquo;{caseStudy.testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-3 text-sm text-muted-foreground">
                    — {caseStudy.testimonial.author}, {caseStudy.testimonial.role}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Results */}
              <Card className="p-5">
                <h3 className="mb-3 font-semibold">Project Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  {p.results.map((r) => (
                    <div key={r.label} className="rounded-lg bg-accent p-3 text-center">
                      <div className="text-xl font-bold text-amber-brand">{r.value}</div>
                      <div className="text-[10px] text-muted-foreground">{r.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Materials & equipment */}
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
                  <Wrench className="h-4 w-4 text-amber-brand" />
                  Materials & Equipment
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Materials
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {p.materials.map((m) => (
                        <span key={m} className="rounded bg-accent px-2 py-0.5 text-[11px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Equipment
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {p.equipment.map((e) => (
                        <span key={e} className="rounded bg-accent px-2 py-0.5 text-[11px]">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Project meta */}
              <Card className="p-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{p.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <Link href={`/services/${service?.slug}`} className="font-medium text-amber-brand hover:underline">
                    {service?.name}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <Link href={`/industries/${industry?.slug}`} className="font-medium text-amber-brand hover:underline">
                    {industry?.name}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <Link href={`/${country?.slug}/${city?.slug}`} className="font-medium text-amber-brand hover:underline">
                    {city?.name}
                  </Link>
                </div>
              </Card>

              <div className="rounded-xl bg-primary p-5 text-primary-foreground">
                <h3 className="font-bold">Need similar work?</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Get a free quote for your marking project.
                </p>
                <Button
                  asChild
                  className="mt-3 w-full bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
                >
                  <Link href="/contact">Request Quote</Link>
                </Button>
              </div>
            </aside>
          </div>

          {/* Related projects */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Related projects</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProjects
                .filter((x) => x.slug !== p.slug && (x.service === p.service || x.city === p.city))
                .slice(0, 3)
                .map((rp) => (
                  <Link key={rp.slug} href={`/projects/${rp.slug}`} className="group">
                    <Card className="h-full p-4 transition-all hover:border-amber-brand hover:shadow-md">
                      <h3 className="font-semibold text-sm group-hover:text-amber-brand">{rp.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{rp.challenge}</p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-brand">
                        View <ArrowRight className="h-3 w-3" />
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <LeadCtaSection defaultService={p.service} defaultCountry={p.country} defaultCity={p.city} source={`project-page-${p.slug}`} />
    </>
  );
}
