import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const heroes = await db.heroSection.findMany({
    where: page ? { page } : undefined,
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ heroes });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.heading) return NextResponse.json({ error: "Heading required" }, { status: 400 });
  const hero = await db.heroSection.create({
    data: {
      page: b.page || "home",
      eyebrow: b.eyebrow || null,
      heading: b.heading,
      subheading: b.subheading || null,
      ctaLabel: b.ctaLabel || null,
      ctaUrl: b.ctaUrl || null,
      cta2Label: b.cta2Label || null,
      cta2Url: b.cta2Url || null,
      backgroundImage: b.backgroundImage || null,
      stats: b.stats ? JSON.stringify(b.stats) : null,
      order: b.order ?? 0,
    },
  });
  return NextResponse.json({ ok: true, hero });
}
