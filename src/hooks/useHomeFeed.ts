import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { fetchFeedGroup } from '../actions/categories/feed.actions';
import { mergeListings } from '../util/cache/feedCacheService';
import { prefetchImages } from '../util/helpers';
import { setFeed, setRecommendations } from '../store/slices/feedSlice';
import { INITIAL_VISIBLE, READ_MORE_STEP } from './useHomeFeed.constants';
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

  const listingsRef = useRef(listings);
  useEffect(() => { listingsRef.current = listings; }, [listings]);

  useEffect(() => {
    const ctrl = new AbortController();
    async function init() {
      let fast: ListingBase[] = [];
      try {
        fast = await fetchFeedGroup('fast', ctrl.signal);
      } finally {
        if (!ctrl.signal.aborted && fast.length > 0) setLoading(false);
      }
      if (ctrl.signal.aborted) return;
      let current = fast;
      if (fast.length > 0) {
        const sorted = sortByTierRandom(fast);
        dispatch(setFeed(sorted));
        prefetchImages(sorted, INITIAL_VISIBLE).catch(() => {});
      }

      const wantedPromise = fetchWantedListings(ctrl.signal).catch(() => [] as ListingBase[]);

      const slow = await fetchFeedGroup('slow', ctrl.signal);
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

    const [fast, recs] = await Promise.allSettled([
      fetchFeedGroup('fast'),
      userId ? fetchRecommendations(userId) : Promise.resolve([]),
    ]);
    const fastValue = fast.status === 'fulfilled' ? fast.value : [];
    const recsValue = recs.status === 'fulfilled' ? (recs.value as ListingBase[]) : [];

    if (fastValue.length > 0) dispatch(setFeed(sortByTierRandom(fastValue)));
    if (recs.status === 'fulfilled') dispatch(setRecommendations(recsValue));
    setRefreshing(false);
    Promise.all([prefetchImages(fastValue, INITIAL_VISIBLE), prefetchImages(recsValue)]).catch(() => {});

    let current = fast.status === 'fulfilled' ? fastValue : listingsRef.current;

    fetchWantedListings().then((wanted) => {
      if (wanted.length === 0) return;
      current = mergeListings(current, wanted);
      dispatch(setFeed(sortByTierRandom(current)));
    }).catch(() => {});

    fetchFeedGroup('slow').then((slow) => {
      if (slow.length === 0) return;
      current = mergeListings(current, slow);
      dispatch(setFeed(sortByTierRandom(current)));
    });
  }, [userId, dispatch]);

  const showMore = useCallback(() => {
    const nextBatch = listingsRef.current.slice(visibleCount, visibleCount + READ_MORE_STEP);
    setVisibleCount((n: number) => n + READ_MORE_STEP);
    prefetchImages(nextBatch).catch(() => {});
  }, [visibleCount]);

  const visibleListings = useMemo(() => listings.slice(0, visibleCount), [listings, visibleCount]);
  const hasMore = visibleCount < listings.length;

  return { user, listings, recommendations, refreshing, loading, visibleListings, hasMore, onRefresh, showMore };
}
