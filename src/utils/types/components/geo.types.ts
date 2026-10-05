import type { ScrollView } from 'react-native';
import type { RefObject } from 'react';
import type { CityPickerItem, RegionPickerItem } from '../models/geo.types';

export interface RegionCityPickerProps {
  selectedRegion: string;
  selectedCity: string;
  onRegionChange: (name: string) => void;
  onCityChange: (name: string) => void;
  regionError?: string;
  cityError?: string;
  scrollViewRef?: RefObject<ScrollView | null>;
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
  regionError?: string;
  cityError?: string;
}

export interface CityAccordionPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  cities: CityPickerItem[];
  selectedCity: string;
  savingCity: boolean;
  onSelectCity: (name: string) => void;
  onAddCustomCity: (name: string) => void;
  onClose: () => void;
}

export interface RegionAccordionPanelProps {
  regions: RegionPickerItem[];
  selectedRegion: string;
  onSelectRegion: (r: RegionPickerItem) => void;
  onClose: () => void;
}

export interface CityRowProps {
  name: string;
  active: boolean;
  onSelect: (name: string) => void;
}

export interface RegionRowProps {
  region: RegionPickerItem;
  active: boolean;
  onSelectRegion: (r: RegionPickerItem) => void;
}
