import type { ListingRoute } from '../app/navigation.types';

export interface HageReplySegment {
  text: string;
  route?: ListingRoute;
}

export interface ListingRefBase {
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
  maGaday?: boolean;
}

export interface ListingRef extends ListingRefBase {
  id: string;
}

export interface HageMessage {
  id: number;
  content: string;
  fromAI: boolean;
  listings?: ListingRef[];
}

export interface HageChatResult {
  reply: string;
  listings: ListingRef[];
}

export interface RawListingRef extends ListingRefBase {
  id?: string;
}

export interface HageChatApiResponse {
  reply?: string;
  listings?: RawListingRef[];
}
