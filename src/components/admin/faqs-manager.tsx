"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, MessageSquare, Search } from "lucide-react";
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

interface Faq {
  id: string; question: string; answer: string; category: string;
  entity: string | null; pageUrl: string | null; status: string;
}

const CATEGORIES = ["general", "cost", "comparison", "process", "compliance", "local"];
const KEY_PAGES = ["/", "/uae", "/saudi-arabia", "/services/road-marking", "/services/thermoplastic-road-marking", "/services/parking-lot-marking", "/services/warehouse-marking", "/services/airport-marking", "/services/epoxy-flooring", "/projects", "/about", "/contact"];

export function FaqsManager() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", category: "general", entity: "", pageUrl: "", status: "published" });
  const [saving, setSaving] = useState(false);

  async function fetchFaqs() {
    setLoading(true);
    const res = await fetch("/api/admin/faq-clusters");
    const data = await res.json();
    setFaqs(data.faqs || []);
    setLoading(false);
  }

  useEffect(() => { fetchFaqs(); }, []);

  function startEdit(f: Faq) {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, entity: f.entity || "", pageUrl: f.pageUrl || "", status: f.status });
    setCreating(false);
  }

  function startCreate() {
    setCreating(true); setEditing(null);
    setForm({ question: "", answer: "", category: "general", entity: "", pageUrl: "", status: "published" });
  }

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/faq-clusters/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/admin/faq-clusters", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      }
      toast({ title: "FAQ saved" });
      setEditing(null); setCreating(false); fetchFaqs();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deleteFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faq-clusters/${id}`, { method: "DELETE" });
    toast({ title: "FAQ deleted" });
    fetchFaqs();
  }

  const filtered = faqs.filter((f) =>
    (!search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())) &&
    (filterCat === "all" || f.category === filterCat)
  );

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New FAQ
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No FAQs yet. Create answer-targeted FAQs for AI search engines.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{f.category}</Badge>
                    {f.pageUrl && <Badge variant="outline" className="text-xs">{f.pageUrl}</Badge>}
                    <Badge className={f.status === "published" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted hover:bg-muted"}>{f.status}</Badge>
                  </div>
                  <h3 className="mt-1 font-medium text-sm">{f.question}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="sm" variant="outline" onClick={() => startEdit(f)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => deleteFaq(f.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Question *</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="How much does thermoplastic road marking cost in Dubai?" /></div>
            <div className="space-y-1.5"><Label>Answer *</Label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} placeholder="Provide a direct, factual, citation-worthy answer..." /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>Category</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Page</Label><Select value={form.pageUrl} onValueChange={(v) => setForm({ ...form, pageUrl: v })}><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger><SelectContent><SelectItem value="">None</SelectItem>{KEY_PAGES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label>Related Entity (for AI knowledge graph)</Label><Input value={form.entity} onChange={(e) => setForm({ ...form, entity: e.target.value })} placeholder="Thermoplastic Road Marking" /></div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save FAQ"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
