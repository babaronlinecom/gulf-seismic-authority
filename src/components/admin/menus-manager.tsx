"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Menu as MenuIcon, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string; label: string; url: string; location: string; order: number;
}

export function MenusManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newLocation, setNewLocation] = useState("header");
  const [saving, setSaving] = useState(false);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/admin/menu-items");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function addItem() {
    if (!newLabel || !newUrl) {
      toast({ title: "Label and URL required", variant: "destructive" });
      return;
    }
    const maxOrder = items.filter((i) => i.location === newLocation).reduce((max, i) => Math.max(max, i.order), 0);
    const res = await fetch("/api/admin/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel, url: newUrl, location: newLocation, order: maxOrder + 1 }),
    });
    if (res.ok) {
      toast({ title: "Menu item added" });
      setNewLabel(""); setNewUrl("");
      fetchItems();
    }
  }

  async function updateItem(id: string, field: keyof MenuItem, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  async function saveItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSaving(true);
    await fetch(`/api/admin/menu-items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: item.label, url: item.url, location: item.location, order: item.order }),
    });
    setSaving(false);
    toast({ title: "Saved" });
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    toast({ title: "Menu item deleted" });
    fetchItems();
  }

  const headerItems = items.filter((i) => i.location === "header").sort((a, b) => a.order - b.order);
  const footerItems = items.filter((i) => i.location === "footer").sort((a, b) => a.order - b.order);

  function renderList(list: MenuItem[], title: string) {
    return (
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <MenuIcon className="h-4 w-4 text-amber-brand" /> {title} ({list.length})
        </h3>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading...</p>
        ) : list.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No items</p>
        ) : (
          <div className="space-y-2">
            {list.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-md border border-border p-2">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  className="h-8 flex-1"
                />
                <Input
                  value={item.url}
                  onChange={(e) => updateItem(item.id, "url", e.target.value)}
                  className="h-8 flex-[2]"
                  placeholder="/path or #anchor"
                />
                <Button size="sm" variant="outline" onClick={() => saveItem(item.id)} disabled={saving} className="h-8">
                  <Save className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteItem(item.id)} className="h-8 hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Add Menu Item</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="About Us" className="w-[180px]" />
          </div>
          <div className="space-y-1.5">
            <Label>URL</Label>
            <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="/about or #section" className="w-[220px]" />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Select value={newLocation} onValueChange={setNewLocation}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addItem} className="bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {renderList(headerItems, "Header Navigation")}
        {renderList(footerItems, "Footer Navigation")}
      </div>
    </div>
  );
}
