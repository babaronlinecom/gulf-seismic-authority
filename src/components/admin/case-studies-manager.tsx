"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, X, Save, Quote } from "lucide-react";
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

interface CaseStudyRecord {
  id: string;
  slug: string;
  title: string;
  projectSlug: string | null;
  summary: string;
  outcomes: string | null;
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  testimonialRole: string | null;
  status: string;
  createdAt: string;
}

const EMPTY = {
  slug: "", title: "", projectSlug: "", summary: "", outcomes: "",
  testimonialQuote: "", testimonialAuthor: "", testimonialRole: "", status: "published",
};

export function CaseStudiesManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<CaseStudyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CaseStudyRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/admin/case-studies");
    const data = await res.json();
    setItems(data.caseStudies || []);
    setLoading(false);
  }

  function startEdit(cs: CaseStudyRecord) {
    setEditing(cs);
    setForm({
      slug: cs.slug, title: cs.title, projectSlug: cs.projectSlug || "",
      summary: cs.summary,
      outcomes: cs.outcomes ? JSON.parse(cs.outcomes).join("\n") : "",
      testimonialQuote: cs.testimonialQuote || "",
      testimonialAuthor: cs.testimonialAuthor || "",
      testimonialRole: cs.testimonialRole || "",
      status: cs.status,
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
        outcomes: form.outcomes ? form.outcomes.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      };
      const url = editing ? `/api/admin/case-studies/${editing.id}` : "/api/admin/case-studies";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: editing ? "Case study updated" : "Case study created" });
      setEditing(null);
      setCreating(false);
      fetchItems();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this case study?")) return;
    await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    toast({ title: "Case study deleted" });
    fetchItems();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} case studies</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Case Study
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No case studies yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((cs) => (
            <Card key={cs.id} className="p-4">
              <Quote className="h-6 w-6 text-amber-brand/40" />
              <h3 className="mt-2 truncate font-medium text-sm">{cs.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{cs.summary}</p>
              <div className="mt-2">
                <Badge className={
                  cs.status === "published"
                    ? "bg-green-600 text-white hover:bg-green-600"
                    : "bg-muted text-muted-foreground hover:bg-muted"
                }>
                  {cs.status}
                </Badge>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(cs)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/case-studies/${cs.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteItem(cs.id)} className="hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Case Study" : "New Case Study"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Summary</Label>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Outcomes (one per line)</Label>
              <Textarea value={form.outcomes} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} rows={4} placeholder="240 bays added&#10;Zero downtime" />
            </div>
            <div className="space-y-1.5">
              <Label>Testimonial Quote</Label>
              <Textarea value={form.testimonialQuote} onChange={(e) => setForm({ ...form, testimonialQuote: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Testimonial Author</Label>
                <Input value={form.testimonialAuthor} onChange={(e) => setForm({ ...form, testimonialAuthor: e.target.value })} placeholder="Project Director" />
              </div>
              <div className="space-y-1.5">
                <Label>Testimonial Role</Label>
                <Input value={form.testimonialRole} onChange={(e) => setForm({ ...form, testimonialRole: e.target.value })} placeholder="Confidential Client" />
              </div>
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
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
