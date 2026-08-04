import { requireAdmin } from "@/lib/admin-session";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function AdminProjectsPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Manage your project portfolio. These appear on the website at /projects.
        </p>
      </div>
      <ProjectsManager />
    </div>
  );
}
