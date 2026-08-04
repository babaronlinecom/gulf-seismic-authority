"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Save, X, GripVertical, Layout, Eye, Copy,
  Type, Image as ImageIcon, List, Quote, Cog, ArrowRight, Columns,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { useToast } from "@/hooks/use-toast";

interface Block {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface PageBuilderRecord {
  id: string; pageSlug: string; title: string;
  blocks: Block[]; status: string; updatedAt: string;
}

const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: Type, defaultData: { text: "New Heading", level: 2 } },
  { type: "text", label: "Rich Text", icon: Layout, defaultData: { content: "" } },
  { type: "image", label: "Image", icon: ImageIcon, defaultData: { src: "", alt: "", caption: "" } },
  { type: "list", label: "List", icon: List, defaultData: { items: ["Item 1", "Item 2"], ordered: false } },
  { type: "quote", label: "Quote", icon: Quote, defaultData: { text: "", author: "" } },
  { type: "cta", label: "CTA Button", icon: ArrowRight, defaultData: { label: "Get a Quote", url: "/contact", style: "primary" } },
  { type: "divider", label: "Divider", icon: Columns, defaultData: {} },
  { type: "stats", label: "Stats Row", icon: Cog, defaultData: { items: [{ label: "Years", value: "7+" }] } },
];

function genId() { return Math.random().toString(36).substring(2, 11); }

export function PageBuilderManager() {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageBuilderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageBuilderRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ pageSlug: "", title: "", blocks: [] as Block[], status: "draft" });
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => { fetchPages(); }, []);

  async function fetchPages() {
    setLoading(true);
    const res = await fetch("/api/admin/page-builder");
    const data = await res.json();
    setPages(data.pages || []);
    setLoading(false);
  }

  function startEdit(p: PageBuilderRecord) {
    setEditing(p);
    setForm({ pageSlug: p.pageSlug, title: p.title, blocks: p.blocks, status: p.status });
    setCreating(false);
    setPreviewMode(false);
  }

  function startCreate() {
    setCreating(true); setEditing(null);
    setForm({ pageSlug: "", title: "", blocks: [], status: "draft" });
    setPreviewMode(false);
  }

  function addBlock(type: string) {
    const blockType = BLOCK_TYPES.find(b => b.type === type);
    if (!blockType) return;
    const newBlock: Block = { id: genId(), type, data: { ...blockType.defaultData } };
    setForm(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  }

  function updateBlock(id: string, data: Record<string, unknown>) {
    setForm(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...data } } : b),
    }));
  }

  function removeBlock(id: string) {
    setForm(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  }

  function moveBlock(id: string, dir: "up" | "down") {
    setForm(prev => {
      const blocks = [...prev.blocks];
      const idx = blocks.findIndex(b => b.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= blocks.length) return prev;
      [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
      return { ...prev, blocks };
    });
  }

  async function save() {
    if (!form.pageSlug || !form.title) {
      toast({ title: "Slug and title required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/page-builder/${editing.id}` : "/api/admin/page-builder";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast({ title: "Page saved", description: `Status: ${form.status}` });
      setEditing(null); setCreating(false); fetchPages();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deletePage(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/admin/page-builder/${id}`, { method: "DELETE" });
    toast({ title: "Page deleted" });
    fetchPages();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pages.length} builder pages</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Page
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
      ) : pages.length === 0 ? (
        <Card className="p-8 text-center">
          <Layout className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No builder pages yet. Create your first visual page.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pages.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-sm">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">/{p.pageSlug}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={p.status === "published" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted hover:bg-muted"}>{p.status}</Badge>
                    <Badge variant="outline" className="text-xs">{p.blocks.length} blocks</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => deletePage(p.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Builder dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setEditing(null); setCreating(false); }}>
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-background shadow-xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{editing ? "Edit Page" : "New Page"}</h3>
                <Button size="sm" variant={previewMode ? "outline" : "default"} onClick={() => setPreviewMode(!previewMode)}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> {previewMode ? "Edit" : "Preview"}
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(null); setCreating(false); }}><X className="h-4 w-4" /></Button>
            </div>

            <div className="p-6 space-y-4">
              {/* Page settings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Page Title *</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="About Us" />
                </div>
                <div className="space-y-1.5">
                  <Label>Page Slug * (URL)</Label>
                  <Input value={form.pageSlug} onChange={e => setForm({ ...form, pageSlug: e.target.value })} placeholder="about-us" />
                </div>
              </div>

              {!previewMode ? (
                <>
                  {/* Block palette */}
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add Block</p>
                    <div className="flex flex-wrap gap-2">
                      {BLOCK_TYPES.map(bt => {
                        const Icon = bt.icon;
                        return (
                          <button
                            key={bt.type}
                            onClick={() => addBlock(bt.type)}
                            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-amber-brand hover:text-amber-brand transition-colors"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {bt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Blocks */}
                  {form.blocks.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Layout className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">No blocks yet. Click a block type above to start building.</p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {form.blocks.map((block, i) => {
                        const bt = BLOCK_TYPES.find(b => b.type === block.type);
                        return (
                          <Card key={block.id} className="p-4">
                            {/* Block header */}
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">{bt?.label || block.type}</Badge>
                                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => moveBlock(block.id, "up")} disabled={i === 0} className="h-7 px-2">↑</Button>
                                <Button size="sm" variant="ghost" onClick={() => moveBlock(block.id, "down")} disabled={i === form.blocks.length - 1} className="h-7 px-2">↓</Button>
                                <Button size="sm" variant="ghost" onClick={() => removeBlock(block.id)} className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            </div>

                            {/* Block editor */}
                            <BlockEditor block={block} updateBlock={updateBlock} />
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* Preview mode */
                <BlockPreview blocks={form.blocks} />
              )}

              {/* Save bar */}
              <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={form.status === "draft" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, status: "draft" })}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    size="sm"
                    variant={form.status === "published" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, status: "published" })}
                    className={form.status === "published" ? "bg-green-600 text-white" : ""}
                  >
                    Publish
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
                  <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                    <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Page"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BLOCK EDITOR — renders the correct editor for each block type
// ---------------------------------------------------------------------------

function BlockEditor({ block, updateBlock }: { block: Block; updateBlock: (id: string, data: Record<string, unknown>) => void }) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <Input
            value={String(block.data.text || "")}
            onChange={e => updateBlock(block.id, { text: e.target.value })}
            placeholder="Heading text..."
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                onClick={() => updateBlock(block.id, { level })}
                className={`rounded px-2 py-1 text-xs ${block.data.level === level ? "bg-amber-brand text-amber-foreground" : "bg-muted"}`}
              >
                H{level}
              </button>
            ))}
          </div>
        </div>
      );

    case "text":
      return (
        <RichTextEditor
          value={String(block.data.content || "")}
          onChange={html => updateBlock(block.id, { content: html })}
          placeholder="Write rich text content..."
        />
      );

    case "image":
      return (
        <div className="space-y-2">
          <Input value={String(block.data.src || "")} onChange={e => updateBlock(block.id, { src: e.target.value })} placeholder="Image URL (paste from Media Library)" />
          <Input value={String(block.data.alt || "")} onChange={e => updateBlock(block.id, { alt: e.target.value })} placeholder="Alt text" />
          <Input value={String(block.data.caption || "")} onChange={e => updateBlock(block.id, { caption: e.target.value })} placeholder="Caption (optional)" />
          {String(block.data.src) && <img src={String(block.data.src)} alt={String(block.data.alt || "")} className="mt-2 max-h-40 rounded-lg object-cover" />}
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          <Textarea
            value={(block.data.items as string[] || []).join("\n")}
            onChange={e => updateBlock(block.id, { items: e.target.value.split("\n").filter(Boolean) })}
            rows={4}
            placeholder="One item per line..."
          />
          <div className="flex gap-2">
            <button onClick={() => updateBlock(block.id, { ordered: false })} className={`rounded px-2 py-1 text-xs ${!block.data.ordered ? "bg-amber-brand text-amber-foreground" : "bg-muted"}`}>Bullet</button>
            <button onClick={() => updateBlock(block.id, { ordered: true })} className={`rounded px-2 py-1 text-xs ${block.data.ordered ? "bg-amber-brand text-amber-foreground" : "bg-muted"}`}>Numbered</button>
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <Textarea value={String(block.data.text || "")} onChange={e => updateBlock(block.id, { text: e.target.value })} rows={3} placeholder="Quote text..." />
          <Input value={String(block.data.author || "")} onChange={e => updateBlock(block.id, { author: e.target.value })} placeholder="Author (optional)" />
        </div>
      );

    case "cta":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Input value={String(block.data.label || "")} onChange={e => updateBlock(block.id, { label: e.target.value })} placeholder="Button label" />
          <Input value={String(block.data.url || "")} onChange={e => updateBlock(block.id, { url: e.target.value })} placeholder="/contact" />
        </div>
      );

    case "divider":
      return <p className="text-xs text-muted-foreground text-center py-2">Horizontal divider line</p>;

    case "stats":
      return (
        <div className="space-y-2">
          <Textarea
            value={(block.data.items as { label: string; value: string }[] || []).map(i => `${i.label}: ${i.value}`).join("\n")}
            onChange={e => updateBlock(block.id, { items: e.target.value.split("\n").filter(Boolean).map(line => {
              const [label, ...rest] = line.split(":");
              return { label: label.trim(), value: rest.join(":").trim() };
            }) })}
            rows={4}
            placeholder="Years: 7+&#10;Clients: 15+"
          />
        </div>
      );

    default:
      return <p className="text-xs text-muted-foreground">Unknown block type: {block.type}</p>;
  }
}

// ---------------------------------------------------------------------------
// BLOCK PREVIEW — renders blocks as they'd appear on the live site
// ---------------------------------------------------------------------------

function BlockPreview({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      {blocks.map(block => {
        switch (block.type) {
          case "heading": {
            const level = Number(block.data.level || 2);
            const Tag = `h${level}` as React.ElementType;
            return <Tag key={block.id} className="font-bold">{String(block.data.text || "")}</Tag>;
          }
          case "text":
            return <div key={block.id} className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: String(block.data.content || "") }} />;
          case "image":
            return (
              <figure key={block.id}>
                {String(block.data.src) && <img src={String(block.data.src)} alt={String(block.data.alt || "")} className="rounded-lg" />}
                {String(block.data.caption as string) && <figcaption className="mt-1 text-xs text-muted-foreground text-center">{String(block.data.caption)}</figcaption>}
              </figure>
            );
          case "list":
            return block.data.ordered ? (
              <ol key={block.id} className="list-decimal pl-6">{(block.data.items as string[] || []).map((item, i) => <li key={i}>{item}</li>)}</ol>
            ) : (
              <ul key={block.id} className="list-disc pl-6">{(block.data.items as string[] || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
            );
          case "quote":
            return (
              <blockquote key={block.id} className="border-l-4 border-amber-brand pl-4 italic">
                {String(block.data.text || "")}
                {String(block.data.author as string) && <footer className="mt-1 text-xs not-italic text-muted-foreground">— {String(block.data.author)}</footer>}
              </blockquote>
            );
          case "cta":
            return (
              <div key={block.id}>
                <Button asChild className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
                  <a href={String(block.data.url || "#")}>{String(block.data.label || "Click")}</a>
                </Button>
              </div>
            );
          case "divider":
            return <hr key={block.id} className="border-border" />;
          case "stats":
            return (
              <div key={block.id} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(block.data.items as { label: string; value: string }[] || []).map((item, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 text-center">
                    <div className="text-2xl font-bold text-amber-brand">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
