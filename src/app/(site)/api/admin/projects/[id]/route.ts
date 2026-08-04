import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/projects/[id] — get a single project */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await db.projectRecord.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

/** PUT /api/admin/projects/[id] — update a project */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, country, city, service, industry, client, year, duration, location, area, challenge, solution, execution, materials, equipment, results, status } = body;

  const project = await db.projectRecord.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(country !== undefined && { country }),
      ...(city !== undefined && { city }),
      ...(service !== undefined && { service }),
      ...(industry !== undefined && { industry }),
      ...(client !== undefined && { client }),
      ...(year !== undefined && { year: year ? Number(year) : null }),
      ...(duration !== undefined && { duration }),
      ...(location !== undefined && { location }),
      ...(area !== undefined && { area }),
      ...(challenge !== undefined && { challenge }),
      ...(solution !== undefined && { solution }),
      ...(execution !== undefined && { execution }),
      ...(materials !== undefined && { materials: materials ? JSON.stringify(materials) : null }),
      ...(equipment !== undefined && { equipment: equipment ? JSON.stringify(equipment) : null }),
      ...(results !== undefined && { results: results ? JSON.stringify(results) : null }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ ok: true, project });
}

/** DELETE /api/admin/projects/[id] — delete a project */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.projectRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
