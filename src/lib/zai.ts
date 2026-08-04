import ZAI from "z-ai-web-dev-sdk";
import fs from "node:fs";
import os from "node:os";

/**
 * Shared ZAI helper (backend-only).
 *
 * Two modes:
 *  1. Env-var mode (production / Vercel): set ZAI_BASE_URL + ZAI_API_KEY.
 *     Calls the ZAI HTTP API directly with fetch — no config file needed.
 *  2. SDK mode (sandbox): falls back to z-ai-web-dev-sdk which reads
 *     /etc/.z-ai-config. Used automatically when env vars are absent.
 *
 * If neither is available, AI calls throw a clear "not configured" error
 * that the API routes catch and return as a graceful message.
 */

export interface ZaiChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ZaiVisionPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

const ENV_BASE_URL = process.env.ZAI_BASE_URL;
const ENV_API_KEY = process.env.ZAI_API_KEY;
const ENV_CHAT_ID = process.env.ZAI_CHAT_ID;
const ENV_USER_ID = process.env.ZAI_USER_ID;
const ENV_TOKEN = process.env.ZAI_TOKEN;

export function isZaiConfigured(): boolean {
  return Boolean(ENV_BASE_URL && ENV_API_KEY) || hasSdkConfig();
}

function hasSdkConfig(): boolean {
  // The SDK reads /etc/.z-ai-config, ~/.z-ai-config, or ./.z-ai-config
  try {
    return (
      fs.existsSync("/etc/.z-ai-config") ||
      fs.existsSync(os.homedir() + "/.z-ai-config") ||
      fs.existsSync(process.cwd() + "/.z-ai-config")
    );
  } catch {
    return false;
  }
}

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getSdk() {
  if (_zai) return _zai;
  _zai = await ZAI.create();
  return _zai;
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ENV_API_KEY}`,
    "X-Z-AI-From": "Z",
  };
  if (ENV_CHAT_ID) h["X-Chat-Id"] = ENV_CHAT_ID;
  if (ENV_USER_ID) h["X-User-Id"] = ENV_USER_ID;
  if (ENV_TOKEN) h["X-Token"] = ENV_TOKEN;
  return h;
}

/** Chat completion. Returns the assistant text. */
export async function zaiChat(messages: ZaiChatMessage[]): Promise<string> {
  // Env-var mode: direct HTTP
  if (ENV_BASE_URL && ENV_API_KEY) {
    const res = await fetch(`${ENV_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        messages,
        thinking: { type: "disabled" },
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`ZAI chat HTTP ${res.status}: ${t.slice(0, 200)}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  }
  // SDK mode (sandbox)
  if (hasSdkConfig()) {
    const zai = await getSdk();
    const completion = await zai.chat.completions.create({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      thinking: { type: "disabled" as const },
    });
    return completion.choices?.[0]?.message?.content || "";
  }
  throw new Error("ZAI_NOT_CONFIGURED");
}

/** Vision chat (image + text). Returns the assistant text. */
export async function zaiVision(prompt: string, imageUrl: string): Promise<string> {
  if (ENV_BASE_URL && ENV_API_KEY) {
    const res = await fetch(`${ENV_BASE_URL}/chat/completions/vision`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        thinking: { type: "disabled" },
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`ZAI vision HTTP ${res.status}: ${t.slice(0, 200)}`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  }
  if (hasSdkConfig()) {
    const zai = await getSdk();
    const response = await zai.chat.completions.createVision({
      model: "glm-4v",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      thinking: { type: "disabled" as const },
    });
    return response.choices?.[0]?.message?.content || "";
  }
  throw new Error("ZAI_NOT_CONFIGURED");
}

export const NOT_CONFIGURED_REPLY =
  "The AI assistant is not configured on this deployment. To activate it, set ZAI_BASE_URL and ZAI_API_KEY environment variables on Vercel. Meanwhile, submit your RFQ directly and the Gulf Seismic team will respond within the published SLA.";
