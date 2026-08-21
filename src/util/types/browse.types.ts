export interface GeoCity {
  id?: string;
  _id?: string;
  name: string;
  region?: string;
}

export interface GeoRegion {
  id?: string;
  _id?: string;
  name: string;
  cities?: GeoCity[];
}

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

export interface UseLocationFilterRowsArgs {
  visible: boolean;
  regions: RegionPickerItem[];
  selectedRegions: string[];
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
}

export interface NestedSubCategory {
  key: string;
  labelKey: string;
  icon: string;
}

export interface SubCategory {
  key: string;
  name: string;
  icon: string;
  nested?: NestedSubCategory[];
}

export interface MainCategory {
  key: string;
  name: string;
  icon: string;
  color: string;
  apiPath: string;
  subCategories: SubCategory[];
}

export interface CategoryGridProps {
  onPress?: (category: MainCategory) => void;
}

export interface CategoryCellProps {
  category: MainCategory;
  label: string;
  width: number;
  onPress: (category: MainCategory) => void;
}

export interface NestedChipsProps {
  items: NestedSubCategory[];
  selectedKey: string | null;
  onPress: (item: NestedSubCategory | null) => void;
}

export interface SidebarNestedProps {
  items: NestedSubCategory[];
  selectedKey: string | null;
  counts: Record<string, number>;
  onPress: (item: NestedSubCategory | null) => void;
  subLabel: string;
  subIcon: string;
  onPost: () => void;
  onFilterPress: () => void;
  hasLocationFilter: boolean;
}

export interface GridProps {
  subs: SubCategory[];
  group: string;
  onPress: (sub: SubCategory) => void;
}

export interface SidebarProps {
  subs: SubCategory[];
  group: string;
  onPress: (sub: SubCategory) => void;
  onPost: () => void;
}

export interface ChipItemProps {
  item: NestedSubCategory;
  active: boolean;
  onPress: (item: NestedSubCategory | null) => void;
}

export interface NestedItemProps {
  item: NestedSubCategory;
  active: boolean;
  count: number;
  onPress: (item: NestedSubCategory | null) => void;
}

export interface LocationFilterModalProps {
  visible: boolean;
  onClose: () => void;
  regions: RegionPickerItem[];
  selectedRegions: string[];
  selectedCities: string[];
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  onToggleRegion: (name: string) => void;
  onToggleCity: (name: string) => void;
  onClear: () => void;
}

export type FilterRow =
  | { key: string; kind: 'region'; name: string; count: number }
  | { key: string; kind: 'city'; name: string; count: number };

export interface SubcategoryHeaderProps {
  subIcon: string;
  subLabel: string;
  categoryLabel: string;
  hasLocationFilter: boolean;
  onFilterPress: () => void;
  nestedItems: NestedSubCategory[];
  selectedNested: NestedSubCategory | null;
  onSelectNested: (item: NestedSubCategory | null) => void;
  selectedRegions: string[];
  selectedCities: string[];
  onClearLocationFilter: () => void;
  showPostBtn: boolean;
  onPost: () => void;
  resultsCount: number | null;
}
