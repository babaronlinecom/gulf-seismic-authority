import { requireAdmin } from "@/lib/admin-session";
import { CaseStudiesManager } from "@/components/admin/case-studies-manager";

export default async function AdminCaseStudiesPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Case Studies</h1>
        <p className="text-sm text-muted-foreground">
          Manage case studies. These appear on the website at /case-studies.
        </p>
      </div>
      <CaseStudiesManager />
    </div>
  );
}
