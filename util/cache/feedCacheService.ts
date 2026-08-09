import type { ListingBase } from '../types/listing.types';

export function mergeListings(current: ListingBase[], incoming: ListingBase[]): ListingBase[] {
  const seen = new Set(current.map((l) => l.id || l._id));
  const novel = incoming.filter((l) => !seen.has(l.id || l._id) && !seen.has(l._id || l.id));
  return novel.length ? [...current, ...novel] : current;
}
