import { HIDDEN_TAB_BAR_ROUTES, NEW_AD_ROUTES } from "../../constants";

export function useTabBarVisibility(pathname: string) {
  const isNewAdFlow = NEW_AD_ROUTES.some((route) => pathname.startsWith(route));
  return !isNewAdFlow && !HIDDEN_TAB_BAR_ROUTES.some((route) => pathname.startsWith(route));
}
