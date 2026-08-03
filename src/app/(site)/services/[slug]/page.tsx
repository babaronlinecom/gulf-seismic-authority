import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Wrench, Clock } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { FaqSection } from "@/components/gulf/faq-section";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  services,
  industries,
  cities,
  countries,
  getProjectsByService,
} from "@/lib/gulf-data";
import { DynamicIcon } from "@/components/gulf/dynamic-icon";
import {
  buildMetadata,
  organizationSchema,
  breadcrumbSchema,
  serviceSchema,
  faqSchema,
} from "@/lib/seo";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: s.seoTitle,
    description: s.seoDescription,
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  const path = `/services/${s.slug}`;
  const serviceIndustries = industries.filter((i) => s.industriesServed.includes(i.slug));
  const serviceProjects = getProjectsByService(s.slug);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema(s, path),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services/road-marking" },
            { name: s.name, url: path },
          ]),
          faqSchema(s.faqs),
        ]}
      />
      <PageHero
        eyebrow="Service"
        title={s.heroHeading}
        description={s.heroDescription}
        crumbs={[{ name: "Services", url: "/services/road-marking" }, { name: s.name, url: path }]}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-brand text-amber-foreground">
            <DynamicIcon name={s.icon} className="h-6 w-6" />
          </div>
          <span className="text-primary-foreground/70">{s.tagline}</span>
        </div>
      </PageHero>

      {/* Body + sidebar */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold">Overview</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.longDescription}</p>

              {/* Benefits */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold">Key benefits</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {s.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2 rounded-lg border border-border bg-card p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                      <span className="text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold">Our delivery process</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {s.process.map((step) => (
                    <div key={step.step} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-brand text-xs font-bold text-amber-foreground">
                          {step.step}
                        </span>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries served */}
              {serviceIndustries.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold">Industries we serve</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {serviceIndustries.map((ind) => {
                      return (
                        <Link key={ind.slug} href={`/industries/${ind.slug}`} className="group">
                          <Card className="flex h-full items-start gap-3 p-4 transition-all hover:border-amber-brand hover:shadow-md">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                              <DynamicIcon name={ind.icon} className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold group-hover:text-amber-brand">
                                {ind.name}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {ind.description}
                              </p>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects */}
              {serviceProjects.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold">Recent {s.name.toLowerCase()} projects</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {serviceProjects.map((p) => {
                      const city = cities.find((c) => c.slug === p.city);
                      return (
                        <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                          <Card className="h-full p-4 transition-all hover:border-amber-brand hover:shadow-md">
                            <h3 className="font-semibold text-sm group-hover:text-amber-brand">
                              {p.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{city?.name}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {p.duration}
                              </span>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
                  <Wrench className="h-4 w-4 text-amber-brand" />
                  Technical Specs
                </h3>
                <div className="space-y-2">
                  {s.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="mb-3 font-semibold text-sm">Materials & Equipment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Materials
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {s.materials.map((m) => (
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
                      {s.equipment.map((e) => (
                        <span key={e} className="rounded bg-accent px-2 py-0.5 text-[11px]">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="rounded-xl bg-primary p-5 text-primary-foreground">
                <h3 className="font-bold">Get a {s.name} quote</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Available in 16 cities across UAE &amp; Saudi Arabia.
                </p>
                <Button
                  asChild
                  className="mt-3 w-full bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
                >
                  <Link href="/contact">Request Quote</Link>
                </Button>
              </div>

              {/* Find by city */}
              <Card className="p-5">
                <h3 className="mb-3 font-semibold text-sm">Find {s.name} by city</h3>
                <div className="grid grid-cols-2 gap-1">
                  {countries.map((c) => (
                    <div key={c.slug}>
                      <div className="mb-1 text-xs font-medium text-muted-foreground">
                        {c.flag} {c.shortName}
                      </div>
                      {cities
                        .filter((ct) => ct.country === c.slug)
                        .slice(0, 4)
                        .map((ct) => (
                          <Link
                            key={ct.slug}
                            href={`/${c.slug}/${ct.slug}/${s.slug}`}
                            className="block py-0.5 text-xs text-muted-foreground hover:text-amber-brand"
                          >
                            {ct.name}
                          </Link>
                        ))}
                    </div>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <FaqSection faqs={s.faqs} />
      <LeadCtaSection defaultService={s.slug} source={`service-page-${s.slug}`} />
    </>
  );
}
