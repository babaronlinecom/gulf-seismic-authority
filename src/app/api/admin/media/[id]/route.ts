import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const item = await db.mediaItem.update({
    where: { id },
    data: {
      ...(b.filename !== undefined && { filename: b.filename }),
      ...(b.title !== undefined && { title: b.title || null }),
      ...(b.alt !== undefined && { alt: b.alt || null }),
      ...(b.folder !== undefined && { folder: b.folder }),
      // SEO fields
      ...(b.seoTitle !== undefined && { seoTitle: b.seoTitle || null }),
      ...(b.seoAlt !== undefined && { seoAlt: b.seoAlt || null }),
      ...(b.seoCaption !== undefined && { seoCaption: b.seoCaption || null }),
      // Social/OG fields
      ...(b.ogTitle !== undefined && { ogTitle: b.ogTitle || null }),
      ...(b.ogDescription !== undefined && { ogDescription: b.ogDescription || null }),
      ...(b.socialCaption !== undefined && { socialCaption: b.socialCaption || null }),
      ...(b.socialHashtags !== undefined && { socialHashtags: b.socialHashtags || null }),
      // Display options
      ...(b.lazyLoad !== undefined && { lazyLoad: !!b.lazyLoad }),
      ...(b.gradientOverlay !== undefined && { gradientOverlay: b.gradientOverlay || null }),
      ...(b.resizeNote !== undefined && { resizeNote: b.resizeNote || null }),
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.mediaItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
