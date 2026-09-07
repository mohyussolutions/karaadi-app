import { CAT_PATHS } from "./paths";
import { withId, withIdSuffix, createCrudEndpoints } from "../util/helpers/endpoint.builders";

export const MARKETPLACE_ENDPOINTS = createCrudEndpoints(CAT_PATHS.marketplace);
export const REAL_ESTATE_ENDPOINTS = createCrudEndpoints(CAT_PATHS.realEstate);
export const CARS_ENDPOINTS = createCrudEndpoints(CAT_PATHS.cars);
export const MOTORCYCLES_ENDPOINTS = createCrudEndpoints(CAT_PATHS.motorcycles);
export const BOATS_ENDPOINTS = createCrudEndpoints(CAT_PATHS.boats);
export const FARM_EQUIPMENT_ENDPOINTS = createCrudEndpoints(CAT_PATHS.farmEquipment);
export const JOBS_ENDPOINTS = createCrudEndpoints(CAT_PATHS.jobs);

export const MY_ADS_ENDPOINTS = {
  LIST: "/api/listings/my-ads",
  DELETE: withId("/api/listings/delete"),
};

export const FEED_ENDPOINTS = {
  FEED: "/api/feed",
  GROUP: (group: "fast" | "slow", page = 1, pageSize = 100) =>
    `/api/feed?group=${group}&page=${page}&pageSize=${pageSize}`,
  RECOMMENDATIONS: "/api/recommendations",
  TRACK_VIEW: "/api/recommendations/track-view",
};

export const SEARCH_ENDPOINTS = {
  GLOBAL: "/api/search",
  SEMANTIC: "/api/search/semantic",
};

export const SEARCH_HISTORY_ENDPOINTS = {
  LIST: "/api/history-search",
  LOG: "/api/history-search/log",
  DELETE: withId("/api/history-search"),
};

export const FAVORITES_ENDPOINTS = {
  LIST: "/api/favorites/my",
  ADD: "/api/favorites",
  REMOVE: withId("/api/favorites"),
};

export const REVIEWS_ENDPOINTS = {
  BY_USER: withId("/api/reviews/user"),
  CREATE: "/api/reviews",
};

export const REPORT_ENDPOINTS = {
  CREATE: "/api/reports",
};

export const IMAGE_ENDPOINTS = {
  UPLOAD: "/api/images/upload",
};

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/users/auth",
  REGISTER: "/api/users/register",
  LOGOUT: "/api/users/logout",
  CONFIRM: "/api/users/confirm",
  RESEND_CODE: "/api/users/resend-code",
  FORGOT_PASSWORD: "/api/users/forgot-password",
  RESET_PASSWORD: "/api/users/reset-password",
  VERIFY_SESSION: "/api/users/verify-session",
  REFRESH_TOKEN: "/api/users/refreshtoken",
  PROFILE: "/api/users/me",
  UPDATE_PROFILE_IMAGE: "/api/users/profile/image",
  UPDATE_USERNAME: "/api/users/profile/username",
  UPDATE_PHONE: "/api/users/profile/phone",
  UPDATE_PHONE_VISIBILITY: "/api/users/profile/phone-visibility",
  UPDATE_PUSH_TOKEN: "/api/users/profile/push-token",
  DELETE_ACCOUNT: "/api/users/delete-account",
  GET_BY_ID: withId("/api/users"),
};

export const SECURITY_ENDPOINTS = {
  SESSIONS: "/api/users/sessions",
  SESSION_LOGOUT: withIdSuffix("/api/users/sessions", "logout"),
  SESSIONS_LOGOUT_ALL: "/api/users/sessions/logout-all",
  LOGIN_HISTORY: "/api/users/login-history",
  LOGIN_HISTORY_DELETE: withId("/api/users/login-history"),
};

export const IDENTIFICATION_ENDPOINTS = {
  STATUS: "/api/identification/status",
  SUBMIT: "/api/identification/submit",
};

export const BLOCK_ENDPOINTS = {
  BLOCK: withIdSuffix("/api/users", "block"),
  UNBLOCK: withIdSuffix("/api/users", "unblock"),
  LIST: "/api/users/blocked",
};

export const BUSINESSES_ENDPOINTS = {
  LIST: "/api/businesses",
  BY_ID: withId("/api/businesses"),
  MY: "/api/businesses/my",
  CREATE: "/api/businesses",
  UPDATE: withId("/api/businesses"),
  DELETE: withId("/api/businesses"),
};

export const BUSINESS_PLAN_ENDPOINTS = {
  PLANS: "/api/business-plans",
  SELECT_PLAN: withIdSuffix("/api/businesses", "select-plan"),
  EXTEND_PLAN: withIdSuffix("/api/businesses", "extend-plan"),
};

export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: "/api/Fee/sub-plans",
  MY: "/api/subscription/my",
  SUBSCRIBE: "/api/subscription",
  BY_ID: withId("/api/subscription"),
  ALL_PAID: "/api/subscription/allpaid",
};

export const FEE_ENDPOINTS = {
  BASE: "/api/Fee",
};

export const PAYMENT_ENDPOINTS = {
  ME: "/api/payments/me",
  MOBILE_INITIATE: "/api/payments/mobile/initiate",
  MOBILE_STATUS: withId("/api/payments/mobile/status"),
  WAAFI_INITIATE: "/api/payments/waafi/initiate",
  WAAFI_STATUS: withId("/api/payments/waafi/status"),
  AD_PATCH: withId("/api/listings"),
  CREATE: "/api/payments",
  ACTIVATE: (category: string, id: string) => `/api/${category}/${id}/payment`,
};

export const CHATS_ENDPOINTS = {
  MY_CHATS: withId("/api/chats/user"),
  CREATE: "/api/chats/create",
  FIND: "/api/chats/conversation/find",
  BY_ID: withId("/api/chats"),
  MESSAGES: withIdSuffix("/api/chats", "messages"),
};

export const MESSAGES_ENDPOINTS = {
  SEND: "/api/messages/send",
  UNREAD_COUNT: withId("/api/messages/unread"),
};

export const NOTIFICATIONS_ENDPOINTS = {
  LIST: withId("/api/notifications/user"),
  MARK_READ: withIdSuffix("/api/notifications", "read"),
  MARK_ALL_READ: withIdSuffix("/api/notifications/user", "read-all"),
  STATS: withIdSuffix("/api/notifications/user", "stats"),
  CLEAR_ALL: withIdSuffix("/api/notifications/user", "clear-all"),
  DELETE: withId("/api/notifications"),
};

export const SUPPORT_ENDPOINTS = {
  TICKETS: "/api/contactUs/tickets",
  TICKET_BY_ID: withId("/api/contactUs/tickets"),
  MESSAGES: withIdSuffix("/api/contactUs/tickets", "messages"),
};

export const SOCIAL_ENDPOINTS = {
  STATUS: "/api/social/status",
  POST: "/api/social/post",
  FACEBOOK_STATUS: "/api/social/facebook/status",
};

export const HAGE_ENDPOINTS = {
  CHAT: "/api/hage/chat",
};

export const GEO_ENDPOINTS = {
  REGIONS: "/api/locations/regions",
  CITIES: "/api/locations/cities",
};

export const VISITOR_ENDPOINTS = {
  TRACK: "/api/visitors/track-user",
};
