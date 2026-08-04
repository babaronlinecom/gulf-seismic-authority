import { requireAdmin } from "@/lib/admin-session";
import { PageBuilderManager } from "@/components/admin/page-builder-manager";

export default async function AdminPageBuilderPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Page Builder</h1>
        <p className="text-sm text-muted-foreground">
          Build pages visually with drag-and-drop blocks — headings, rich text, images, lists, quotes, CTAs, stats
        </p>
      </div>
      <PageBuilderManager />
    </div>
  );
}
