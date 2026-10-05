import type { ListingBase } from '../models/listing.types';
import type { User } from '../models/user.types';

export interface UseHomeFeedResult {
  user: User | null;
  listings: ListingBase[];
  recommendations: ListingBase[];
  refreshing: boolean;
  loading: boolean;
  visibleListings: ListingBase[];
  hasMore: boolean;
  loadingMore: boolean;
  onRefresh: () => Promise<void>;
  showMore: () => void;
}

export type ListingsCallback = (listings: ListingBase[]) => void;
