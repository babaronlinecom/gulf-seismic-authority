import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { db } from "@/lib/db";
import { buildSeoMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";
import { company } from "@/lib/gulf-data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeoMetadata({
    path: "/terms",
    defaults: { title: "Terms of Service | Gulf Seismic", description: "Terms and conditions for using Gulf Seismic's website and services." },
  });
}

export default async function TermsPage() {
  let page = await db.page.findUnique({ where: { slug: "terms" } });
  if (!page || page.status !== "published") {
    page = {
      id: "",
      slug: "terms",
      title: "Terms of Service",
      heroHeading: "Terms of Service",
      heroDescription: "The terms and conditions for using Gulf Seismic's website and services.",
      heroEyebrow: "Legal",
      content: `## Acceptance of Terms\n\nBy accessing this website, you agree to these terms of service.\n\n## Use of Website\n\nThis website is provided for informational purposes. You may not use it for any unlawful purpose.\n\n## Intellectual Property\n\nAll content on this website is the property of ${company.legalName} unless otherwise stated.\n\n## Limitation of Liability\n\n${company.legalName} shall not be liable for any indirect or consequential damages arising from the use of this website.\n\n## Contact\n\nFor questions about these terms, email ${company.email}.`,
      excerpt: null,
      seoTitle: "Terms of Service | Gulf Seismic",
      seoDescription: "Terms and conditions for using Gulf Seismic's website and services.",
      status: "published",
      showInHeader: false,
      showInFooter: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Terms of Service", url: "/terms" },
      ])} />
      <PageHero
        eyebrow={page.heroEyebrow || "Legal"}
        title={page.heroHeading || "Terms of Service"}
        description={page.heroDescription || undefined}
        crumbs={[{ name: "Terms", url: "/terms" }]}
      />
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-amber-brand [&_a]:underline [&_strong]:text-foreground" dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, "<br/>").replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>') }} />
        </div>
      </article>
    </>
  );
}
