import { requireAdmin } from "@/lib/admin-session";
import { FormBuilder } from "@/components/admin/form-builder";

export default async function AdminFormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  return (
    <div className="p-6 lg:p-8">
      <FormBuilder formId={id} />
    </div>
  );
}
