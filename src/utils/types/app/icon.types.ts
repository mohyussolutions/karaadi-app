import type MaterialCommunityIconsType from '@expo/vector-icons/MaterialCommunityIcons';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type MCIcon = keyof typeof MaterialCommunityIcons.glyphMap;

export type IconName = ComponentProps<typeof MaterialCommunityIconsType>['name'];

export interface NavIconEntry {
  filled: MCIcon;
  outline: MCIcon;
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

export type IconMap = Record<string, MCIcon>;
export type IconGroupMap = Record<string, IconMap>;
export type NestedIconGroupMap = Record<string, IconGroupMap>;
