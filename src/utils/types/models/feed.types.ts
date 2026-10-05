import type { FEED_GROUPS } from '../../../actions/constants/api.constants';
import type { ListingBase } from './listing.types';

export type FeedGroup = (typeof FEED_GROUPS)[keyof typeof FEED_GROUPS];

export type FeedTierKey = 'premium90' | 'standard60' | 'basic30' | 'rest';

export interface TieredListing {
  listing: ListingBase;
  tier: FeedTierKey;
}
