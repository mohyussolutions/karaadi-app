import type { BizStepDef, MenuItem, SettingsRow, TabItem } from "../util/types";
import { NAV_ICONS } from "../util/icons/icons";

export {
  MAIN_CATEGORIES,
  SUB_I18N_GROUP,
  getCategoryByKey,
} from "../constants/categories";
export type {
  MainCategory,
  SubCategory,
  NestedSubCategory,
} from "../constants/categories";

import { MAIN_CATEGORIES, SubCategory } from "../constants/categories";

export const TAB_ITEMS: TabItem[] = [
  {
    name: "home",
    labelKey: "nav.home",
    icon: NAV_ICONS.home.filled,
    iconOutline: NAV_ICONS.home.outline,
  },
  {
    name: "businesses",
    labelKey: "nav.business",
    icon: NAV_ICONS.business.filled,
    iconOutline: NAV_ICONS.business.outline,
  },
  {
    name: "new-ad",
    labelKey: "nav.newAd",
    icon: NAV_ICONS.newAd.filled,
    iconOutline: NAV_ICONS.newAd.outline,
  },
  {
    name: "messages",
    labelKey: "nav.messages",
    icon: NAV_ICONS.messages.filled,
    iconOutline: NAV_ICONS.messages.outline,
  },
  {
    name: "profile",
    labelKey: "nav.mine",
    icon: NAV_ICONS.profile.filled,
    iconOutline: NAV_ICONS.profile.outline,
  },
];

export const LOGIN_TAB_ITEM: TabItem = {
  name: "login",
  labelKey: "nav.login",
  icon: NAV_ICONS.profile.filled,
  iconOutline: NAV_ICONS.profile.outline,
};

export const PROFILE_MENU_ITEMS: MenuItem[] = [
  { icon: "tag-outline",              labelKey: "mine.account.myAds",           descKey: "descriptions.myAdsDesc",           route: "/profile/my-ads" },
  { icon: "account-circle-outline",   labelKey: "mine.account.myAccount",       descKey: "descriptions.myAccountDesc",       route: "/profile/edit" },
  { icon: "tune-variant",             labelKey: "mine.account.settings",        descKey: "descriptions.settingsDesc",        route: "/profile/settings" },
  { icon: "bookmark-outline",         labelKey: "mine.account.favorites",       descKey: "descriptions.favoritesDesc",       route: "/profile/favorites" },
  { icon: "text-search",              labelKey: "mine.account.savedSearches",   descKey: "descriptions.savedSearchesDesc",   route: "/profile/saved-searches" },
  { icon: "store-outline",            labelKey: "mine.account.forBusinesses",   descKey: "descriptions.forBusinessesDesc",   route: "/profile/businesses" },
  { icon: "clock-outline",            labelKey: "mine.account.contactHistory",  descKey: "descriptions.contactHistoryDesc",  route: "/profile/contact-history" },
  { icon: "crown-outline",            labelKey: "mine.account.mySubscriptions", descKey: "descriptions.mySubscriptionsDesc", route: "/profile/subscription" },
  { icon: "shield-check-outline",     labelKey: "mine.account.identityVerification", descKey: "descriptions.identityVerificationDesc", route: "/profile/verify-identity" },
  { icon: "certificate-outline",      labelKey: "mine.account.badge",           descKey: "descriptions.badgeDesc",           route: "/profile/badge" },
  { icon: "school-outline",           labelKey: "mine.account.tutorials",       descKey: "descriptions.tutorialsDesc",       route: "/profile/tutorials" },
];

export const SETTINGS_ROWS: SettingsRow[] = [
  {
    icon: "shield-lock-outline",
    labelKey: "mine.settings.security",
    route: "/profile/settings/Security",
  },
  {
    icon: "eye-off-outline",
    labelKey: "mine.settings.privacy",
    route: "/profile/settings/Privacy",
  },
  {
    icon: "credit-card-outline",
    labelKey: "mine.settingsPage.payments",
    route: "/profile/settings/Payment",
  },
  {
    icon: "crown-outline",
    labelKey: "mine.settings.subscription",
    route: "/profile/wanted",
  },
  {
    icon: "information-outline",
    labelKey: "mine.account.aboutKaraadi",
    route: "/profile/about-karaadi",
  },
];

export const BIZ_STEPS: BizStepDef[] = [
  { key: 'plan', labelKey: 'mine.businesses.stepPlan' },
  { key: 'apply', labelKey: 'mine.businesses.stepApply' },
  { key: 'approval', labelKey: 'mine.businesses.stepApproval' },
  { key: 'categories', labelKey: 'mine.businesses.stepCategories' },
  { key: 'post', labelKey: 'mine.businesses.stepPost' },
];

export function getSubCategory(
  catKey: string,
  subKey: string,
): SubCategory | undefined {
  const lower = catKey.toLowerCase();
  const cat = MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower);
  return cat?.subCategories.find((s) => s.key === subKey);
}

export function getCategoryRoute(catKey: string): string {
  return `/browse/${catKey.toLowerCase()}`;
}

export function getSubcategoryRoute(catKey: string, subKey: string): string {
  return `/browse/${catKey.toLowerCase()}/${subKey}`;
}

export function getCategoryColor(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.color ??
    "#6B7280"
  );
}

export function getCategoryIcon(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.icon ??
    "tag-outline"
  );
}

export function getCategoryApiPath(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.apiPath ??
    `/api/${lower}`
  );
}

export function getAllSubCategories(catKey: string): SubCategory[] {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.subCategories ??
    []
  );
}
