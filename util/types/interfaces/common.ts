import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';

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

export interface TabItem {
  name: string;
  labelKey: string;
  icon: string;
  iconOutline: string;
  iconFamily?: 'Ionicons' | 'Octicons';
  image?: ImageSourcePropType;
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

export interface Language {
  code: 'en' | 'so';
  label: string;
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
  iconCols: number;
  gridCellWidth: (cols?: number, hPad?: number, gap?: number) => number;
}

export interface SplashScreenProps {
  onFinish: () => void;
}

export interface BizStepDef {
  key: string;
  labelKey: string;
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
