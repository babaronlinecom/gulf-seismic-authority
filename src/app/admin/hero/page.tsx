import { requireAdmin } from "@/lib/admin-session";
import { HeroManager } from "@/components/admin/hero-manager";

export default async function AdminHeroPage() {
  await requireAdmin();
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hero Sections</h1>
        <p className="text-sm text-muted-foreground">Manage hero sections for each page (homepage, about, contact, etc.)</p>
      </div>
      <HeroManager />
    </div>
  );
}
