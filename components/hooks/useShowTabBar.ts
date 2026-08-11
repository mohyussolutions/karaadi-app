const HIDDEN_TAB_BAR_ROUTES = ["/(auth)", "/listing", "/profile/chat"];
const NEW_AD_ROUTES = ["/(tabs)/new-ad", "/new-ad"];

export function useShowTabBar(pathname: string) {
  const isNewAdFlow = NEW_AD_ROUTES.some((route) => pathname.startsWith(route));
  return !isNewAdFlow && !HIDDEN_TAB_BAR_ROUTES.some((route) => pathname.startsWith(route));
}
