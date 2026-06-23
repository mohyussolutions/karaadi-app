export interface Region {
  _id: string;
  name: string;
  nameEn?: string;
  nameSo?: string;
}

export interface City {
  _id: string;
  name: string;
  region?: string;
}

export interface RegionPickerItem {
  id: string;
  name: string;
  cities?: CityPickerItem[];
}

export interface CityPickerItem {
  id: string;
  name: string;
}

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
