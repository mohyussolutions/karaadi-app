import type { ListingBase } from '../models/listing.types';

export interface UseListingDetailOptions<T extends ListingBase> {
  fetchItem: (id: string, signal: AbortSignal) => Promise<T | null | undefined>;
  categoryHint: string;
  listingType?: string;
  contactRole?: string;
  extraDeps?: unknown[];
}

export type ListingFetcher<T extends ListingBase> = UseListingDetailOptions<T>['fetchItem'];
