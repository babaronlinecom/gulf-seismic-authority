import { NextResponse } from "next/server";
import { checkCmsHealth } from "@/lib/wordpress";

/**
 * GET /api/cms-health
 * Reports the live WordPress CMS connection status, latency and content
 * counts. Used by ops dashboards and uptime monitors.
 *
 * Returns 503 when CMS is unreachable so monitors fire alerts.
 */
export async function GET() {
  const health = await checkCmsHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
