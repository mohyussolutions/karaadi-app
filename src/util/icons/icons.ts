import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type MaterialCommunityIconsType from '@expo/vector-icons/MaterialCommunityIcons';

export type MCIcon = keyof typeof MaterialCommunityIcons.glyphMap;
export type IconName = ComponentProps<typeof MaterialCommunityIconsType>['name'];

export interface NavIconEntry {
  filled: MCIcon;
  outline: MCIcon;
}

export interface CategoryIcons {
  Cars: MCIcon;
  Motorcycles: MCIcon;
  Boats: MCIcon;
  farmequipment: MCIcon;
  RealEstate: MCIcon;
  Marketplace: MCIcon;
  Jobs: MCIcon;
  Subscriptions: MCIcon;
}

export interface ListingTypeIcons {
  sell: MCIcon;
  rent: MCIcon;
  wanted: MCIcon;
}

export interface ConditionIcons {
  new: MCIcon;
  used: MCIcon;
  likeNew: MCIcon;
  refurbished: MCIcon;
}

export interface SocialIcons {
  phone: MCIcon;
  whatsapp: MCIcon;
  facebook: MCIcon;
  instagram: MCIcon;
  tiktok: MCIcon;
  website: MCIcon;
  email: MCIcon;
}

export interface NavIcons {
  home: NavIconEntry;
  search: NavIconEntry;
  newAd: NavIconEntry;
  messages: NavIconEntry;
  profile: NavIconEntry;
  business: NavIconEntry;
  login: NavIconEntry;
}

export const CATEGORY_ICONS: CategoryIcons = {
  Cars: "car-outline",
  Motorcycles: "motorbike",
  Boats: "sail-boat",
  farmequipment: "tractor-variant",
  RealEstate: "home-city-outline",
  Marketplace: "storefront-outline",
  Jobs: "briefcase-outline",
  Subscriptions: "crown-outline",
};

export const LISTING_TYPE_ICONS: ListingTypeIcons = {
  sell: "tag-outline",
  rent: "key-outline",
  wanted: "magnify",
};

export const CONDITION_ICONS: ConditionIcons = {
  new: "star-circle-outline",
  used: "recycle",
  likeNew: "star-half-full",
  refurbished: "wrench-outline",
};

export const SOCIAL_ICONS: SocialIcons = {
  phone: "phone-outline",
  whatsapp: "whatsapp",
  facebook: "facebook",
  instagram: "instagram",
  tiktok: "music-box-outline",
  website: "web",
  email: "email-outline",
};

export const NAV_ICONS: NavIcons = {
  home: { filled: "home", outline: "home-outline" },
  search: { filled: "magnify", outline: "magnify" },
  newAd: { filled: "plus-circle", outline: "plus-circle-outline" },
  messages: { filled: "message", outline: "message-outline" },
  profile: { filled: "account-circle", outline: "account-circle-outline" },
  business: { filled: "office-building", outline: "office-building-outline" },
  login: { filled: "account", outline: "account-outline" },
};

export const AMENITY_ICONS: Record<string, string> = {
  swimmingPool: 'pool',
  gym: 'dumbbell',
  security: 'shield-check-outline',
  elevator: 'elevator',
  generator: 'lightning-bolt',
  waterSupply: 'water',
  airConditioning: 'snowflake',
  garden: 'flower-outline',
  balcony: 'home-outline',
  parking: 'parking',
};

export const AMENITY_KEYS = Object.keys(AMENITY_ICONS);
