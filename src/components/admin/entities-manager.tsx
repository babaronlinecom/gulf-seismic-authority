"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Brain, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Entity {
  id: string; name: string; description: string; entityType: string;
  sameAs: string[]; properties: Record<string, string>;
}

const ENTITY_TYPES = ["Organization", "Service", "Place", "Product", "Person", "LocalBusiness", "ProfessionalService", "Thing"];

export function EntitiesManager() {
  const { toast } = useToast();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Entity | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", entityType: "Thing", sameAs: "", properties: "" });
  const [saving, setSaving] = useState(false);

  async function fetchEntities() {
    setLoading(true);
    const res = await fetch("/api/admin/entities");
    const data = await res.json();
    setEntities(data.entities || []);
    setLoading(false);
  }

  useEffect(() => { fetchEntities(); }, []);

  function startEdit(e: Entity) {
    setEditing(e);
    setForm({
      name: e.name, description: e.description, entityType: e.entityType,
      sameAs: e.sameAs.join("\n"), properties: Object.entries(e.properties).map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
    setCreating(false);
  }

  function startCreate() {
    setCreating(true); setEditing(null);
    setForm({ name: "", description: "", entityType: "Thing", sameAs: "", properties: "" });
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description, entityType: form.entityType,
        sameAs: form.sameAs.split("\n").map((s) => s.trim()).filter(Boolean),
        properties: form.properties ? Object.fromEntries(form.properties.split("\n").filter(Boolean).map((line) => {
          const [k, ...rest] = line.split(":"); return [k.trim(), rest.join(":").trim()];
        })) : {},
      };
      const res = await fetch("/api/admin/entities", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Entity saved" });
      setEditing(null); setCreating(false); fetchEntities();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deleteEntity(id: string) {
    if (!confirm("Delete this entity?")) return;
    await fetch(`/api/admin/entities/${id}`, { method: "DELETE" });
    toast({ title: "Entity deleted" });
    fetchEntities();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{entities.length} entities · Define what your business IS for AI</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Entity
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : entities.length === 0 ? (
        <Card className="p-8 text-center">
          <Brain className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No entities defined yet. Create your first entity to help AI understand your business.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="mb-1 text-xs">{e.entityType}</Badge>
                  <h3 className="truncate font-medium text-sm">{e.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.description}</p>
                  {e.sameAs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {e.sameAs.slice(0, 2).map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-brand hover:underline truncate max-w-[150px]">
                          <ExternalLink className="mr-0.5 inline h-3 w-3" />{new URL(url).hostname}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(e)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => deleteEntity(e.id)} className="hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Entity" : "New AI Entity"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Entity Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Gulf Seismic" /></div>
              <div className="space-y-1.5"><Label>Entity Type</Label>
                <Select value={form.entityType} onValueChange={(v) => setForm({ ...form, entityType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ENTITY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Gulf Seismic is a road marking contractor..." /></div>
            <div className="space-y-1.5"><Label>Same As URLs (one per line)</Label><Textarea value={form.sameAs} onChange={(e) => setForm({ ...form, sameAs: e.target.value })} rows={3} placeholder={"https://en.wikipedia.org/...\nhttps://www.linkedin.com/company/..."} /></div>
            <div className="space-y-1.5"><Label>Properties (key: value, one per line)</Label><Textarea value={form.properties} onChange={(e) => setForm({ ...form, properties: e.target.value })} rows={4} placeholder={"foundingDate: 2015\nareaServed: UAE, Saudi Arabia"} /></div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Entity"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
