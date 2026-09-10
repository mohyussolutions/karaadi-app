import type { ListingBase } from './listing.types';
import type { User } from './user.types';

export interface UseHomeFeedResult {
  user: User | null;
  listings: ListingBase[];
  recommendations: ListingBase[];
  refreshing: boolean;
  loading: boolean;
  visibleListings: ListingBase[];
  hasMore: boolean;
  onRefresh: () => Promise<void>;
  showMore: () => void;
}
