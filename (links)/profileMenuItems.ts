import type { MenuItem } from "../util/types";

export const PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    icon: "bullhorn-outline",
    labelKey: "mine.account.myAds",
    descKey: "descriptions.myAdsDesc",
    route: "/profile/my-ads",
  },
  {
    icon: "account-outline",
    labelKey: "mine.account.myAccount",
    descKey: "descriptions.myAccountDesc",
    route: "/profile/edit",
  },
  {
    icon: "cog-outline",
    labelKey: "mine.account.settings",
    descKey: "descriptions.settingsDesc",
    route: "/profile/settings",
  },
  {
    icon: "heart-outline",
    labelKey: "mine.account.favorites",
    descKey: "descriptions.favoritesDesc",
    route: "/profile/favorites",
  },
  {
    icon: "magnify",
    labelKey: "mine.account.savedSearches",
    descKey: "descriptions.savedSearchesDesc",
    route: "/profile/saved-searches",
  },
  {
    icon: "office-building-outline",
    labelKey: "mine.account.forBusinesses",
    descKey: "descriptions.forBusinessesDesc",
    route: "/profile/businesses",
  },
  {
    icon: "history",
    labelKey: "mine.account.contactHistory",
    descKey: "descriptions.contactHistoryDesc",
    route: "/profile/contact-history",
  },
  {
    icon: "crown-outline",
    labelKey: "mine.account.mySubscriptions",
    descKey: "descriptions.mySubscriptionsDesc",
    route: "/profile/subscription",
  },
  {
    icon: "shield-star-outline",
    labelKey: "mine.account.badge",
    descKey: "descriptions.badgeDesc",
    route: "/profile/badge",
  },
  {
    icon: "play-circle-outline",
    labelKey: "mine.account.tutorials",
    descKey: "descriptions.tutorialsDesc",
    route: "/profile/tutorials",
  },
];
