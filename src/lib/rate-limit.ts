/**
 * Simple in-memory rate limiter for public API endpoints.
 * Limits requests per IP address to prevent spam and bot abuse.
 *
 * Note: This is a per-instance limiter (resets on cold start / redeploy).
 * For production at scale, use @upstash/ratelimit with Vercel KV.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Check if a request from the given IP is allowed.
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  // Clean up expired entries periodically
  if (store.size > 1000) {
    for (const [key, val] of store.entries()) {
      if (val.resetAt < now) store.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    store.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract client IP from a Next.js request.
 * Handles Vercel's forwarded headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
