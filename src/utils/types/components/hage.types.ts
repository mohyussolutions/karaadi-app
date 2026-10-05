import type { EdgeInsets } from 'react-native-safe-area-context';
import type { FlatList } from 'react-native';
import type { RefObject } from 'react';
import type { ListingRoute } from '../app/navigation.types';
import type { HageMessage, ListingRef } from '../models/hage.types';

export interface HageInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
  insets: EdgeInsets;
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

export interface HageMessageRowProps {
  item: HageMessage;
  onListingPress: (listing: ListingRef) => void;
  onLinkPress: (route: ListingRoute) => void;
}

export interface ListingChipProps {
  item: ListingRef;
  onPress: () => void;
}
