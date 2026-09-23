import type { Favorite, ListingBase } from './listing.types';
import type { HageMessage, Chat } from './chat.types';
import type { Lang } from './common.types';
import type { ThemeMode } from './theme.types';
import type { User } from './user.types';
import type { Notification } from './notification.types';
import type { GeoRegion } from './browse.types';
import type { LoadedCollection } from './generic.types';

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
