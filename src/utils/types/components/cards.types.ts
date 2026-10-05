import type { ListingBase } from '../models/listing.types';

export interface SellerCardProps {
  username?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  subtitle?: string;
  userId?: string | null;
  isVerified?: boolean | null;
  onMessage?: () => void;
  onCall?: () => void;
  messageBtnLabel?: string;
  messageBtnIcon?: string;
  disabled?: boolean;
}

export interface ListingCardProps {
  item: ListingBase;
  onPress?: () => void;
  categoryKey?: string;
  imageAspectRatio?: number;
  priceLabel?: string;
  onDelete?: (item: ListingBase) => void;
  removing?: boolean;
}

export interface MyAdCardProps {
  item: ListingBase;
  deleting?: boolean;
  onDelete: (item: ListingBase) => void;
  onPayNow: (item: ListingBase) => void;
}

export interface SocialPostCardProps {
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  listingUrl: string;
  listingId?: string;
  isPremium90?: boolean;
}

export interface SpecGridProps {
  title: string;
  items: { label: string; value: string }[];
}

export interface StarRatingProps {
  rating: number;
  count: number;
}

export interface OwnShareButtonProps {
  onPress: () => void;
}
