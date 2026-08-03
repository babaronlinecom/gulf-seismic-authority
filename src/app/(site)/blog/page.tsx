import Link from "next/link";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/gulf/page-hero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedPosts, getPostCategories } from "@/lib/cms";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/gulf/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Blog | Road & Industrial Marking Insights — Gulf Seismic",
  description:
    "Technical guides, market insights and case studies on road marking, thermoplastic, warehouse marking, airport marking and epoxy flooring across UAE & Saudi Arabia.",
  path: "/blog",
});

export const revalidate = 300; // ISR 5 min

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPublishedPosts(category ? { category } : undefined),
    getPostCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Blog & Resources"
        title="Insights from the Gulf marking industry"
        description="Technical guides, market insights and project case studies from our marking experts across UAE & Saudi Arabia."
        crumbs={[{ name: "Blog", url: "/blog" }]}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-3 py-1 text-xs ${!category ? "border-amber-brand bg-amber-brand text-amber-foreground" : "border-border hover:border-amber-brand"}`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full border px-3 py-1 text-xs ${category === cat ? "border-amber-brand bg-amber-brand text-amber-foreground" : "border-border hover:border-amber-brand"}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <Card className="p-12 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-semibold">No posts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Blog posts will appear here once published from the admin panel.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden transition-all hover:border-amber-brand hover:shadow-lg">
                    {post.featuredImage ? (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-primary">
                        <div className="absolute inset-0 road-stripe-h opacity-20" />
                        <Newspaper className="relative h-10 w-10 text-amber-brand" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      {post.category && (
                        <Badge className="mb-2 w-fit bg-amber-brand text-amber-foreground hover:bg-amber-brand">
                          {post.category}
                        </Badge>
                      )}
                      <h3 className="font-semibold leading-tight group-hover:text-amber-brand line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                      )}
                      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
