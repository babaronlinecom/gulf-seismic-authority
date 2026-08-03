import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const forms = await db.form.findMany({ orderBy: { createdAt: "desc" } });
  // Include submission counts
  const formsWithCounts = await Promise.all(
    forms.map(async (f) => ({
      ...f,
      fields: JSON.parse(f.fields),
      _count: await db.formSubmission.count({ where: { formId: f.id } }),
    }))
  );
  return NextResponse.json({ forms: formsWithCounts });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.name || !b.slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
  const form = await db.form.create({
    data: {
      name: b.name, slug: b.slug,
      description: b.description || null,
      fields: JSON.stringify(b.fields || []),
      submitLabel: b.submitLabel || "Submit",
      successMessage: b.successMessage || "Thank you!",
      emailTo: b.emailTo || null,
      status: b.status || "active",
    },
  });
  return NextResponse.json({ ok: true, form });
}
