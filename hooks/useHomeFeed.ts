import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { fetchFeedGroup, getHomeFeedRecommendations } from '../api/categories/feed.actions';
import { mergeListings, setMemCache, writeDiskCache, readDiskCache } from '../util/cache/feedCacheService';
import { setFeed, setRecommendations, isFeedFresh } from '../store/slices/feedSlice';
import type { ListingBase } from '../util/types/listing.types';

const INITIAL_VISIBLE = 20;
const READ_MORE_STEP = 10;
const TOP_ITEMS_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sortByTierRandom(listings: ListingBase[]): ListingBase[] {
  const now = Date.now();
  const topItemsCutoff = now - TOP_ITEMS_DAYS * DAY_MS;

  const isTop90Item = (listing: ListingBase): boolean => {
    if (!listing.isPremium90) return false;
    const expiryAt = listing.expiryDate ? Date.parse(listing.expiryDate) : Number.NaN;
    if (Number.isFinite(expiryAt)) return expiryAt > now;
    const createdAt = Date.parse(listing.createdAt);
    return Number.isFinite(createdAt) ? createdAt >= topItemsCutoff : true;
  };

  const top90 = shuffle(listings.filter((l) => isTop90Item(l)));
  const standard = shuffle(listings.filter((l) => l.isStandard60 && !isTop90Item(l)));
  const basic = shuffle(listings.filter((l) => l.isBasic30 && !isTop90Item(l) && !l.isStandard60));
  const rest = shuffle(listings.filter((l) => !isTop90Item(l) && !l.isStandard60 && !l.isBasic30));
  return [...top90, ...standard, ...basic, ...rest];
}

async function fetchRecommendations(signal?: AbortSignal): Promise<ListingBase[]> {
  try {
    return await getHomeFeedRecommendations(signal);
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

  useEffect(() => {
    const ctrl = new AbortController();
    async function init() {
      if (isFeedFresh(fetchedAtRef.current)) return;

      const disk = await readDiskCache();
      if (disk && disk.length > 0 && !ctrl.signal.aborted) {
        dispatch(setFeed(sortByTierRandom(disk)));
        setMemCache(disk);
      }

      const fast = await fetchFeedGroup('fast', ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (fast.length > 0) {
        const sorted = sortByTierRandom(fast);
        dispatch(setFeed(sorted));
        setMemCache(fast);
        writeDiskCache(fast);
      }

      const slow = await fetchFeedGroup('slow', ctrl.signal);
      if (ctrl.signal.aborted || slow.length === 0) return;
      const merged = mergeListings(fast.length > 0 ? fast : (disk ?? []), slow);
      dispatch(setFeed(sortByTierRandom(merged)));
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

    const [fast, recs] = await Promise.allSettled([
      fetchFeedGroup('fast'),
      user ? fetchRecommendations() : Promise.resolve([]),
    ]);
    if (fast.status === 'fulfilled' && fast.value.length > 0) {
      dispatch(setFeed(sortByTierRandom(fast.value)));
      setMemCache(fast.value);
      writeDiskCache(fast.value);
    }
    if (recs.status === 'fulfilled') dispatch(setRecommendations(recs.value as ListingBase[]));
    setRefreshing(false);

    fetchFeedGroup('slow').then((slow) => {
      if (slow.length === 0) return;
      const fastItems = fast.status === 'fulfilled' ? fast.value : listings;
      const merged = mergeListings(fastItems, slow);
      dispatch(setFeed(sortByTierRandom(merged)));
      writeDiskCache(merged);
    });
  }, [user, dispatch, listings]);

  function showMore() { setVisibleCount((n) => n + READ_MORE_STEP); }

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return { user, listings, recommendations, refreshing, visibleListings, hasMore, onRefresh, showMore };
}
