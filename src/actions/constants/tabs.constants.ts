import type { TabItem, TabPrefixMap } from '../../utils/types';
import { NAV_ICONS } from '../../utils/icons';
import { SPACING } from '../../utils/colors/colors';
import { PATHNAMES, ROUTES } from './routes.constants';

export const TAB_NAMES = {
  home: 'home',
  businesses: 'businesses',
  newAd: 'new-ad',
  messages: 'messages',
  profile: 'profile',
  notifications: 'notifications',
  login: 'login',
} as const;

export const DEFAULT_TAB = TAB_NAMES.home;

export const TAB_ITEMS: TabItem[] = [
  {
    name: TAB_NAMES.home,
    labelKey: 'nav.home',
    icon: NAV_ICONS.home.filled,
    iconOutline: NAV_ICONS.home.outline,
  },
  {
    name: TAB_NAMES.businesses,
    labelKey: 'nav.business',
    icon: NAV_ICONS.business.filled,
    iconOutline: NAV_ICONS.business.outline,
  },
  {
    name: TAB_NAMES.newAd,
    labelKey: 'nav.newAd',
    icon: NAV_ICONS.newAd.filled,
    iconOutline: NAV_ICONS.newAd.outline,
  },
  {
    name: TAB_NAMES.messages,
    labelKey: 'nav.messages',
    icon: NAV_ICONS.messages.filled,
    iconOutline: NAV_ICONS.messages.outline,
  },
  {
    name: TAB_NAMES.profile,
    labelKey: 'nav.mine',
    icon: NAV_ICONS.profile.filled,
    iconOutline: NAV_ICONS.profile.outline,
  },
];

export const LOGIN_TAB_ITEM: TabItem = {
  name: TAB_NAMES.login,
  labelKey: 'nav.login',
  icon: NAV_ICONS.login.filled,
  iconOutline: NAV_ICONS.login.outline,
};

export const HIDDEN_TAB_SCREENS = [TAB_NAMES.newAd, TAB_NAMES.notifications] as const;

export const TAB_PATHS = new Set<string>([
  PATHNAMES.home,
  PATHNAMES.messages,
  PATHNAMES.profile,
  PATHNAMES.newAd,
  PATHNAMES.businesses,
  PATHNAMES.notifications,
]);

export const TAB_ROUTE_PREFIXES = {
  [TAB_NAMES.messages]: [ROUTES.chat, PATHNAMES.messages],
  [TAB_NAMES.profile]: [PATHNAMES.profile],
  [TAB_NAMES.newAd]: [PATHNAMES.newAd],
  [TAB_NAMES.businesses]: [PATHNAMES.businesses, PATHNAMES.business],
} as const satisfies TabPrefixMap;

export const HIDDEN_TAB_BAR_ROUTES = [PATHNAMES.authGroup, ROUTES.chat] as const;
export const NEW_AD_ROUTES = [ROUTES.newAd, PATHNAMES.newAd] as const;

const TAB_BAR_ITEM_HEIGHT = 54;
const TAB_BAR_VERTICAL_PADDING = SPACING.xs * 2;
const TAB_BAR_TOP_GAP = SPACING.xl;
export const TAB_BAR_HEIGHT = TAB_BAR_TOP_GAP + TAB_BAR_VERTICAL_PADDING + TAB_BAR_ITEM_HEIGHT;
