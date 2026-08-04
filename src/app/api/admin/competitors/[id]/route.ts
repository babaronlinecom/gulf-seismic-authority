import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const comp = await db.competitor.update({
    where: { id },
    data: {
      ...(b.name !== undefined && { name: b.name }),
      ...(b.url !== undefined && { url: b.url }),
      ...(b.country !== undefined && { country: b.country || null }),
      ...(b.services !== undefined && { services: b.services ? JSON.stringify(b.services) : null }),
      ...(b.strengths !== undefined && { strengths: b.strengths || null }),
      ...(b.weaknesses !== undefined && { weaknesses: b.weaknesses || null }),
      ...(b.ranking !== undefined && { ranking: b.ranking ? Number(b.ranking) : null }),
      ...(b.notes !== undefined && { notes: b.notes || null }),
    },
  });
  return NextResponse.json({ ok: true, competitor: comp });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.competitor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
