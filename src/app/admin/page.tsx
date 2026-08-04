import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { LeadsTable } from "@/components/admin/leads-table";
import { StatsCard } from "@/components/admin/stats-card";
import { LeadSourceChart, LeadTrendChart } from "@/components/admin/charts";
import { Users, TrendingUp, FolderKanban, FileText, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  // Fetch dashboard data server-side
  const [
    totalLeads, newLeads, wonLeads, totalProjects, totalCaseStudies,
    bySource, recentLeads, last7DaysCount,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "new" } }),
    db.lead.count({ where: { status: "won" } }),
    db.projectRecord.count(),
    db.caseStudyRecord.count(),
    db.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, name: true, email: true, company: true, country: true,
        city: true, service: true, source: true, leadScore: true, status: true, createdAt: true,
      },
    }),
    db.lead.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {session.user.name}. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Total Leads"
          value={totalLeads}
          icon={Users}
          accent="amber"
          sub={`${last7DaysCount} in last 7 days`}
        />
        <StatsCard
          label="New Leads"
          value={newLeads}
          icon={AlertCircle}
          accent="blue"
          sub="Awaiting response"
        />
        <StatsCard
          label="Won Deals"
          value={wonLeads}
          icon={TrendingUp}
          accent="green"
          sub={`${totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0}% conversion`}
        />
        <StatsCard
          label="Projects"
          value={totalProjects}
          icon={FolderKanban}
          accent="default"
          sub={`${totalCaseStudies} case studies`}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Leads by Source</h3>
          <LeadSourceChart data={bySource.map((s) => ({ source: s.source ?? "unknown", count: s._count }))} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Recent Lead Activity</h3>
          <LeadTrendChart recentCount={last7DaysCount} total={totalLeads} />
        </Card>
      </div>

      {/* Recent leads */}
      <Card className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent Leads</h3>
          <Link
            href="/admin/leads"
            className="flex items-center gap-1 text-xs font-medium text-amber-brand hover:underline"
          >
            View all leads <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No leads yet.</p>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads?id=${lead.id}`}
                className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{lead.name}</span>
                    {lead.company && (
                      <span className="truncate text-xs text-muted-foreground">· {lead.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{lead.country}</span>
                    {lead.city && <span>· {lead.city}</span>}
                    {lead.service && <span>· {lead.service.replace(/-/g, " ")}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {lead.leadScore !== null && lead.leadScore > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Score {lead.leadScore}
                    </Badge>
                  )}
                  <Badge
                    className={
                      lead.status === "new"
                        ? "bg-amber-brand text-amber-foreground hover:bg-amber-brand"
                        : lead.status === "won"
                        ? "bg-green-600 text-white hover:bg-green-600"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    }
                  >
                    {lead.status}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
