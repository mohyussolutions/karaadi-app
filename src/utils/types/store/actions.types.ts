import type { PayloadAction } from '@reduxjs/toolkit';
import type { Lang } from '../app/i18n.types';
import type { ThemeMode } from '../app/theme.types';
import type { Chat } from '../models/chat.types';
import type { ListingBase } from '../models/listing.types';
import type { ListingType, Step } from '../models/newAd.types';
import type { Notification } from '../models/notification.types';
import type { Plan } from '../models/plan.types';
import type { FeeInfoPayload, PrefillForPaymentPayload, SessionPayload } from './payloads.types';

export type SetCredentialsAction = PayloadAction<SessionPayload>;

export type SetBrowseQueryAction = PayloadAction<string>;

export type SetChatsAction = PayloadAction<Chat[]>;
export type MarkChatsReadAction = PayloadAction<number[]>;

export type SetFeedAction = PayloadAction<ListingBase[]>;
export type MergeFeedAction = PayloadAction<ListingBase[]>;
export type SetRecommendationsAction = PayloadAction<ListingBase[]>;

export type AddUserMessageAction = PayloadAction<string>;

export type SetLanguageAction = PayloadAction<Lang>;

export type SetThemeModeAction = PayloadAction<ThemeMode>;

export type SetStepAction = PayloadAction<Step>;
export type SetListingTypeAction = PayloadAction<ListingType>;
export type SetCategoryKeyAction = PayloadAction<string>;
export type SetBusinessIdAction = PayloadAction<string | null>;
export type SetSelectedPlanAction = PayloadAction<Plan | null>;
export type SetFeeInfoAction = PayloadAction<FeeInfoPayload>;
export type PrefillForPaymentAction = PayloadAction<PrefillForPaymentPayload>;

export type MergeServerNotificationsAction = PayloadAction<Notification[]>;
export type AddNotificationAction = PayloadAction<Notification>;
export type SetUnreadCountAction = PayloadAction<number>;
export type MarkChatNotificationsReadAction = PayloadAction<number[]>;
export type MarkOneReadAction = PayloadAction<string>;
export type RemoveNotificationAction = PayloadAction<string>;
