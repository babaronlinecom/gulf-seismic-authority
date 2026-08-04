import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const page = await db.pageBuilder.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: b.title }),
      ...(b.pageSlug !== undefined && { pageSlug: b.pageSlug }),
      ...(b.blocks !== undefined && { blocks: JSON.stringify(b.blocks) }),
      ...(b.status !== undefined && { status: b.status }),
    },
  });
  return NextResponse.json({ ok: true, page });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.pageBuilder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
