import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, projectSlug, summary, outcomes, testimonialQuote, testimonialAuthor, testimonialRole, status } = body;

  const cs = await db.caseStudyRecord.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(projectSlug !== undefined && { projectSlug }),
      ...(summary !== undefined && { summary }),
      ...(outcomes !== undefined && { outcomes: outcomes ? JSON.stringify(outcomes) : null }),
      ...(testimonialQuote !== undefined && { testimonialQuote }),
      ...(testimonialAuthor !== undefined && { testimonialAuthor }),
      ...(testimonialRole !== undefined && { testimonialRole }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ ok: true, caseStudy: cs });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.caseStudyRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
