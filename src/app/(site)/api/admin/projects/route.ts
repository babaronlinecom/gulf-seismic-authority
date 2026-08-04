import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/projects — list all projects */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.projectRecord.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

/** POST /api/admin/projects — create a new project */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, country, city, service, industry, client, year, duration, location, area, challenge, solution, execution, materials, equipment, results, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const project = await db.projectRecord.create({
    data: {
      title, slug, country: country || "uae", city, service, industry,
      client, year: year ? Number(year) : null, duration, location, area,
      challenge, solution, execution,
      materials: materials ? JSON.stringify(materials) : null,
      equipment: equipment ? JSON.stringify(equipment) : null,
      results: results ? JSON.stringify(results) : null,
      status: status || "published",
    },
  });

  return NextResponse.json({ ok: true, project });
}
