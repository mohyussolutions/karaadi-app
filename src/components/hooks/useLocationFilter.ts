import { useEffect, useMemo, useState } from 'react';
import { matchesCategoryKey, toRegionPickerItems } from '../../util/helpers';
import { fetchGeoRegions, GEO_CACHE_TTL } from '../../store/slices/geoSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import type { ListingBase } from '../../util/types/listing.types';

export function useLocationFilter(allListings: ListingBase[], subcategoryKey: string) {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const isStale = !geo.fetchedAt || Date.now() - geo.fetchedAt >= GEO_CACHE_TTL;
    if (isStale && geo.status !== 'loading') dispatch(fetchGeoRegions());
  }, [dispatch, geo.fetchedAt, geo.status]);

  const regions = useMemo(() => toRegionPickerItems(geo.regions), [geo.regions]);

  function toggleRegion(name: string) {
    setSelectedRegions((prev) => {
      if (prev.includes(name)) {
        const cityNames = new Set((regions.find((r) => r.name === name)?.cities ?? []).map((c) => c.name));
        setSelectedCities((cities) => cities.filter((c) => !cityNames.has(c)));
        return prev.filter((r) => r !== name);
      }
      return [...prev, name];
    });
  }

  function toggleCity(name: string) {
    setSelectedCities((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  function clearLocationFilter() {
    setSelectedRegions([]);
    setSelectedCities([]);
  }

  const locationCounts = useMemo(() => {
    const base = allListings.filter((item) => matchesCategoryKey(item, subcategoryKey));
    const regionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    for (const item of base) {
      if (item.region) {
        const key = item.region.trim().toLowerCase();
        regionCounts[key] = (regionCounts[key] ?? 0) + 1;
      }
      if (item.city) {
        const key = item.city.trim().toLowerCase();
        cityCounts[key] = (cityCounts[key] ?? 0) + 1;
      }
    }
    return { regionCounts, cityCounts };
  }, [allListings, subcategoryKey]);

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
}
