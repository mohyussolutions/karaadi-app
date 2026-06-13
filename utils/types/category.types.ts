import type { RegionPickerItem } from './shared.types';

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
  onToggleRegion: (name: string) => void;
  onToggleCity: (name: string) => void;
  onClear: () => void;
}

export type FilterRow =
  | { key: string; kind: 'region'; name: string }
  | { key: string; kind: 'city'; name: string };
