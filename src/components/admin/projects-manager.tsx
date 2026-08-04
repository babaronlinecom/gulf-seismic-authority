"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, X, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { countries, cities, services, industries } from "@/lib/gulf-data";

interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  country: string;
  city: string | null;
  service: string | null;
  industry: string | null;
  client: string | null;
  year: number | null;
  duration: string | null;
  location: string | null;
  area: string | null;
  challenge: string | null;
  solution: string | null;
  execution: string | null;
  materials: string | null;
  equipment: string | null;
  results: string | null;
  status: string;
  createdAt: string;
}

const EMPTY = {
  slug: "", title: "", country: "uae", city: "", service: "", industry: "",
  client: "", year: new Date().getFullYear(), duration: "", location: "", area: "",
  challenge: "", solution: "", execution: "", materials: "", equipment: "",
  results: "", status: "published",
};

export function ProjectsManager() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  function startEdit(p: ProjectRecord) {
    setEditing(p);
    setForm({
      slug: p.slug, title: p.title, country: p.country, city: p.city || "",
      service: p.service || "", industry: p.industry || "", client: p.client || "",
      year: p.year || new Date().getFullYear(), duration: p.duration || "",
      location: p.location || "", area: p.area || "", challenge: p.challenge || "",
      solution: p.solution || "", execution: p.execution || "",
      materials: p.materials ? JSON.parse(p.materials).join("\n") : "",
      equipment: p.equipment ? JSON.parse(p.equipment).join("\n") : "",
      results: p.results ? (JSON.parse(p.results) as {label:string,value:string}[]).map((r) => `${r.label}: ${r.value}`).join("\n") : "",
      status: p.status,
    });
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(EMPTY);
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : null,
        materials: form.materials ? form.materials.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        equipment: form.equipment ? form.equipment.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        results: form.results ? form.results.split("\n").filter(Boolean).map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: label.trim(), value: rest.join(":").trim() };
        }) : [],
      };
      const url = editing ? `/api/admin/projects/${editing.id}` : "/api/admin/projects";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: editing ? "Project updated" : "Project created" });
      setEditing(null);
      setCreating(false);
      fetchProjects();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    toast({ title: "Project deleted" });
    fetchProjects();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Project
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No projects yet. Click "New Project" to create one.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-sm">{p.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.country} · {p.city || "—"} · {p.service?.replace(/-/g, " ") || "—"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{p.year || "—"}</Badge>
                    <Badge className={
                      p.status === "published"
                        ? "bg-green-600 text-white hover:bg-green-600"
                        : "bg-muted text-muted-foreground hover:bg-muted"
                    }>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteProject(p.id)} className="hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="project-slug" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.flag} {c.shortName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {cities.filter((c) => c.country === form.country).map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Service</Label>
                <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select value={form.industry} onValueChange={(v) => setForm({ ...form, industry: v })}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => <SelectItem key={i.slug} value={i.slug}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Year</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="3 weeks" />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Confidential [Type]" />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Sheikh Zayed Road, Dubai" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Area / Scope</Label>
              <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="12,000 m²" />
            </div>
            <div className="space-y-1.5">
              <Label>Challenge</Label>
              <Textarea value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Solution</Label>
              <Textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Execution</Label>
              <Textarea value={form.execution} onChange={(e) => setForm({ ...form, execution: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Materials (one per line)</Label>
                <Textarea value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} rows={3} placeholder="Thermoplastic&#10;Glass beads" />
              </div>
              <div className="space-y-1.5">
                <Label>Equipment (one per line)</Label>
                <Textarea value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} rows={3} placeholder="Self-propelled applicator&#10;Water-blaster" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Results (format: Label: Value, one per line)</Label>
              <Textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} rows={3} placeholder="Distance marked: 42 km&#10;Line applied: 168 km" />
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
