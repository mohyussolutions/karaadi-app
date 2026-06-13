import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/config";

type Params = Record<string, string | number | boolean | undefined | null>;
type ExtraHeaders = Record<string, string>;

export type ApiResponse<T = any> = { data: T };

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
  const token = await SecureStore.getItemAsync("karaadi_token");
  const headers: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["x-auth-token"] = token;
  }
  return { ...headers, ...extra };
}

async function handle401() {
  await SecureStore.deleteItemAsync("karaadi_token");
  await SecureStore.deleteItemAsync("karaadi_user");
  const { disconnectSocket } =
    require("./sockets/socket.actions") as typeof import("./sockets/socket.actions");
  disconnectSocket();
  const { store } = require("../store") as typeof import("../store");
  const { clearCredentials } =
    require("../store/slices/authSlice") as typeof import("../store/slices/authSlice");
  store.dispatch(clearCredentials());
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { params?: Params; headers?: ExtraHeaders; signal?: AbortSignal },
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;
  const url = buildUrl(path, options?.params);
  const headers = await buildHeaders(options?.headers, isFormData);

  const res = await fetch(url, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    signal: options?.signal,
  });

  if (res.status === 401) {
    await handle401();
    throw Object.assign(new Error("Unauthorized"), {
      response: { status: 401 },
    });
  }

  if (!res.ok) {
    let errData: unknown;
    try {
      errData = await res.json();
    } catch {
      errData = await res.text().catch(() => "");
    }
    throw Object.assign(new Error(`HTTP ${res.status}`), {
      response: { status: res.status, data: errData },
    });
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : (null as T);
  return { data };
}

export type RequestOptions = {
  params?: Params;
  headers?: ExtraHeaders;
  signal?: AbortSignal;
};

export const apiClient = {
  get: <T = any>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T = any>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T = any>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
