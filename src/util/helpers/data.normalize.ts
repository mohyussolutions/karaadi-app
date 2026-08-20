import type { RawItem } from '../types/normalize.types';
import type { GeoRegion, RegionPickerItem } from '../types/geo.types';
import type { Subscription, ListingBase } from '../types/listing.types';
import { formatPrice } from './ui.format';

export function subscriptionToListingItem(item: Subscription): ListingBase {
  return {
    _id: item._id || item.id,
    id: item.id || item._id || '',
    userId: item.userId,
    title: item.title,
    description: item.description || '',
    price: 0,
    region: item.region || '',
    city: item.cities?.[0] || '',
    images: [],
    mainCategory: 'subscription',
    createdAt: item.createdAt || '',
    updatedAt: item.createdAt || '',
  };
}

export function subscriptionPriceLabel(item: Subscription, priceOnRequestLabel: string): string {
  if (item.priceMin && item.priceMax) return `${formatPrice(item.priceMin)} – ${formatPrice(item.priceMax)}`;
  if (item.priceMax) return formatPrice(item.priceMax);
  if (item.priceMin) return formatPrice(item.priceMin);
  return priceOnRequestLabel;
}

function toStr(val: unknown): string {
  if (!val) return '';
  if (Array.isArray(val)) return (val[0] as string) ?? '';
  return String(val);
}

function toArr(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val as string[];
  return [String(val)];
}

export function normalizeItem<T>(item: RawItem): T {
  const catStr  = toStr(item['category']);
  const subStr  = toStr(item['subcategory']);
  const catTag  = (item['categoryTag'] as string) || catStr;
  return {
    ...item,
    id:             item['id']  || item['_id'] || '',
    _id:            item['_id'] || item['id']  || '',
    category:       catStr,
    subcategory:    subStr,
    categoryTag:    catTag,
    categoryArr:    toArr(item['category']),
    subcategoryArr: toArr(item['subcategory']),
  } as T;
}

export function normalizeList<T>(arr: RawItem[]): T[] {
  return arr.map((i) => normalizeItem<T>(i));
}

export function extractList<T>(result: unknown): T[] {
  const raw = Array.isArray(result)
    ? result
    : (result as RawItem)?.['data'] || (result as RawItem)?.['items'] || (result as RawItem)?.['listings'] || (result as RawItem)?.['results'] || [];
  return normalizeList<T>(raw as RawItem[]);
}

export function matchesCategoryKey(item: { category?: string }, key: string): boolean {
  const raw = item as any;
  if (raw.categoryTag === key) return true;
  if (raw.categoryArr?.includes(key)) return true;
  return item.category === key;
}

export function matchesSubcategoryKey(item: { subcategory?: string }, key: string): boolean {
  const raw = item as any;
  if (raw.subcategoryArr?.includes(key)) return true;
  return item.subcategory === key;
}

export function toRegionPickerItems(regions: GeoRegion[]): RegionPickerItem[] {
  return regions.map((r: any) => ({
    id: r.id || r._id || String(Math.random()),
    name: r.name,
    cities: (r.cities || []).map((c: any) => ({
      id: c.id || c._id || String(Math.random()),
      name: c.name,
    })),
  }));
}
