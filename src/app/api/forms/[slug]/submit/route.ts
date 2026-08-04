import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/** POST /api/forms/[slug]/submit — public form submission (rate limited) */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Rate limiting: 5 submissions per minute per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { slug } = await params;
  const form = await db.form.findUnique({ where: { slug } });
  if (!form || form.status !== "active") {
    return NextResponse.json({ error: "Form not found or inactive" }, { status: 404 });
  }

  const body = await req.json();
  const fields = JSON.parse(form.fields) as { name: string; label: string; required?: boolean }[];

  // Validate required fields
  const missing: string[] = [];
  for (const field of fields) {
    if (field.required && !body[field.name]) {
      missing.push(field.label);
    }
  }
  if (missing.length > 0) {
    return NextResponse.json({ error: `Required fields missing: ${missing.join(", ")}` }, { status: 400 });
  }

  // Store submission
  const submission = await db.formSubmission.create({
    data: {
      formId: form.id,
      data: JSON.stringify(body),
      status: "new",
    },
  });

  return NextResponse.json({ ok: true, id: submission.id, message: form.successMessage });
}
