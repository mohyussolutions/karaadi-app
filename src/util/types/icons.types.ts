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
