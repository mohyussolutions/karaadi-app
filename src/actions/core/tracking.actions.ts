import * as SecureStore from "../../lib/helpers/device/secureStorage";
import { API_BASE_URL } from "../constants/endpoints";
import { TRACKING_ENDPOINTS } from "../constants/endpoints";
import { AUTH_TOKEN_KEY, AUTHORIZATION_HEADER, BEARER_PREFIX, CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE } from "../constants";
import { TRACKING_REQUEST_TIMEOUT_MS } from "../constants/tracking.constants";
import type { CreatedIdResponse, LinkSessionResponse, PageViewInput, SearchClickInput, SearchInput, StringMap, TrackingEventInput, TrackingHttpMethod } from "../../utils/types";

async function send<T>(path: string, method: TrackingHttpMethod, body: unknown): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TRACKING_REQUEST_TIMEOUT_MS);
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const headers: StringMap = { [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE };
    if (token) headers[AUTHORIZATION_HEADER] = `${BEARER_PREFIX}${token}`;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok || res.status === 204) return null;
    return (await res.json().catch(() => null)) as T | null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function sendPageView(input: PageViewInput) {
  return send<CreatedIdResponse>(TRACKING_ENDPOINTS.PAGE_VIEWS, "POST", input);
}

export function sendTrackingEvent(input: TrackingEventInput) {
  return send<CreatedIdResponse>(TRACKING_ENDPOINTS.EVENTS, "POST", input);
}

export async function sendSearch(input: SearchInput): Promise<string | null> {
  const res = await send<CreatedIdResponse>(TRACKING_ENDPOINTS.SEARCHES, "POST", input);
  return res?.id ?? null;
}

export function sendSearchClick(
  searchId: string,
  input: SearchClickInput,
) {
  return send<null>(TRACKING_ENDPOINTS.SEARCH_CLICK(searchId), "PATCH", input);
}

export function sendSessionLink(sessionId: string) {
  return send<LinkSessionResponse>(TRACKING_ENDPOINTS.LINK_SESSION, "POST", { sessionId });
}
