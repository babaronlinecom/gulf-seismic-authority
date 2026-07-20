import ZAI from "z-ai-web-dev-sdk";

/**
 * Shared ZAI SDK singleton (backend-only).
 * Powers: LLM chat (RFQ assistant), VLM (drawing/spec analysis),
 * web search (competitor/market intel), page reader (baseline reads).
 */
let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;

export async function getZai() {
  if (_zai) return _zai;
  _zai = await ZAI.create();
  return _zai;
}

export type ZaiClient = Awaited<ReturnType<typeof ZAI.create>>;
