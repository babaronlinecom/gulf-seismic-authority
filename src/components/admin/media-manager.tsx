"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload, Trash2, Copy, Search, Image as ImageIcon, Check, X, Save,
  Globe, Share2, Settings2, FileImage, Eye, Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string; filename: string; title: string | null; url: string;
  alt: string | null; mimeType: string; size: number; width: number | null; height: number | null;
  folder: string;
  seoTitle: string | null; seoAlt: string | null; seoCaption: string | null;
  ogTitle: string | null; ogDescription: string | null;
  socialCaption: string | null; socialHashtags: string | null;
  lazyLoad: boolean; gradientOverlay: string | null; resizeNote: string | null;
  createdAt: string;
}

export function MediaManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterFolder, setFilterFolder] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");
  const fileRef = useRef<HTMLInputElement>(null);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name, dataUrl,
            alt: file.name.replace(/\.[^.]+$/, ""),
            folder: "general",
          }),
        });
        if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      }
      toast({ title: `${files.length} image(s) uploaded` });
      fetchItems();
    } catch (err) {
      toast({ title: "Upload failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    toast({ title: "Image deleted" });
    fetchItems();
  }

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    toast({ title: "URL copied to clipboard" });
    setTimeout(() => setCopied(null), 2000);
  }

  function startEdit(item: MediaItem) {
    setEditing(item);
  }

  const folders = Array.from(new Set(items.map((i) => i.folder)));
  const filtered = items.filter((i) =>
    (!search || (i.title || i.filename).toLowerCase().includes(search.toLowerCase()) || (i.alt ?? "").toLowerCase().includes(search.toLowerCase())) &&
    (filterFolder === "all" || i.folder === filterFolder)
  );

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function hasSeo(item: MediaItem) {
    return !!(item.seoTitle && item.seoAlt);
  }
  function hasSocial(item: MediaItem) {
    return !!(item.ogTitle && item.socialCaption);
  }

  return (
    <div className="space-y-4">
      {/* Upload + toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" id="media-upload" />
          <Button asChild disabled={uploading} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <label htmlFor="media-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}
            </label>
          </Button>
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title, filename, alt text..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterFolder} onValueChange={setFilterFolder}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All folders</SelectItem>
              {folders.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex rounded-md border border-border">
            <Button size="sm" variant={view === "table" ? "default" : "ghost"} onClick={() => setView("table")} className="rounded-r-none">
              <FileImage className="h-4 w-4" />
            </Button>
            <Button size="sm" variant={view === "grid" ? "default" : "ghost"} onClick={() => setView("grid")} className="rounded-l-none">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">{items.length === 0 ? "No images yet. Upload your first image." : "No images match your search."}</p>
        </Card>
      ) : view === "table" ? (
        /* TABLE VIEW */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-3">Thumbnail</th>
                  <th className="px-3 py-3">Title</th>
                  <th className="px-3 py-3">Alt Text</th>
                  <th className="px-3 py-3">Dimensions</th>
                  <th className="px-3 py-3">Size</th>
                  <th className="px-3 py-3">Folder</th>
                  <th className="px-3 py-3">SEO</th>
                  <th className="px-3 py-3">Social</th>
                  <th className="px-3 py-3">Display</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer" onClick={() => startEdit(item)}>
                    <td className="px-3 py-2">
                      <div className="h-12 w-16 overflow-hidden rounded border border-border bg-muted">
                        <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-xs">{item.title || item.filename}</div>
                      <div className="text-[10px] text-muted-foreground">{item.filename}</div>
                    </td>
                    <td className="px-3 py-2 max-w-[200px]">
                      <p className="truncate text-xs text-muted-foreground" title={item.alt || ""}>{item.alt || "—"}</p>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {item.width && item.height ? `${item.width}×${item.height}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{formatSize(item.size)}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="text-xs">{item.folder}</Badge></td>
                    <td className="px-3 py-2">
                      {hasSeo(item) ? <Badge className="bg-green-600 text-white hover:bg-green-600 text-xs"><Check className="h-3 w-3" /></Badge> : <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>}
                    </td>
                    <td className="px-3 py-2">
                      {hasSocial(item) ? <Badge className="bg-green-600 text-white hover:bg-green-600 text-xs"><Check className="h-3 w-3" /></Badge> : <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        {item.lazyLoad && <Badge variant="outline" className="text-[10px] text-blue-600" title="Lazy loading enabled">LL</Badge>}
                        {item.gradientOverlay && item.gradientOverlay !== "none" && <Badge variant="outline" className="text-[10px] text-purple-600" title={`Gradient: ${item.gradientOverlay}`}>GR</Badge>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => copyUrl(item.url, item.id)} className="h-7 w-7 p-0">
                          {copied === item.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(item)} className="h-7 w-7 p-0">
                          <Settings2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteItem(item.id)} className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <Card key={item.id} className="group overflow-hidden p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="ghost" onClick={() => copyUrl(item.url, item.id)} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(item)} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 p-0 text-white hover:bg-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium" title={item.title || item.filename}>{item.title || item.filename}</p>
                <div className="mt-1 flex items-center gap-1">
                  {hasSeo(item) && <Badge className="bg-green-600 text-white text-[9px] px-1">SEO</Badge>}
                  {hasSocial(item) && <Badge className="bg-blue-600 text-white text-[9px] px-1">SOC</Badge>}
                  <span className="text-[10px] text-muted-foreground">{item.width}×{item.height}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Editor Dialog */}
      {editing && <MediaEditor item={editing} onClose={() => setEditing(null)} onUpdate={fetchItems} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MEDIA EDITOR — full SEO + social + display editor with live previews
// ---------------------------------------------------------------------------

function MediaEditor({ item, onClose, onUpdate }: { item: MediaItem; onClose: () => void; onUpdate: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: item.title || "", alt: item.alt || "", folder: item.folder,
    seoTitle: item.seoTitle || "", seoAlt: item.seoAlt || "", seoCaption: item.seoCaption || "",
    ogTitle: item.ogTitle || "", ogDescription: item.ogDescription || "",
    socialCaption: item.socialCaption || "", socialHashtags: item.socialHashtags || "",
    lazyLoad: item.lazyLoad, gradientOverlay: item.gradientOverlay || "none",
    resizeNote: item.resizeNote || "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Image metadata saved" });
      onUpdate();
      onClose();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  }

  const seoComplete = !!(form.seoTitle && form.seoAlt);
  const socialComplete = !!(form.ogTitle && form.socialCaption);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h3 className="text-lg font-bold">Edit Image Metadata</h3>
          <Button size="sm" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="p-6">
          {/* Image preview */}
          <div className="mb-6 overflow-hidden rounded-lg bg-muted">
            <img src={item.url} alt={form.alt || item.filename} className="max-h-64 w-full object-contain" />
          </div>

          {/* Quick info */}
          <div className="mb-6 grid grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted-foreground">File:</span> {item.filename}</div>
            <div><span className="text-muted-foreground">Size:</span> {item.width}×{item.height}</div>
            <div><span className="text-muted-foreground">Type:</span> {item.mimeType}</div>
            <div><span className="text-muted-foreground">Bytes:</span> {(item.size / 1024).toFixed(0)} KB</div>
          </div>

          {/* Status badges */}
          <div className="mb-4 flex gap-2">
            <Badge className={seoComplete ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}>
              {seoComplete ? "✓" : "✗"} SEO {seoComplete ? "Complete" : "Incomplete"}
            </Badge>
            <Badge className={socialComplete ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}>
              {socialComplete ? "✓" : "✗"} Social {socialComplete ? "Complete" : "Incomplete"}
            </Badge>
            <Badge variant="outline" className={form.lazyLoad ? "text-blue-600" : "text-muted-foreground"}>
              {form.lazyLoad ? "✓" : "✗"} Lazy Loading
            </Badge>
            <Badge variant="outline" className="text-purple-600">Gradient: {form.gradientOverlay}</Badge>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general"><FileImage className="mr-1 h-4 w-4" /> General</TabsTrigger>
              <TabsTrigger value="seo"><Globe className="mr-1 h-4 w-4" /> SEO</TabsTrigger>
              <TabsTrigger value="social"><Share2 className="mr-1 h-4 w-4" /> Social / OG</TabsTrigger>
              <TabsTrigger value="display"><Settings2 className="mr-1 h-4 w-4" /> Display</TabsTrigger>
              <TabsTrigger value="preview"><Eye className="mr-1 h-4 w-4" /> Preview</TabsTrigger>
            </TabsList>

            {/* GENERAL TAB */}
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-1.5">
                <Label>Display Title</Label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Highway Road Marking at Golden Hour" />
                <p className="text-xs text-muted-foreground">Human-readable title shown in the media library</p>
              </div>
              <div className="space-y-1.5">
                <Label>Descriptive Alt Text (accessibility + basic SEO)</Label>
                <Textarea value={form.alt} onChange={(e) => update("alt", e.target.value)} rows={2} placeholder="Describe the image for screen readers and search engines" />
                <p className="text-xs text-muted-foreground">Essential for accessibility (WCAG) and Google Image search. Describe what's IN the image.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Folder</Label>
                  <Select value={form.folder} onValueChange={(v) => update("folder", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["hero", "services", "projects", "blog", "og", "general"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Filename</Label>
                  <Input value={item.filename} readOnly className="bg-muted text-xs" />
                </div>
              </div>
            </TabsContent>

            {/* SEO TAB */}
            <TabsContent value="seo" className="space-y-4">
              <div className="rounded-md bg-amber-brand/10 p-3">
                <p className="text-xs text-amber-brand"><strong>SEO Optimization:</strong> These fields help your images rank in Google Image search and appear in rich results.</p>
              </div>
              <div className="space-y-1.5">
                <Label>SEO Title (keyword-rich)</Label>
                <Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} placeholder="Road Marking UAE Highway — Gulf Seismic Thermoplastic" />
                <p className="text-xs text-muted-foreground">Include target keywords. Different from display title — optimized for search engines.</p>
              </div>
              <div className="space-y-1.5">
                <Label>SEO Alt Text (keyword-optimized)</Label>
                <Textarea value={form.seoAlt} onChange={(e) => update("seoAlt", e.target.value)} rows={2} placeholder="Professional road marking contractor applying hot thermoplastic line marking with glass beads on highway" />
                <p className="text-xs text-muted-foreground">Keyword-rich version of alt text for Google Image SEO. Include service + location + keyword.</p>
              </div>
              <div className="space-y-1.5">
                <Label>SEO Caption (for image search)</Label>
                <Textarea value={form.seoCaption} onChange={(e) => update("seoCaption", e.target.value)} rows={2} placeholder="Gulf Seismic applying thermoplastic road markings on a UAE highway — municipal-spec quality." />
                <p className="text-xs text-muted-foreground">Caption text that appears below images in Google Image search results.</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SEO Checklist</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">{form.seoTitle ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />} SEO title set</div>
                  <div className="flex items-center gap-2">{form.seoAlt ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />} SEO alt text set</div>
                  <div className="flex items-center gap-2">{form.seoCaption ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />} SEO caption set</div>
                  <div className="flex items-center gap-2">{form.alt ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />} Accessibility alt text set</div>
                  <div className="flex items-center gap-2">{item.width && item.width >= 1200 ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />} Image width ≥ 1200px (recommended for SEO)</div>
                </div>
              </div>
            </TabsContent>

            {/* SOCIAL / OG TAB */}
            <TabsContent value="social" className="space-y-4">
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-blue-700"><strong>Social Media Optimization:</strong> These fields control how your image appears when shared on Facebook, Twitter, LinkedIn, and WhatsApp.</p>
              </div>
              <div className="space-y-1.5">
                <Label>OG Title (Open Graph)</Label>
                <Input value={form.ogTitle} onChange={(e) => update("ogTitle", e.target.value)} placeholder="Gulf Seismic — Road & Industrial Marking Authority" />
                <p className="text-xs text-muted-foreground">Title shown when the image is shared on social media.</p>
              </div>
              <div className="space-y-1.5">
                <Label>OG Description</Label>
                <Textarea value={form.ogDescription} onChange={(e) => update("ogDescription", e.target.value)} rows={2} placeholder="Professional thermoplastic road marking across UAE and Saudi Arabia." />
                <p className="text-xs text-muted-foreground">Description shown below the image on social platforms.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Social Media Caption</Label>
                <Textarea value={form.socialCaption} onChange={(e) => update("socialCaption", e.target.value)} rows={2} placeholder="Precision thermoplastic road marking on a UAE highway. 🛣️🇦🇪" />
                <p className="text-xs text-muted-foreground">Ready-to-post caption for Instagram, LinkedIn, Twitter.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Social Hashtags (comma-separated)</Label>
                <Input value={form.socialHashtags} onChange={(e) => update("socialHashtags", e.target.value)} placeholder="#RoadMarking, #Thermoplastic, #UAE" />
                <p className="text-xs text-muted-foreground">Hashtags to include when posting this image on social media.</p>
              </div>
            </TabsContent>

            {/* DISPLAY TAB */}
            <TabsContent value="display" className="space-y-4">
              <div className="rounded-md bg-purple-50 p-3">
                <p className="text-xs text-purple-700"><strong>Display Options:</strong> Control how the image renders on the website.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Lazy Loading</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={form.lazyLoad} onChange={() => update("lazyLoad", true)} className="h-4 w-4" />
                    <span className="text-sm">Enabled (recommended — improves page load speed)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={!form.lazyLoad} onChange={() => update("lazyLoad", false)} className="h-4 w-4" />
                    <span className="text-sm">Disabled (load immediately — for above-the-fold images)</span>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Gradient Overlay</Label>
                <Select value={form.gradientOverlay} onValueChange={(v) => update("gradientOverlay", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (no overlay)</SelectItem>
                    <SelectItem value="light">Light (subtle gradient for text readability)</SelectItem>
                    <SelectItem value="dark">Dark (strong gradient for hero/text overlays)</SelectItem>
                    <SelectItem value="primary">Primary (brand color gradient)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Apply a gradient overlay when text is displayed over the image.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Resize Notes</Label>
                <Textarea value={form.resizeNote} onChange={(e) => update("resizeNote", e.target.value)} rows={2} placeholder="Hero: 1344x768. Thumbnail: 400x225. OG: 1200x630." />
                <p className="text-xs text-muted-foreground">Document the available sizes and recommended dimensions for this image.</p>
              </div>
            </TabsContent>

            {/* PREVIEW TAB */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                {/* Social preview */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Social Media Preview (Facebook / LinkedIn / WhatsApp)</p>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="aspect-video bg-muted">
                      <img src={item.url} alt={form.alt || item.filename} className="h-full w-full object-cover" />
                    </div>
                    <div className="bg-white p-3 dark:bg-secondary">
                      <p className="text-xs text-green-600">gulfseismic.com</p>
                      <p className="font-medium text-sm text-gray-900 dark:text-foreground">{form.ogTitle || form.title || "No OG title set"}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground line-clamp-2">{form.ogDescription || "No OG description set"}</p>
                    </div>
                  </div>
                </div>

                {/* Twitter preview */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Twitter Card Preview</p>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="aspect-video bg-muted">
                      <img src={item.url} alt={form.alt || item.filename} className="h-full w-full object-cover" />
                    </div>
                    <div className="bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">gulfseismic.com</p>
                      <p className="font-medium text-sm">{form.ogTitle || form.title || "No title set"}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{form.ogDescription || "No description set"}</p>
                    </div>
                  </div>
                </div>

                {/* Google Image search preview */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Google Image Search Preview</p>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex gap-3">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
                        <img src={item.url} alt={form.seoAlt || form.alt || item.filename} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-blue-700 hover:underline cursor-pointer">{form.seoTitle || form.title || "No SEO title"}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{form.seoCaption || form.alt || "No SEO caption"}</p>
                        <p className="mt-1 text-xs text-green-700">gulfseismic.com › images › {item.folder}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save bar */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <Button variant="outline" size="sm" onClick={() => copyUrl(item.url, item.id)}>
              <Copy className="mr-1 h-4 w-4" /> Copy URL
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
