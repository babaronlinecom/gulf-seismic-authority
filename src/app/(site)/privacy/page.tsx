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
    path: "/privacy",
    defaults: { title: "Privacy Policy | Gulf Seismic", description: "How Gulf Seismic collects, uses, and protects your data." },
  });
}

export default async function PrivacyPage() {
  let page = await db.page.findUnique({ where: { slug: "privacy" } });
  if (!page || page.status !== "published") {
    page = {
      id: "",
      slug: "privacy",
      title: "Privacy Policy",
      heroHeading: "Privacy Policy",
      heroDescription: "How Gulf Seismic collects, uses, and protects your data.",
      heroEyebrow: "Legal",
      content: `## Information We Collect\n\nWe collect information you provide when you submit a quote request, contact form, or subscribe to our newsletter. This includes your name, email, phone number, and project details.\n\n## How We Use Your Information\n\n- To respond to your inquiries and provide quotes\n- To deliver our services\n- To send you relevant updates (if you've subscribed)\n\n## Data Security\n\nWe implement appropriate technical and organizational measures to protect your personal data.\n\n## Contact\n\nFor privacy questions, email ${company.email}.`,
      excerpt: null,
      seoTitle: "Privacy Policy | Gulf Seismic",
      seoDescription: "How Gulf Seismic collects, uses, and protects your data.",
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
        { name: "Privacy Policy", url: "/privacy" },
      ])} />
      <PageHero
        eyebrow={page.heroEyebrow || "Legal"}
        title={page.heroHeading || "Privacy Policy"}
        description={page.heroDescription || undefined}
        crumbs={[{ name: "Privacy", url: "/privacy" }]}
      />
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-amber-brand [&_a]:underline [&_strong]:text-foreground" dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, "<br/>").replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>') }} />
        </div>
      </article>
    </>
  );
}
