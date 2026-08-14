import { useEffect, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { fetchFeedGroup, getHomeFeedRecommendations } from '../../api/categories/feed.actions';
import { mergeListings } from '../../util/cache/feedCacheService';
import { prefetchImages } from '../../util/helpers';
import { setFeed, setRecommendations } from '../../store/slices/feedSlice';
import type { ListingBase } from '../../util/types/listing.types';

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

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function init() {
      const fast = await fetchFeedGroup('fast', ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (fast.length > 0) {
        const sorted = sortByTierRandom(fast);
        dispatch(setFeed(sorted));
        prefetchImages(sorted, INITIAL_VISIBLE).catch(() => {});
      }

      const slow = await fetchFeedGroup('slow', ctrl.signal);
      if (ctrl.signal.aborted || slow.length === 0) return;
      const merged = mergeListings(fast, slow);
      dispatch(setFeed(sortByTierRandom(merged)));
    }
    init();
    return () => ctrl.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    fetchRecommendations(ctrl.signal).then((recs) => {
      if (ctrl.signal.aborted) return;
      dispatch(setRecommendations(recs));
      if (recs.length > 0) prefetchImages(recs).catch(() => {});
    });
    return () => ctrl.abort();
  }, [user?.id, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setVisibleCount(INITIAL_VISIBLE);

    const [fast, recs] = await Promise.allSettled([
      fetchFeedGroup('fast'),
      user ? fetchRecommendations() : Promise.resolve([]),
    ]);
    const fastValue = fast.status === 'fulfilled' ? fast.value : [];
    const recsValue = recs.status === 'fulfilled' ? (recs.value as ListingBase[]) : [];

    if (fastValue.length > 0) dispatch(setFeed(sortByTierRandom(fastValue)));
    if (recs.status === 'fulfilled') dispatch(setRecommendations(recsValue));
    setRefreshing(false);
    Promise.all([prefetchImages(fastValue, INITIAL_VISIBLE), prefetchImages(recsValue)]).catch(() => {});

    fetchFeedGroup('slow').then((slow) => {
      if (slow.length === 0) return;
      const fastItems = fast.status === 'fulfilled' ? fast.value : listings;
      const merged = mergeListings(fastItems, slow);
      dispatch(setFeed(sortByTierRandom(merged)));
    });
  }, [user, dispatch, listings]);

  const showMore = useCallback(() => {
    const nextBatch = listings.slice(visibleCount, visibleCount + READ_MORE_STEP);
    setVisibleCount((n) => n + READ_MORE_STEP);
    prefetchImages(nextBatch).catch(() => {});
  }, [listings, visibleCount]);

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return { user, listings, recommendations, refreshing, visibleListings, hasMore, onRefresh, showMore, revealing };
}
