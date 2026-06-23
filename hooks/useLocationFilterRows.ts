import { useEffect, useMemo, useState } from 'react';
import type { FilterRow } from '../util/types';
import type { RegionPickerItem } from '../util/types/geo.types';

function filterRegionsBySearch(regions: RegionPickerItem[], search: string): RegionPickerItem[] {
  const q = search.trim().toLowerCase();
  if (!q) return regions;
  return regions.filter((r) => r.name.toLowerCase().includes(q));
}

function buildRegionRow(region: RegionPickerItem, regionCounts: Record<string, number>): FilterRow {
  return {
    key: `region-${region.id}`,
    kind: 'region',
    name: region.name,
    count: regionCounts[region.name.toLowerCase()] ?? 0,
  };
}

function buildCityRows(region: RegionPickerItem, cityCounts: Record<string, number>): FilterRow[] {
  return (region.cities ?? []).map((c) => ({
    key: `city-${region.id}-${c.id}`,
    kind: 'city',
    name: c.name,
    count: cityCounts[c.name.toLowerCase()] ?? 0,
  }));
}

interface UseLocationFilterRowsArgs {
  visible: boolean;
  regions: RegionPickerItem[];
  selectedRegions: string[];
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
}

export function useLocationFilterRows({ visible, regions, selectedRegions, regionCounts, cityCounts }: UseLocationFilterRowsArgs) {
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
}
