export function normalizeItem<T extends { _id?: string; id?: string }>(item: T): T {
  return {
    ...item,
    id: item.id || item._id || '',
    _id: item._id || item.id || '',
  };
}

export function normalizeList<T extends { _id?: string; id?: string }>(arr: T[]): T[] {
  return arr.map(normalizeItem);
}

export function extractList<T>(result: any): T[] {
  const raw = Array.isArray(result)
    ? result
    : result?.data || result?.items || result?.listings || result?.results || [];
  return normalizeList<any>(raw);
}
