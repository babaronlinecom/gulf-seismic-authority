import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Deterministic A/B/C lead classification per SKILL.md RFQ system. */
export function classifyLead(input: {
  attachments?: string;
  completionDate?: string;
  procurementStage?: string;
  phone?: string;
  quantity?: string;
  saudiRoute?: string;
  surface?: string;
  message?: string;
}): { grade: "A" | "B" | "C"; score: number } {
  let score = 0;
  let hasAttachments = false;
  try {
    hasAttachments =
      !!input.attachments &&
      input.attachments !== "[]" &&
      input.attachments !== "" &&
      Array.isArray(JSON.parse(input.attachments || "[]")) &&
      JSON.parse(input.attachments || "[]").length > 0;
  } catch {
    hasAttachments = false;
  }
  if (hasAttachments) score += 30;
  if (input.completionDate) score += 20;
  const stage = (input.procurementStage || "").toLowerCase();
  if (["tendering", "award", "mobilization", "ترسية", "تعبئة", "مناقصة"].some((s) => stage.includes(s)))
    score += 25;
  if (input.phone) score += 10;
  if (input.quantity) score += 10;
  const route = (input.saudiRoute || "").toLowerCase();
  if (["direct", "partner-led", "project-specific", "مباشر", "بقيادة شريك", "خاص بمشروع"].some((s) => route.includes(s)))
    score += 5;
  if (input.surface) score += 5;

  const grade: "A" | "B" | "C" = score >= 60 ? "A" : score >= 30 ? "B" : "C";
  return { grade, score };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["name", "email"];
    for (const k of required) {
      if (!body?.[k] || String(body[k]).trim() === "") {
        return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 });
      }
    }
    if (!body.consent) {
      return NextResponse.json({ ok: false, error: "Consent required" }, { status: 400 });
    }

    const { grade, score } = classifyLead(body);

    const rfq = await db.rfq.create({
      data: {
        name: String(body.name).slice(0, 200),
        company: body.company ? String(body.company).slice(0, 200) : null,
        role: body.role ? String(body.role).slice(0, 120) : null,
        email: String(body.email).slice(0, 200),
        phone: body.phone ? String(body.phone).slice(0, 60) : null,
        country: body.country ? String(body.country).slice(0, 80) : null,
        city: body.city ? String(body.city).slice(0, 80) : null,
        projectName: body.projectName ? String(body.projectName).slice(0, 200) : null,
        clientType: body.clientType || null,
        service: body.service || null,
        quantity: body.quantity ? String(body.quantity).slice(0, 120) : null,
        surface: body.surface ? String(body.surface).slice(0, 300) : null,
        completionDate: body.completionDate || null,
        procurementStage: body.procurementStage || null,
        saudiRoute: body.saudiRoute || null,
        preferredContact: body.preferredContact || null,
        message: body.message ? String(body.message).slice(0, 4000) : null,
        attachments: JSON.stringify(body.attachments || []),
        leadGrade: grade,
        leadScore: score,
        status: "new",
        source: body.source || "contact",
        consent: true,
      },
    });

    try {
      await db.auditLog.create({
        data: {
          action: "rfq_submitted",
          entity: "Rfq",
          entityId: rfq.id,
          meta: JSON.stringify({ grade, score }),
        },
      });
    } catch {}

    return NextResponse.json({ ok: true, id: rfq.id, grade, score });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rfqs = await db.rfq.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        country: true,
        city: true,
        service: true,
        clientType: true,
        procurementStage: true,
        saudiRoute: true,
        leadGrade: true,
        leadScore: true,
        status: true,
        source: true,
        createdAt: true,
      },
    });
    const counts = { A: 0, B: 0, C: 0 } as Record<string, number>;
    rfqs.forEach((r) => {
      if (r.leadGrade) counts[r.leadGrade] = (counts[r.leadGrade] || 0) + 1;
    });
    return NextResponse.json({ ok: true, rfqs, counts, total: rfqs.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
