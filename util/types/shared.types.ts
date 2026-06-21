export * from './interfaces/common';

// listing-card props kept here due to dependency on ListingBase
import type { ListingBase } from './listing.types';

export interface ListingCardProps {
  item: ListingBase;
  onPress?: () => void;
  categoryKey?: string;
}

export interface MyAdCardProps {
  item: ListingBase;
  deleting?: boolean;
  onDelete: (item: ListingBase) => void;
  onPayNow: (item: ListingBase) => void;
}

// geo picker props
export interface RegionCityPickerProps {
  selectedRegion: string;
  selectedCity: string;
  onRegionChange: (name: string) => void;
  onCityChange: (name: string) => void;
}

export interface PickerFieldsProps {
  selectedRegion: string;
  cityText: string;
  loadingRegions: boolean;
  regionExpanded: boolean;
  cityExpanded: boolean;
  onToggleRegion: () => void;
  onToggleCity: () => void;
  onClearCity: () => void;
}

export interface CityAccordionPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  cities: import('./interfaces/common').CityPickerItem[];
  selectedCity: string;
  savingCity: boolean;
  onSelectCity: (name: string) => void;
  onAddCustomCity: (name: string) => void;
  onClose: () => void;
}

export interface RegionAccordionPanelProps {
  regions: import('./interfaces/common').RegionPickerItem[];
  selectedRegion: string;
  onSelectRegion: (r: import('./interfaces/common').RegionPickerItem) => void;
  onClose: () => void;
}
