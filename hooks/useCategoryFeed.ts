import { useState, useCallback, useEffect } from 'react';
import { fetchByCategory } from '../api/categories/feed.actions';
import { waitForImages } from '../util/helpers';
import { CATEGORY_FEED_LIMIT } from '../constants';
import type { ListingBase } from '../util/types/listing.types';

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
      await waitForImages(data);
      if (signal?.aborted) return;
      setListings(data);
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

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }

  return { listings, loading, refreshing, onRefresh };
}
