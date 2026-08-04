import { requireAdmin } from "@/lib/admin-session";
import { MenusManager } from "@/components/admin/menus-manager";

export default async function AdminMenusPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Menus</h1>
        <p className="text-sm text-muted-foreground">Manage header and footer navigation links</p>
      </div>
      <MenusManager />
    </div>
  );
}
