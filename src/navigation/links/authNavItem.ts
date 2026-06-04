export const AUTH_NAV_ITEM = {
  authenticated: {
    labelKey: 'nav.profile',
    route: '/(tabs)/profile',
    icon: 'account-circle-outline',
    iconSize: 24,
  },
  unauthenticated: {
    labelKey: 'nav.login',
    route: '/(auth)/login',
    icon: 'account-outline',
    iconSize: 22,
  },
} as const;

export const getAuthNavItem = (isAuthenticated: boolean) =>
  isAuthenticated ? AUTH_NAV_ITEM.authenticated : AUTH_NAV_ITEM.unauthenticated;
