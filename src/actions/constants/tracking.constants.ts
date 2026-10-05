import type { NewAdFlowStepMap, TrackedRouteFlow } from "../../utils/types";
import { PATHNAMES } from "./routes.constants";

export const TRACKING_CONSENT_KEY = "karaadi_tracking_consent_v1";
export const TRACKING_SESSION_KEY = "karaadi_tracking_session_v1";
export const TRACKING_FLOWS_KEY = "karaadi_tracking_flows_v1";
export const TRACKING_LINKED_KEY = "karaadi_tracking_linked_v1";

export const CONSENT_GRANTED = "granted";
export const CONSENT_DENIED = "denied";

export const TRACKING_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const FLOW_INSTANCE_TTL_MS = 24 * 60 * 60 * 1000;
export const TRACKING_REQUEST_TIMEOUT_MS = 8000;

export const SEARCH_SETTLE_MS = 1200;
export const SEARCH_DEDUPE_MS = 30_000;
export const SEARCH_CLICK_WINDOW_MS = 10 * 60 * 1000;
export const SEARCH_MAX_FILTERS = 18;
export const SEARCH_QUERY_MAX = 200;
export const TRACKING_VALUE_MAX = 200;

export const TRACKING_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;
export const TRACKING_KEY_REGEX = /^[a-z][a-z0-9_]*$/i;
export const TRACKING_NON_KEY_CHARS = /[^a-z0-9_]/gi;
export const TRACKING_PATH_REGEX = /^\/[^\s]*$/;

export const TRACKING_EVENTS = {
  FLOW_STARTED: "flow_started",
  FLOW_STEP: "flow_step",
  FLOW_COMPLETED: "flow_completed",
  CLICK_CTA: "click_cta",
} as const;

export const FLOWS = {
  CREATE_LISTING: "create_listing",
  SIGNUP: "signup",
} as const;

export const ROUTE_FLOWS: TrackedRouteFlow[] = [
  {
    flow: FLOWS.SIGNUP,
    steps: [
      { step: "register", path: PATHNAMES.register },
      { step: "confirm", path: PATHNAMES.confirm },
    ],
  },
];

export const NEW_AD_FLOW_STEPS: NewAdFlowStepMap = {
  type: { step: "category", stepIndex: 0 },
  category: { step: "category", stepIndex: 0 },
  form: { step: "details", stepIndex: 1 },
  plan: { step: "plan", stepIndex: 2 },
  summary: { step: "payment", stepIndex: 3 },
  payment: { step: "payment", stepIndex: 3 },
};
