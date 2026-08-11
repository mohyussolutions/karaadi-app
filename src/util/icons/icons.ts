import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type MCIcon = keyof typeof MaterialCommunityIcons.glyphMap;

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
};

const ICON_MAP: Partial<Record<MCIcon, string>> = {
  "sofa-outline": "couch",
  "home-outline": "home",
  "car-outline": "car",
  motorbike: "motorcycle",
  "sail-boat": "ship",
  monitor: "desktop",
  "paw-outline": "paw",
  soccer: "futbol",
  "tshirt-crew-outline": "tshirt",
  "school-outline": "school",
  "key-outline": "key",
  "home-city-outline": "city",
  earth: "globe",
  barn: "home",
  "office-building-outline": "building",
  "office-building": "building",
  "car-key": "car-alt",
  "truck-outline": "truck",
  "car-electric-outline": "charging-station",
  ferry: "ship",
  "engine-outline": "cogs",
  "spray-bottle": "tint",
  grain: "leaf",
  "water-outline": "water",
  "dots-horizontal-circle-outline": "ellipsis-h",
  bowl: "utensils",
  "puzzle-outline": "puzzle-piece",
  "coffee-outline": "coffee",
  cup: "mug-hot",
  "clock-time-four-outline": "clock",
  cellphone: "mobile-alt",
  television: "tv",
  "camera-outline": "camera",
  "washing-machine": "bath",
  cow: "horse",
  sheep: "paw",
  "horse-variant": "horse",
  turkey: "paw",
  needle: "syringe",
  "tag-outline": "tag",
  basketball: "basketball-ball",
  tent: "campground",
  puzzle: "puzzle-piece",
  "bed-outline": "bed",
  "table-furniture": "table",
  stove: "utensils",
  hanger: "tshirt",
  "shoe-heel": "shopping-bag",
  "bag-personal-outline": "shopping-bag",
  "home-plus-outline": "home",
  "sprout-outline": "seedling",
  "tree-outline": "tree",
  "store-outline": "store",
  door: "door-open",
  factory: "industry",
  "car-sports": "car-side",
  "car-convertible": "car",
  "van-passenger": "shuttle-van",
  "car-wrench": "car-crash",
  "truck-trailer": "truck-moving",
  tire: "cogs",
  "tanker-truck": "truck-moving",
  "bus-double-decker": "bus",
  "bus-school": "bus",
  "truck-cargo-container": "truck-loading",
  "shield-outline": "shield-alt",
  "toolbox-outline": "toolbox",
  "wrench-outline": "wrench",
  "compass-outline": "compass",
  shovel: "tools",
  "seed-outline": "seedling",
  corn: "seedling",
  sprinkler: "water",
  waves: "water",
  pump: "water",
};

export function getNativeIcon(name: string): string {
  return ICON_MAP[name as MCIcon] ?? name;
}

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
