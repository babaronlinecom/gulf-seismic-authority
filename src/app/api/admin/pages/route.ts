import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/pages — list all pages */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pages = await db.page.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ pages });
}

/** POST /api/admin/pages — create a page */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.title || !b.slug) return NextResponse.json({ error: "Title and slug required" }, { status: 400 });
  const page = await db.page.create({
    data: {
      title: b.title, slug: b.slug,
      heroHeading: b.heroHeading || null,
      heroDescription: b.heroDescription || null,
      heroEyebrow: b.heroEyebrow || null,
      content: b.content || "",
      excerpt: b.excerpt || null,
      seoTitle: b.seoTitle || null,
      seoDescription: b.seoDescription || null,
      status: b.status || "published",
      showInHeader: !!b.showInHeader,
      showInFooter: !!b.showInFooter,
    },
  });
  return NextResponse.json({ ok: true, page });
}
