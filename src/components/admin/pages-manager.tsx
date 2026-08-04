"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, X, Save, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PageRecord {
  id: string; slug: string; title: string;
  heroHeading: string | null; heroDescription: string | null; heroEyebrow: string | null;
  content: string; excerpt: string | null;
  seoTitle: string | null; seoDescription: string | null;
  status: string; showInHeader: boolean; showInFooter: boolean;
  createdAt: string;
}

const EMPTY = {
  slug: "", title: "", heroEyebrow: "", heroHeading: "", heroDescription: "",
  content: "", excerpt: "", seoTitle: "", seoDescription: "",
  status: "published", showInHeader: false, showInFooter: false,
};

export function PagesManager() {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPages(); }, []);

  async function fetchPages() {
    setLoading(true);
    const res = await fetch("/api/admin/pages");
    const data = await res.json();
    setPages(data.pages || []);
    setLoading(false);
  }

  function startEdit(p: PageRecord) {
    setEditing(p);
    setForm({
      slug: p.slug, title: p.title,
      heroEyebrow: p.heroEyebrow || "", heroHeading: p.heroHeading || "",
      heroDescription: p.heroDescription || "",
      content: p.content, excerpt: p.excerpt || "",
      seoTitle: p.seoTitle || "", seoDescription: p.seoDescription || "",
      status: p.status, showInHeader: p.showInHeader, showInFooter: p.showInFooter,
    });
    setCreating(false);
  }

  function startCreate() {
    setCreating(true); setEditing(null); setForm(EMPTY);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/pages/${editing.id}` : "/api/admin/pages";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: editing ? "Page updated" : "Page created" });
      setEditing(null); setCreating(false); fetchPages();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally { setSaving(false); }
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    toast({ title: "Page deleted" });
    fetchPages();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pages.length} pages</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Page
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : pages.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No pages yet. Create your first page.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-sm">{p.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{p.slug}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge className={p.status === "published" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted text-muted-foreground hover:bg-muted"}>
                      {p.status}
                    </Badge>
                    {p.showInHeader && <Badge variant="outline" className="text-xs">Header</Badge>}
                    {p.showInFooter && <Badge variant="outline" className="text-xs">Footer</Badge>}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => deletePage(p.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug * (URL path)</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="about" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hero Section</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Eyebrow</Label>
                  <Input value={form.heroEyebrow} onChange={(e) => setForm({ ...form, heroEyebrow: e.target.value })} placeholder="About Us" />
                </div>
                <div className="space-y-1.5">
                  <Label>Hero Heading</Label>
                  <Input value={form.heroHeading} onChange={(e) => setForm({ ...form, heroHeading: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Hero Description</Label>
                  <Textarea value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} rows={2} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Content</Label>
              <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} placeholder="Start writing page content..." />
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>SEO Title</Label>
                  <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>SEO Description</Label>
                  <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <Checkbox checked={form.showInHeader} onCheckedChange={(v) => setForm({ ...form, showInHeader: !!v })} />
                Show in Header
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <Checkbox checked={form.showInFooter} onCheckedChange={(v) => setForm({ ...form, showInFooter: !!v })} />
                Show in Footer
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}><X className="mr-1 h-4 w-4" /> Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Page"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
