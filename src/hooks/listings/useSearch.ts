import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FILTER_KIND_CITY, FILTER_KIND_REGION, GEO_CACHE_TTL, HEADER_SEARCH_DEBOUNCE_MS } from '../../actions/constants';
import { SEARCH_SETTLE_MS } from '../../actions/constants/tracking.constants';
import { searchAllListings } from '../../actions/search/globalSearch';
import { deleteSearchHistory, getSearchHistory } from '../../actions/search/searchHistory';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { clearBrowseQuery, setBrowseQuery } from '../../store/slices/browseSearchSlice';
import { fetchGeoRegions, selectGeo } from '../../store/slices/geoSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filterBySearch, matchesSubcategoryListing, toRegionPickerItems } from '../../lib/helpers';
import { trackSearch } from '../../lib/tracking/tracker';

import type { DropdownOption, DropdownValue, FilterRow, ListingBase, NumberMap, RegionPickerItem, SearchHistoryItem, SearchTrackingInput, TimeoutHandle, Translate, UseLocationFilterRowsArgs, VoidCallback } from '../../utils/types';

export const useGlobalSearch = (query: string, loadedListings: ListingBase[]): ListingBase[] | null => {
  const trimmed = query.trim();
  const [serverResults, setServerResults] = useState<ListingBase[] | null>(null);

  useEffect(() => {
    setServerResults(null);
    if (!trimmed) return;
    const abortController = new AbortController();
    searchAllListings(trimmed, abortController.signal)
      .then((results) => {
        if (!abortController.signal.aborted) setServerResults(results);
      })
      .catch(() => {});
    return () => abortController.abort();
  }, [trimmed]);

  const instantResults = useMemo(
    () => (trimmed ? filterBySearch(loadedListings, trimmed) : null),
    [loadedListings, trimmed],
  );

  if (!trimmed) return null;
  return serverResults ?? instantResults;
};

export const useSearchTracking = ({ query, resultsCount, loading, filters }: SearchTrackingInput) => {
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const filtersKey = JSON.stringify(filters ?? {});

  useEffect(() => {
    const text = query.trim();
    if (!text || loading) return;
    const timer = setTimeout(() => {
      trackSearch(text, resultsCount, filtersRef.current);
    }, SEARCH_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [query, resultsCount, loading, filtersKey]);
};

export const useHeaderSearch = (pathname: string) => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const debounceRef = useRef<TimeoutHandle | null>(null);

  const cancelPendingSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
  }, []);

  useEffect(() => {
    cancelPendingSearch();
    setSearchInput('');
    dispatch(clearBrowseQuery());
    return cancelPendingSearch;
  }, [pathname, dispatch, cancelPendingSearch]);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchInput(text);
      cancelPendingSearch();
      debounceRef.current = setTimeout(() => dispatch(setBrowseQuery(text)), HEADER_SEARCH_DEBOUNCE_MS);
    },
    [dispatch, cancelPendingSearch],
  );

  const clearSearch = useCallback(() => {
    cancelPendingSearch();
    setSearchInput('');
    dispatch(clearBrowseQuery());
  }, [dispatch, cancelPendingSearch]);

  const onSearchFocus = useCallback(() => setSearchFocused(true), []);
  const onSearchBlur = useCallback(() => setSearchFocused(false), []);

  return {
    searchInput,
    searchFocused,
    handleSearchChange,
    clearSearch,
    onSearchFocus,
    onSearchBlur,
  };
};

const normalizeLocation = (value: string) => value.trim().toLowerCase();

const confirmDeleteSearch = (t: Translate, onConfirm: VoidCallback) => {
  Alert.alert(t('auth.common.error'), `${t('common.back')}?`, [
    { text: t('auth.common.ok'), style: 'cancel' },
    { text: t('businesses.myAds.delete'), style: 'destructive', onPress: onConfirm },
  ]);
};

export const useSavedSearches = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const uid = user?._id || user?.id;
  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    getSearchHistory(abortController.signal)
      .then((data) => setSearches(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => abortController.abort();
  }, [uid]);

  const deleteSearch = useCallback(
    (id: string) => {
      confirmDeleteSearch(t, () => {
        setSearches((prev) => prev.filter((s) => (s._id || s.id) !== id));
        deleteSearchHistory(id);
      });
    },
    [t],
  );

  return { searches, loading, deleteSearch };
};

const toggleIn = (list: string[], name: string) =>
  list.includes(name) ? list.filter((c) => c !== name) : [...list, name];

const cityNamesOf = (regions: RegionPickerItem[], regionName: string) =>
  new Set((regions.find((r) => r.name === regionName)?.cities ?? []).map((c) => c.name));

const countLocations = (allListings: ListingBase[], categoryKey: string, subcategoryKey: string) => {
  const regionCounts: NumberMap = {};
  const cityCounts: NumberMap = {};
  for (const item of allListings) {
    if (!matchesSubcategoryListing(item, categoryKey, subcategoryKey)) continue;
    if (item.region) {
      const key = normalizeLocation(item.region);
      regionCounts[key] = (regionCounts[key] ?? 0) + 1;
    }
    if (item.city) {
      const key = normalizeLocation(item.city);
      cityCounts[key] = (cityCounts[key] ?? 0) + 1;
    }
  }
  return { regionCounts, cityCounts };
};

const useGeoRegions = () => {
  const dispatch = useAppDispatch();
  const geo = useAppSelector(selectGeo);

  useEffect(() => {
    const isStale = !geo.fetchedAt || Date.now() - geo.fetchedAt >= GEO_CACHE_TTL;
    if (isStale && geo.status !== 'loading') dispatch(fetchGeoRegions());
  }, [dispatch, geo.fetchedAt, geo.status]);

  return useMemo(() => toRegionPickerItems(geo.regions), [geo.regions]);
};

export const useLocationFilter = (allListings: ListingBase[], categoryKey: string, subcategoryKey: string) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const regions = useGeoRegions();

  const toggleRegion = useCallback(
    (name: string) => {
      setSelectedRegions((prev) => {
        if (prev.includes(name)) {
          const cityNames = cityNamesOf(regions, name);
          setSelectedCities((cities) => cities.filter((c) => !cityNames.has(c)));
        }
        return toggleIn(prev, name);
      });
    },
    [regions],
  );

  const toggleCity = useCallback((name: string) => {
    setSelectedCities((prev) => toggleIn(prev, name));
  }, []);

  const clearLocationFilter = useCallback(() => {
    setSelectedRegions([]);
    setSelectedCities([]);
  }, []);

  const locationCounts = useMemo(
    () => countLocations(allListings, categoryKey, subcategoryKey),
    [allListings, categoryKey, subcategoryKey],
  );

  const hasLocationFilter = selectedRegions.length > 0 || selectedCities.length > 0;

  return {
    regions,
    selectedRegions,
    selectedCities,
    filterOpen,
    setFilterOpen,
    hasLocationFilter,
    locationCounts,
    toggleRegion,
    toggleCity,
    clearLocationFilter,
  };
};

const filterRegionsBySearch = (regions: RegionPickerItem[], search: string): RegionPickerItem[] => {
  const q = search.trim().toLowerCase();
  if (!q) return regions;
  return regions.filter((r) => r.name.toLowerCase().includes(q));
};

const buildRegionRow = (region: RegionPickerItem, regionCounts: NumberMap): FilterRow => ({
  key: `region-${region.id}`,
  kind: FILTER_KIND_REGION,
  name: region.name,
  count: regionCounts[region.name.toLowerCase()] ?? 0,
});

const buildCityRows = (region: RegionPickerItem, cityCounts: NumberMap): FilterRow[] =>
  (region.cities ?? []).map((c) => ({
    key: `city-${region.id}-${c.id}`,
    kind: FILTER_KIND_CITY,
    name: c.name,
    count: cityCounts[c.name.toLowerCase()] ?? 0,
  }));

export const useLocationFilterRows = ({
  visible,
  regions,
  selectedRegions,
  regionCounts,
  cityCounts,
}: UseLocationFilterRowsArgs) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) setSearch('');
  }, [visible]);

  const rows = useMemo<FilterRow[]>(() => {
    const out: FilterRow[] = [];
    for (const region of filterRegionsBySearch(regions, search)) {
      out.push(buildRegionRow(region, regionCounts));
      if (selectedRegions.includes(region.name)) {
        out.push(...buildCityRows(region, cityCounts));
      }
    }
    return out;
  }, [regions, search, selectedRegions, regionCounts, cityCounts]);

  return { search, setSearch, rows };
};

const normalize = (opt: DropdownValue): DropdownOption =>
  typeof opt === 'string' ? { label: opt, value: opt } : opt;

export const useDropdownOptions = (options: (string | DropdownOption)[], search: string) => {
  const normalized = useMemo(() => options.map(normalize), [options]);

  const filtered = useMemo(
    () => (search.trim() ? normalized.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : normalized),
    [normalized, search],
  );

  return { normalized, filtered };
};
