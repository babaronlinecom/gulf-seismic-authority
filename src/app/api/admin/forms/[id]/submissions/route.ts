import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/forms/[id]/submissions — list submissions for a form */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const submissions = await db.formSubmission.findMany({
    where: { formId: id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const parsed = submissions.map((s) => ({ ...s, data: JSON.parse(s.data) }));
  return NextResponse.json({ submissions: parsed });
}
