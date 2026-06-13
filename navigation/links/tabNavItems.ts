export interface TabNavItem {
  key: string;
  labelKey: string;
  icon: string;
  route: string;
}

export const TAB_NAV_ITEMS: TabNavItem[] = [
  { key: 'home',     labelKey: 'tabs.home',     icon: 'home-outline',       route: '/(tabs)/home' },
  { key: 'new-ad',   labelKey: 'tabs.newAd',    icon: 'plus-circle-outline', route: '/(tabs)/new-ad' },
  { key: 'messages', labelKey: 'tabs.messages', icon: 'message-outline',     route: '/(tabs)/messages' },
  { key: 'profile',  labelKey: 'tabs.profile',  icon: 'account-outline',     route: '/(tabs)/profile' },
];
