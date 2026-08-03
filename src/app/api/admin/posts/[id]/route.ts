import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const post = await db.post.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: b.title }),
      ...(b.slug !== undefined && { slug: b.slug }),
      ...(b.excerpt !== undefined && { excerpt: b.excerpt || null }),
      ...(b.content !== undefined && { content: b.content }),
      ...(b.category !== undefined && { category: b.category || null }),
      ...(b.tags !== undefined && { tags: b.tags ? JSON.stringify(b.tags) : null }),
      ...(b.author !== undefined && { author: b.author }),
      ...(b.featuredImage !== undefined && { featuredImage: b.featuredImage || null }),
      ...(b.seoTitle !== undefined && { seoTitle: b.seoTitle || null }),
      ...(b.seoDescription !== undefined && { seoDescription: b.seoDescription || null }),
      ...(b.status !== undefined && { status: b.status }),
      ...(b.publishedAt !== undefined && { publishedAt: new Date(b.publishedAt) }),
    },
  });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
