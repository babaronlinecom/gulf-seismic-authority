import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pages = await db.pageBuilder.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ pages: pages.map(p => ({ ...p, blocks: JSON.parse(p.blocks) })) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.pageSlug || !b.title) return NextResponse.json({ error: "pageSlug and title required" }, { status: 400 });
  const page = await db.pageBuilder.upsert({
    where: { pageSlug: b.pageSlug },
    update: { title: b.title, blocks: JSON.stringify(b.blocks || []), status: b.status || "draft" },
    create: { pageSlug: b.pageSlug, title: b.title, blocks: JSON.stringify(b.blocks || []), status: b.status || "draft" },
  });
  return NextResponse.json({ ok: true, page });
}
