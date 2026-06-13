import type { AnyListing } from '../utils/types/listing.types';

const cache: Record<string, AnyListing> = {};

export function cacheListing(id: string, item: AnyListing): void {
  if (id) cache[id] = item;
}

export function getCachedListing<T extends AnyListing = AnyListing>(id: string): T | null {
  return (cache[id] as T) ?? null;
}
