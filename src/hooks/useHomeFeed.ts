import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/store';
import { fetchFeedGroup, fetchFeedPage } from '../actions/categories/feed.actions';
import { mergeListings } from '../util/cache/feedCacheService';
import { prefetchImages } from '../util/helpers';
import { setFeed, mergeFeed, setRecommendations } from '../store/slices/feedSlice';
import { INITIAL_VISIBLE, FEED_REVEAL_STEPS, READ_MORE_STEP, EAGER_PREFETCH_COUNT, FEED_GROUPS, FEED_MAX_ITEMS, FEED_DEFAULT_PAGE } from '../constants/constants';
import { fetchRecommendations, fetchWantedListings } from './useHomeFeed.helpers';
import { sortByTierRandom } from '../policy/feedTierPolicy';
import type { ListingBase } from '../util/types/listing.types';
import type { UseHomeFeedResult } from '../util/types/useHomeFeed.types';

function getListingKey(listing: ListingBase): string {
  return listing.id || listing._id;
}

function findNewListings(knownListings: ListingBase[], fetchedListings: ListingBase[]): ListingBase[] {
  const knownListingKeys = new Set(knownListings.map(getListingKey));
  return fetchedListings.filter((listing) => !knownListingKeys.has(getListingKey(listing)));
}

export function useHomeFeed(): UseHomeFeedResult {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const listings = useAppSelector((state) => state.feed.listings ?? []);
  const recommendations = useAppSelector((state) => state.feed.recommendations ?? []);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const nextPageRef = useRef(FEED_DEFAULT_PAGE + 1);
  const loadingMoreRef = useRef(false);
  const endReachedRef = useRef(false);
  const revealStepRef = useRef(0);

  const listingsRef = useRef(listings);
  useEffect(() => { listingsRef.current = listings; }, [listings]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadFastGroup(): Promise<ListingBase[]> {
      let fastListings: ListingBase[] = [];
      try {
        fastListings = await fetchFeedGroup(FEED_GROUPS.FAST, abortController.signal);
      } finally {
        if (!abortController.signal.aborted && fastListings.length > 0) setLoading(false);
      }
      if (fastListings.length > 0) {
        const sortedFastListings = sortByTierRandom(fastListings);
        dispatch(setFeed(sortedFastListings));
        prefetchImages(sortedFastListings, EAGER_PREFETCH_COUNT).catch(() => {});
      }
      return fastListings;
    }

    async function loadSlowGroup(currentListings: ListingBase[]): Promise<ListingBase[]> {
      const slowListings = await fetchFeedGroup(FEED_GROUPS.SLOW, abortController.signal);
      let mergedListings = currentListings;
      if (!abortController.signal.aborted) {
        if (slowListings.length > 0) {
          mergedListings = mergeListings(currentListings, slowListings);
          dispatch(setFeed(sortByTierRandom(mergedListings)));
        }
        setLoading(false);
      }
      return mergedListings;
    }

    async function loadWantedGroup(currentListings: ListingBase[], wantedPromise: Promise<ListingBase[]>): Promise<void> {
      const wantedListings = await wantedPromise;
      if (!abortController.signal.aborted && wantedListings.length > 0) {
        const mergedListings = mergeListings(currentListings, wantedListings);
        dispatch(setFeed(sortByTierRandom(mergedListings)));
      }
    }

    async function init() {
      const fastListings = await loadFastGroup();
      if (abortController.signal.aborted) return;

      const wantedPromise = fetchWantedListings(abortController.signal).catch(() => [] as ListingBase[]);

      const currentListings = await loadSlowGroup(fastListings);

      await loadWantedGroup(currentListings, wantedPromise);
    }

    init();
    return () => abortController.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    const abortController = new AbortController();
    fetchRecommendations(user.id, abortController.signal).then((recommendedListings) => {
      if (abortController.signal.aborted) return;
      dispatch(setRecommendations(recommendedListings));
      if (recommendedListings.length > 0) prefetchImages(recommendedListings).catch(() => {});
    });
    return () => abortController.abort();
  }, [user?.id, dispatch]);

  const userId = user?.id;

  const resetPagination = useCallback(() => {
    setVisibleCount(INITIAL_VISIBLE);
    nextPageRef.current = FEED_DEFAULT_PAGE + 1;
    endReachedRef.current = false;
    revealStepRef.current = 0;
    setEndReached(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    resetPagination();

    const [fastResult, recommendationsResult] = await Promise.allSettled([
      fetchFeedGroup(FEED_GROUPS.FAST),
      userId ? fetchRecommendations(userId) : Promise.resolve([]),
    ]);
    const fastListings = fastResult.status === 'fulfilled' ? fastResult.value : [];
    const recommendedListings = recommendationsResult.status === 'fulfilled' ? (recommendationsResult.value as ListingBase[]) : [];

    if (fastListings.length > 0) dispatch(setFeed(sortByTierRandom(fastListings)));
    if (recommendationsResult.status === 'fulfilled') dispatch(setRecommendations(recommendedListings));
    setRefreshing(false);
    Promise.all([prefetchImages(fastListings, EAGER_PREFETCH_COUNT), prefetchImages(recommendedListings)]).catch(() => {});

    let latestListings = fastResult.status === 'fulfilled' ? fastListings : listingsRef.current;

    fetchWantedListings().then((wantedListings) => {
      if (wantedListings.length === 0) return;
      latestListings = mergeListings(latestListings, wantedListings);
      dispatch(setFeed(sortByTierRandom(latestListings)));
    }).catch(() => {});

    fetchFeedGroup(FEED_GROUPS.SLOW).then((slowListings) => {
      if (slowListings.length === 0) return;
      latestListings = mergeListings(latestListings, slowListings);
      dispatch(setFeed(sortByTierRandom(latestListings)));
    });
  }, [userId, dispatch, resetPagination]);

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
      const fetchedListings = await fetchFeedPage(nextPageRef.current);
      const newListings = findNewListings(listingsRef.current, fetchedListings);
      if (newListings.length === 0) {
        endReachedRef.current = true;
        setEndReached(true);
      } else {
        nextPageRef.current += 1;
        dispatch(mergeFeed(sortByTierRandom(newListings)));
        prefetchImages(newListings, EAGER_PREFETCH_COUNT).catch(() => {});
      }
    } catch {
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [dispatch]);

  const showMore = useCallback(() => {
    const revealCount = FEED_REVEAL_STEPS[revealStepRef.current] ?? READ_MORE_STEP;
    revealStepRef.current += 1;
    const upcomingListings = listingsRef.current.slice(visibleCount, visibleCount + revealCount);
    setVisibleCount((previousVisibleCount: number) => previousVisibleCount + revealCount);
    prefetchImages(upcomingListings).catch(() => {});
    if (visibleCount + revealCount * 2 >= listingsRef.current.length) loadNextPage();
  }, [visibleCount, loadNextPage]);

  const visibleListings = useMemo(() => listings.slice(0, visibleCount), [listings, visibleCount]);
  const hasMore = visibleCount < listings.length || (!endReached && listings.length > 0);

  return { user, listings, recommendations, refreshing, loading, visibleListings, hasMore, loadingMore, onRefresh, showMore };
}
