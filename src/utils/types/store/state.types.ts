import type { LoadedCollection } from '../api/api.types';
import type { Lang } from '../app/i18n.types';
import type { ThemeMode } from '../app/theme.types';
import type { Chat } from '../models/chat.types';
import type { GeoRegion } from '../models/geo.types';
import type { HageMessage } from '../models/hage.types';
import type { Favorite, ListingBase } from '../models/listing.types';
import type { Notification } from '../models/notification.types';
import type { User } from '../models/user.types';

export interface ChatsState extends LoadedCollection<Chat> {}


export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}


export interface NotificationSettingsState {
  soundEnabled: boolean;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}


export interface BrowseSearchState {
  query: string;
}


export interface FavoritesState extends LoadedCollection<Favorite> {
  ids: string[];
  idMap: Record<string, string>;
}


export interface FeedState {
  listings: ListingBase[];
  recommendations: ListingBase[];
}


export interface GeoState {
  regions: GeoRegion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchedAt: number | null;
}


export interface HageState {
  open: boolean;
  messages: HageMessage[];
  loading: boolean;
}


export interface LanguageState {
  lang: Lang;
}


export interface ThemeState {
  mode: ThemeMode;
}

export type FavoritesData = Pick<FavoritesState, 'ids' | 'idMap' | 'items'>;
