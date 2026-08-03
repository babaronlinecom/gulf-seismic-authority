"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, Inbox, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FormRecord {
  id: string; name: string; slug: string; description: string | null;
  fields: { type: string; label: string; name: string; required?: boolean; options?: string[]; placeholder?: string }[];
  submitLabel: string; successMessage: string; emailTo: string | null;
  status: string; _count: number; createdAt: string;
}

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "date", label: "Date" },
];

export function FormsManager() {
  const router = useRouter();
  const { toast } = useToast();
  const [forms, setForms] = useState<FormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", description: "",
    submitLabel: "Submit", successMessage: "Thank you!", emailTo: "",
    fields: [] as { type: string; label: string; name: string; required?: boolean; options?: string[]; placeholder?: string }[],
  });
  const [saving, setSaving] = useState(false);

  async function fetchForms() {
    setLoading(true);
    const res = await fetch("/api/admin/forms");
    const data = await res.json();
    setForms(data.forms || []);
    setLoading(false);
  }

  useEffect(() => { fetchForms(); }, []);

  function addField() {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: "text", label: "New Field", name: `field_${prev.fields.length + 1}`, required: false }],
    }));
  }

  function updateField(index: number, key: string, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    }));
  }

  function removeField(index: number) {
    setForm((prev) => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));
  }

  async function save() {
    if (!form.name || !form.slug) {
      toast({ title: "Name and slug required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Form created" });
      setCreating(false);
      setForm({ name: "", slug: "", description: "", submitLabel: "Submit", successMessage: "Thank you!", emailTo: "", fields: [] });
      fetchForms();
    } catch {
      toast({ title: "Create failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteForm(id: string) {
    if (!confirm("Delete this form and all its submissions?")) return;
    await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
    toast({ title: "Form deleted" });
    fetchForms();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{forms.length} forms</p>
        <Button onClick={() => setCreating(true)} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Form
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : forms.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No forms yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-sm">{f.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{f.slug}</p>
                  {f.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.description}</p>}
                  <div className="mt-2 flex items-center gap-1.5">
                    <Badge className={f.status === "active" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted hover:bg-muted"}>{f.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Inbox className="mr-1 h-3 w-3" /> {f._count}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{f.fields.length} fields</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/forms/${f.id}`)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/forms/${f.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteForm(f.id)} className="hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>Create New Form</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Form Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact Form" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug * (URL path)</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="contact" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>

            {/* Fields builder */}
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Form Fields</p>
                <Button size="sm" variant="outline" onClick={addField}><Plus className="mr-1 h-3 w-3" /> Add Field</Button>
              </div>
              {form.fields.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">No fields yet. Click "Add Field" to start.</p>
              ) : (
                <div className="space-y-2">
                  {form.fields.map((field, i) => (
                    <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-border bg-background p-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(i, "type", e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Label</Label>
                        <Input value={field.label} onChange={(e) => updateField(i, "label", e.target.value)} className="h-8 w-[140px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Name</Label>
                        <Input value={field.name} onChange={(e) => updateField(i, "name", e.target.value)} className="h-8 w-[120px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input value={field.placeholder || ""} onChange={(e) => updateField(i, "placeholder", e.target.value)} className="h-8 w-[140px]" />
                      </div>
                      {(field.type === "select" || field.type === "radio") && (
                        <div className="space-y-1 w-full">
                          <Label className="text-xs">Options (comma-separated)</Label>
                          <Input
                            value={(field.options || []).join(", ")}
                            onChange={(e) => updateField(i, "options", e.target.value)}
                            className="h-8"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                      <label className="flex items-center gap-1 pb-2 text-xs">
                        <input type="checkbox" checked={!!field.required} onChange={(e) => updateField(i, "required", e.target.checked)} />
                        Required
                      </label>
                      <Button size="sm" variant="ghost" onClick={() => removeField(i)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Submit Button Label</Label><Input value={form.submitLabel} onChange={(e) => setForm({ ...form, submitLabel: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Notification Email</Label><Input value={form.emailTo} onChange={(e) => setForm({ ...form, emailTo: e.target.value })} placeholder="info@gulfseismic.com" /></div>
            </div>
            <div className="space-y-1.5"><Label>Success Message</Label><Textarea value={form.successMessage} onChange={(e) => setForm({ ...form, successMessage: e.target.value })} rows={2} /></div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                {saving ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
