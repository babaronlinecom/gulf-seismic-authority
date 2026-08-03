import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import { getOptimizationScores } from "@/lib/optimization";

export async function POST() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const scores = await getOptimizationScores();
  const snapshot = await db.optimizationSnapshot.create({ data: scores });
  return NextResponse.json({ ok: true, snapshot });
}
