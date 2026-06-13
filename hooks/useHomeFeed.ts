import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { fetchFeedGroup } from '../api/categories/feed.actions';
import { apiClient } from '../api/client';
import { FEED_ENDPOINTS } from '../constants';
import { mergeListings, setMemCache, writeDiskCache } from '../services/feedCacheService';
import { setFeed, mergeFeed, setRecommendations, isFeedFresh } from '../store/slices/feedSlice';
import type { ListingBase } from '../utils/types/listing.types';

const INITIAL_VISIBLE = 20;
const READ_MORE_STEP = 10;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sortByTierRandom(listings: ListingBase[]): ListingBase[] {
  const premium = shuffle(listings.filter((l: any) => l.isPremium90));
  const standard = shuffle(listings.filter((l: any) => l.isStandard60 && !l.isPremium90));
  const basic = shuffle(listings.filter((l: any) => l.isBasic30 && !l.isPremium90 && !l.isStandard60));
  const rest = shuffle(listings.filter((l: any) => !l.isPremium90 && !l.isStandard60 && !l.isBasic30));
  return [...premium, ...standard, ...basic, ...rest];
}

async function fetchRecommendations(signal?: AbortSignal): Promise<ListingBase[]> {
  try {
    const { data } = await apiClient.get(FEED_ENDPOINTS.RECOMMENDATIONS, { signal });
    const list = Array.isArray(data) ? data : data?.listings ?? data?.data ?? [];
    return list.map((item: Record<string, unknown>) => ({ ...item, id: item.id || item._id }));
  } catch {
    return [];
  }
}

export function useHomeFeed() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const listings = useAppSelector((s) => s.feed.listings ?? []);
  const recommendations = useAppSelector((s) => s.feed.recommendations ?? []);
  const fetchedAt = useAppSelector((s) => s.feed.fetchedAt);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const fetchedAtRef = useRef(fetchedAt);
  fetchedAtRef.current = fetchedAt;
  const didSortRef = useRef(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function init() {
      if (isFeedFresh(fetchedAtRef.current)) return;

      const fast = await fetchFeedGroup('fast', ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (fast.length > 0) {
        didSortRef.current = true;
        const sorted = sortByTierRandom(fast);
        dispatch(setFeed(sorted));
        setMemCache(fast);
        writeDiskCache(fast);
      }

      const slow = await fetchFeedGroup('slow', ctrl.signal);
      if (ctrl.signal.aborted || slow.length === 0) return;
      dispatch(mergeFeed(sortByTierRandom(slow)));
      const merged = mergeListings(fast, slow);
      setMemCache(merged);
      writeDiskCache(merged);
    }
    init();
    return () => ctrl.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    fetchRecommendations(ctrl.signal).then((recs) => dispatch(setRecommendations(recs)));
    return () => ctrl.abort();
  }, [user?.id, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setVisibleCount(INITIAL_VISIBLE);
    didSortRef.current = false;

    const [fast, recs] = await Promise.allSettled([
      fetchFeedGroup('fast'),
      user ? fetchRecommendations() : Promise.resolve([]),
    ]);
    if (fast.status === 'fulfilled' && fast.value.length > 0) {
      didSortRef.current = true;
      dispatch(setFeed(sortByTierRandom(fast.value)));
      setMemCache(fast.value);
      writeDiskCache(fast.value);
    }
    if (recs.status === 'fulfilled') dispatch(setRecommendations(recs.value as ListingBase[]));
    setRefreshing(false);

    fetchFeedGroup('slow').then((slow) => {
      if (slow.length === 0) return;
      dispatch(mergeFeed(sortByTierRandom(slow)));
      const fastItems = fast.status === 'fulfilled' ? fast.value : [];
      writeDiskCache(mergeListings(fastItems, slow));
    });
  }, [user, dispatch]);

  function showMore() { setVisibleCount((n) => n + READ_MORE_STEP); }

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return { user, listings, recommendations, refreshing, visibleListings, hasMore, onRefresh, showMore };
}
