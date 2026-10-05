import type { FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { ListRenderItemInfo as FlashListRenderItemInfo } from '@shopify/flash-list';
import type { ChatMessage, GroupedChat } from '../models/chat.types';
import type { HageMessage } from '../models/hage.types';
import type { ListingBase } from '../models/listing.types';
import type { MainCategory, NestedSubCategory } from '../models/category.types';
import type { Notification } from '../models/notification.types';
import type { FilterRow } from '../models/geo.types';
import type { SupportChatMessage } from '../models/support.types';
import type { SubscriptionRow } from '../hooks/usePayments.types';

export type ListingRenderInfo = FlashListRenderItemInfo<ListingBase>;
export type ListingFlatListRenderInfo = ListRenderItemInfo<ListingBase>;
export type NestedSubCategoryRenderInfo = FlashListRenderItemInfo<NestedSubCategory>;
export type MainCategoryRenderInfo = FlashListRenderItemInfo<MainCategory>;
export type FilterRowRenderInfo = ListRenderItemInfo<FilterRow>;
export type ChatMessageRenderInfo = ListRenderItemInfo<ChatMessage>;
export type GroupedChatRenderInfo = ListRenderItemInfo<GroupedChat>;
export type HageMessageRenderInfo = ListRenderItemInfo<HageMessage>;
export type NotificationRenderInfo = ListRenderItemInfo<Notification>;
export type SupportChatMessageRenderInfo = ListRenderItemInfo<SupportChatMessage>;
export type SubscriptionRowRenderInfo = ListRenderItemInfo<SubscriptionRow>;

export type ChatMessageListRef = FlatList<ChatMessage>;
export type HageMessageListRef = FlatList<HageMessage>;
export type SupportChatListRef = FlatList<SupportChatMessage>;

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
