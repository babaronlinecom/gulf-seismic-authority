"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2, Copy, Search, Image as ImageIcon, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string; filename: string; url: string; alt: string | null;
  mimeType: string; size: number; folder: string; createdAt: string;
}

export function MediaManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
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
        // Convert to base64 data URL
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
            filename: file.name,
            dataUrl,
            alt: file.name.replace(/\.[^.]+$/, ""),
            folder: "general",
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
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

  async function updateAlt(id: string, alt: string) {
    await fetch(`/api/admin/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
  }

  const filtered = items.filter((i) =>
    !search || i.filename.toLowerCase().includes(search.toLowerCase()) || (i.alt ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-4">
      {/* Upload bar */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="media-upload"
          />
          <Button asChild disabled={uploading} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <label htmlFor="media-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Images"}
            </label>
          </Button>
          <span className="text-xs text-muted-foreground">Max 2MB per image · PNG, JPG, GIF, WebP, SVG</span>
          <div className="relative ml-auto min-w-[200px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length === 0 ? "No images yet. Upload your first image." : "No images match your search."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <Card key={item.id} className="group overflow-hidden p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" variant="ghost" onClick={() => copyUrl(item.url, item.id)} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(item)} className="h-8 w-8 p-0 text-white hover:bg-white/20">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 p-0 text-white hover:bg-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium" title={item.filename}>{item.filename}</p>
                <p className="text-[10px] text-muted-foreground">{formatSize(item.size)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="font-semibold">Image Details</h3>
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="mb-4 overflow-hidden rounded-lg bg-muted">
              <img src={selected.url} alt={selected.alt || selected.filename} className="max-h-96 w-full object-contain" />
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Filename</Label>
                <Input value={selected.filename} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1.5">
                <Label>Alt Text (for SEO/accessibility)</Label>
                <Input
                  defaultValue={selected.alt || ""}
                  onBlur={(e) => {
                    updateAlt(selected.id, e.target.value);
                    setSelected({ ...selected, alt: e.target.value });
                  }}
                  placeholder="Describe the image..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Image URL (click to copy)</Label>
                <div className="flex gap-2">
                  <Input value={selected.url} readOnly className="bg-muted font-mono text-xs" />
                  <Button size="sm" onClick={() => copyUrl(selected.url, selected.id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground">Size:</span> {formatSize(selected.size)}</div>
                <div><span className="text-muted-foreground">Type:</span> {selected.mimeType}</div>
                <div><span className="text-muted-foreground">Folder:</span> {selected.folder}</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
