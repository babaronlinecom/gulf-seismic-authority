"use client";

import { useState } from "react";
import { UserPlus, Save, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function SettingsManager({ currentUser }: { currentUser: { email: string; name: string; role: string } }) {
  const { toast } = useToast();
  const [name, setName] = useState(currentUser.name);
  const [email] = useState(currentUser.email);
  const [newPass, setNewPass] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateOwnPassword() {
    if (!newPass || newPass.length < 8) {
      toast({ title: "Password too short", description: "Minimum 8 characters", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Password updated" });
      setNewPass("");
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function createAdmin() {
    if (!newName || !newEmail || !newPassword) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/settings/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      toast({ title: "Admin user created", description: newEmail });
      setNewName(""); setNewEmail(""); setNewPassword("");
    } catch (e) {
      toast({ title: "Create failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Your Profile</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} disabled className="bg-muted" />
          </div>
        </div>
        <div className="mt-3">
          <Badge>{currentUser.role}</Badge>
        </div>
      </Card>

      {/* Change password */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Key className="h-4 w-4" /> Change Password
        </h3>
        <div className="flex gap-2">
          <Input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password (min 8 chars)"
          />
          <Button onClick={updateOwnPassword} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Update"}
          </Button>
        </div>
      </Card>

      {/* Create admin user (admin role only) */}
      {currentUser.role === "admin" && (
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <UserPlus className="h-4 w-4" /> Create Admin User
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="john@gulfseismic.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 chars" />
            </div>
          </div>
          <Button onClick={createAdmin} disabled={creating} className="mt-3 bg-amber-brand text-amber-foreground hover:bg-[var(--amber-dark)]">
            <UserPlus className="mr-1 h-4 w-4" /> {creating ? "Creating..." : "Create User"}
          </Button>
        </Card>
      )}

      {/* System info */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">System Information</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Database</span><span>SQLite (local) / PostgreSQL (Neon)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Auth</span><span>NextAuth.js v4 (JWT)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">CMS</span><span>WordPress (cms.gulfseismic.com)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Frontend</span><span>Next.js 16 App Router</span></div>
        </div>
      </Card>
    </div>
  );
}
