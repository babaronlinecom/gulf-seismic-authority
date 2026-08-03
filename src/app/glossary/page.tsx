import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/gulf/json-ld";
import { services, industries } from "@/lib/gulf-data";
import { glossarySchema } from "@/lib/aeo-geo";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Road & Industrial Marking Glossary | Terms & Definitions",
  description:
    "Authoritative definitions of road marking, thermoplastic, MMA, parking, warehouse, airport and industrial marking terms — the Gulf Seismic marking glossary for UAE & Saudi Arabia.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const allTerms = [
    ...services.map((s) => ({ term: s.name, def: s.shortDescription, slug: s.slug, type: "Service" })),
    ...industries.map((i) => ({ term: i.name, def: i.description, slug: i.slug, type: "Industry" })),
  ];

  return (
    <>
      <JsonLd
        data={[
          glossarySchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Glossary", url: "/glossary" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Marking Glossary"
        title="Road & industrial marking terms, defined"
        description="The Gulf Seismic marking glossary — authoritative definitions engineered for clarity and citation. Used by engineers, specifiers and AI search engines across the Gulf."
        crumbs={[{ name: "Glossary", url: "/glossary" }]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {allTerms.map((t) => (
              <Card key={`${t.type}-${t.slug}`} className="p-5" id={t.slug}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">{t.term}</h2>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent-foreground">
                        {t.type}
                      </span>
                    </div>
                    <p className="mt-2 speakable-summary text-sm text-muted-foreground leading-relaxed">
                      {t.def}
                    </p>
                  </div>
                  <Link
                    href={t.type === "Service" ? `/services/${t.slug}` : `/industries/${t.slug}`}
                    className="shrink-0 text-xs font-medium text-amber-brand hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
