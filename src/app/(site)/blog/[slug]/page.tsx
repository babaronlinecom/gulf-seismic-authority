import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedPost, getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { buildMetadata, breadcrumbSchema, articleSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";
import ReactMarkdown from "react-markdown";

// Map blog post slugs to their generated featured images
const blogImageMap: Record<string, string> = {
  "thermoplastic-vs-cold-paint-road-marking": "/images/blog/thermoplastic-vs-cold-paint.jpg",
  "parking-lot-capacity-optimisation": "/images/blog/parking-optimisation.jpg",
  "warehouse-5s-floor-marking-guide": "/images/blog/warehouse-5s-guide.jpg",
  "icao-annex-14-airport-marking-explained": "/images/blog/icao-annex-14.jpg",
  "epoxy-vs-polyurea-industrial-floors": "/images/blog/epoxy-vs-polyurea.jpg",
  "saudi-vision-2030-road-marking-opportunities": "/images/blog/saudi-vision-2030.jpg",
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return buildMetadata({ title: "Not Found", description: "", noIndex: true });
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings, related] = await Promise.all([
    getPublishedPost(slug),
    getSiteSettings(),
    getPublishedPosts({ limit: 3 }),
  ]);

  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const relatedPosts = related.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || "",
            date: post.publishedAt.toISOString(),
            author: post.author || settings.siteName,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: path },
          ]),
        ]}
      />
      <PageHero
        eyebrow={post.category || "Blog"}
        title={post.title}
        description={post.excerpt || undefined}
        crumbs={[
          { name: "Blog", url: "/blog" },
          { name: post.title, url: path },
        ]}
      />

      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>

          {/* Featured image */}
          {(post.featuredImage || blogImageMap[post.slug]) && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={post.featuredImage || blogImageMap[post.slug]}
                alt={`${post.title} — Gulf Seismic blog`}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
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
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Back link */}
          <div className="mt-12 border-t border-border pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-brand hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>

          {/* Related */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-4 font-semibold">Related Posts</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                    <Card className="p-4 transition-all hover:border-amber-brand hover:shadow-md">
                      {rp.category && (
                        <Badge variant="outline" className="mb-2 text-xs">{rp.category}</Badge>
                      )}
                      <h4 className="text-sm font-medium group-hover:text-amber-brand line-clamp-2">{rp.title}</h4>
                      {rp.excerpt && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{rp.excerpt}</p>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
