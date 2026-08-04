import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snapshots = await db.optimizationSnapshot.findMany({
    orderBy: { createdAt: "asc" },
    take: 90, // last 90 snapshots
  });
  return NextResponse.json({ snapshots });
}
