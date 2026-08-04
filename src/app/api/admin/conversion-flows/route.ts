import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl");
  const flows = await db.conversionFlow.findMany({
    where: pageUrl ? { pageUrl } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ flows });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.name || !b.pageUrl || !b.ctaLabel || !b.ctaUrl) return NextResponse.json({ error: "name, pageUrl, ctaLabel, ctaUrl required" }, { status: 400 });
  const flow = await db.conversionFlow.create({
    data: {
      name: b.name, pageUrl: b.pageUrl, ctaLabel: b.ctaLabel, ctaUrl: b.ctaUrl,
      ctaType: b.ctaType || "primary", placement: b.placement || "bottom",
      intent: b.intent || "conversion", status: b.status || "active",
    },
  });
  return NextResponse.json({ ok: true, flow });
}
