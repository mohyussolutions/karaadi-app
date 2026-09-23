import type { FilterRow } from '../../../util/types';
import { FILTER_KIND_CITY } from '../../../constants';

export function isCityRow(item: FilterRow): item is Extract<FilterRow, { kind: typeof FILTER_KIND_CITY }> {
  return item.kind === FILTER_KIND_CITY;
}
