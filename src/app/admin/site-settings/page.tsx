import { requireAdmin } from "@/lib/admin-session";
import { SiteSettingsManager } from "@/components/admin/site-settings-manager";

export default async function AdminSiteSettingsPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Global settings: brand, contact info, social links, footer content</p>
      </div>
      <SiteSettingsManager />
    </div>
  );
}
