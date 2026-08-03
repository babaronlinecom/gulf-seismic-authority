import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/leads
 * Captures a lead from any funnel (RFQ, WhatsApp, Call, Contact, Tender).
 * Computes a lead score based on data completeness and intent signals.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      company,
      email,
      phone,
      country,
      city,
      service,
      message,
      source = "website-rfq",
      campaign,
      funnel = "rfq",
    } = body || {};

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, phone, message" },
        { status: 400 }
      );
    }

    // Compute lead score 0-100
    let score = 30; // base
    if (company) score += 10;
    if (city) score += 10;
    if (service) score += 15;
    if (message && message.length > 50) score += 15;
    if (email.includes("@") && email.includes(".")) score += 5;
    if (source === "tender") score += 15;
    score = Math.min(100, score);

    const lead = await db.lead.create({
      data: {
        name: String(name).slice(0, 200),
        company: company ? String(company).slice(0, 200) : null,
        email: String(email).slice(0, 200),
        phone: String(phone).slice(0, 50),
        country: String(country || "uae").slice(0, 50),
        city: city ? String(city).slice(0, 100) : null,
        service: service ? String(service).slice(0, 100) : null,
        message: String(message).slice(0, 5000),
        source: String(source).slice(0, 50),
        campaign: campaign ? String(campaign).slice(0, 100) : null,
        funnel: String(funnel).slice(0, 50),
        leadScore: score,
        userAgent: req.headers.get("user-agent")?.slice(0, 500),
        referrer: req.headers.get("referer")?.slice(0, 500),
        pagePath: req.headers.get("referer")?.slice(0, 500),
      },
    });

    return NextResponse.json({
      ok: true,
      id: lead.id,
      leadScore: lead.leadScore,
      message: "Lead captured successfully",
    });
  } catch (err) {
    console.error("[/api/leads] error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads — returns a summary of captured leads (for admin use).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

  try {
    const [leads, total, bySource, byStatus] = await Promise.all([
      db.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          name: true,
          company: true,
          email: true,
          phone: true,
          country: true,
          city: true,
          service: true,
          source: true,
          leadScore: true,
          status: true,
          createdAt: true,
        },
      }),
      db.lead.count(),
      db.lead.groupBy({ by: ["source"], _count: true }),
      db.lead.groupBy({ by: ["status"], _count: true }),
    ]);

    return NextResponse.json({
      ok: true,
      total,
      bySource,
      byStatus,
      leads,
    });
  } catch (err) {
    console.error("[/api/leads GET] error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
