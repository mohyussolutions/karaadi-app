import type { TAB_NAMES } from '../../../actions/constants/tabs.constants';
import type { Stack, useRouter } from 'expo-router';
import type { ImageSourcePropType } from 'react-native';
import type { ComponentProps } from 'react';
import type { ROUTES } from '../../../actions/constants';
import type { MCIcon } from './icon.types';

export type ListingRoute =
  | { pathname: typeof ROUTES.vehicleDetail; params: { id: string; category: string } }
  | { pathname: typeof ROUTES.realEstateDetail; params: { id: string } }
  | { pathname: typeof ROUTES.jobDetail; params: { id: string } }
  | { pathname: typeof ROUTES.itemDetail; params: { id: string } };

export type RouteBuilder = (id: string) => ListingRoute;

export interface ListingRouteTarget {
  id?: string;
  _id?: string;
  mainCategory?: string;
  category?: string;
}

export type AppRouter = ReturnType<typeof useRouter>;

export interface RouteItemBase {
  icon: MCIcon;
  labelKey: string;
  route: string;
}

export type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];

export interface TabItem {
  name: TabName;
  labelKey: string;
  icon: MCIcon;
  iconOutline: MCIcon;
  image?: ImageSourcePropType;
}

export interface MenuItem extends RouteItemBase {
  descKey?: string;
}

export interface SettingsRow extends RouteItemBase {
  color?: string;
}

export type StackScreenOptions = ComponentProps<typeof Stack.Screen>['options'];

export type ContentPadding = 'default' | 'zero' | 'auth';

export interface RootStackScreenConfig {
  name: string;
  options: Omit<StackScreenOptions, 'contentStyle'>;
  contentPadding?: ContentPadding;
}

export interface CategoryPatternRoute {
  patterns: string[];
  build: RouteBuilder;
}

export type RouteBuilderMap = Record<string, RouteBuilder>;
export type TabPrefixMap = Record<string, readonly string[]>;
export type StackScreenBaseOptions = Omit<StackScreenOptions, 'contentStyle'>;
export type ContentPaddingMap = Record<ContentPadding, number>;
export type RouterHref = Parameters<AppRouter['push']>[0];
