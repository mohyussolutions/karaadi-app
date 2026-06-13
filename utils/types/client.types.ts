export type Params = Record<string, string | number | boolean | undefined | null>;
export type ExtraHeaders = Record<string, string>;

export type ApiResponse<T = any> = { data: T };

export type RequestOptions = {
  params?: Params;
  headers?: ExtraHeaders;
  signal?: AbortSignal;
};
