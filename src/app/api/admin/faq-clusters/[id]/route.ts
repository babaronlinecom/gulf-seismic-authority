import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const faq = await db.faqCluster.update({
    where: { id },
    data: {
      ...(b.question !== undefined && { question: b.question }),
      ...(b.answer !== undefined && { answer: b.answer }),
      ...(b.category !== undefined && { category: b.category }),
      ...(b.entity !== undefined && { entity: b.entity || null }),
      ...(b.pageUrl !== undefined && { pageUrl: b.pageUrl || null }),
      ...(b.status !== undefined && { status: b.status }),
    },
  });
  return NextResponse.json({ ok: true, faq });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.faqCluster.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
