export interface TabNavItem {
  name: string;
  labelKey: string;
  icon: string;
  iconSize?: number;
}

export const TAB_NAV_ITEMS: TabNavItem[] = [
  { name: 'businesses',    labelKey: 'nav.business',   icon: 'store-outline' },
  { name: 'notifications', labelKey: 'nav.notifications', icon: 'bell-outline' },
  { name: 'new-ad',        labelKey: 'nav.newAd',      icon: 'plus-circle', iconSize: 4 },
  { name: 'messages',      labelKey: 'nav.messages',   icon: 'message-outline' },
  { name: 'profile',       labelKey: 'nav.mine',       icon: 'account-circle-outline' },
];
