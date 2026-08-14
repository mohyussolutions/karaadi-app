import type { EdgeInsets } from 'react-native-safe-area-context';
import type { RefObject } from 'react';
import type { FlatList } from 'react-native';
import type { ListingRoute } from './routing.types';

export interface HageReplySegment {
  text: string;
  route?: ListingRoute;
}

export interface HageInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
  insets: EdgeInsets;
}

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

export interface HageMessageListProps {
  listRef: RefObject<FlatList<HageMessage> | null>;
  messages: HageMessage[];
  loading: boolean;
  insets: EdgeInsets;
  emptyText: string;
  thinkingText: string;
  onListingPress: (listing: ListingRef) => void;
  onLinkPress: (route: ListingRoute) => void;
}
