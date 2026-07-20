"use client";

import * as React from "react";
import { Upload, X, FileText, CheckCircle2, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "../shared";
import { toast } from "sonner";

interface Attachment {
  name: string;
  size: number;
  type: string;
}

export function RfqForm({ onSubmitted }: { onSubmitted?: () => void } = {}) {
  const t = useContent();
  const f = t.contactRfq.fields;
  const o = t.contactRfq.options;
  const [form, setForm] = React.useState<Record<string, string>>({
    name: "", company: "", role: "", email: "", phone: "",
    country: "", city: "", projectName: "", quantity: "", surface: "",
    completionDate: "", message: "",
  });
  const [clientType, setClientType] = React.useState("");
  const [service, setService] = React.useState("");
  const [procurementStage, setProcurementStage] = React.useState("");
  const [saudiRoute, setSaudiRoute] = React.useState("");
  const [preferredContact, setPreferredContact] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{ grade: string; score: number } | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = ["image/", "application/pdf", "text/", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument", "application/zip", "application/dwg", "image/vnd.dwg"];
    const next: Attachment[] = [];
    Array.from(files).slice(0, 5).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name}: max 8MB`);
        return;
      }
      const ok = allowed.some((p) => file.type.startsWith(p)) || file.name.match(/\.(pdf|dwg|dxf|jpg|jpeg|png|gif|webp|xls|xlsx|docx|zip|txt)$/i);
      if (!ok) {
        toast.error(`${file.name}: unsupported file type`);
        return;
      }
      next.push({ name: file.name, size: file.size, type: file.type || "application/octet-stream" });
    });
    setAttachments((prev) => [...prev, ...next].slice(0, 5));
  };

  const removeAtt = (i: number) => setAttachments((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    if (!consent) {
      toast.error("Please provide consent");
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          clientType, service, procurementStage, saudiRoute, preferredContact,
          consent, attachments, source: "contact",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
      setResult({ grade: data.grade, score: data.score });
      toast.success(f.success);
      onSubmitted?.();
      // reset
      setForm({ name: "", company: "", role: "", email: "", phone: "", country: "", city: "", projectName: "", quantity: "", surface: "", completionDate: "", message: "" });
      setClientType(""); setService(""); setProcurementStage(""); setSaudiRoute(""); setPreferredContact("");
      setConsent(false); setAttachments([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="rounded-xl border border-brand/40 bg-brand/5 p-6 sm:p-8 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold">{f.success}</h3>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Lead grade:</span>
          <span className="font-bold text-brand text-lg">{result.grade}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">score {result.score}</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {result.grade === "A"
            ? "Active project detected — you'll receive a technical response within one working day."
            : result.grade === "B"
            ? "Clear need — we'll help complete the scope, then respond within two working days."
            : "Thank you — we'll share capability and resources within three working days."}
        </p>
        <Button variant="outline" onClick={() => setResult(null)}>Submit another RFQ</Button>
      </div>
    );
  }

  const fieldCls = "h-11";

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Contact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.name} required>
          <Input className={fieldCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </Field>
        <Field label={f.company}>
          <Input className={fieldCls} value={form.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <Field label={f.role}>
          <Input className={fieldCls} value={form.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
        <Field label={f.email} required>
          <Input className={fieldCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </Field>
        <Field label={f.phone}>
          <Input className={fieldCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={f.country}>
            <Input className={fieldCls} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="SA / AE / QA" />
          </Field>
          <Field label={f.city}>
            <Input className={fieldCls} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Riyadh / Dubai" />
          </Field>
        </div>
      </div>

      {/* Project */}
      <div className="h-px bg-border" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.projectName}>
          <Input className={fieldCls} value={form.projectName} onChange={(e) => set("projectName", e.target.value)} />
        </Field>
        <Field label={f.clientType}>
          <Select value={clientType} onValueChange={setClientType}>
            <SelectTrigger className={fieldCls}><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{o.clientType.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={f.service}>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className={fieldCls}><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{o.service.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={f.quantity}>
          <Input className={fieldCls} value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 12,000 lm" />
        </Field>
        <Field label={f.surface}>
          <Input className={fieldCls} value={form.surface} onChange={(e) => set("surface", e.target.value)} placeholder="asphalt / concrete / condition" />
        </Field>
        <Field label={f.completionDate}>
          <Input className={fieldCls} type="date" value={form.completionDate} onChange={(e) => set("completionDate", e.target.value)} />
        </Field>
        <Field label={f.procurementStage}>
          <Select value={procurementStage} onValueChange={setProcurementStage}>
            <SelectTrigger className={fieldCls}><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{o.procurementStage.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={f.saudiRoute}>
          <Select value={saudiRoute} onValueChange={setSaudiRoute}>
            <SelectTrigger className={fieldCls}><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{o.saudiRoute.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label={f.preferredContact}>
          <Select value={preferredContact} onValueChange={setPreferredContact}>
            <SelectTrigger className={fieldCls}><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>{o.preferredContact.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>

      <Field label={f.message}>
        <Textarea rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Brief: scope, site, programme, access, acceptance criteria…" />
      </Field>

      {/* Attachments */}
      <Field label={f.attachments}>
        <div
          className="rounded-lg border-2 border-dashed border-border p-5 text-center transition hover:border-brand/50 cursor-pointer"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        >
          <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Click or drop drawings / specifications (PDF, DWG, images — max 8MB, up to 5)</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.docx,.zip,.txt,image/*,application/pdf"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
        {attachments.length > 0 && (
          <ul className="mt-3 space-y-2">
            {attachments.map((a, i) => (
              <li key={i} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm">
                <FileText className="h-4 w-4 text-brand shrink-0" />
                <span className="flex-1 truncate">{a.name}</span>
                <span className="text-xs text-muted-foreground">{(a.size / 1024).toFixed(0)} KB</span>
                <button type="button" onClick={() => removeAtt(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <span className="text-xs text-muted-foreground leading-relaxed">{f.consent}</span>
      </label>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto amber-glow bg-brand text-brand-foreground hover:brightness-105">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:rotate-180" />}
        {f.submit}
      </Button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label} {required && <span className="text-brand">*</span>}
      </Label>
      {children}
    </div>
  );
}
