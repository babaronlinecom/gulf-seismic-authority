import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const flow = await db.conversionFlow.update({
    where: { id },
    data: {
      ...(b.name !== undefined && { name: b.name }),
      ...(b.pageUrl !== undefined && { pageUrl: b.pageUrl }),
      ...(b.ctaLabel !== undefined && { ctaLabel: b.ctaLabel }),
      ...(b.ctaUrl !== undefined && { ctaUrl: b.ctaUrl }),
      ...(b.ctaType !== undefined && { ctaType: b.ctaType }),
      ...(b.placement !== undefined && { placement: b.placement }),
      ...(b.intent !== undefined && { intent: b.intent }),
      ...(b.status !== undefined && { status: b.status }),
    },
  });
  return NextResponse.json({ ok: true, flow });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.conversionFlow.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
