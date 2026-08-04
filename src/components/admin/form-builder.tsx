"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Inbox, Plus, X, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FormField {
  type: string; label: string; name: string; required?: boolean;
  options?: string[]; placeholder?: string;
}

interface Submission {
  id: string; data: Record<string, unknown>; status: string; createdAt: string;
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

export function FormBuilder({ formId }: { formId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<{
    name: string; slug: string; description: string;
    submitLabel: string; successMessage: string; emailTo: string;
    status: string; fields: FormField[];
  } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tab, setTab] = useState<"edit" | "submissions">("edit");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchForm(), fetchSubmissions()]);
  }, []);

  async function fetchForm() {
    const res = await fetch(`/api/admin/forms/${formId}`);
    const data = await res.json();
    if (data.form) {
      setForm({
        name: data.form.name, slug: data.form.slug,
        description: data.form.description || "",
        submitLabel: data.form.submitLabel, successMessage: data.form.successMessage,
        emailTo: data.form.emailTo || "", status: data.form.status,
        fields: data.form.fields || [],
      });
    }
    setLoading(false);
  }

  async function fetchSubmissions() {
    const res = await fetch(`/api/admin/forms/${formId}/submissions`);
    const data = await res.json();
    setSubmissions(data.submissions || []);
  }

  function addField() {
    if (!form) return;
    setForm({ ...form, fields: [...form.fields, { type: "text", label: "New Field", name: `field_${form.fields.length + 1}`, required: false }] });
  }

  function updateField(index: number, key: string, value: string | boolean | string[]) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)) });
  }

  function removeField(index: number) {
    if (!form) return;
    setForm({ ...form, fields: form.fields.filter((_, i) => i !== index) });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Form saved" });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteForm() {
    if (!confirm("Delete this form and all submissions?")) return;
    await fetch(`/api/admin/forms/${formId}`, { method: "DELETE" });
    toast({ title: "Form deleted" });
    router.push("/admin/forms");
  }

  if (loading) return <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>;
  if (!form) return <p className="py-12 text-center text-sm text-muted-foreground">Form not found</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-bold">{form.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={deleteForm} className="hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="mr-1 h-4 w-4" /> Delete
          </Button>
          <Button size="sm" onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={tab === "edit" ? "default" : "outline"} size="sm" onClick={() => setTab("edit")}>
          Edit Form
        </Button>
        <Button variant={tab === "submissions" ? "default" : "outline"} size="sm" onClick={() => setTab("submissions")}>
          <Inbox className="mr-1 h-4 w-4" /> Submissions ({submissions.length})
        </Button>
      </div>

      {tab === "edit" ? (
        <div className="space-y-4">
          {/* Basic settings */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Form Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <div className="mt-3 space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>Submit Label</Label><Input value={form.submitLabel} onChange={(e) => setForm({ ...form, submitLabel: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Notification Email</Label><Input value={form.emailTo} onChange={(e) => setForm({ ...form, emailTo: e.target.value })} /></div>
            </div>
            <div className="mt-3 space-y-1.5"><Label>Success Message</Label><Textarea value={form.successMessage} onChange={(e) => setForm({ ...form, successMessage: e.target.value })} rows={2} /></div>
          </Card>

          {/* Fields */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Form Fields ({form.fields.length})</h3>
              <Button size="sm" variant="outline" onClick={addField}><Plus className="mr-1 h-3 w-3" /> Add Field</Button>
            </div>
            {form.fields.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No fields. Click "Add Field" to start.</p>
            ) : (
              <div className="space-y-2">
                {form.fields.map((field, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-border bg-secondary/30 p-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-sm">
                        {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Label</Label><Input value={field.label} onChange={(e) => updateField(i, "label", e.target.value)} className="h-8 w-[140px]" /></div>
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={field.name} onChange={(e) => updateField(i, "name", e.target.value)} className="h-8 w-[120px]" /></div>
                    <div className="space-y-1"><Label className="text-xs">Placeholder</Label><Input value={field.placeholder || ""} onChange={(e) => updateField(i, "placeholder", e.target.value)} className="h-8 w-[140px]" /></div>
                    {(field.type === "select" || field.type === "radio") && (
                      <div className="space-y-1 w-full"><Label className="text-xs">Options (comma-separated)</Label><Input value={(field.options || []).join(", ")} onChange={(e) => updateField(i, "options", e.target.value.split(",").map((s) => s.trim()))} className="h-8" /></div>
                    )}
                    <label className="flex items-center gap-1 pb-2 text-xs"><input type="checkbox" checked={!!field.required} onChange={(e) => updateField(i, "required", e.target.checked)} /> Required</label>
                    <Button size="sm" variant="ghost" onClick={() => removeField(i)} className="h-8 hover:bg-destructive/10 hover:text-destructive"><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : (
        /* Submissions */
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <Card className="p-12 text-center">
              <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No submissions yet.</p>
            </Card>
          ) : (
            submissions.map((sub) => (
              <Card key={sub.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{sub.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(sub.data).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>{" "}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
