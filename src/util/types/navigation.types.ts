import type { ImageSourcePropType } from 'react-native';

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

export interface BizStepDef {
  key: string;
  labelKey: string;
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
