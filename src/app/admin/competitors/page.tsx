import { requireAdmin } from "@/lib/admin-session";
import { CompetitorsManager } from "@/components/admin/competitors-manager";

export default async function AdminCompetitorsPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Competitor Analysis</h1>
        <p className="text-sm text-muted-foreground">Track competitors, identify keyword gaps, and find opportunities to outrank them</p>
      </div>
      <CompetitorsManager />
    </div>
  );
}
