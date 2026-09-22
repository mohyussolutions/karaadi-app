import type { ListingBase } from '../types/listing.types';

function primaryListingKey(listing: ListingBase): string {
  return listing.id || listing._id;
}

function fallbackListingKey(listing: ListingBase): string {
  return listing._id || listing.id;
}

function isNewListing(seenKeys: Set<string>, listing: ListingBase): boolean {
  return !seenKeys.has(primaryListingKey(listing)) && !seenKeys.has(fallbackListingKey(listing));
}

export function mergeListings(current: ListingBase[], incoming: ListingBase[]): ListingBase[] {
  const seenKeys = new Set(current.map(primaryListingKey));
  const newListings = incoming.filter((listing) => isNewListing(seenKeys, listing));
  return newListings.length ? [...current, ...newListings] : current;
}
