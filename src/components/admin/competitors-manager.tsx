"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ExternalLink, Users, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Competitor {
  id: string; name: string; url: string; country: string | null;
  services: string[]; strengths: string | null; weaknesses: string | null;
  ranking: number | null; notes: string | null;
}

const EMPTY = { name: "", url: "", country: "", services: "", strengths: "", weaknesses: "", ranking: "", notes: "" };

export function CompetitorsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Competitor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/admin/competitors");
    const data = await res.json();
    setItems(data.competitors || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function startEdit(c: Competitor) {
    setEditing(c);
    setForm({
      name: c.name, url: c.url, country: c.country || "",
      services: c.services.join(", "), strengths: c.strengths || "",
      weaknesses: c.weaknesses || "", ranking: c.ranking ? String(c.ranking) : "",
      notes: c.notes || "",
    });
    setCreating(false);
  }

  function startCreate() { setCreating(true); setEditing(null); setForm(EMPTY); }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        services: form.services ? form.services.split(",").map((s) => s.trim()).filter(Boolean) : [],
        ranking: form.ranking ? Number(form.ranking) : null,
      };
      const url = editing ? `/api/admin/competitors/${editing.id}` : "/api/admin/competitors";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast({ title: editing ? "Competitor updated" : "Competitor added" });
      setEditing(null); setCreating(false); fetchItems();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this competitor?")) return;
    await fetch(`/api/admin/competitors/${id}`, { method: "DELETE" });
    toast({ title: "Competitor deleted" });
    fetchItems();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} competitors tracked</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> Add Competitor
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No competitors tracked yet. Add competitors to identify keyword gaps and opportunities.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-sm">{c.name}</h3>
                    {c.ranking && <Badge variant="outline" className="text-xs">#{c.ranking}</Badge>}
                  </div>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 flex items-center gap-1 text-xs text-amber-brand hover:underline truncate">
                    <ExternalLink className="h-3 w-3" /> {c.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                  {c.country && <p className="mt-1 text-xs text-muted-foreground">{c.country}</p>}
                  {c.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.services.slice(0, 4).map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                  )}
                  {c.strengths && <p className="mt-2 text-xs text-muted-foreground"><span className="font-medium text-green-600">Strengths:</span> {c.strengths}</p>}
                  {c.weaknesses && <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-red-600">Weaknesses:</span> {c.weaknesses}</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(c)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => deleteItem(c.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Competitor" : "Add Competitor"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Competitor Name" /></div>
              <div className="space-y-1.5"><Label>URL *</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="UAE" /></div>
              <div className="space-y-1.5"><Label>Ranking (1-10)</Label><Input type="number" min="1" max="10" value={form.ranking} onChange={(e) => setForm({ ...form, ranking: e.target.value })} placeholder="3" /></div>
            </div>
            <div className="space-y-1.5"><Label>Services (comma-separated)</Label><Input value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Road Marking, Epoxy Flooring" /></div>
            <div className="space-y-1.5"><Label>Strengths</Label><Textarea value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} rows={2} placeholder="What do they do well?" /></div>
            <div className="space-y-1.5"><Label>Weaknesses</Label><Textarea value={form.weaknesses} onChange={(e) => setForm({ ...form, weaknesses: e.target.value })} rows={2} placeholder="Where can you outperform them?" /></div>
            <div className="space-y-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}><X className="mr-1 h-4 w-4" /> Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
