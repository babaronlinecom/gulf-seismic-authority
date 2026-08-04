import { requireAdmin } from "@/lib/admin-session";
import { MediaManager } from "@/components/admin/media-manager";

export default async function AdminMediaPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-sm text-muted-foreground">Upload and manage images for your website</p>
      </div>
      <MediaManager />
    </div>
  );
}
