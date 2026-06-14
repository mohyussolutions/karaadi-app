import { useCallback } from 'react';
import { normalizeItem, normalizeList, extractList } from '../util/helpers';

export function useNormalize() {
  const normalize = useCallback(
    <T extends { _id?: string; id?: string }>(item: T): T => normalizeItem(item),
    [],
  );

  const normalizeAll = useCallback(
    <T extends { _id?: string; id?: string }>(arr: T[]): T[] => normalizeList(arr),
    [],
  );

  const extract = useCallback(
    <T>(result: any): T[] => extractList<T>(result),
    [],
  );

  return { normalize, normalizeAll, extract };
}
