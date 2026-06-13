import type { ReactNode } from 'react';
import type { ListingBase } from './listing.types';

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
  onOpenRegion: () => void;
  onOpenCity: () => void;
  onClearCity: () => void;
}

export interface CityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  cities: CityPickerItem[];
  selectedCity: string;
  showUseTyped: boolean;
  savingCity: boolean;
  onSelectCity: (name: string) => void;
  onAddCustomCity: (name: string) => void;
}

export interface RegionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  regions: RegionPickerItem[];
  selectedRegion: string;
  selectedCity: string;
  onSelectRegion: (r: RegionPickerItem) => void;
  onSelectCity: (name: string) => void;
}

export interface TabItem {
  name: string;
  labelKey: string;
  icon: string;
  iconOutline: string;
}

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

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

export interface SplashScreenProps {
  onFinish: () => void;
}

export interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  sidebarStyle?: object;
  mainStyle?: object;
}

export interface ResponsiveInfo {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isMobileLandscape: boolean;
  isTabletLandscape: boolean;
  sidebarWidth: number;
  mainWidth: number;
  numColumns: number;
  cardWidth: (containerWidth?: number, cols?: number, hPad?: number, gap?: number) => number;
}

export interface MenuItem {
  icon: string;
  labelKey: string;
  route: string;
  descKey?: string;
}

export interface SettingsRow {
  icon: string;
  labelKey: string;
  route: string;
  color?: string;
}

export interface PaymentStatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: string;
}

export interface PaymentCategoryInfo {
  label: string;
  icon: string;
  color: string;
}
