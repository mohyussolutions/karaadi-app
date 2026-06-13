import type { ImageSourcePropType } from "react-native";

export interface TabItem {
  name: string;
  labelKey: string;
  icon: string;
  iconOutline: string;
  image?: ImageSourcePropType;
}

export const TAB_ITEMS: TabItem[] = [
  {
    name: "home",
    labelKey: "nav.home",
    icon: "home",
    iconOutline: "home-outline",
  },
  {
    name: "businesses",
    labelKey: "nav.business",
    icon: "business",
    iconOutline: "business-outline",
  },
  {
    name: "new-ad",
    labelKey: "nav.newAd",
    icon: "add-circle",
    iconOutline: "add-circle-outline",
  },
  {
    name: "messages",
    labelKey: "nav.messages",
    icon: "chatbubble",
    iconOutline: "chatbubble-outline",
  },
  {
    name: "profile",
    labelKey: "nav.mine",
    icon: "person-circle",
    iconOutline: "person-circle-outline",
  },
];

export const LOGIN_TAB_ITEM: TabItem = {
  name: "login",
  labelKey: "nav.login",
  icon: "log-in",
  iconOutline: "log-in-outline",
};
