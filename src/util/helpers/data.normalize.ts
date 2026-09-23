import type { RawItem } from '../types/common.types';
import type { GeoRegion, RegionPickerItem } from '../types/browse.types';
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

function toSingleString(value: unknown): string {
  if (!value) return '';
  if (Array.isArray(value)) return (value[0] as string) ?? '';
  return String(value);
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  return [String(value)];
}

function normalizeItem<T>(item: RawItem): T {
  const categoryString = toSingleString(item['category']);
  const subcategoryString = toSingleString(item['subcategory']);
  const categoryTag = (item['categoryTag'] as string) || categoryString;
  return {
    ...item,
    id:             item['id']  || item['_id'] || '',
    _id:            item['_id'] || item['id']  || '',
    category:       categoryString,
    subcategory:    subcategoryString,
    categoryTag:    categoryTag,
    categoryArr:    toStringArray(item['category']),
    subcategoryArr: toStringArray(item['subcategory']),
  } as T;
}

function normalizeList<T>(items: RawItem[]): T[] {
  return items.map((item) => normalizeItem<T>(item));
}

function extractRawList(result: unknown): RawItem[] {
  if (Array.isArray(result)) return result;
  const typed = result as RawItem;
  return (typed?.['data'] || typed?.['items'] || typed?.['listings'] || typed?.['results'] || []) as RawItem[];
}

export function extractList<T>(result: unknown): T[] {
  return normalizeList<T>(extractRawList(result));
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
