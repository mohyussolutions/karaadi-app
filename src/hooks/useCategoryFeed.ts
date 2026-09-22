import { useState, useCallback, useEffect } from 'react';
import { fetchByCategory } from '../actions/categories/feed.actions';
import { prefetchImages } from '../util/helpers';
import { CATEGORY_FEED_LIMIT } from '../constants';
import { sortByTierRandom } from '../policy/feedTierPolicy';
import type { ListingBase } from '../util/types/listing.types';

const PREFETCH_LIMIT = 20;

export function useCategoryFeed(categoryKey: string, subcategoryKey?: string) {
  const [listings, setListings] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!categoryKey) return;
    try {
      const params: Record<string, string> = { limit: String(CATEGORY_FEED_LIMIT) };
      if (subcategoryKey) {
        params.category = subcategoryKey;
        params.categoryTag = subcategoryKey;
      }
      const data = await fetchByCategory(categoryKey, params, signal);
      if (signal?.aborted) return;
      const sorted = sortByTierRandom(data);
      setListings(sorted);
      prefetchImages(sorted, PREFETCH_LIMIT).catch(() => {});
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryKey, subcategoryKey]);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [categoryKey, subcategoryKey]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  return { listings, loading, refreshing, onRefresh };
}
