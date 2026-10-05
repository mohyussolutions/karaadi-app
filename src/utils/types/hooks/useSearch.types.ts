import type { RegionPickerItem } from '../models/geo.types';

export interface UseLocationFilterRowsArgs {
  visible: boolean;
  regions: RegionPickerItem[];
  selectedRegions: string[];
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
}
