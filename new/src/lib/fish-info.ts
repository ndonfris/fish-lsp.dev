import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

/** Playground fly.io container — already has fish-lsp installed. */
const API_URL = 'https://playground.fish-lsp.dev/api/info';

/** Persistent cache location (under node_modules, already gitignored). */
const CACHE_FILE = resolve('node_modules/.cache/fish-lsp-info.json');

/** Re-fetch at most once every 6 hours. */
const TTL_MS = 6 * 60 * 60 * 1000;

export interface FishInfo {
  version: string;
  buildTime: string;
}

interface CacheEntry {
  fetchedAt: number;
  data: FishInfo;
}

async function readCache(): Promise<CacheEntry | null> {
  try {
    const parsed = JSON.parse(await readFile(CACHE_FILE, 'utf8')) as CacheEntry;
    if (parsed && parsed.data && typeof parsed.fetchedAt === 'number') return parsed;
  } catch {
    /* missing or corrupt cache — treat as empty */
  }
  return null;
}

async function writeCache(data: FishInfo): Promise<void> {
  try {
    await mkdir(dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify({ fetchedAt: Date.now(), data }), 'utf8');
  } catch {
    /* cache is best-effort — ignore write failures */
  }
}

async function fetchUpstream(): Promise<FishInfo | null> {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && typeof json.version === 'string') {
      return { version: json.version, buildTime: String(json.buildTime ?? '') };
    }
  } catch {
    /* network/parse failure */
  }
  return null;
}

/**
 * fish-lsp version/build-time, persistently cached for 6h. Only hits the
 * network when the cache is missing or older than the TTL; on a network
 * failure it falls back to the (stale) cache, or null if there is none.
 */
export async function getFishInfo(): Promise<FishInfo | null> {
  const cached = await readCache();
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return cached.data;
  }

  const fresh = await fetchUpstream();
  if (fresh) {
    await writeCache(fresh);
    return fresh;
  }

  return cached?.data ?? null; // serve stale on failure
}
