import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Phone, MapPin, Clock, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { FaqSection } from "@/components/gulf/faq-section";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  countries,
  cities,
  services,
  getCitiesByCountry,
  getProjectsByCity,
  type CountrySlug,
} from "@/lib/gulf-data";
import { allProjects } from "@/lib/gulf-content-merged";
import { DynamicIcon } from "@/components/gulf/dynamic-icon";
import {
  generateCityServiceIntro,
  generateCityServiceBody,
  generateCityServiceFaqs,
  generateCityServiceMeta,
} from "@/lib/programmatic-content";
import {
  buildSeoMetadata,
  organizationSchema,
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
  getDbFaqs,
} from "@/lib/seo";
import { aeoBundle } from "@/lib/aeo-geo";
import { LocalBusinessSignals } from "@/components/gulf/local-business-signals";

const COUNTRIES: CountrySlug[] = ["uae", "saudi-arabia"];

export async function generateStaticParams() {
  const params: { country: string; city: string; service: string }[] = [];
  for (const c of COUNTRIES) {
    for (const city of getCitiesByCountry(c)) {
      for (const s of services) {
        params.push({ country: c, city: city.slug, service: s.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string; service: string }>;
}): Promise<Metadata> {
  const { country, city, service } = await params;
  const c = countries.find((x) => x.slug === country);
  const ct = cities.find((x) => x.slug === city && x.country === country);
  const s = services.find((x) => x.slug === service);
  if (!c || !ct || !s)
    return { title: "Not Found", robots: { index: false, follow: false } };
  const meta = generateCityServiceMeta(ct, s);
  return await buildSeoMetadata({
    path: `/${c.slug}/${ct.slug}/${s.slug}`,
    defaults: { title: meta.title, description: meta.description },
  });
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<{ country: string; city: string; service: string }>;
}) {
  const { country, city, service } = await params;
  const c = countries.find((x) => x.slug === country);
  const ct = cities.find((x) => x.slug === city && x.country === country);
  const s = services.find((x) => x.slug === service);
  if (!c || !ct || !s) notFound();

  const path = `/${c.slug}/${ct.slug}/${s.slug}`;
  const intro = generateCityServiceIntro(ct, s, c);
  const body = generateCityServiceBody(ct, s, c);
  const faqs = [...generateCityServiceFaqs(ct, s, c), ...await getDbFaqs(path)];
  // Use merged projects (50 total) — city projects for this service
  const cityProjects = allProjects
    .filter((p) => p.city === ct.slug && p.service === s.slug)
    .slice(0, 4);

  // Related services in this city (internal linking)
  const relatedServices = services.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: c.name, url: `/${c.slug}` },
            { name: ct.name, url: `/${c.slug}/${ct.slug}` },
            { name: s.name, url: path },
          ]),
          ...aeoBundle({ country: c, city: ct, service: s, faqs, path }),
        ]}
      />
      <PageHero
        eyebrow={`${c.flag} ${ct.name} · ${s.name}`}
        title={`${s.name} in ${ct.name}`}
        description={intro}
        crumbs={[
          { name: c.name, url: `/${c.slug}` },
          { name: ct.name, url: `/${c.slug}/${ct.slug}` },
          { name: s.name, url: path },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
          >
            <Link href="/contact">Get a {ct.name} Quote</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" />
              {c.phone}
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Body + sidebar */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="prose prose-sm max-w-none">
                {body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold">
                  Benefits of {s.name.toLowerCase()} in {ct.name}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {s.benefits.map((b) => (
                    <div
                      key={b}
                      className="flex items-start gap-2 rounded-lg border border-border bg-card p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                      <span className="text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="mt-10">
                <h2 className="text-2xl font-bold">Our {s.name} process in {ct.name}</h2>
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

              {/* City projects for this service */}
              {cityProjects.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold">
                    {s.name} projects delivered in {ct.name}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {cityProjects.map((p) => (
                      <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                        <Card className="p-4 transition-all hover:border-amber-brand hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm group-hover:text-amber-brand">
                              {p.title}
                            </h3>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {p.challenge}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {p.duration}
                            </span>
                            <span>{p.year}</span>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Service card */}
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <DynamicIcon name={s.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{ct.name}, {c.shortName}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {s.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
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
                      {s.materials.map((m) => (
                        <span
                          key={m}
                          className="rounded bg-accent px-2 py-0.5 text-[11px] text-accent-foreground"
                        >
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
                        <span
                          key={e}
                          className="rounded bg-accent px-2 py-0.5 text-[11px] text-accent-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location */}
              <Card className="p-5">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-sm">
                  <MapPin className="h-4 w-4 text-amber-brand" />
                  Serving {ct.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {ct.region}, {c.name}. Population {ct.population}. Located at {ct.latitude}°N,{" "}
                  {ct.longitude}°E.
                </p>
              </Card>

              {/* Local business signals — NAP, map embed, GBP */}
              <LocalBusinessSignals country={c} city={ct} />

              {/* CTA */}
              <div className="rounded-xl bg-primary p-5 text-primary-foreground">
                <h3 className="font-bold">Need {s.name} in {ct.name}?</h3>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Get a free quote from local marking specialists.
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
        </div>
      </section>

      {/* Related services (internal linking) */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-2xl font-bold">
            Other marking services in {ct.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((rs) => {
              return (
                <Link
                  key={rs.slug}
                  href={`/${c.slug}/${ct.slug}/${rs.slug}`}
                  className="group"
                >
                  <Card className="h-full p-4 transition-all hover:border-amber-brand hover:shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <DynamicIcon name={rs.icon} className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold">{rs.name}</h3>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {rs.shortDescription}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} title={`${s.name} in ${ct.name} — FAQ`} />

      <LeadCtaSection
        defaultCountry={c.slug}
        defaultCity={ct.slug}
        defaultService={s.slug}
        source={`city-service-${ct.slug}-${s.slug}`}
      />
    </>
  );
}
