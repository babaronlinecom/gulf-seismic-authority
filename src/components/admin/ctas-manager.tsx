"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, MousePointerClick } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Flow {
  id: string; name: string; pageUrl: string; ctaLabel: string; ctaUrl: string;
  ctaType: string; placement: string; intent: string; status: string;
}

const CTA_TYPES = ["primary", "secondary", "whatsapp", "call", "email"];
const PLACEMENTS = ["hero", "inline", "bottom", "sidebar", "floating"];
const INTENTS = ["awareness", "consideration", "conversion"];
const KEY_PAGES = ["/", "/uae", "/saudi-arabia", "/services/road-marking", "/services/thermoplastic-road-marking", "/services/parking-lot-marking", "/services/warehouse-marking", "/services/airport-marking", "/services/epoxy-flooring", "/projects", "/about", "/contact"];

const EMPTY = { name: "", pageUrl: "/", ctaLabel: "", ctaUrl: "", ctaType: "primary", placement: "bottom", intent: "conversion", status: "active" };

export function CtasManager() {
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Flow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function fetchFlows() {
    setLoading(true);
    const res = await fetch("/api/admin/conversion-flows");
    const data = await res.json();
    setFlows(data.flows || []);
    setLoading(false);
  }

  useEffect(() => { fetchFlows(); }, []);

  function startEdit(f: Flow) {
    setEditing(f);
    setForm({ name: f.name, pageUrl: f.pageUrl, ctaLabel: f.ctaLabel, ctaUrl: f.ctaUrl, ctaType: f.ctaType, placement: f.placement, intent: f.intent, status: f.status });
    setCreating(false);
  }

  function startCreate() { setCreating(true); setEditing(null); setForm(EMPTY); }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/conversion-flows/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/admin/conversion-flows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error();
      }
      toast({ title: "CTA saved" });
      setEditing(null); setCreating(false); fetchFlows();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deleteFlow(id: string) {
    if (!confirm("Delete this CTA?")) return;
    await fetch(`/api/admin/conversion-flows/${id}`, { method: "DELETE" });
    toast({ title: "CTA deleted" });
    fetchFlows();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{flows.length} conversion CTAs · Optimize search-to-lead flow</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Plus className="mr-1 h-4 w-4" /> New CTA</Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : flows.length === 0 ? (
        <Card className="p-8 text-center">
          <MousePointerClick className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No CTAs yet. Create conversion flows for your key pages.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {flows.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="mb-1 text-xs">{f.intent}</Badge>
                  <h3 className="truncate font-medium text-sm">{f.name}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{f.ctaLabel}</span> → {f.ctaUrl}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{f.ctaType}</Badge>
                    <Badge variant="outline" className="text-xs">{f.placement}</Badge>
                    <Badge variant="outline" className="text-xs">{f.pageUrl}</Badge>
                    <Badge className={f.status === "active" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted hover:bg-muted"}>{f.status}</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(f)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => deleteFlow(f.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{editing ? "Edit CTA" : "New Conversion CTA"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>CTA Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Homepage Quote CTA" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Page</Label><Select value={form.pageUrl} onValueChange={(v) => setForm({ ...form, pageUrl: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{KEY_PAGES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Intent</Label><Select value={form.intent} onValueChange={(v) => setForm({ ...form, intent: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{INTENTS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>CTA Label *</Label><Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Get a Free Quote" /></div>
              <div className="space-y-1.5"><Label>CTA URL *</Label><Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="/contact" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>CTA Type</Label><Select value={form.ctaType} onValueChange={(v) => setForm({ ...form, ctaType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CTA_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Placement</Label><Select value={form.placement} onValueChange={(v) => setForm({ ...form, placement: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PLACEMENTS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save CTA"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
