import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    totalProjects,
    totalCaseStudies,
    bySource,
    byCountry,
    byService,
    byStatus,
    recentLeads,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "new" } }),
    db.lead.count({ where: { status: "contacted" } }),
    db.lead.count({ where: { status: "qualified" } }),
    db.lead.count({ where: { status: "won" } }),
    db.projectRecord.count(),
    db.caseStudyRecord.count(),
    db.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
    db.lead.groupBy({ by: ["country"], _count: true, orderBy: { _count: { country: "desc" } } }),
    db.lead.groupBy({ by: ["service"], _count: true, orderBy: { _count: { service: "desc" } } }),
    db.lead.groupBy({ by: ["status"], _count: true }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        country: true,
        city: true,
        service: true,
        source: true,
        leadScore: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  // Lead score average
  const scoreAgg = await db.lead.aggregate({ _avg: { leadScore: true } });

  // Last 7 days leads
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const last7Days = await db.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } });

  return NextResponse.json({
    totals: {
      leads: totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      wonLeads,
      projects: totalProjects,
      caseStudies: totalCaseStudies,
      avgScore: Math.round(scoreAgg._avg.leadScore ?? 0),
      last7Days,
    },
    bySource: bySource.map((s) => ({ source: s.source ?? "unknown", count: s._count })),
    byCountry: byCountry.map((c) => ({ country: c.country ?? "unknown", count: c._count })),
    byService: byService.filter((s) => s.service).map((s) => ({ service: s.service!, count: s._count })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    recentLeads,
  });
}
