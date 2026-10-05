import type { CityFilterRow, FilterRow } from '../../../utils/types';
import { FILTER_KIND_CITY } from '../../../actions/constants';

export function isCityRow(item: FilterRow): item is CityFilterRow {
  return item.kind === FILTER_KIND_CITY;
}
