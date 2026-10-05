import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  fetchByCategory,
  fetchCategoryPage,
  fetchFeedGroup,
  fetchFeedPage,
  fetchFullCategory,
  getHomeFeedRecommendations,
} from '../../actions/categories/feed.actions';
import { fetchAllPaidSubscriptions } from '../../actions/categories/subscription.actions';
import {
  CATEGORY_FEED_LIMIT,
  CATEGORY_FULL_PAGE_SIZE,
  CATEGORY_PAGE_SIZE,
  EAGER_PREFETCH_COUNT,
  FEED_DEFAULT_PAGE,
  FEED_GROUPS,
  HOME_FEED_FIRST_STEP,
  HOME_FEED_INITIAL,
  HOME_FEED_MAX,
  HOME_FEED_STEP,
  PAGED_CATEGORY_KEYS,
  PREFETCH_LIMIT,
} from '../../actions/constants';
import { mergeFeed, selectFeedListings, selectFeedRecommendations, setFeed, setRecommendations } from '../../store/slices/feedSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { mergeListings } from '../../lib/cache/feedCacheService';
import {
  filterBySearch,
  matchesSubcategoryKey,
  matchesSubcategoryListing,
  prefetchImages,
  subscriptionToListingItem,
} from '../../lib/helpers';
import { sortByTierRandom } from '../../lib/policy/feedTierPolicy';

import type { AppDispatch, AuthUser, BooleanCallback, ListingBase, ListingsCallback, NestedSubCategory, NumberMap, NumberRef, StateSetter, UseHomeFeedResult, VoidCallback } from '../../utils/types';

import { selectUser } from '../../store/slices/authSlice';
export const fetchRecommendations = async (userId: string, signal?: AbortSignal): Promise<ListingBase[]> => {
  try {
    return await getHomeFeedRecommendations(userId, signal);
  } catch {
    return [];
  }
};

export const fetchWantedListings = async (signal?: AbortSignal): Promise<ListingBase[]> => {
  const paidSubscriptions = await fetchAllPaidSubscriptions(signal);
  return paidSubscriptions.map(subscriptionToListingItem);
};

const ignoreError = () => {};

const listingKey = (item: ListingBase) => item.id || item._id;

const findNewListings = (knownListings: ListingBase[], fetchedListings: ListingBase[]): ListingBase[] => {
  const knownListingKeys = new Set(knownListings.map(listingKey));
  return fetchedListings.filter((listing) => !knownListingKeys.has(listingKey(listing)));
};

const loadFastGroup = async (signal: AbortSignal, dispatch: AppDispatch, onLoaded: VoidCallback) => {
  let fastListings: ListingBase[] = [];
  try {
    fastListings = await fetchFeedGroup(FEED_GROUPS.FAST, signal);
  } finally {
    if (!signal.aborted && fastListings.length > 0) onLoaded();
  }
  if (fastListings.length > 0) {
    const sortedFastListings = sortByTierRandom(fastListings);
    dispatch(setFeed(sortedFastListings));
    prefetchImages(sortedFastListings, EAGER_PREFETCH_COUNT).catch(ignoreError);
  }
  return fastListings;
};

const loadSlowGroup = async (
  currentListings: ListingBase[],
  signal: AbortSignal,
  dispatch: AppDispatch,
  onLoaded: VoidCallback,
) => {
  const slowListings = await fetchFeedGroup(FEED_GROUPS.SLOW, signal);
  let mergedListings = currentListings;
  if (!signal.aborted) {
    if (slowListings.length > 0) {
      mergedListings = mergeListings(currentListings, slowListings);
      dispatch(setFeed(sortByTierRandom(mergedListings)));
    }
    onLoaded();
  }
  return mergedListings;
};

const loadWantedGroup = async (
  currentListings: ListingBase[],
  wantedPromise: Promise<ListingBase[]>,
  signal: AbortSignal,
  dispatch: AppDispatch,
) => {
  const wantedListings = await wantedPromise;
  if (!signal.aborted && wantedListings.length > 0) {
    dispatch(setFeed(sortByTierRandom(mergeListings(currentListings, wantedListings))));
  }
};

const loadInitialFeed = async (signal: AbortSignal, dispatch: AppDispatch, onLoaded: VoidCallback) => {
  const fastListings = await loadFastGroup(signal, dispatch, onLoaded);
  if (signal.aborted) return;
  const wantedPromise = fetchWantedListings(signal).catch(() => [] as ListingBase[]);
  const currentListings = await loadSlowGroup(fastListings, signal, dispatch, onLoaded);
  await loadWantedGroup(currentListings, wantedPromise, signal, dispatch);
};

const fetchRefreshGroups = async (userId: string | undefined) => {
  const [fastResult, recommendationsResult] = await Promise.allSettled([
    fetchFeedGroup(FEED_GROUPS.FAST),
    userId ? fetchRecommendations(userId) : Promise.resolve([]),
  ]);
  return {
    fastLoaded: fastResult.status === 'fulfilled',
    fastListings: fastResult.status === 'fulfilled' ? fastResult.value : [],
    recommendationsLoaded: recommendationsResult.status === 'fulfilled',
    recommendedListings:
      recommendationsResult.status === 'fulfilled' ? (recommendationsResult.value as ListingBase[]) : [],
  };
};

const mergeLateGroups = (dispatch: AppDispatch, startListings: ListingBase[]) => {
  let latestListings = startListings;
  const mergeIn = (incoming: ListingBase[]) => {
    if (incoming.length === 0) return;
    latestListings = mergeListings(latestListings, incoming);
    dispatch(setFeed(sortByTierRandom(latestListings)));
  };
  fetchWantedListings().then(mergeIn).catch(ignoreError);
  fetchFeedGroup(FEED_GROUPS.SLOW).then(mergeIn);
};

const useRecommendations = (user: AuthUser, dispatch: AppDispatch) => {
  useEffect(() => {
    if (!user) return;
    const abortController = new AbortController();
    fetchRecommendations(user.id, abortController.signal).then((recommendedListings) => {
      if (abortController.signal.aborted) return;
      dispatch(setRecommendations(recommendedListings));
      if (recommendedListings.length > 0) prefetchImages(recommendedListings).catch(ignoreError);
    });
    return () => abortController.abort();
  }, [user?.id, dispatch]);
};

const useFeedPagination = (listings: ListingBase[], dispatch: AppDispatch) => {
  const [visibleCount, setVisibleCount] = useState(HOME_FEED_INITIAL);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const nextPageRef = useRef(FEED_DEFAULT_PAGE + 1);
  const loadingMoreRef = useRef(false);
  const endReachedRef = useRef(false);
  const revealStepRef = useRef(0);

  const listingsRef = useRef(listings);
  useEffect(() => {
    listingsRef.current = listings;
  }, [listings]);

  const markEndReached = useCallback(() => {
    endReachedRef.current = true;
    setEndReached(true);
  }, []);

  const resetPagination = useCallback(() => {
    setVisibleCount(HOME_FEED_INITIAL);
    nextPageRef.current = FEED_DEFAULT_PAGE + 1;
    endReachedRef.current = false;
    revealStepRef.current = 0;
    setEndReached(false);
  }, []);

  const loadNextPage = useCallback(async () => {
    if (loadingMoreRef.current || endReachedRef.current) return;
    if (listingsRef.current.length >= HOME_FEED_MAX) return markEndReached();
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const fetchedListings = await fetchFeedPage(nextPageRef.current);
      const newListings = findNewListings(listingsRef.current, fetchedListings);
      if (newListings.length === 0) return markEndReached();
      nextPageRef.current += 1;
      dispatch(mergeFeed(sortByTierRandom(newListings)));
      prefetchImages(newListings, EAGER_PREFETCH_COUNT).catch(ignoreError);
    } catch {
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [dispatch, markEndReached]);

  const showMore = useCallback(() => {
    const step = revealStepRef.current === 0 ? HOME_FEED_FIRST_STEP : HOME_FEED_STEP;
    revealStepRef.current += 1;
    const nextCount = Math.min(visibleCount + step, HOME_FEED_MAX);
    setVisibleCount(nextCount);
    prefetchImages(listingsRef.current.slice(visibleCount, nextCount)).catch(ignoreError);
    if (nextCount + HOME_FEED_STEP >= listingsRef.current.length) loadNextPage();
  }, [visibleCount, loadNextPage]);

  const visibleListings = useMemo(() => listings.slice(0, visibleCount), [listings, visibleCount]);
  const moreAvailable = visibleCount < listings.length || (!endReached && listings.length > 0);
  const hasMore = visibleCount < HOME_FEED_MAX && moreAvailable;

  return { listingsRef, resetPagination, showMore, visibleListings, hasMore, loadingMore };
};

export const useHomeFeed = (): UseHomeFeedResult => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const listings = useAppSelector(selectFeedListings) ?? [];
  const recommendations = useAppSelector(selectFeedRecommendations) ?? [];
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { listingsRef, resetPagination, showMore, visibleListings, hasMore, loadingMore } = useFeedPagination(
    listings,
    dispatch,
  );

  useEffect(() => {
    const abortController = new AbortController();
    loadInitialFeed(abortController.signal, dispatch, () => setLoading(false));
    return () => abortController.abort();
  }, [dispatch]);

  useRecommendations(user, dispatch);

  const userId = user?.id;
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    resetPagination();
    const { fastLoaded, fastListings, recommendationsLoaded, recommendedListings } = await fetchRefreshGroups(userId);
    if (fastListings.length > 0) dispatch(setFeed(sortByTierRandom(fastListings)));
    if (recommendationsLoaded) dispatch(setRecommendations(recommendedListings));
    setRefreshing(false);
    Promise.all([prefetchImages(fastListings, EAGER_PREFETCH_COUNT), prefetchImages(recommendedListings)]).catch(
      ignoreError,
    );
    mergeLateGroups(dispatch, fastLoaded ? fastListings : listingsRef.current);
  }, [userId, dispatch, resetPagination, listingsRef]);

  return {
    user,
    listings,
    recommendations,
    refreshing,
    loading,
    visibleListings,
    hasMore,
    loadingMore,
    onRefresh,
    showMore,
  };
};

const appendUnique = (existing: ListingBase[], incoming: ListingBase[]): ListingBase[] => {
  const seen = new Set(existing.map(listingKey));
  return [...existing, ...incoming.filter((item) => !seen.has(listingKey(item)))];
};

const fetchFirstCategoryPage = async (categoryKey: string, paged: boolean, signal?: AbortSignal) =>
  paged
    ? fetchCategoryPage(categoryKey, FEED_DEFAULT_PAGE, CATEGORY_PAGE_SIZE, signal)
    : sortByTierRandom(await fetchByCategory(categoryKey, { limit: CATEGORY_FEED_LIMIT }, signal));

const useCategorySearch = (
  categoryKey: string,
  searching: boolean,
  searchListings: ListingBase[] | null,
  setSearchListings: ListingsCallback,
) => {
  useEffect(() => {
    if (!searching || searchListings) return;
    const abortController = new AbortController();
    fetchCategoryPage(categoryKey, FEED_DEFAULT_PAGE, CATEGORY_FULL_PAGE_SIZE, abortController.signal)
      .then((allListings) => {
        if (!abortController.signal.aborted) setSearchListings(allListings);
      })
      .catch(ignoreError);
    return () => abortController.abort();
  }, [searching, searchListings, categoryKey]);
};

const useCategoryLoadMore = (
  categoryKey: string,
  paged: boolean,
  hasMore: boolean,
  pageRef: NumberRef,
  setListings: StateSetter<ListingBase[]>,
  setHasMore: BooleanCallback,
) => {
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!paged || !hasMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const pageListings = await fetchCategoryPage(categoryKey, nextPage, CATEGORY_PAGE_SIZE);
      pageRef.current = nextPage;
      setListings((current) => appendUnique(current, pageListings));
      setHasMore(pageListings.length >= CATEGORY_PAGE_SIZE);
      prefetchImages(pageListings, PREFETCH_LIMIT).catch(ignoreError);
    } catch {
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [categoryKey, paged, hasMore]);

  return { loadingMore, loadMore };
};

export const useCategoryFeed = (categoryKey: string, searchQuery = '') => {
  const paged = PAGED_CATEGORY_KEYS.includes(categoryKey);
  const searching = paged && searchQuery.trim().length > 0;
  const [listings, setListings] = useState<ListingBase[]>([]);
  const [searchListings, setSearchListings] = useState<ListingBase[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(FEED_DEFAULT_PAGE);

  const loadFirstPage = useCallback(
    async (signal?: AbortSignal) => {
      if (!categoryKey) return;
      try {
        const firstPage = await fetchFirstCategoryPage(categoryKey, paged, signal);
        if (signal?.aborted) return;
        pageRef.current = FEED_DEFAULT_PAGE;
        setListings(firstPage);
        setHasMore(paged && firstPage.length >= CATEGORY_PAGE_SIZE);
        prefetchImages(firstPage, PREFETCH_LIMIT).catch(ignoreError);
      } catch {
        if (signal?.aborted) return;
        setListings([]);
        setHasMore(false);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [categoryKey, paged],
  );

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    setListings([]);
    setSearchListings(null);
    loadFirstPage(abortController.signal);
    return () => abortController.abort();
  }, [loadFirstPage]);

  const { loadingMore, loadMore } = useCategoryLoadMore(categoryKey, paged, hasMore, pageRef, setListings, setHasMore);

  useCategorySearch(categoryKey, searching, searchListings, setSearchListings);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchListings(null);
    loadFirstPage();
  }, [loadFirstPage]);

  return {
    listings: searching ? (searchListings ?? listings) : listings,
    loading,
    refreshing,
    loadingMore,
    hasMore: !searching && hasMore,
    onRefresh,
    loadMore,
  };
};

export const useCategoryListings = (categoryKey: string) => {
  const [listings, setListings] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!categoryKey) return;
      try {
        const allListings = await fetchFullCategory(categoryKey, signal);
        if (signal?.aborted) return;
        setListings(allListings);
        prefetchImages(allListings, PREFETCH_LIMIT).catch(ignoreError);
      } catch {
        if (!signal?.aborted) setListings([]);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [categoryKey],
  );

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  return { listings, loading, refreshing, onRefresh };
};

const includesLocation = (selected: string[], value: string): boolean => {
  const normalizedValue = (value ?? '').trim().toLowerCase();
  return selected.some((s) => s.trim().toLowerCase() === normalizedValue);
};

export const useSubcategoryListings = (
  allListings: ListingBase[],
  categoryKey: string,
  subcategoryKey: string,
  nestedItems: NestedSubCategory[],
  selectedRegions: string[],
  selectedCities: string[],
  searchQuery: string,
) => {
  const [selectedNested, setSelectedNested] = useState<NestedSubCategory | null>(null);

  const listings = useMemo<ListingBase[]>(() => {
    let result = allListings.filter((item) => matchesSubcategoryListing(item, categoryKey, subcategoryKey));
    if (selectedNested) result = result.filter((item) => matchesSubcategoryKey(item, selectedNested.key));
    if (selectedRegions.length) result = result.filter((item) => includesLocation(selectedRegions, item.region));
    if (selectedCities.length) result = result.filter((item) => includesLocation(selectedCities, item.city));
    return filterBySearch(result, searchQuery);
  }, [allListings, categoryKey, subcategoryKey, selectedNested, selectedRegions, selectedCities, searchQuery]);

  const nestedCounts = useMemo<NumberMap>(() => {
    const base = allListings.filter((item) => matchesSubcategoryListing(item, categoryKey, subcategoryKey));
    const out: NumberMap = {};
    for (const nested of nestedItems) {
      out[nested.key] = base.filter((item) => matchesSubcategoryKey(item, nested.key)).length;
    }
    return out;
  }, [allListings, categoryKey, subcategoryKey, nestedItems]);

  return { selectedNested, setSelectedNested, listings, nestedCounts };
};

export const useFilteredListings = (listings: ListingBase[], searchQuery: string) =>
  useMemo(() => filterBySearch(listings, searchQuery), [listings, searchQuery]);

export const useSkeletonListings = (count: number) =>
  useMemo(
    () => Array.from({ length: count }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }) as unknown as ListingBase),
    [count],
  );
