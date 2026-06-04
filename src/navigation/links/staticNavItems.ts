export interface NavItem {
  labelKey: string;
  route: string;
  icon: string;
  iconSize: number;
  hasBadge?: boolean;
}

export const STATIC_NAV_ITEMS: NavItem[] = [
  {
    labelKey: 'nav.newAd',
    route: '/(tabs)/new-ad',
    icon: 'plus-circle-outline',
    iconSize: 22,
    hasBadge: false,
  },
];
