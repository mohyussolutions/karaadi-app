import type {
  MCIcon, NavIconEntry, CategoryIcons, ListingTypeIcons, ConditionIcons, SocialIcons, NavIcons,
} from '../types/icons.types';

export type {
  MCIcon, NavIconEntry, CategoryIcons, ListingTypeIcons, ConditionIcons, SocialIcons, NavIcons,
};

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
