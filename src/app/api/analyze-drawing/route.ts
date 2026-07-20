import { NextRequest, NextResponse } from "next/server";
import { getZai } from "@/lib/zai";

export const runtime = "nodejs";

const PROMPT = `You are analyzing a drawing or specification extract uploaded by a buyer for a road-marking RFQ.

Extract and summarize, as a concise structured list:
1. Marking types visible or referenced (e.g. centreline, edge line, lane line, stop bar, symbols, bay markings, runway markings).
2. Materials / systems referenced if any (thermoplastic, cold plastic/MMA, paint, epoxy, road studs, glass beads).
3. Dimensions, widths, colours or quantities if readable.
4. Inspection / acceptance criteria if referenced (thickness, retroreflectivity, adhesion).
5. Surface / location context if readable (highway, airport, car park, warehouse).
6. Any missing information the buyer should add before Gulf Seismic can quote.

Be honest: if the image is unclear, say so. Do not invent values not visible in the image. Keep it under 250 words. Respond in the same language as any visible text, otherwise English.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataUrl: string | undefined = body?.dataUrl;
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ ok: false, error: "Valid image data URL required" }, { status: 400 });
    }

    const zai = await getZai();
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      thinking: { type: "disabled" as const },
    });

    const analysis = response.choices?.[0]?.message?.content || "";
    return NextResponse.json({ ok: true, analysis });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg, analysis: "" }, { status: 500 });
  }
}
