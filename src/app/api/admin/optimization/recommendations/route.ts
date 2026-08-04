import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { generateRecommendations } from "@/lib/recommendation-engine";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { recommendations, summary } = await generateRecommendations();
  return NextResponse.json({ recommendations, summary });
}
