import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** PATCH /api/admin/leads/[id] — update lead status or notes */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status, notes } = body;

  const update: Record<string, unknown> = {};
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;

  const lead = await db.lead.update({
    where: { id },
    data: update,
    select: { id: true, status: true, notes: true },
  });

  return NextResponse.json({ ok: true, lead });
}

/** DELETE /api/admin/leads/[id] — delete a lead */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
