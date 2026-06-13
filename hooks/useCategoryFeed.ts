import { useState, useCallback, useEffect } from 'react';
import { fetchByCategory } from '../api/categories/feed.actions';
import { getCached, setCached, isFresh, cacheKey } from '../services/categoryCacheService';
import { CATEGORY_FEED_LIMIT } from '../constants';
import type { ListingBase } from '../utils/types/listing.types';

export function useCategoryFeed(categoryKey: string, subcategoryKey?: string) {
  const key = cacheKey(categoryKey, subcategoryKey);
  const cached = getCached(key);

  const [listings, setListings] = useState<ListingBase[]>(cached ?? []);
  const [loading, setLoading] = useState(cached === null);
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
      setCached(key, data);
      setListings(data);
    } catch {
      if (!getCached(key)) setListings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryKey, subcategoryKey, key]);

  useEffect(() => {
    if (isFresh(key)) return;
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [key]);

  function onRefresh() {
    setRefreshing(true);
    fetchData();
  }

  return { listings, loading, refreshing, onRefresh };
}
