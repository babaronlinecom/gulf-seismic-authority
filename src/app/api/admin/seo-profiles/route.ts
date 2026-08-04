import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profiles = await db.seoProfile.findMany({ orderBy: { pageUrl: "asc" } });
  return NextResponse.json({ profiles });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.pageUrl) return NextResponse.json({ error: "pageUrl required" }, { status: 400 });
  const profile = await db.seoProfile.upsert({
    where: { pageUrl: b.pageUrl },
    update: {
      metaTitle: b.metaTitle, metaDescription: b.metaDescription,
      canonicalUrl: b.canonicalUrl, robotsIndex: b.robotsIndex, robotsFollow: b.robotsFollow,
      ogTitle: b.ogTitle, ogDescription: b.ogDescription, ogImage: b.ogImage,
      twitterCard: b.twitterCard, focusKeyword: b.focusKeyword,
      secondaryKeywords: b.secondaryKeywords ? JSON.stringify(b.secondaryKeywords) : null,
    },
    create: {
      pageUrl: b.pageUrl, metaTitle: b.metaTitle, metaDescription: b.metaDescription,
      canonicalUrl: b.canonicalUrl, robotsIndex: b.robotsIndex ?? true, robotsFollow: b.robotsFollow ?? true,
      ogTitle: b.ogTitle, ogDescription: b.ogDescription, ogImage: b.ogImage,
      twitterCard: b.twitterCard || "summary_large_image", focusKeyword: b.focusKeyword,
      secondaryKeywords: b.secondaryKeywords ? JSON.stringify(b.secondaryKeywords) : null,
    },
  });
  return NextResponse.json({ ok: true, profile });
}
