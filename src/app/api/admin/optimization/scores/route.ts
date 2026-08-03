import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { getOptimizationScores, getAllSeoProfiles, getEntityDefinitions, getFaqClusters, getConversionFlows } from "@/lib/optimization";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [scores, profiles, entities, faqs, ctas] = await Promise.all([
    getOptimizationScores(),
    getAllSeoProfiles(),
    getEntityDefinitions(),
    getFaqClusters(),
    getConversionFlows(),
  ]);
  return NextResponse.json({ scores, counts: { profiles: profiles.length, entities: entities.length, faqs: faqs.length, ctas: ctas.length } });
}
