"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Layout } from "lucide-react";
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

interface HeroRecord {
  id: string; page: string; eyebrow: string | null; heading: string;
  subheading: string | null; ctaLabel: string | null; ctaUrl: string | null;
  cta2Label: string | null; cta2Url: string | null; stats: string | null; order: number;
}

const EMPTY = {
  page: "home", eyebrow: "", heading: "", subheading: "",
  ctaLabel: "", ctaUrl: "", cta2Label: "", cta2Url: "", stats: "",
};

export function HeroManager() {
  const { toast } = useToast();
  const [heroes, setHeroes] = useState<HeroRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHeroes(); }, []);

  async function fetchHeroes() {
    setLoading(true);
    const res = await fetch("/api/admin/hero");
    const data = await res.json();
    setHeroes(data.heroes || []);
    setLoading(false);
  }

  function startEdit(h: HeroRecord) {
    setEditing(h);
    let statsStr = "";
    if (h.stats) {
      try {
        const parsed = JSON.parse(h.stats) as { label: string; value: string }[];
        statsStr = parsed.map((s) => `${s.label}: ${s.value}`).join("\n");
      } catch { statsStr = ""; }
    }
    setForm({
      page: h.page, eyebrow: h.eyebrow || "", heading: h.heading,
      subheading: h.subheading || "", ctaLabel: h.ctaLabel || "", ctaUrl: h.ctaUrl || "",
      cta2Label: h.cta2Label || "", cta2Url: h.cta2Url || "", stats: statsStr,
    });
    setCreating(false);
  }

  function startCreate() { setCreating(true); setEditing(null); setForm(EMPTY); }

  async function save() {
    setSaving(true);
    try {
      const statsArr = form.stats ? form.stats.split("\n").filter(Boolean).map((line) => {
        const [label, ...rest] = line.split(":");
        return { label: label.trim(), value: rest.join(":").trim() };
      }) : [];
      const payload = { ...form, stats: statsArr };
      const url = editing ? `/api/admin/hero/${editing.id}` : "/api/admin/hero";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast({ title: editing ? "Hero updated" : "Hero created" });
      setEditing(null); setCreating(false); fetchHeroes();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deleteHero(id: string) {
    if (!confirm("Delete this hero section?")) return;
    await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
    toast({ title: "Hero deleted" });
    fetchHeroes();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{heroes.length} hero sections</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Hero
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : heroes.length === 0 ? (
        <Card className="p-12 text-center">
          <Layout className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No hero sections yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {heroes.map((h) => (
            <Card key={h.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="mb-1 text-xs">Page: {h.page}</Badge>
                  <h3 className="font-medium text-sm">{h.heading}</h3>
                  {h.subheading && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.subheading}</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(h)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => deleteHero(h.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Hero Section" : "New Hero Section"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Page</Label>
                <Select value={form.page} onValueChange={(v) => setForm({ ...form, page: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Heading *</Label>
                <Input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Eyebrow (small text above heading)</Label>
              <Input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} placeholder="Serving 16 cities..." />
            </div>
            <div className="space-y-1.5">
              <Label>Subheading</Label>
              <Textarea value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Primary CTA Label</Label><Input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} placeholder="Get a Quote" /></div>
              <div className="space-y-1.5"><Label>Primary CTA URL</Label><Input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="/contact" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Secondary CTA Label</Label><Input value={form.cta2Label} onChange={(e) => setForm({ ...form, cta2Label: e.target.value })} placeholder="Explore Services" /></div>
              <div className="space-y-1.5"><Label>Secondary CTA URL</Label><Input value={form.cta2Url} onChange={(e) => setForm({ ...form, cta2Url: e.target.value })} placeholder="/services/road-marking" /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Stats (format: Label: Value, one per line)</Label>
              <Textarea value={form.stats} onChange={(e) => setForm({ ...form, stats: e.target.value })} rows={4} placeholder="Cities served: 16&#10;Projects: 850+" />
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}><X className="mr-1 h-4 w-4" /> Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Hero"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
