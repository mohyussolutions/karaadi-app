import { useEffect, useMemo, useState } from 'react';
import { clientGetAllRegions } from '../api/categories/geo.actions';
import { matchesCategoryKey } from '../util/helpers';
import type { ListingBase } from '../util/types/listing.types';
import type { RegionPickerItem } from '../util/types/geo.types';

export function useLocationFilter(allListings: ListingBase[], subcategoryKey: string) {
  const [regions, setRegions] = useState<RegionPickerItem[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    clientGetAllRegions()
      .then((data) => {
        const list: RegionPickerItem[] = Array.isArray(data)
          ? data.map((r: any) => ({
              id: r.id || r._id || String(Math.random()),
              name: r.name,
              cities: (r.cities || []).map((c: any) => ({ id: c.id || c._id || String(Math.random()), name: c.name })),
            }))
          : [];
        setRegions(list);
      })
      .catch(() => {});
  }, []);

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
