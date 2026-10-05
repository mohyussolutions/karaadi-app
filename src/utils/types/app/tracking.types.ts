export type TrackingConsent = "granted" | "denied" | null;

export type TrackingPlatform = "ios" | "android";

export type TrackingPrimitive = string | number | boolean | null;

export type TrackingProperties = Record<string, TrackingPrimitive | TrackingPrimitive[]>;

export interface TrackedRouteFlowStep {
  step: string;
  path: string;
}

export interface TrackedRouteFlow {
  flow: string;
  steps: TrackedRouteFlowStep[];
}

export interface NewAdFlowStep {
  step: string;
  stepIndex: number;
}

export interface FlowInstance {
  flowId: string;
  step: string;
  stepIndex: number;
  updatedAt: number;
}

export type FlowInstances = Record<string, FlowInstance>;

export interface StoredTrackingSession {
  id: string;
  createdAt: number;
}

export interface TrackedSearch {
  id: string;
  key: string;
  at: number;
}

export interface SearchTrackingInput {
  query: string;
  resultsCount: number;
  loading?: boolean;
  filters?: TrackingProperties;
}

export interface PageViewInput {
  path: string;
  sessionId: string;
  platform: TrackingPlatform;
}

export interface TrackingEventInput {
  name: string;
  properties?: TrackingProperties;
  sessionId: string;
  platform: TrackingPlatform;
}

export interface SearchInput {
  query: string;
  resultsCount: number;
  filters?: TrackingProperties;
  sessionId: string;
  platform: TrackingPlatform;
}

export interface ClickedResult {
  id: string;
  type?: string;
  position?: number;
}

export interface SearchClickInput {
  sessionId: string;
  clickedResult: ClickedResult;
}

export interface LinkSessionResponse {
  linked: unknown;
}

export interface StaffFlags {
  isAdmin?: unknown;
  isManager?: unknown;
}

export type TrackingHttpMethod = 'POST' | 'PATCH';
export type NewAdFlowStepMap = Record<string, NewAdFlowStep>;
