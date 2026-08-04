import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entities = await db.entityDefinition.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ entities: entities.map(e => ({ ...e, sameAs: e.sameAs ? JSON.parse(e.sameAs) : [], properties: e.properties ? JSON.parse(e.properties) : {} })) });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const entity = await db.entityDefinition.upsert({
    where: { name: b.name },
    update: {
      description: b.description, entityType: b.entityType || "Thing",
      sameAs: b.sameAs ? JSON.stringify(b.sameAs) : null,
      properties: b.properties ? JSON.stringify(b.properties) : null,
    },
    create: {
      name: b.name, description: b.description || "",
      entityType: b.entityType || "Thing",
      sameAs: b.sameAs ? JSON.stringify(b.sameAs) : null,
      properties: b.properties ? JSON.stringify(b.properties) : null,
    },
  });
  return NextResponse.json({ ok: true, entity });
}
