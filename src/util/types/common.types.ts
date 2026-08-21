import type { store } from '../../store/store';

export type Lang = 'en' | 'so';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type RawItem = Record<string, unknown>;

export type ListingRoute =
  | { pathname: '/listing/vehicle/[id]'; params: { id: string; category: string } }
  | { pathname: '/listing/real-estate/[id]'; params: { id: string } }
  | { pathname: '/listing/job/[id]'; params: { id: string } }
  | { pathname: '/listing/item-detail/[id]'; params: { id: string } };

export type ShadowParams = {
  color: string;
  offset?: { width: number; height: number };
  opacity: number;
  radius: number;
  elevation: number;
};

export interface ToastPayload {
  message: string;
  type?: 'saved' | 'removed';
  onView?: () => void;
}

export interface ConfirmModalAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: ConfirmModalAction[];
  onDismiss: () => void;
}

export interface EulaModalProps {
  visible: boolean;
  onAccept: () => void;
}

export type Params = Record<string, string | number | boolean | undefined | null>;
export type ExtraHeaders = Record<string, string>;

export type RequestOptions = {
  params?: Params;
  headers?: ExtraHeaders;
  signal?: AbortSignal;
};

export interface SearchParams {
  title?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export interface ReportPayload {
  userId: string;
  itemId: string;
  itemType: string;
  reason: string;
  description?: string;
}
