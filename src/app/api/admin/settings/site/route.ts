import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/settings/site — get all site settings */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.siteSetting.findMany();
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch {
      settings[row.key] = row.value;
    }
  }
  return NextResponse.json({ settings });
}

/** PUT /api/admin/settings/site — bulk update site settings */
export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { settings } = body as { settings: Record<string, unknown> };
  if (!settings) return NextResponse.json({ error: "settings object required" }, { status: 400 });

  for (const [key, value] of Object.entries(settings)) {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    await db.siteSetting.upsert({
      where: { key },
      update: { value: strValue },
      create: { key, value: strValue },
    });
  }
  return NextResponse.json({ ok: true });
}
