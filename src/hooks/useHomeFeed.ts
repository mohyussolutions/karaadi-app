import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { fetchFeedGroup, fetchFeedPage } from '../actions/categories/feed.actions';
import { mergeListings } from '../util/cache/feedCacheService';
import { prefetchImages } from '../util/helpers';
import { setFeed, mergeFeed, setRecommendations } from '../store/slices/feedSlice';
import { INITIAL_VISIBLE, READ_MORE_STEP, EAGER_PREFETCH_COUNT, FEED_GROUPS, FEED_MAX_ITEMS, FEED_DEFAULT_PAGE } from '../constants/constants';
import { fetchRecommendations, fetchWantedListings } from './useHomeFeed.helpers';
import { sortByTierRandom } from './feedTierPolicy';
import type { ListingBase } from '../util/types/listing.types';
import type { UseHomeFeedResult } from '../util/types/useHomeFeed.types';

export function useHomeFeed(): UseHomeFeedResult {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const listings = useAppSelector((s) => s.feed.listings ?? []);
  const recommendations = useAppSelector((s) => s.feed.recommendations ?? []);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const nextPageRef = useRef(FEED_DEFAULT_PAGE + 1);
  const loadingMoreRef = useRef(false);
  const endReachedRef = useRef(false);

  const listingsRef = useRef(listings);
  useEffect(() => { listingsRef.current = listings; }, [listings]);

  useEffect(() => {
    const ctrl = new AbortController();
    async function init() {
      let fast: ListingBase[] = [];
      try {
        fast = await fetchFeedGroup(FEED_GROUPS.FAST, ctrl.signal);
      } finally {
        if (!ctrl.signal.aborted && fast.length > 0) setLoading(false);
      }
      if (ctrl.signal.aborted) return;
      let current = fast;
      if (fast.length > 0) {
        const sorted = sortByTierRandom(fast);
        dispatch(setFeed(sorted));
        prefetchImages(sorted, EAGER_PREFETCH_COUNT).catch(() => {});
      }

      const wantedPromise = fetchWantedListings(ctrl.signal).catch(() => [] as ListingBase[]);

      const slow = await fetchFeedGroup(FEED_GROUPS.SLOW, ctrl.signal);
      if (!ctrl.signal.aborted) {
        if (slow.length > 0) {
          current = mergeListings(current, slow);
          dispatch(setFeed(sortByTierRandom(current)));
        }
        setLoading(false);
      }

      const wanted = await wantedPromise;
      if (!ctrl.signal.aborted && wanted.length > 0) {
        current = mergeListings(current, wanted);
        dispatch(setFeed(sortByTierRandom(current)));
      }
    }
    init();
    return () => ctrl.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    const ctrl = new AbortController();
    fetchRecommendations(user.id, ctrl.signal).then((recs) => {
      if (ctrl.signal.aborted) return;
      dispatch(setRecommendations(recs));
      if (recs.length > 0) prefetchImages(recs).catch(() => {});
    });
    return () => ctrl.abort();
  }, [user?.id, dispatch]);

  const userId = user?.id;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setVisibleCount(INITIAL_VISIBLE);
    nextPageRef.current = FEED_DEFAULT_PAGE + 1;
    endReachedRef.current = false;
    setEndReached(false);

    const [fast, recs] = await Promise.allSettled([
      fetchFeedGroup(FEED_GROUPS.FAST),
      userId ? fetchRecommendations(userId) : Promise.resolve([]),
    ]);
    const fastValue = fast.status === 'fulfilled' ? fast.value : [];
    const recsValue = recs.status === 'fulfilled' ? (recs.value as ListingBase[]) : [];

    if (fastValue.length > 0) dispatch(setFeed(sortByTierRandom(fastValue)));
    if (recs.status === 'fulfilled') dispatch(setRecommendations(recsValue));
    setRefreshing(false);
    Promise.all([prefetchImages(fastValue, EAGER_PREFETCH_COUNT), prefetchImages(recsValue)]).catch(() => {});

    let current = fast.status === 'fulfilled' ? fastValue : listingsRef.current;

    fetchWantedListings().then((wanted) => {
      if (wanted.length === 0) return;
      current = mergeListings(current, wanted);
      dispatch(setFeed(sortByTierRandom(current)));
    }).catch(() => {});

    fetchFeedGroup(FEED_GROUPS.SLOW).then((slow) => {
      if (slow.length === 0) return;
      current = mergeListings(current, slow);
      dispatch(setFeed(sortByTierRandom(current)));
    });
  }, [userId, dispatch]);

  const loadNextPage = useCallback(async () => {
    if (loadingMoreRef.current || endReachedRef.current) return;
    if (listingsRef.current.length >= FEED_MAX_ITEMS) {
      endReachedRef.current = true;
      setEndReached(true);
      return;
    }
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const items = await fetchFeedPage(nextPageRef.current);
      const known = new Set(listingsRef.current.map((l) => l.id || l._id));
      const novel = items.filter((l) => !known.has(l.id || l._id));
      if (novel.length === 0) {
        endReachedRef.current = true;
        setEndReached(true);
      } else {
        nextPageRef.current += 1;
        dispatch(mergeFeed(sortByTierRandom(novel)));
        prefetchImages(novel, EAGER_PREFETCH_COUNT).catch(() => {});
      }
    } catch {
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [dispatch]);

  const showMore = useCallback(() => {
    const nextBatch = listingsRef.current.slice(visibleCount, visibleCount + READ_MORE_STEP);
    setVisibleCount((n: number) => n + READ_MORE_STEP);
    prefetchImages(nextBatch).catch(() => {});
    if (visibleCount + READ_MORE_STEP * 2 >= listingsRef.current.length) loadNextPage();
  }, [visibleCount, loadNextPage]);

  const visibleListings = useMemo(() => listings.slice(0, visibleCount), [listings, visibleCount]);
  const hasMore = visibleCount < listings.length || (!endReached && listings.length > 0);

  return { user, listings, recommendations, refreshing, loading, visibleListings, hasMore, loadingMore, onRefresh, showMore };
}
