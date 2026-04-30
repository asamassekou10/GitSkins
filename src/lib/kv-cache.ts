/**
 * Thin caching layer.
 *
 * Uses Vercel KV in production (when KV_REST_API_URL + KV_REST_API_TOKEN are set).
 * Falls back to a process-scoped in-memory Map so the app works without KV.
 *
 * The in-memory fallback is good enough for development and low-traffic
 * deployments — it keeps data warm per serverless instance rather than
 * globally, which is fine.
 */

// ─── In-memory fallback ───────────────────────────────────────────────────────

interface MemEntry<T> {
  value: T;
  expiresAt: number;
}

const mem = new Map<string, MemEntry<unknown>>();

function memGet<T>(key: string): T | null {
  const entry = mem.get(key) as MemEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    mem.delete(key);
    return null;
  }
  return entry.value;
}

function memSet<T>(key: string, value: T, ttlSeconds: number): void {
  mem.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ─── KV availability check ───────────────────────────────────────────────────

function kvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (kvAvailable()) {
    try {
      const { kv } = await import('@vercel/kv');
      return await kv.get<T>(key);
    } catch {
      // KV unavailable — fall through to memory
    }
  }
  return memGet<T>(key);
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (kvAvailable()) {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.setex(key, ttlSeconds, value);
      return;
    } catch {
      // KV unavailable — fall through to memory
    }
  }
  memSet(key, value, ttlSeconds);
}

/**
 * Cache-aside helper.
 * Calls `fetcher` only on a cache miss and stores the result for `ttlSeconds`.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  if (fresh !== null && fresh !== undefined) {
    await cacheSet(key, fresh, ttlSeconds);
  }
  return fresh;
}
