const BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api.karaadi.com';

const e = (path: string) => `${BASE}${path}`;
const eid = (base: string, id: string | number) => `${BASE}${base}/${id}`;

export const AUTH_ENDPOINTS = {
  LOGIN: e('/api/users/auth'),
  REGISTER: e('/api/users/register'),
  LOGOUT: e('/api/users/logout'),
  CONFIRM: e('/api/users/confirm'),
  RESEND_CODE: e('/api/users/resend-code'),
  FORGOT_PASSWORD: e('/api/users/forgot-password'),
  RESET_PASSWORD: e('/api/users/reset-password'),
  VERIFY_SESSION: e('/api/users/verify-session'),
  REFRESH_TOKEN: e('/api/users/refreshtoken'),
  PROFILE: e('/api/users/profile'),
  UPDATE_PROFILE_IMAGE: e('/api/users/profile/image'),
  UPDATE_USERNAME: e('/api/users/profile/username'),
  UPDATE_PHONE: e('/api/users/profile/phone'),
  DELETE_ACCOUNT: e('/api/users/delete-account'),
  GET_BY_ID: (id: string) => eid('/api/users', id),
};

export const CARS_ENDPOINTS = {
  LIST: e('/api/cars'),
  BY_ID: (id: string) => eid('/api/cars', id),
  CREATE: e('/api/cars'),
  UPDATE: (id: string) => eid('/api/cars', id),
  DELETE: (id: string) => eid('/api/cars', id),
};

export const BOATS_ENDPOINTS = {
  LIST: e('/api/boats'),
  BY_ID: (id: string) => eid('/api/boats', id),
  CREATE: e('/api/boats'),
  UPDATE: (id: string) => eid('/api/boats', id),
  DELETE: (id: string) => eid('/api/boats', id),
};

export const MOTORCYCLES_ENDPOINTS = {
  LIST: e('/api/motorcycles'),
  BY_ID: (id: string) => eid('/api/motorcycles', id),
  CREATE: e('/api/motorcycles'),
  UPDATE: (id: string) => eid('/api/motorcycles', id),
  DELETE: (id: string) => eid('/api/motorcycles', id),
};

export const REAL_ESTATE_ENDPOINTS = {
  LIST: e('/api/real-estate'),
  BY_ID: (id: string) => eid('/api/real-estate', id),
  CREATE: e('/api/real-estate'),
  UPDATE: (id: string) => eid('/api/real-estate', id),
  DELETE: (id: string) => eid('/api/real-estate', id),
};

export const FARM_EQUIPMENT_ENDPOINTS = {
  LIST: e('/api/traktor'),
  BY_ID: (id: string) => eid('/api/traktor', id),
  CREATE: e('/api/traktor'),
  UPDATE: (id: string) => eid('/api/traktor', id),
  DELETE: (id: string) => eid('/api/traktor', id),
};

export const MARKETPLACE_ENDPOINTS = {
  LIST: e('/api/marketplace'),
  BY_ID: (id: string) => eid('/api/marketplace', id),
  CREATE: e('/api/marketplace'),
  UPDATE: (id: string) => eid('/api/marketplace', id),
  DELETE: (id: string) => eid('/api/marketplace', id),
};

export const JOBS_ENDPOINTS = {
  LIST: e('/api/jobs'),
  BY_ID: (id: string) => eid('/api/jobs', id),
  CREATE: e('/api/jobs'),
  UPDATE: (id: string) => eid('/api/jobs', id),
  DELETE: (id: string) => eid('/api/jobs', id),
};

export const ITEMS_ENDPOINTS = {
  LIST: e('/api/items'),
  BY_ID: (id: string) => eid('/api/items', id),
  CREATE: e('/api/items'),
  UPDATE: (id: string) => eid('/api/items', id),
  DELETE: (id: string) => eid('/api/items', id),
};

export const FAVORITES_ENDPOINTS = {
  LIST: e('/api/favorites'),
  ADD: e('/api/favorites'),
  REMOVE: (id: string) => eid('/api/favorites', id),
  CHECK: (listingId: string, type: string) =>
    e(`/api/favorites/check?listingId=${listingId}&type=${type}`),
};

export const MESSAGES_ENDPOINTS = {
  CONVERSATIONS: e('/api/messages/conversations'),
  CONVERSATION: (userId: string) => eid('/api/messages/conversation', userId),
  SEND: e('/api/messages'),
  UNREAD_COUNT: e('/api/messages/unread-count'),
};

export const NOTIFICATIONS_ENDPOINTS = {
  LIST: e('/api/notifications'),
  MARK_READ: (id: string) => eid('/api/notifications/read', id),
  MARK_ALL_READ: e('/api/notifications/read-all'),
  UNREAD_COUNT: e('/api/notifications/unread-count'),
};

export const SEARCH_ENDPOINTS = {
  GLOBAL: e('/api/search'),
  SEMANTIC: e('/api/search/semantic'),
};

export const MY_ADS_ENDPOINTS = {
  LIST: e('/api/listings/mine'),
  DELETE: (id: string, type: string) =>
    e(`/api/listings/${id}?type=${type}`),
};

export const BUSINESSES_ENDPOINTS = {
  LIST: e('/api/businesses'),
  BY_ID: (id: string) => eid('/api/businesses', id),
  MY_BUSINESS: e('/api/businesses/mine'),
};

export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: e('/api/Fee/sub-plans'),
  MY_SUBSCRIPTION: e('/api/subscription/mine'),
  SUBSCRIBE: e('/api/subscription'),
};

export const REVIEWS_ENDPOINTS = {
  BY_USER: (userId: string) => e(`/api/reviews/user/${userId}`),
  CREATE: e('/api/reviews'),
};

export const UPLOAD_ENDPOINTS = {
  IMAGE: e('/api/upload/image'),
  IMAGES: e('/api/upload/images'),
};

export const FEED_ENDPOINTS = {
  FEED: e('/api/feed'),
  RECOMMENDATIONS: e('/api/recommendations'),
};

export const WANTED_ENDPOINTS = {
  LIST: e('/api/wanted'),
  BY_ID: (id: string) => eid('/api/wanted', id),
  CREATE: e('/api/wanted'),
};
