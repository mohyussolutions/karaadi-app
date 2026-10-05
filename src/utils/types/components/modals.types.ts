import type { VideoSource } from 'expo-video';
import type { ReactNode } from 'react';
import type { ColorPalette } from '../app/theme.types';
import type { SubcategoryBrowseStyles } from './browse.types';
import type { FilterRow, RegionPickerItem } from '../models/geo.types';

export interface LocationFilterModalProps extends ModalProps {
  regions: RegionPickerItem[];
  selectedRegions: string[];
  selectedCities: string[];
  regionCounts: Record<string, number>;
  cityCounts: Record<string, number>;
  onToggleRegion: (name: string) => void;
  onToggleCity: (name: string) => void;
  onClear: () => void;
}

export interface ConfirmModalAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: ConfirmModalAction[];
  onDismiss: () => void;
}

export interface EulaModalProps {
  visible: boolean;
  onAccept: () => void;
}

export interface ZoomModalProps extends ModalProps {
  images: string[];
  startIndex: number;
  title: string;
}

export interface SwipeDownToCloseProps {
  children: ReactNode;
}

export interface FilterRowItemProps {
  item: FilterRow;
  active: boolean;
  onToggleRegion: (name: string) => void;
  onToggleCity: (name: string) => void;
}

export interface FilterModalHeaderProps {
  title: string;
  onClose: () => void;
  isTablet: boolean;
  Colors: ColorPalette;
  styles: SubcategoryBrowseStyles;
}

export interface FilterSearchBoxProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  isTablet: boolean;
  Colors: ColorPalette;
  styles: SubcategoryBrowseStyles;
}

export interface FilterModalFooterProps {
  totalSelected: number;
  onClear: () => void;
  onApply: () => void;
  insetBottom: number;
  isTablet: boolean;
  t: (key: string) => string;
  styles: SubcategoryBrowseStyles;
}

export interface VideoPopupModalProps {
  visible: boolean;
  onClose: () => void;
  source: VideoSource;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface IdentityGateProps {
  visible: boolean;
  idCardRequired?: boolean;
  selfieRequired?: boolean;
  onVerified: () => void;
}

export interface TrackingConsentModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}
