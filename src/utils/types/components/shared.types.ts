import type { ImageProps as ExpoImageProps } from 'expo-image';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import type { MainCategory } from '../models/category.types';

export interface CategoryGridProps {
  onPress?: (category: MainCategory) => void;
}

export interface CategoryGridItemProps {
  category: MainCategory;
  label: string;
  width: number;
  onPress: (category: MainCategory) => void;
}

export interface ToastPayload {
  message: string;
  type?: 'saved' | 'removed';
  onView?: () => void;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageSource extends Partial<ImageSize> {
  uri: string;
}

export interface ThemedIconProps {
  name: string;
  size?: number;
  color?: string;
}

export type RemoteImageProps = Omit<ExpoImageProps, 'style'> & {
  style?: StyleProp<ImageStyle & ViewStyle>;
  iconSize?: number;
};

export interface VerifiedBadgeProps {
  visible?: boolean | null;
  size?: number;
}

export interface LoadMoreButtonProps {
  onPress: () => void;
  loading: boolean;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}
