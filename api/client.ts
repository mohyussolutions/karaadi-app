import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/config";
import { storeRef } from "../store/storeRef";
import { clearCredentials } from "../store/slices/authSlice";
import { disconnectSocket } from "./sockets/socket.actions";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTHORIZATION_HEADER,
  AUTH_TOKEN_HEADER,
  BEARER_PREFIX,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
} from "./client.constants";
import type {
  ExtraHeaders,
  Params,
  ApiData,
  ApiResponse,
  RequestOptions,
} from "../util/types/client.types";

export type { ApiResponse, RequestOptions } from "../util/types/client.types";

function buildUrl(path: string, params?: Params): string {
  const base = `${API_BASE_URL}${path}`;
  if (!params) return base;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return qs ? `${base}?${qs}` : base;
}

async function buildHeaders(
  extra?: ExtraHeaders,
  isFormData?: boolean,
): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  const headers: Record<string, string> = isFormData
    ? {}
    : { [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE };
  if (token) {
    headers[AUTHORIZATION_HEADER] = `${BEARER_PREFIX}${token}`;
    headers[AUTH_TOKEN_HEADER] = token;
  }
  return { ...headers, ...extra };
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

function apiError(message: string, status: number, data?: unknown) {
  return Object.assign(new Error(message), { response: { status, data } });
}

async function readErrorBody(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return await res.text().catch(() => "");
  }
}

async function parseBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as T);
}

async function handle401() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
  disconnectSocket();
  storeRef.dispatch?.(clearCredentials());
}

async function ensureOk(res: Response): Promise<void> {
  if (res.status === 401) {
    await handle401();
    throw apiError("Unauthorized", 401);
  }

  if (!res.ok) {
    const errData = await readErrorBody(res);
    throw apiError(`HTTP ${res.status}`, res.status, errData);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;
  const url = buildUrl(path, options?.params);
  const headers = await buildHeaders(options?.headers, isFormData);

  const res = await fetch(url, {
    method,
    headers,
    body: serializeBody(body),
    signal: options?.signal,
  });

  await ensureOk(res);

  return { data: await parseBody<T>(res) };
}

export const apiClient = {
  get: <T = ApiData>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T = ApiData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T = ApiData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T = ApiData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T = ApiData>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
