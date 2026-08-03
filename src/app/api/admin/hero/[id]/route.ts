import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const hero = await db.heroSection.update({
    where: { id },
    data: {
      ...(b.page !== undefined && { page: b.page }),
      ...(b.eyebrow !== undefined && { eyebrow: b.eyebrow || null }),
      ...(b.heading !== undefined && { heading: b.heading }),
      ...(b.subheading !== undefined && { subheading: b.subheading || null }),
      ...(b.ctaLabel !== undefined && { ctaLabel: b.ctaLabel || null }),
      ...(b.ctaUrl !== undefined && { ctaUrl: b.ctaUrl || null }),
      ...(b.cta2Label !== undefined && { cta2Label: b.cta2Label || null }),
      ...(b.cta2Url !== undefined && { cta2Url: b.cta2Url || null }),
      ...(b.backgroundImage !== undefined && { backgroundImage: b.backgroundImage || null }),
      ...(b.stats !== undefined && { stats: b.stats ? JSON.stringify(b.stats) : null }),
      ...(b.order !== undefined && { order: b.order }),
    },
  });
  return NextResponse.json({ ok: true, hero });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.heroSection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
