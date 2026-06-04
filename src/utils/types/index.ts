export type { User, AuthResponse } from './user.types';
export type {
  ListingBase, Car, RealEstate, Motorcycle, Boat,
  MarketplaceItem, FarmEquipment, Job, WantedItem,
  AnyListing, PaginatedResponse,
} from './listing.types';
export type { Chat, ChatMessage, ChatUser } from './chat.types';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  listingId: string;
  listingType: string;
  listing?: import('./listing.types').ListingBase;
  createdAt: string;
}

export interface SearchResult {
  _id: string;
  id: string;
  title: string;
  price: number;
  images: string[];
  region?: string;
  city?: string;
  category?: string;
  mainCategory?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  unreadCount?: number;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}
