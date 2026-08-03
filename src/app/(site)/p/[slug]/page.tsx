import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { getPage } from "@/lib/cms";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";
import ReactMarkdown from "react-markdown";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "published")
    return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt || "",
    path: `/p/${page.slug}`,
  });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "published") notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: page.title, url: `/p/${page.slug}` },
        ])}
      />
      {page.heroHeading && (
        <PageHero
          eyebrow={page.heroEyebrow || undefined}
          title={page.heroHeading}
          description={page.heroDescription || undefined}
          crumbs={[{ name: page.title, url: `/p/${page.slug}` }]}
        />
      )}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {!page.heroHeading && (
            <h1 className="mb-6 text-3xl font-bold">{page.title}</h1>
          )}
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 list-disc pl-6 text-muted-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 text-muted-foreground">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ children, href }) => <a href={href} className="text-amber-brand hover:underline">{children}</a>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-brand pl-4 italic text-muted-foreground">{children}</blockquote>,
              }}
            >
              {page.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </>
  );
}
