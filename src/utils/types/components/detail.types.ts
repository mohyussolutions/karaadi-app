import type { ReactNode } from 'react';
import type { createStyles as createRecommendedSectionStyles } from '../../styles/detail/recommendedSection.styles';
import type { ListingBase } from '../models/listing.types';

export interface ImageGalleryProps {
  images: string[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onImagePress?: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onShare?: () => void;
  badge?: { label: string; color: string } | null;
  isSold?: boolean;
}

export interface DetailNotFoundProps {
  icon?: string;
  message?: string;
  onBack: () => void;
}

export interface DetailActionBarProps {
  onMessage?: () => void;
  messageLabel?: string;
  messageDisabled?: boolean;
  messageIcon?: string;
  onCall?: () => void;
  callLabel?: string;
  priceLabel?: string;
  titleLabel?: string;
  extra?: ReactNode;
}

export interface RecommendedSectionProps {
  endpoint: string;
  excludeId: string;
  title?: string;
  categoryKey?: string;
}

export interface RecommendedItemProps {
  item: ListingBase;
  styles: ReturnType<typeof createRecommendedSectionStyles>;
  onPress: (item: ListingBase) => void;
  priceOnRequestLabel: string;
}

export interface ReportLinkProps {
  itemId: string;
  itemType: string;
}

export interface MyAdGalleryProps {
  images: string[];
  width: number;
  sold: boolean;
  soldLabel: string;
}
