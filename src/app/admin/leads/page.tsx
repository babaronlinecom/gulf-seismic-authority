import { requireAdmin } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { LeadsTable } from "@/components/admin/leads-table";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireAdmin();
  const { id } = await searchParams;

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      country: true,
      city: true,
      service: true,
      message: true,
      source: true,
      leadScore: true,
      status: true,
      funnel: true,
      campaign: true,
      notes: true,
      createdAt: true,
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">
          {leads.length} total leads · {leads.filter((l) => l.status === "new").length} new
        </p>
      </div>
      <LeadsTable initialLeads={JSON.parse(JSON.stringify(leads))} highlightId={id} />
    </div>
  );
}
