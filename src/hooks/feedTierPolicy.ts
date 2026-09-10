import type { ListingBase } from '../util/types/listing.types';
import type { FeedTierKey } from '../util/types/feedTier.types';
import { TOP_ITEMS_DAYS, DAY_MS } from './feedTierPolicy.constants';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const isTopTierItem = (listing: ListingBase, now: number): boolean => {
  if (!listing.isPremium90) return false;
  const expiryAt = listing.expiryDate ? Date.parse(listing.expiryDate) : Number.NaN;
  if (Number.isFinite(expiryAt)) return expiryAt > now;
  const createdAt = Date.parse(listing.createdAt);
  const topItemsCutoff = now - TOP_ITEMS_DAYS * DAY_MS;
  return Number.isFinite(createdAt) ? createdAt >= topItemsCutoff : true;
};

const tierKeyFor = (listing: ListingBase, now: number): FeedTierKey => {
  if (isTopTierItem(listing, now)) return 'premium90';
  if (listing.isStandard60) return 'standard60';
  if (listing.isBasic30) return 'basic30';
  return 'rest';
};

function groupListingsByTier(listings: ListingBase[], now: number): Map<FeedTierKey, ListingBase[]> {
  const buckets = new Map<FeedTierKey, ListingBase[]>([
    ['premium90', []],
    ['standard60', []],
    ['basic30', []],
    ['rest', []],
  ]);

  for (const listing of listings) {
    buckets.get(tierKeyFor(listing, now))?.push(listing);
  }

  return buckets;
}

export function sortByTierRandom(listings: ListingBase[]): ListingBase[] {
  const buckets = groupListingsByTier(listings, Date.now());
  return [...buckets.values()].flatMap(shuffle);
}
