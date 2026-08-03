import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Phone, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { ServicesGrid } from "@/components/gulf/services-grid";
import { ProjectsShowcase } from "@/components/gulf/projects-showcase";
import { LeadCtaSection } from "@/components/gulf/lead-cta-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/gulf/json-ld";
import {
  countries,
  getCitiesByCountry,
  getProjectsByCountry,
  services,
  type CountrySlug,
} from "@/lib/gulf-data";
import {
  buildMetadata,
  organizationSchema,
  breadcrumbSchema,
} from "@/lib/seo";

const COUNTRIES: CountrySlug[] = ["uae", "saudi-arabia"];

export async function generateStaticParams() {
  return COUNTRIES.map((slug) => ({ country: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = countries.find((x) => x.slug === country);
  if (!c) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: c.seoTitle,
    description: c.seoDescription,
    path: `/${c.slug}`,
  });
}

export default async function CountryHubPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = countries.find((x) => x.slug === country);
  if (!c) notFound();

  const countryCities = getCitiesByCountry(c.slug);
  const countryProjects = getProjectsByCountry(c.slug);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: c.name, url: `/${c.slug}` },
          ]),
        ]}
      />
      <PageHero
        eyebrow={`${c.flag} ${c.shortName} Authority Hub`}
        title={c.heroHeading}
        description={c.heroDescription}
        crumbs={[{ name: c.name, url: `/${c.slug}` }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
          >
            <Link href="/contact">Get a Quote in {c.shortName}</Link>
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

      {/* Cities grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {c.shortName} cities we serve
            </h2>
            <p className="mt-4 text-muted-foreground">
              Select your city to find local {c.shortName} road and industrial marking services.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {countryCities.map((city) => (
              <Link key={city.slug} href={`/${c.slug}/${city.slug}`} className="group">
                <Card className="h-full p-5 transition-all hover:border-amber-brand hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-brand" />
                      <h3 className="font-semibold">{city.name}</h3>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-amber-brand" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{city.region}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {city.highlights.slice(0, 2).map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServicesGrid />

      {countryProjects.length > 0 && <ProjectsShowcase />}

      {/* Why Gulf Seismic in this country */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Why {c.shortName} contractors choose Gulf Seismic
              </h2>
              <p className="mt-4 text-muted-foreground">
                We&apos;ve spent a decade building marking expertise across {c.name}, with crews
                trained for local conditions and certified to {c.shortName} specifications.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  `Local crews trained for ${c.shortName} climate and traffic`,
                  `Compliant with ${c.shortName} municipal specifications`,
                  `Rapid mobilisation across all ${countryCities.length} cities`,
                  `10+ years delivering projects in ${c.shortName}`,
                  `ISO 9001 certified quality management`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group rounded-xl border border-border bg-background p-5 transition-all hover:border-amber-brand hover:shadow-md"
                >
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {s.shortDescription}
                  </p>
                  <div className="mt-3 text-xs font-medium text-amber-brand">Learn more →</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LeadCtaSection defaultCountry={c.slug} source={`country-hub-${c.slug}`} />
    </>
  );
}
