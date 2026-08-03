"use client";

import { useState, useEffect } from "react";
import { Search, Download, Filter, Phone, Mail, MapPin, Clock, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  country: string;
  city: string | null;
  service: string | null;
  message: string;
  source: string | null;
  leadScore: number | null;
  status: string;
  funnel: string | null;
  campaign: string | null;
  notes: string | null;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "qualified", "quoted", "won", "lost"];

export function LeadsTable({ initialLeads, highlightId }: { initialLeads: Lead[]; highlightId?: string }) {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // If highlightId is set (from URL), open that lead
  useEffect(() => {
    if (highlightId) {
      const lead = leads.find((l) => l.id === highlightId);
      if (lead) setSelected(lead);
    }
  }, [highlightId, leads]);

  const filtered = leads.filter((l) => {
    const matchesSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.phone ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const matchesSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const sources = Array.from(new Set(leads.map((l) => l.source).filter(Boolean)));

  async function updateStatus(leadId: string, status: string) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
      setSelected((prev) => (prev?.id === leadId ? { ...prev, status } : prev));
      toast({ title: "Status updated", description: `Lead marked as ${status}` });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  }

  async function exportCsv() {
    const res = await fetch("/api/admin/leads/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gulf-seismic-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, company, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s!}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        <span>{lead.country}</span>
                        {lead.city && <span className="text-muted-foreground">· {lead.city}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {lead.service ? lead.service.replace(/-/g, " ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {lead.source ?? "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {lead.leadScore !== null && lead.leadScore > 0 ? (
                        <span className={
                          lead.leadScore >= 70 ? "font-bold text-green-600" :
                          lead.leadScore >= 50 ? "font-bold text-amber-brand" :
                          "text-muted-foreground"
                        }>
                          {lead.leadScore}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          lead.status === "new"
                            ? "bg-amber-brand text-amber-foreground hover:bg-amber-brand"
                            : lead.status === "won"
                            ? "bg-green-600 text-white hover:bg-green-600"
                            : lead.status === "lost"
                            ? "bg-destructive text-white hover:bg-destructive"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {leads.length} leads
      </p>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-[480px] overflow-y-auto sm:w-[540px]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {/* Contact info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Contact
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-2 hover:text-amber-brand">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}
                    </a>
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 hover:text-amber-brand">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}
                    </a>
                    {selected.company && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Company:</span> {selected.company}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selected.country}{selected.city && `, ${selected.city}`}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDistanceToNow(new Date(selected.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {/* Project info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Project Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Service:</span> {selected.service?.replace(/-/g, " ") ?? "—"}</div>
                    <div><span className="text-muted-foreground">Source:</span> {selected.source ?? "—"}</div>
                    <div><span className="text-muted-foreground">Funnel:</span> {selected.funnel ?? "—"}</div>
                    <div><span className="text-muted-foreground">Score:</span> {selected.leadScore ?? "—"}</div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </h4>
                  <div className="rounded-md border border-border bg-secondary/50 p-3 text-sm">
                    {selected.message}
                  </div>
                </div>

                {/* Status management */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Update Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selected.status === s ? "default" : "outline"}
                        disabled={updating}
                        onClick={() => updateStatus(selected.id, s)}
                        className={
                          selected.status === s && s === "new"
                            ? "bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
                            : selected.status === s && s === "won"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : ""
                        }
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={`mailto:${selected.email}?subject=Re: Your Gulf Seismic quote request`}>
                      <Mail className="mr-2 h-4 w-4" /> Reply by Email
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2 h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
