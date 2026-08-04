"use client";

import { useState, useEffect } from "react";
import { Save, Settings, Phone, Mail, MapPin, Clock, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function SiteSettingsManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchSettings() {
    setLoading(true);
    const res = await fetch("/api/admin/settings/site");
    const data = await res.json();
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(data.settings || {})) {
      flat[k] = Array.isArray(v) ? v.join(", ") : String(v);
    }
    setSettings(flat);
    setLoading(false);
  }

  useEffect(() => { fetchSettings(); }, []);

  async function save() {
    setSaving(true);
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(settings)) {
      // Parse comma-separated arrays for known array fields
      if (k === "certifications") {
        payload[k] = v.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        payload[k] = v;
      }
    }
    const res = await fetch("/api/admin/settings/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: payload }),
    });
    setSaving(false);
    if (res.ok) toast({ title: "Site settings saved" });
    else toast({ title: "Save failed", variant: "destructive" });
  }

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) return <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Brand */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Settings className="h-4 w-4 text-amber-brand" /> Brand</h3>
        <div className="mb-4 flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo preview" className="h-12 w-auto object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">No logo</div>
          )}
          <div className="flex-1 space-y-1.5">
            <Label>Logo URL</Label>
            <Input value={settings.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} placeholder="/logo.png or https://..." />
            <p className="text-xs text-muted-foreground">Upload to Media Library, then paste URL here. Updates header, footer, and admin.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Site Name</Label><Input value={settings.siteName || ""} onChange={(e) => update("siteName", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Logo Text (fallback)</Label><Input value={settings.logoText || ""} onChange={(e) => update("logoText", e.target.value)} placeholder="GS" /></div>
        </div>
        <div className="mt-3 space-y-1.5"><Label>Tagline</Label><Input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} /></div>
      </Card>

      {/* Contact */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Phone className="h-4 w-4 text-amber-brand" /> Contact Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Phone</Label><Input value={settings.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>WhatsApp (digits only)</Label><Input value={settings.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} placeholder="97150000000" /></div>
          <div className="space-y-1.5"><Label><Mail className="mr-1 inline h-3 w-3" /> Email</Label><Input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
          <div className="space-y-1.5"><Label><MapPin className="mr-1 inline h-3 w-3" /> Address</Label><Input value={settings.address || ""} onChange={(e) => update("address", e.target.value)} /></div>
        </div>
        <div className="mt-3 space-y-1.5"><Label><Clock className="mr-1 inline h-3 w-3" /> Working Hours</Label><Input value={settings.workingHours || ""} onChange={(e) => update("workingHours", e.target.value)} /></div>
      </Card>

      {/* Social */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Link2 className="h-4 w-4 text-amber-brand" /> Social Links</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>LinkedIn URL</Label><Input value={settings.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Instagram URL</Label><Input value={settings.instagram || ""} onChange={(e) => update("instagram", e.target.value)} /></div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Footer Content</h3>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Footer About Text</Label><Textarea value={settings.footerAbout || ""} onChange={(e) => update("footerAbout", e.target.value)} rows={3} /></div>
          <div className="space-y-1.5"><Label>Certifications (comma-separated)</Label><Input value={settings.certifications || ""} onChange={(e) => update("certifications", e.target.value)} placeholder="ISO 9001, ICAO Annex 14" /></div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
