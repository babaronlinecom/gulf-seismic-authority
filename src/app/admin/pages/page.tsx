import { requireAdmin } from "@/lib/admin-session";
import { PagesManager } from "@/components/admin/pages-manager";

export default async function AdminPagesPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <p className="text-sm text-muted-foreground">Manage website pages (About, Contact, Privacy, etc.)</p>
      </div>
      <PagesManager />
    </div>
  );
}
