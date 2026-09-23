import type {
  SocialIcons, NavIcons,
} from '../types/icon.types';

export type {
  MCIcon, IconName, SocialIcons
} from '../types/icon.types';
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
