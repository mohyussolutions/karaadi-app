import type { getSocket } from '../../../actions/sockets/socket.actions';

export type RawItem = Record<string, unknown>;

export type Params = Record<string, string | number | boolean | undefined | null>;

export type ExtraHeaders = Record<string, string>;

export interface RequestOptions {
  params?: Params;
  headers?: ExtraHeaders;
  signal?: AbortSignal;
}

export interface SearchParams {
  title?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined | null;
}

export type ApiData = any;

export interface ApiResponse<T = ApiData> { data: T }

export interface ApiError extends Error {
  response?: { status: number; data?: { message?: string } };
}

export interface LoadedCollection<T> {
  items: T[];
  loaded: boolean;
}

export interface ItemRef {
  itemId: string;
  itemType: string;
}

export type AppSocket = NonNullable<ReturnType<typeof getSocket>>;
