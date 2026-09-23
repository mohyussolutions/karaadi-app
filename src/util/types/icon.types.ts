import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type MaterialCommunityIconsType from '@expo/vector-icons/MaterialCommunityIcons';

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
