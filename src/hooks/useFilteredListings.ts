import { useMemo } from 'react';
import type { ListingBase } from '../util/types/listing.types';

function matchesListingQuery(item: ListingBase, q: string) {
  const matchesTitle = (item.title ?? '').toLowerCase().includes(q);
  const matchesCity = (item.city ?? '').toLowerCase().includes(q);
  const matchesRegion = (item.region ?? '').toLowerCase().includes(q);
  const matchesPrice = String(item.price ?? '').includes(q);
  return matchesTitle || matchesCity || matchesRegion || matchesPrice;
}

export function useFilteredListings(listings: ListingBase[], searchQuery: string) {
  return useMemo(
    () => listings.filter((item) => matchesListingQuery(item, searchQuery.trim().toLowerCase())),
    [listings, searchQuery],
  );
}

export function useSearchFilteredListings(listings: ListingBase[], searchQuery: string) {
  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return listings.filter((item) => matchesListingQuery(item, q));
  }, [listings, searchQuery]);
}
