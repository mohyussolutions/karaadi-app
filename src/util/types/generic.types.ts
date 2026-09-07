export type ApiData = any;

export type ApiResponse<T = ApiData> = { data: T };

export interface ApiError extends Error {
  response?: { status: number; data?: { message?: string } };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
