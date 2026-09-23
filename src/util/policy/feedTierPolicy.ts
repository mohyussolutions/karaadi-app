import type { ListingBase } from '../types/listing.types';
import type { FeedTierKey } from '../types/feedTier.types';
import { TOP_ITEMS_DAYS, DAY_MS, TIER_ORDER } from '../../constants';

function swap<T>(items: T[], indexA: number, indexB: number): void {
  [items[indexA], items[indexB]] = [items[indexB], items[indexA]];
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex--) {
    const swapIndex = Math.floor(Math.random() * (currentIndex + 1));
    swap(shuffled, currentIndex, swapIndex);
  }
  return shuffled;
}

function hasActiveExpiry(listing: ListingBase, now: number): boolean | null {
  if (!listing.expiryDate) return null;
  const expiryAt = Date.parse(listing.expiryDate);
  return Number.isFinite(expiryAt) ? expiryAt > now : null;
}

function isWithinTopItemsWindow(listing: ListingBase, now: number): boolean {
  const createdAt = Date.parse(listing.createdAt);
  if (!Number.isFinite(createdAt)) return true;
  const topItemsCutoff = now - TOP_ITEMS_DAYS * DAY_MS;
  return createdAt >= topItemsCutoff;
}

function isTopTierItem(listing: ListingBase, now: number): boolean {
  if (!listing.isPremium90) return false;
  const activeExpiry = hasActiveExpiry(listing, now);
  return activeExpiry !== null ? activeExpiry : isWithinTopItemsWindow(listing, now);
}

function tierKeyFor(listing: ListingBase, now: number): FeedTierKey {
  if (isTopTierItem(listing, now)) return 'premium90';
  if (listing.isStandard60) return 'standard60';
  if (listing.isBasic30) return 'basic30';
  return 'rest';
}

function tagListingsWithTier(listings: ListingBase[], now: number): { listing: ListingBase; tier: FeedTierKey }[] {
  return listings.map((listing) => ({ listing, tier: tierKeyFor(listing, now) }));
}

function listingsForTier(taggedListings: { listing: ListingBase; tier: FeedTierKey }[], tier: FeedTierKey): ListingBase[] {
  return taggedListings.filter((entry) => entry.tier === tier).map((entry) => entry.listing);
}

function groupListingsByTier(listings: ListingBase[], now: number): ListingBase[][] {
  const taggedListings = tagListingsWithTier(listings, now);
  return TIER_ORDER.map((tier) => listingsForTier(taggedListings, tier));
}

export function sortByTierRandom(listings: ListingBase[]): ListingBase[] {
  return groupListingsByTier(listings, Date.now()).flatMap(shuffle);
}
