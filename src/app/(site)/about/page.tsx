import Link from "next/link";
import { CheckCircle2, Target, Eye, Award, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/gulf/json-ld";
import { company, services, countries } from "@/lib/gulf-data";
import { buildMetadata, breadcrumbSchema, organizationSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Gulf Seismic | Road & Industrial Marking Authority",
  description:
    "Gulf Seismic is the UAE and Saudi Arabia authority for road marking, parking marking, warehouse marking, airport marking, industrial marking, safety signage and epoxy flooring. 10+ years, 850+ projects, 16 cities.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="About Us"
        title="The Gulf's authority in road & industrial marking"
        description={company.description}
        crumbs={[{ name: "About", url: "/about" }]}
      />

      {/* Stats */}
      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {company.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-amber-brand sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <Target className="h-8 w-8 text-amber-brand" />
              <h2 className="mt-4 text-xl font-bold">Our Mission</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                To deliver the highest-quality road and industrial marking across the Gulf — making
                roads safer, warehouses more efficient, and facilities more compliant — on every
                project, in every city.
              </p>
            </Card>
            <Card className="p-6">
              <Eye className="h-8 w-8 text-amber-brand" />
              <h2 className="mt-4 text-xl font-bold">Our Vision</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                To be the dominant authority platform for road and industrial marking across the
                UAE and Saudi Arabia — the first name contractors, consultants and authorities call
                for marking expertise.
              </p>
            </Card>
            <Card className="p-6">
              <Award className="h-8 w-8 text-amber-brand" />
              <h2 className="mt-4 text-xl font-bold">Our Standards</h2>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {company.certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand" />
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Company story */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-bold">Our story</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in {company.founded} and headquartered in {company.headquarters.city}, Gulf
              Seismic began as a specialist thermoplastic road marking contractor serving the UAE.
              Over a decade, we have grown into a full-spectrum marking authority — delivering
              highway, parking, warehouse, airport, industrial, safety signage and epoxy flooring
              solutions across 16 cities in the UAE and Saudi Arabia.
            </p>
            <p>
              Our growth has been driven by a relentless focus on quality and compliance. Every
              project follows the same disciplined five-step process — consult, design, mobilise,
              execute, and verify — so our clients receive consistent, municipal-spec results
              whether the job is a 42 km highway or a single parking deck.
            </p>
            <p>
              Today, with over 850 delivered projects and 2,400+ km of lines applied, Gulf Seismic
              is the marking partner of choice for transport authorities, retail groups, logistics
              operators, petrochemical companies and airport operators across the Gulf.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-amber-brand" />
            <h2 className="mt-3 text-balance text-3xl font-bold">Our coverage</h2>
            <p className="mt-3 text-muted-foreground">
              Two nations. Sixteen cities. One standard of quality.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {countries.map((c) => (
              <Card key={c.slug} className="p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.dialCode}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{c.heroDescription}</p>
                <Link
                  href={`/${c.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-amber-brand hover:underline"
                >
                  Explore {c.shortName} →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services summary */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-bold">What we do</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-4 transition-colors hover:bg-primary-foreground/10"
              >
                <h3 className="font-semibold text-sm">{s.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-primary-foreground/60">
                  {s.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
