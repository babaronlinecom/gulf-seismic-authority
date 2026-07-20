"use client";

import * as React from "react";
import { RefreshCw, Inbox, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../shared";
import { useContent } from "../shared";

interface RfqRow {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  service: string | null;
  clientType: string | null;
  procurementStage: string | null;
  saudiRoute: string | null;
  leadGrade: string | null;
  leadScore: number | null;
  status: string;
  source: string | null;
  createdAt: string;
}

export function LeadPipeline({ refreshSignal }: { refreshSignal?: number } = {}) {
  const t = useContent();
  const [rows, setRows] = React.useState<RfqRow[]>([]);
  const [counts, setCounts] = React.useState<{ A: number; B: number; C: number }>({ A: 0, B: 0, C: 0 });
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rfq", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setRows(data.rfqs);
        setCounts(data.counts);
        setTotal(data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (refreshSignal && refreshSignal > 0) load();
  }, [refreshSignal]);

  const gradeColor = (g: string | null) =>
    g === "A" ? "bg-brand text-brand-foreground" : g === "B" ? "bg-brand-2 text-brand-2-foreground" : "bg-muted text-muted-foreground";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-brand" />
          <div>
            <div className="text-sm font-semibold">Live RFQ pipeline</div>
            <div className="text-xs text-muted-foreground">A/B/C lead classification — synced from the database</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 pointer-events-none ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <div className="bg-card p-3 text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        {(["A", "B", "C"] as const).map((g) => (
          <div key={g} className="bg-card p-3 text-center">
            <div className={`mx-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${gradeColor(g)}`}>
              {g}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{counts[g] || 0} leads</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="max-h-96 overflow-y-auto scroll-area">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            No RFQs yet. Submit the form above to see leads appear here in real time.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary/80 backdrop-blur">
              <tr className="text-start">
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Grade</th>
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Contact</th>
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Service</th>
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Stage</th>
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Route</th>
                <th className="px-3 py-2 text-start font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30">
                  <td className="px-3 py-2">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${gradeColor(r.leadGrade)}`}>
                      {r.leadGrade || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.company || r.email}</div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{r.service || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.procurementStage || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.saudiRoute || "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
