export type Params = Record<string, string | number | boolean | undefined | null>;
export type ExtraHeaders = Record<string, string>;

export type ApiData = any;

export type ApiResponse<T = ApiData> = { data: T };

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
