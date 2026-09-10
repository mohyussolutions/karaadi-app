import { getHomeFeedRecommendations } from '../actions/categories/feed.actions';
import { fetchAllPaidSubscriptions } from '../actions/categories/subscription.actions';
import { subscriptionToListingItem } from '../util/helpers';
import type { ListingBase } from '../util/types/listing.types';

export async function fetchRecommendations(userId: string, signal?: AbortSignal): Promise<ListingBase[]> {
  try {
    return await getHomeFeedRecommendations(userId, signal);
  } catch {
    return [];
  }
}

export async function fetchWantedListings(signal?: AbortSignal): Promise<ListingBase[]> {
  const subs = await fetchAllPaidSubscriptions(signal);
  return subs.map(subscriptionToListingItem);
}
