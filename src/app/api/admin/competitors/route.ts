import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const competitors = await db.competitor.findMany({ orderBy: { ranking: "asc" } });
  return NextResponse.json({ competitors: competitors.map(c => ({ ...c, services: c.services ? JSON.parse(c.services) : [] })) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.name || !b.url) return NextResponse.json({ error: "Name and URL required" }, { status: 400 });
  const comp = await db.competitor.create({
    data: {
      name: b.name, url: b.url, country: b.country || null,
      services: b.services ? JSON.stringify(b.services) : null,
      strengths: b.strengths || null, weaknesses: b.weaknesses || null,
      ranking: b.ranking ? Number(b.ranking) : null, notes: b.notes || null,
    },
  });
  return NextResponse.json({ ok: true, competitor: comp });
}
