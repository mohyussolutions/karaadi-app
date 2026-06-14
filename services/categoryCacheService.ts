import type { ListingBase } from '../util/types/listing.types';

const TTL = 5 * 60_000;

type Entry = { data: ListingBase[]; ts: number };
const cache = new Map<string, Entry>();

export function cacheKey(categoryKey: string, subcategoryKey?: string): string {
  return subcategoryKey ? `${categoryKey}/${subcategoryKey}` : categoryKey;
}

export function getCached(key: string): ListingBase[] | null {
  return cache.get(key)?.data ?? null;
}

export function isFresh(key: string): boolean {
  const entry = cache.get(key);
  return !!entry && Date.now() - entry.ts < TTL;
}

export function setCached(key: string, data: ListingBase[]): void {
  cache.set(key, { data, ts: Date.now() });
}
