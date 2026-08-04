import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const item = await db.menuItem.update({
    where: { id },
    data: {
      ...(b.label !== undefined && { label: b.label }),
      ...(b.url !== undefined && { url: b.url }),
      ...(b.location !== undefined && { location: b.location }),
      ...(b.order !== undefined && { order: b.order }),
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
