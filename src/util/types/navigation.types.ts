import type { ImageSourcePropType } from 'react-native';
import type { ReactNode } from 'react';
import type { MCIcon } from '../icons/icons';
import type { Lang } from './common.types';

interface RouteItemBase {
  icon: MCIcon;
  labelKey: string;
  route: string;
}

export interface TabItem {
  name: string;
  labelKey: string;
  icon: string;
  iconOutline: string;
  image?: ImageSourcePropType;
}

export interface BottomTabItemProps {
  item: TabItem;
  focused: boolean;
  onPress: () => void;
}

export interface TabButtonBackgroundProps {
  image?: ImageSourcePropType;
  focused: boolean;
  pressed: boolean;
  children: ReactNode;
}

export interface MenuItem extends RouteItemBase {
  descKey?: string;
}

export interface SettingsRow extends RouteItemBase {
  color?: string;
}

export interface Language {
  code: Lang;
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
