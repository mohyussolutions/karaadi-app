import { useMemo, useState } from 'react';
import { matchesCategoryKey, matchesSubcategoryKey } from '../util/helpers';
import type { ListingBase } from '../util/types/listing.types';
import type { NestedSubCategory } from '../util/types/category.types';

function includesLocation(selected: string[], value: string): boolean {
  const v = (value ?? '').trim().toLowerCase();
  return selected.some((s) => s.trim().toLowerCase() === v);
}

function matchesSearch(item: ListingBase, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const matchesTitle = (item.title ?? '').toLowerCase().includes(q);
  const matchesCity = (item.city ?? '').toLowerCase().includes(q);
  const matchesRegion = (item.region ?? '').toLowerCase().includes(q);
  const matchesPrice = String(item.price ?? '').includes(q);
  return matchesTitle || matchesCity || matchesRegion || matchesPrice;
}

export function useSubcategoryListings(
  allListings: ListingBase[],
  subcategoryKey: string,
  nestedItems: NestedSubCategory[],
  selectedRegions: string[],
  selectedCities: string[],
  searchQuery: string,
) {
  const [selectedNested, setSelectedNested] = useState<NestedSubCategory | null>(null);

  const listings = useMemo<ListingBase[]>(() => {
    let result = allListings.filter((item) => matchesCategoryKey(item, subcategoryKey));
    if (selectedNested) result = result.filter((item) => matchesSubcategoryKey(item, selectedNested.key));
    if (selectedRegions.length) result = result.filter((item) => includesLocation(selectedRegions, item.region));
    if (selectedCities.length) result = result.filter((item) => includesLocation(selectedCities, item.city));
    if (searchQuery.trim()) result = result.filter((item) => matchesSearch(item, searchQuery));
    return result;
  }, [allListings, subcategoryKey, selectedNested, selectedRegions, selectedCities, searchQuery]);

  const nestedCounts = useMemo<Record<string, number>>(() => {
    const base = allListings.filter((item) => matchesCategoryKey(item, subcategoryKey));
    const out: Record<string, number> = {};
    for (const nested of nestedItems) {
      out[nested.key] = base.filter((item) => matchesSubcategoryKey(item, nested.key)).length;
    }
    return out;
  }, [allListings, subcategoryKey, nestedItems]);

  return { selectedNested, setSelectedNested, listings, nestedCounts };
}
