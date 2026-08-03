import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone, CheckCircle2, Ruler } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
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
import { DynamicIcon } from "@/components/gulf/dynamic-icon";
import {
  buildMetadata,
  organizationSchema,
  breadcrumbSchema,
  localBusinessSchema,
} from "@/lib/seo";

const COUNTRIES: CountrySlug[] = ["uae", "saudi-arabia"];

export async function generateStaticParams() {
  const params: { country: string; city: string }[] = [];
  for (const c of COUNTRIES) {
    for (const city of getCitiesByCountry(c)) {
      params.push({ country: c, city: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}): Promise<Metadata> {
  const { country, city } = await params;
  const c = countries.find((x) => x.slug === country);
  const ct = cities.find((x) => x.slug === city && x.country === country);
  if (!c || !ct) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: ct.seoTitle,
    description: ct.seoDescription,
    path: `/${c.slug}/${ct.slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country, city } = await params;
  const c = countries.find((x) => x.slug === country);
  const ct = cities.find((x) => x.slug === city && x.country === country);
  if (!c || !ct) notFound();

  const path = `/${c.slug}/${ct.slug}`;
  const cityProjects = getProjectsByCity(ct.slug);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(c, ct, path),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: c.name, url: `/${c.slug}` },
            { name: ct.name, url: path },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${c.flag} ${ct.region}`}
        title={ct.heroHeading}
        description={ct.heroDescription}
        crumbs={[
          { name: c.name, url: `/${c.slug}` },
          { name: ct.name, url: path },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
          >
            <Link href="/contact">Get a Quote in {ct.name}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call {c.shortName} Team
            </a>
          </Button>
        </div>
      </PageHero>

      {/* City stats */}
      <section className="border-b border-border bg-background py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-brand">{ct.population}</div>
            <div className="text-xs text-muted-foreground">Population</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-brand">{services.length}</div>
            <div className="text-xs text-muted-foreground">Services available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-brand">{cityProjects.length}+</div>
            <div className="text-xs text-muted-foreground">Delivered projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-brand">10+</div>
            <div className="text-xs text-muted-foreground">Years in {c.shortName}</div>
          </div>
        </div>
      </section>

      {/* Services in this city */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Marking services in {ct.name}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each service below links to a dedicated {ct.name} page with local context, specs and
              a quote form.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              return (
                <Link
                  key={s.slug}
                  href={`/${c.slug}/${ct.slug}/${s.slug}`}
                  className="group"
                >
                  <Card className="h-full p-5 transition-all hover:border-amber-brand hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <DynamicIcon name={s.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold text-sm">{s.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {s.shortDescription}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-brand">
                      {ct.name} page
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* City highlights */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Marking expertise built for {ct.name}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {ct.name} presents unique marking challenges — from local climate to traffic
                patterns and regulatory requirements. Gulf Seismic has the local knowledge to
                deliver durable results.
              </p>
              <ul className="mt-6 space-y-3">
                {ct.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                    <span>{h}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                  <span>
                    Located at {ct.latitude}°N, {ct.longitude}°E — {ct.region}
                  </span>
                </li>
              </ul>
            </div>
            {cityProjects.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Recent projects in {ct.name}</h3>
                {cityProjects.map((p) => (
                  <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                    <Card className="p-4 transition-all hover:border-amber-brand hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm group-hover:text-amber-brand">
                          {p.title}
                        </h4>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {p.area}
                        </span>
                        <span>{p.duration}</span>
                        <span>{p.year}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <LeadCtaSection defaultCountry={c.slug} defaultCity={ct.slug} source={`city-page-${ct.slug}`} />
    </>
  );
}
