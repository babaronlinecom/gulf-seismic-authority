"use client";

import { useState, useEffect } from "react";
import { Search, Save, Check, X, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface SeoProfile {
  id?: string; pageUrl: string; metaTitle: string | null; metaDescription: string | null;
  canonicalUrl: string | null; robotsIndex: boolean; robotsFollow: boolean;
  ogTitle: string | null; ogDescription: string | null; ogImage: string | null;
  twitterCard: string; focusKeyword: string | null; secondaryKeywords: string | null;
}

export function PageOptimizer({ pages }: { pages: { url: string; label: string }[] }) {
  const { toast } = useToast();
  const [selectedUrl, setSelectedUrl] = useState(pages[0]?.url || "/");
  const [profile, setProfile] = useState<SeoProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(selectedUrl); }, [selectedUrl]);

  async function fetchProfile(url: string) {
    setLoading(true);
    const res = await fetch("/api/admin/seo-profiles");
    const data = await res.json();
    const found = (data.profiles as SeoProfile[]).find((p) => p.pageUrl === url);
    setProfile(found || {
      pageUrl: url, metaTitle: "", metaDescription: "", canonicalUrl: "",
      robotsIndex: true, robotsFollow: true, ogTitle: "", ogDescription: "",
      ogImage: "", twitterCard: "summary_large_image", focusKeyword: "", secondaryKeywords: "",
    });
    setLoading(false);
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      toast({ title: "SEO profile saved" });
      fetchProfile(selectedUrl);
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function update(field: keyof SeoProfile, value: string | boolean) {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  const titleLen = profile?.metaTitle?.length || 0;
  const descLen = profile?.metaDescription?.length || 0;

  return (
    <div className="space-y-4">
      {/* Page selector */}
      <div className="flex flex-wrap items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedUrl}
          onChange={(e) => setSelectedUrl(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {pages.map((p) => <option key={p.url} value={p.url}>{p.label} ({p.url})</option>)}
        </select>
        <Button asChild variant="ghost" size="sm">
          <a href={`https://gulf-seismic-authority.vercel.app${selectedUrl}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : profile ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* SEO Meta */}
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Search className="h-4 w-4 text-amber-brand" /> SEO Meta Tags
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Focus Keyword</Label>
                <Input value={profile.focusKeyword || ""} onChange={(e) => update("focusKeyword", e.target.value)} placeholder="road marking Dubai" />
              </div>
              <div className="space-y-1.5">
                <Label>Meta Title <span className={`text-xs ${titleLen > 60 ? "text-destructive" : "text-muted-foreground"}`}>({titleLen}/60)</span></Label>
                <Input value={profile.metaTitle || ""} onChange={(e) => update("metaTitle", e.target.value)} placeholder="Road Marking Dubai | Gulf Seismic" maxLength={70} />
              </div>
              <div className="space-y-1.5">
                <Label>Meta Description <span className={`text-xs ${descLen > 160 ? "text-destructive" : "text-muted-foreground"}`}>({descLen}/160)</span></Label>
                <Textarea value={profile.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} rows={2} maxLength={170} placeholder="Professional road marking contractors in Dubai..." />
              </div>
              <div className="space-y-1.5">
                <Label>Canonical URL</Label>
                <Input value={profile.canonicalUrl || ""} onChange={(e) => update("canonicalUrl", e.target.value)} placeholder="https://gulfseismic.com/..." />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={profile.robotsIndex} onCheckedChange={(v) => update("robotsIndex", !!v)} /> Index
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={profile.robotsFollow} onCheckedChange={(v) => update("robotsFollow", !!v)} /> Follow
                </label>
              </div>
            </div>
          </Card>

          {/* Google Preview */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Google Search Preview</h3>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-green-700">{`gulfseismic.com${selectedUrl}`}</div>
              <div className="mt-1 text-lg font-medium text-blue-700 hover:underline cursor-pointer">
                {profile.metaTitle || "Untitled Page — add a meta title"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {profile.metaDescription || "Add a meta description to control how this page appears in Google search results."}
              </div>
            </div>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {titleLen > 0 && titleLen <= 60 ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />}
                Title length {titleLen <= 60 ? "optimal" : titleLen > 60 ? "too long" : "missing"} (recommended: 50-60 chars)
              </div>
              <div className="flex items-center gap-2">
                {descLen > 0 && descLen <= 160 ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />}
                Description length {descLen <= 160 ? "optimal" : descLen > 160 ? "too long" : "missing"} (recommended: 150-160 chars)
              </div>
              <div className="flex items-center gap-2">
                {profile.focusKeyword ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />}
                Focus keyword {profile.focusKeyword ? "set" : "missing"}
              </div>
            </div>
          </Card>

          {/* Social / OG */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">Social / Open Graph</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>OG Title</Label>
                <Input value={profile.ogTitle || ""} onChange={(e) => update("ogTitle", e.target.value)} placeholder="Same as meta title or custom" />
              </div>
              <div className="space-y-1.5">
                <Label>OG Description</Label>
                <Textarea value={profile.ogDescription || ""} onChange={(e) => update("ogDescription", e.target.value)} rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label>OG Image URL</Label>
                <Input value={profile.ogImage || ""} onChange={(e) => update("ogImage", e.target.value)} placeholder="https://... (1200×630)" />
              </div>
            </div>
          </Card>

          {/* AIO/GEO checklist */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold">AIO / GEO Checklist</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">AIO</Badge>
                <span className="text-muted-foreground">Define this page's entity in AI Entities</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">GEO</Badge>
                <span className="text-muted-foreground">Add citation-worthy content (stats, facts)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">AEO</Badge>
                <span className="text-muted-foreground">Add 3+ FAQs in FAQ Clusters for this page</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">SXO</Badge>
                <span className="text-muted-foreground">Add a conversion CTA in Conversion CTAs</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">SEO</Badge>
                <span className="text-muted-foreground">Use focus keyword in title, H1, and first paragraph</span>
              </div>
            </div>
          </Card>

          {/* Save */}
          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save SEO Profile"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
