import type { RawItem } from './api.types';
import type { Business } from '../models/business.types';
import type { ListingBase } from '../models/listing.types';
import type { ServerNotification } from '../models/notification.types';
import type { PaymentItem } from '../models/payment.types';
import type { Review } from '../models/review.types';
import type { SearchHistoryItem } from '../models/search.types';
import type { SupportChatMessage } from '../models/support.types';
import type { LoginEntry, Session } from '../models/user.types';

export interface ApiErrorBody {
  message?: string;
  error?: string;
}

export interface ErrorLike {
  name?: string;
  message?: string;
}

export interface ApiErrorWithData {
  response?: { data?: Record<string, unknown> };
}

export interface CreatedIdResponse {
  id: string;
}

export interface ListingsEnvelope {
  listings?: ListingBase[];
  items?: ListingBase[];
}

export interface SubscriptionsEnvelope {
  subscriptions?: RawItem[];
  data?: RawItem[];
}

export interface NotificationsEnvelope {
  notifications?: ServerNotification[];
}

export interface NotificationStatsResponse {
  stats?: { unread?: number };
}

export interface PaymentsEnvelope {
  data?: PaymentItem[];
}

export interface PaymentInitiateResponse {
  paymentRef?: string;
}

export interface PaymentStatusResponse {
  status?: string;
}

export interface ReviewsEnvelope {
  reviews?: Review[];
}

export interface SessionsEnvelope {
  sessions?: Session[];
}

export interface LoginHistoryEnvelope {
  history?: LoginEntry[];
}

export interface SearchHistoryEnvelope {
  searches?: SearchHistoryItem[];
}

export interface SupportChatMessageResponse {
  message: SupportChatMessage;
}

export interface MyAdUpdateResponse {
  maGaday?: boolean;
}

export type CreateBusinessResponse = Business & { business?: Business };

export type ListingsResponse = ListingBase[] | ListingsEnvelope;
export type SubscriptionsResponse = SubscriptionsEnvelope | RawItem[];
export type RawItemResponse = RawItem | RawItem[];
export type NotificationsResponse = ServerNotification[] | NotificationsEnvelope;
export type PaymentsResponse = PaymentItem[] | PaymentsEnvelope;
export type ReviewsResponse = Review[] | ReviewsEnvelope;
export type SessionsResponse = Session[] | SessionsEnvelope;
export type LoginHistoryResponse = LoginEntry[] | LoginHistoryEnvelope;
export type SearchHistoryResponse = SearchHistoryItem[] | SearchHistoryEnvelope;
