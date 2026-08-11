export interface ListingRef {
  id: string;
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
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

export interface RawListingRef {
  id?: string;
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
}

export interface HageChatApiResponse {
  reply?: string;
  listings?: RawListingRef[];
}
