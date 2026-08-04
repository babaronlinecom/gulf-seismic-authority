import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { getContentGaps } from "@/lib/recommendation-engine";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const gaps = await getContentGaps();
  return NextResponse.json({ gaps });
}
