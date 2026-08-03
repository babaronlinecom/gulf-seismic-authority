"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface FormField {
  type: string; label: string; name: string; required?: boolean;
  options?: string[]; placeholder?: string;
}

interface FormData {
  name: string; slug: string; description: string | null;
  fields: FormField[]; submitLabel: string; successMessage: string; status: string;
}

export function PublicFormRenderer({ form }: { form: FormData }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${form.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Thank You!</h2>
        <p className="mt-2 text-muted-foreground">{form.successMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      {form.description && <p className="mb-6 text-sm text-muted-foreground">{form.description}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.fields.map((field, i) => (
          <div key={i} className="space-y-1.5">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                value={values[field.name] || ""}
                onChange={(e) => update(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
              />
            ) : field.type === "select" ? (
              <Select value={values[field.name] || ""} onValueChange={(v) => update(field.name, v)}>
                <SelectTrigger><SelectValue placeholder={field.placeholder || "Select..."} /></SelectTrigger>
                <SelectContent>
                  {(field.options || []).map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values[field.name] === "true"}
                  onChange={(e) => update(field.name, e.target.checked ? "true" : "false")}
                  required={field.required}
                  className="h-4 w-4"
                />
                <span className="text-sm">{field.placeholder || field.label}</span>
              </label>
            ) : (
              <Input
                id={field.name}
                type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
                value={values[field.name] || ""}
                onChange={(e) => update(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"
        >
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> {form.submitLabel}</>
          )}
        </Button>
      </form>
    </Card>
  );
}
