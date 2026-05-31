export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  phone?: string;
  phoneVerified?: boolean;
  isAdmin?: boolean;
  token: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ListingBase {
  _id: string;
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  region: string;
  city: string;
  images: string[];
  isPaid?: boolean;
  isActive?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

export interface Car extends ListingBase {
  mainCategory: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  type: string;
}

export interface RealEstate extends ListingBase {
  mainCategory: string;
  category: string;
  subcategory: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished?: boolean;
}

export interface Motorcycle extends ListingBase {
  mainCategory: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  category: string;
}

export interface Boat extends ListingBase {
  mainCategory: string;
  brand: string;
  model: string;
  year: number;
  length?: number;
  category: string;
}

export interface Marketplace extends ListingBase {
  mainCategory: string;
  category: string;
  subcategory: string;
  condition?: string;
}

export interface Job extends ListingBase {
  mainCategory: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: string;
  requirements?: string;
}

export interface FarmEquipment extends ListingBase {
  mainCategory: string;
  category: string;
  brand?: string;
  model?: string;
  year?: number;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  listingId?: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: Message;
  otherUser?: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  unreadCount?: number;
  updatedAt: string;
}

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
  listing?: ListingBase;
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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
