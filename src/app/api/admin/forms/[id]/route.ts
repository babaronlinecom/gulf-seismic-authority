import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const form = await db.form.findUnique({ where: { id } });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ form: { ...form, fields: JSON.parse(form.fields) } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const form = await db.form.update({
    where: { id },
    data: {
      ...(b.name !== undefined && { name: b.name }),
      ...(b.slug !== undefined && { slug: b.slug }),
      ...(b.description !== undefined && { description: b.description || null }),
      ...(b.fields !== undefined && { fields: JSON.stringify(b.fields) }),
      ...(b.submitLabel !== undefined && { submitLabel: b.submitLabel }),
      ...(b.successMessage !== undefined && { successMessage: b.successMessage }),
      ...(b.emailTo !== undefined && { emailTo: b.emailTo || null }),
      ...(b.status !== undefined && { status: b.status }),
    },
  });
  return NextResponse.json({ ok: true, form });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  // Delete all submissions first
  await db.formSubmission.deleteMany({ where: { formId: id } });
  await db.form.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
