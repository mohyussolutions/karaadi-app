import { useMemo } from 'react';
import type { CreatedItemSummary } from '../util/types/new-ad.types';

export function useDisplayAttrs(item: CreatedItemSummary | null) {
  return useMemo(
    () => (item?.allAttrs && item.allAttrs.length > 0
      ? item.allAttrs.filter((a) => a.value && String(a.value).trim())
      : []),
    [item?.allAttrs],
  );
}
