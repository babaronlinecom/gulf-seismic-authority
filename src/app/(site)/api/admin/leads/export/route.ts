import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/leads/export — download all leads as CSV */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true, company: true,
      country: true, city: true, service: true, message: true,
      source: true, leadScore: true, status: true, funnel: true,
      campaign: true, notes: true, createdAt: true,
    },
  });

  const headers = [
    "ID", "Name", "Email", "Phone", "Company", "Country", "City",
    "Service", "Source", "Score", "Status", "Funnel", "Campaign",
    "Message", "Notes", "Created At",
  ];

  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((l) =>
    [
      l.id, l.name, l.email, l.phone, l.company, l.country, l.city,
      l.service, l.source, l.leadScore, l.status, l.funnel, l.campaign,
      l.message, l.notes, l.createdAt.toISOString(),
    ].map(escape).join(",")
  );

  const csv = [headers.map(escape).join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gulf-seismic-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
