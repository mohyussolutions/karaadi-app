import type { VideoSource } from 'expo-video';
import type { MCIcon } from './icon.types';

export interface TutorialVideo {
  id: string;
  titleKey: string;
  source: VideoSource;
}

export interface AboutPageItem {
  id: string;
  icon: MCIcon;
  titleKey: string;
  route: string;
}

export interface InfoRow {
  icon: string;
  label: string;
  value: string;
}
