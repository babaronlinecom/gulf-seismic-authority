import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const items = await db.menuItem.findMany({
    where: location ? { location } : undefined,
    orderBy: [{ location: "asc" }, { order: "asc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.label || !b.url) return NextResponse.json({ error: "Label and URL required" }, { status: 400 });
  const item = await db.menuItem.create({
    data: {
      label: b.label, url: b.url,
      location: b.location || "header",
      order: b.order ?? 0,
    },
  });
  return NextResponse.json({ ok: true, item });
}
