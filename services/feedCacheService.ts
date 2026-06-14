import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ListingBase } from '../util/types/listing.types';

const STORAGE_KEY = 'karaadi_feed_v1';
const TTL = 300_000;

let mem: { listings: ListingBase[]; ts: number } | null = null;

export function getMemCache(): ListingBase[] | null {
  return mem ? mem.listings : null;
}

export function setMemCache(listings: ListingBase[]): void {
  mem = { listings, ts: Date.now() };
}

export function isCacheFresh(): boolean {
  return !!mem && Date.now() - mem.ts < TTL;
}

export async function readDiskCache(): Promise<ListingBase[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { listings?: ListingBase[] } | null;
    const listings = parsed?.listings;
    return Array.isArray(listings) ? listings : null;
  } catch {
    return null;
  }
}

export function writeDiskCache(listings: ListingBase[]): void {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ listings, ts: Date.now() })).catch(() => {});
}

export function mergeListings(current: ListingBase[], incoming: ListingBase[]): ListingBase[] {
  const seen = new Set(current.map((l) => l.id || l._id));
  const novel = incoming.filter((l) => !seen.has(l.id || l._id) && !seen.has(l._id || l.id));
  return novel.length ? [...current, ...novel] : current;
}
