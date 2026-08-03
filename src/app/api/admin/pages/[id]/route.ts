import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const page = await db.page.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: b.title }),
      ...(b.slug !== undefined && { slug: b.slug }),
      ...(b.heroHeading !== undefined && { heroHeading: b.heroHeading || null }),
      ...(b.heroDescription !== undefined && { heroDescription: b.heroDescription || null }),
      ...(b.heroEyebrow !== undefined && { heroEyebrow: b.heroEyebrow || null }),
      ...(b.content !== undefined && { content: b.content }),
      ...(b.excerpt !== undefined && { excerpt: b.excerpt || null }),
      ...(b.seoTitle !== undefined && { seoTitle: b.seoTitle || null }),
      ...(b.seoDescription !== undefined && { seoDescription: b.seoDescription || null }),
      ...(b.status !== undefined && { status: b.status }),
      ...(b.showInHeader !== undefined && { showInHeader: !!b.showInHeader }),
      ...(b.showInFooter !== undefined && { showInFooter: !!b.showInFooter }),
    },
  });
  return NextResponse.json({ ok: true, page });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.page.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
