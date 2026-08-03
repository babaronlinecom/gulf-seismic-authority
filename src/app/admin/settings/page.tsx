import { requireAdmin } from "@/lib/admin-session";
import { SettingsManager } from "@/components/admin/settings-manager";

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and system settings.</p>
      </div>
      <SettingsManager
        currentUser={{
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        }}
      />
    </div>
  );
}
