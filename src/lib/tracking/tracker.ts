import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  sendPageView,
  sendSearch,
  sendSearchClick,
  sendSessionLink,
  sendTrackingEvent,
} from "../../actions/core/tracking.actions";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  FLOW_INSTANCE_TTL_MS,
  ROUTE_FLOWS,
  SEARCH_CLICK_WINDOW_MS,
  SEARCH_DEDUPE_MS,
  SEARCH_QUERY_MAX,
  TRACKING_CONSENT_KEY,
  TRACKING_EVENTS,
  TRACKING_FLOWS_KEY,
  TRACKING_ID_REGEX,
  TRACKING_KEY_REGEX,
  TRACKING_LINKED_KEY,
  TRACKING_NON_KEY_CHARS,
  TRACKING_PATH_REGEX,
  TRACKING_SESSION_KEY,
  TRACKING_SESSION_TTL_MS,
} from "../../actions/constants/tracking.constants";
import { TRACKING_EXCLUDED_PATHS } from "../../actions/constants/routes.constants";
import type { FlowInstances, StaffFlags, StoredTrackingSession, TrackedSearch, TrackingConsent, TrackingPlatform, TrackingProperties } from "../../utils/types";

const platform: TrackingPlatform = Platform.OS === "ios" ? "ios" : "android";

let consent: TrackingConsent = null;
let sessionId: string | null = null;
let staff = false;
let lastPath: string | null = null;
let lastSearch: TrackedSearch | null = null;
let ready: Promise<TrackingConsent> | null = null;

function randomId(): string {
  const chunk = () => Math.random().toString(36).slice(2);
  return `${Date.now().toString(36)}${chunk()}${chunk()}`.replace(/[^a-z0-9]/g, "").slice(0, 32);
}

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

async function getOrCreateSession(): Promise<string> {
  const stored = await readJson<StoredTrackingSession>(TRACKING_SESSION_KEY);
  if (stored?.id && TRACKING_ID_REGEX.test(stored.id) && Date.now() - stored.createdAt < TRACKING_SESSION_TTL_MS) {
    return stored.id;
  }
  const session: StoredTrackingSession = { id: randomId(), createdAt: Date.now() };
  await writeJson(TRACKING_SESSION_KEY, session);
  return session.id;
}

export function initTracking(): Promise<TrackingConsent> {
  ready ??= (async () => {
    const value = await AsyncStorage.getItem(TRACKING_CONSENT_KEY).catch(() => null);
    consent = value === CONSENT_GRANTED ? "granted" : value === CONSENT_DENIED ? "denied" : null;
    if (consent === "granted") sessionId = await getOrCreateSession();
    return consent;
  })();
  return ready;
}

export async function setTrackingConsent(granted: boolean): Promise<void> {
  await initTracking();
  await AsyncStorage.setItem(TRACKING_CONSENT_KEY, granted ? CONSENT_GRANTED : CONSENT_DENIED).catch(() => undefined);
  consent = granted ? "granted" : "denied";
  if (granted) {
    sessionId = await getOrCreateSession();
    return;
  }
  sessionId = null;
  lastSearch = null;
  await AsyncStorage.multiRemove([TRACKING_SESSION_KEY, TRACKING_FLOWS_KEY, TRACKING_LINKED_KEY]).catch(() => undefined);
}

export function getTrackingConsent(): TrackingConsent {
  return consent;
}

export function setTrackingStaff(isStaff: boolean) {
  staff = isStaff;
}

function activeSession(): string | null {
  return consent === "granted" && !staff ? sessionId : null;
}

export async function trackEvent(name: string, properties?: TrackingProperties) {
  await initTracking();
  const sid = activeSession();
  if (!sid) return;
  await sendTrackingEvent({ name, properties, sessionId: sid, platform });
}

export async function trackFlowStep(flow: string, step: string, stepIndex: number, resumePath: string) {
  await initTracking();
  if (!activeSession()) return;
  const instances = (await readJson<FlowInstances>(TRACKING_FLOWS_KEY)) ?? {};
  const current = instances[flow];
  const now = Date.now();
  const base = { flow, step, stepIndex, resumePath };
  if (!current || now - current.updatedAt > FLOW_INSTANCE_TTL_MS) {
    const flowId = randomId();
    instances[flow] = { flowId, step, stepIndex, updatedAt: now };
    await trackEvent(TRACKING_EVENTS.FLOW_STARTED, { ...base, flowId });
    await trackEvent(TRACKING_EVENTS.FLOW_STEP, { ...base, flowId });
  } else if (current.step !== step) {
    instances[flow] = { ...current, step, stepIndex, updatedAt: now };
    await trackEvent(TRACKING_EVENTS.FLOW_STEP, { ...base, flowId: current.flowId });
  } else {
    instances[flow] = { ...current, updatedAt: now };
  }
  await writeJson(TRACKING_FLOWS_KEY, instances);
}

export async function completeFlow(flow: string) {
  await initTracking();
  if (!activeSession()) return;
  const instances = (await readJson<FlowInstances>(TRACKING_FLOWS_KEY)) ?? {};
  const flowId = instances[flow]?.flowId ?? randomId();
  await trackEvent(TRACKING_EVENTS.FLOW_COMPLETED, { flow, flowId });
  delete instances[flow];
  await writeJson(TRACKING_FLOWS_KEY, instances);
}

export async function trackScreen(path: string) {
  await initTracking();
  const sid = activeSession();
  if (!sid || path === lastPath || !TRACKING_PATH_REGEX.test(path)) return;
  if (TRACKING_EXCLUDED_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return;
  lastPath = path;
  sendPageView({ path, sessionId: sid, platform });
  for (const { flow, steps } of ROUTE_FLOWS) {
    const stepIndex = steps.findIndex((s) => s.path === path);
    if (stepIndex >= 0) trackFlowStep(flow, steps[stepIndex].step, stepIndex, path);
  }
}

export async function trackSearch(query: string, resultsCount: number, filters?: TrackingProperties) {
  await initTracking();
  const sid = activeSession();
  const text = query.trim().slice(0, SEARCH_QUERY_MAX);
  if (!sid || !text) return;
  const key = `${lastPath ?? ""}|${text.toLowerCase()}|${resultsCount}`;
  if (lastSearch && lastSearch.key === key && Date.now() - lastSearch.at < SEARCH_DEDUPE_MS) return;
  const id = await sendSearch({ query: text, resultsCount, filters, sessionId: sid, platform });
  if (id) lastSearch = { id, key, at: Date.now() };
}

export function trackResultClick(id: string, type?: string, position?: number) {
  const sid = activeSession();
  if (!sid || !lastSearch || Date.now() - lastSearch.at > SEARCH_CLICK_WINDOW_MS) return;
  if (!TRACKING_ID_REGEX.test(id)) return;
  const normalizedType = type?.replace(TRACKING_NON_KEY_CHARS, "_").toLowerCase().slice(0, 40);
  sendSearchClick(lastSearch.id, {
    sessionId: sid,
    clickedResult: {
      id,
      ...(normalizedType && TRACKING_KEY_REGEX.test(normalizedType) ? { type: normalizedType } : {}),
      ...(typeof position === "number" ? { position } : {}),
    },
  });
}

export async function linkTrackingSession(userId: string) {
  await initTracking();
  const sid = activeSession();
  if (!sid) return;
  const key = `${sid}:${userId}`;
  const linked = await AsyncStorage.getItem(TRACKING_LINKED_KEY).catch(() => null);
  if (linked === key) return;
  const res = await sendSessionLink(sid);
  if (res) await AsyncStorage.setItem(TRACKING_LINKED_KEY, key).catch(() => undefined);
}

export function isStaffUser(user: StaffFlags | null | undefined): boolean {
  const isTrue = (value: unknown) => value === true || value === "true";
  return !!user && (isTrue(user.isAdmin) || isTrue(user.isManager));
}
