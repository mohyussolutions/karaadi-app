import type { MenuItem } from "../../util/types";

export const PROFILE_MENU_ITEMS: MenuItem[] = [
  { icon: "tag-outline",              labelKey: "mine.account.myAds",           descKey: "descriptions.myAdsDesc",           route: "/profile/my-ads" },
  { icon: "account-circle-outline",   labelKey: "mine.account.myAccount",       descKey: "descriptions.myAccountDesc",       route: "/profile/edit" },
  { icon: "tune-variant",             labelKey: "mine.account.settings",        descKey: "descriptions.settingsDesc",        route: "/profile/settings" },
  { icon: "bookmark-outline",         labelKey: "mine.account.favorites",       descKey: "descriptions.favoritesDesc",       route: "/profile/favorites" },
  { icon: "text-search",              labelKey: "mine.account.savedSearches",   descKey: "descriptions.savedSearchesDesc",   route: "/profile/saved-searches" },
  { icon: "store-outline",            labelKey: "mine.account.forBusinesses",   descKey: "descriptions.forBusinessesDesc",   route: "/profile/businesses" },
  { icon: "clock-outline",            labelKey: "mine.account.contactHistory",  descKey: "descriptions.contactHistoryDesc",  route: "/profile/contact-history" },
  { icon: "crown-outline",            labelKey: "mine.account.mySubscriptions", descKey: "descriptions.mySubscriptionsDesc", route: "/profile/subscription" },
  { icon: "certificate-outline",      labelKey: "mine.account.badge",           descKey: "descriptions.badgeDesc",           route: "/profile/badge" },
  { icon: "school-outline",           labelKey: "mine.account.tutorials",       descKey: "descriptions.tutorialsDesc",       route: "/profile/tutorials" },
];
