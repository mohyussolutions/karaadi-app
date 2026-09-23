import * as SecureStore from "../util/helpers/secureStorage";
import { API_BASE_URL } from "../api/urls";
import { storeRef } from "../store/internal/storeRef";
import { disconnectSocket } from "./sockets/socket.actions";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTHORIZATION_HEADER,
  AUTH_TOKEN_HEADER,
  BEARER_PREFIX,
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  REQUEST_TIMEOUT_MS,
  UPLOAD_TIMEOUT_MS,
  RETRY_MAX_ATTEMPTS,
  RETRY_BASE_DELAY_MS,
  RETRY_MAX_DELAY_MS,
  RETRY_STATUS_CODES,
} from "../constants";
import type {
  ExtraHeaders,
  Params,
  RequestOptions,
} from "../util/types/common.types";
import type { ApiData, ApiResponse } from "../util/types/generic.types";

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
  storeRef.dispatch?.({ type: "auth/clearCredentials" });
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

function withTimeout(external: AbortSignal | undefined, timeoutMs: number) {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  if (external) {
    if (external.aborted) ctrl.abort();
    else external.addEventListener("abort", onAbort, { once: true });
  }
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return { signal: ctrl.signal, clear: () => clearTimeout(timer) };
}

function backoffDelay(attempt: number, retryAfter: string | null): number {
  const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : NaN;
  if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) {
    return Math.min(retryAfterMs, RETRY_MAX_DELAY_MS);
  }
  const exp = Math.min(RETRY_MAX_DELAY_MS, RETRY_BASE_DELAY_MS * 2 ** attempt);
  return exp * (0.5 + Math.random() * 0.5);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  method: string,
  external: AbortSignal | undefined,
  timeoutMs: number,
): Promise<Response> {
  const maxAttempts = method === "GET" ? RETRY_MAX_ATTEMPTS + 1 : 1;
  for (let attempt = 0; ; attempt++) {
    const { signal, clear } = withTimeout(external, timeoutMs);
    const isLast = attempt + 1 >= maxAttempts;
    try {
      const res = await fetch(url, { ...init, signal });
      clear();
      if (isLast || !RETRY_STATUS_CODES.includes(res.status)) return res;
      const delay = backoffDelay(attempt, res.headers.get("Retry-After"));
      await res.text().catch(() => "");
      await wait(delay);
    } catch (e) {
      clear();
      if (external?.aborted || isLast) throw e;
      await wait(backoffDelay(attempt, null));
    }
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

  const res = await fetchWithRetry(
    url,
    { method, headers, body: serializeBody(body) },
    method,
    options?.signal,
    isFormData ? UPLOAD_TIMEOUT_MS : REQUEST_TIMEOUT_MS,
  );

  await ensureOk(res);

  return { data: await parseBody<T>(res) };
}

function apiGet<T = ApiData>(
  path: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return request<T>("GET", path, undefined, options);
}

function apiPost<T = ApiData>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return request<T>("POST", path, body, options);
}

function apiPut<T = ApiData>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return request<T>("PUT", path, body, options);
}

function apiPatch<T = ApiData>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return request<T>("PATCH", path, body, options);
}

function apiDelete<T = ApiData>(
  path: string,
  options?: RequestOptions,
): Promise<ApiResponse<T>> {
  return request<T>("DELETE", path, undefined, options);
}

export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};
