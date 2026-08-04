import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const caseStudies = await db.caseStudyRecord.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ caseStudies });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, projectSlug, summary, outcomes, testimonialQuote, testimonialAuthor, testimonialRole, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const cs = await db.caseStudyRecord.create({
    data: {
      title, slug, projectSlug, summary,
      outcomes: outcomes ? JSON.stringify(outcomes) : null,
      testimonialQuote, testimonialAuthor, testimonialRole,
      status: status || "published",
    },
  });

  return NextResponse.json({ ok: true, caseStudy: cs });
}
