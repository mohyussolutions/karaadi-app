import type { ListingBase } from './listing.types';

export interface SearchHistoryItem {
  _id?: string;
  id?: string;
  query?: string;
  search?: string;
  text?: string;
  createdAt?: string;
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

export type SearchableListing = ListingBase & Partial<{
  brand: string;
  type: string;
  make: string;
  salary: number;
  itemType: string;
}>;

export interface SearchQuery {
  keywords: string[];
  priceValue: number | null;
}
