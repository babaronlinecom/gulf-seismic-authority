"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, X, Save, Newspaper } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PostRecord {
  id: string; slug: string; title: string; excerpt: string | null;
  content: string; category: string | null; author: string | null;
  featuredImage: string | null; seoTitle: string | null; seoDescription: string | null;
  status: string; publishedAt: string;
}

const EMPTY = {
  slug: "", title: "", excerpt: "", content: "", category: "",
  author: "Gulf Seismic", featuredImage: "", seoTitle: "", seoDescription: "",
  status: "published", publishedAt: new Date().toISOString().slice(0, 10),
};

export function PostsManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  function startEdit(p: PostRecord) {
    setEditing(p);
    setForm({
      slug: p.slug, title: p.title, excerpt: p.excerpt || "", content: p.content,
      category: p.category || "", author: p.author || "Gulf Seismic",
      featuredImage: p.featuredImage || "", seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "", status: p.status,
      publishedAt: new Date(p.publishedAt).toISOString().slice(0, 10),
    });
    setCreating(false);
  }

  function startCreate() { setCreating(true); setEditing(null); setForm(EMPTY); }

  async function save() {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: editing ? "Post updated" : "Post created" });
      setEditing(null); setCreating(false); fetchPosts();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    toast({ title: "Post deleted" });
    fetchPosts();
  }

  const isOpen = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        <Button onClick={startCreate} size="sm" className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
          <Plus className="mr-1 h-4 w-4" /> New Post
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No posts yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-4">
              <h3 className="truncate font-medium text-sm">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt || p.content.slice(0, 80)}</p>
              <div className="mt-2 flex items-center gap-1.5">
                {p.category && <Badge variant="outline" className="text-xs">{p.category}</Badge>}
                <Badge className={p.status === "published" ? "bg-green-600 text-white hover:bg-green-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{p.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(p.publishedAt).toLocaleDateString()}</p>
              <div className="mt-3 flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => deletePost(p.id)} className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setEditing(null); setCreating(false); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-blog-post" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Technical Guide" /></div>
              <div className="space-y-1.5"><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Publish Date</Label><Input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Featured Image URL</Label><Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://..." /></div>
            <div className="space-y-1.5"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
            <div className="space-y-1.5"><Label>Content</Label><RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} placeholder="Start writing your blog post..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>SEO Title</Label><Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1.5"><Label>SEO Description</Label><Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} /></div>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}><X className="mr-1 h-4 w-4" /> Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]"><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save Post"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
