import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await db.post.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.title || !b.slug) return NextResponse.json({ error: "Title and slug required" }, { status: 400 });
  const post = await db.post.create({
    data: {
      title: b.title, slug: b.slug,
      excerpt: b.excerpt || null,
      content: b.content || "",
      category: b.category || null,
      tags: b.tags ? JSON.stringify(b.tags) : null,
      author: b.author || "Gulf Seismic",
      featuredImage: b.featuredImage || null,
      seoTitle: b.seoTitle || null,
      seoDescription: b.seoDescription || null,
      status: b.status || "published",
      publishedAt: b.publishedAt ? new Date(b.publishedAt) : new Date(),
    },
  });
  return NextResponse.json({ ok: true, post });
}
