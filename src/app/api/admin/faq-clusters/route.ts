import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const pageUrl = searchParams.get("pageUrl");
  const faqs = await db.faqCluster.findMany({
    where: pageUrl ? { pageUrl } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.question || !b.answer) return NextResponse.json({ error: "question and answer required" }, { status: 400 });
  const faq = await db.faqCluster.create({
    data: {
      question: b.question, answer: b.answer,
      category: b.category || "general", entity: b.entity || null,
      pageUrl: b.pageUrl || null, status: b.status || "published",
    },
  });
  return NextResponse.json({ ok: true, faq });
}
