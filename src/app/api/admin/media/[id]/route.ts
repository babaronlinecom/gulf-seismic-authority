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
      ...(b.alt !== undefined && { alt: b.alt || null }),
      ...(b.filename !== undefined && { filename: b.filename }),
      ...(b.folder !== undefined && { folder: b.folder }),
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
