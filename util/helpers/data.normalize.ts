type RawItem = Record<string, unknown>;

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
