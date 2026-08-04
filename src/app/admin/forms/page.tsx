import { requireAdmin } from "@/lib/admin-session";
import { FormsManager } from "@/components/admin/forms-manager";

export default async function AdminFormsPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
        <p className="text-sm text-muted-foreground">Create custom forms and view submissions</p>
      </div>
      <FormsManager />
    </div>
  );
}
