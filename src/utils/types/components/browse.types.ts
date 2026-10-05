import type { createStyles as createSubcategoryBrowseStyles } from '../../styles/browse/subcategoryBrowse.styles';
import type { NestedSubCategory, SubCategory } from '../models/category.types';

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

export interface SelectableItemProps<T> {
  item: T;
  active: boolean;
  onPress: (item: T | null) => void;
}

export interface ChipItemProps extends SelectableItemProps<NestedSubCategory> {}

export interface NestedItemProps extends SelectableItemProps<NestedSubCategory> {
  count: number;
}

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
}

export type SubcategoryBrowseStyles = ReturnType<typeof createSubcategoryBrowseStyles>;
