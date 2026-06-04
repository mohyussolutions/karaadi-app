export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://karaadi.onrender.com').replace(/\/$/, '');


export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200/e5e7eb/9ca3af?text=No+Image';

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/users/auth',
  REGISTER: '/api/users/register',
  LOGOUT: '/api/users/logout',
  CONFIRM: '/api/users/confirm',
  RESEND_CODE: '/api/users/resend-code',
  FORGOT_PASSWORD: '/api/users/forgot-password',
  RESET_PASSWORD: '/api/users/reset-password',
  VERIFY_SESSION: '/api/users/verify-session',
  REFRESH_TOKEN: '/api/users/refreshtoken',
  PROFILE: '/api/users/me',
  UPDATE_PROFILE_IMAGE: '/api/users/profile/image',
  UPDATE_USERNAME: '/api/users/profile/username',
  UPDATE_PHONE: '/api/users/profile/phone',
  DELETE_ACCOUNT: '/api/users/delete-account',
  GET_BY_ID: (id: string) => `/api/users/${id}`,
};

export const CARS_ENDPOINTS = {
  LIST: '/api/cars',
  BY_ID: (id: string) => `/api/cars/${id}`,
  CREATE: '/api/cars',
  UPDATE: (id: string) => `/api/cars/${id}`,
  DELETE: (id: string) => `/api/cars/${id}`,
};

export const BOATS_ENDPOINTS = {
  LIST: '/api/boats',
  BY_ID: (id: string) => `/api/boats/${id}`,
  CREATE: '/api/boats',
  UPDATE: (id: string) => `/api/boats/${id}`,
  DELETE: (id: string) => `/api/boats/${id}`,
};

export const MOTORCYCLES_ENDPOINTS = {
  LIST: '/api/motorcycles',
  BY_ID: (id: string) => `/api/motorcycles/${id}`,
  CREATE: '/api/motorcycles',
  UPDATE: (id: string) => `/api/motorcycles/${id}`,
  DELETE: (id: string) => `/api/motorcycles/${id}`,
};

export const REAL_ESTATE_ENDPOINTS = {
  LIST: '/api/real-estate',
  BY_ID: (id: string) => `/api/real-estate/${id}`,
  CREATE: '/api/real-estate',
  UPDATE: (id: string) => `/api/real-estate/${id}`,
  DELETE: (id: string) => `/api/real-estate/${id}`,
};

export const FARM_EQUIPMENT_ENDPOINTS = {
  LIST: '/api/traktor',
  BY_ID: (id: string) => `/api/traktor/${id}`,
  CREATE: '/api/traktor',
  UPDATE: (id: string) => `/api/traktor/${id}`,
  DELETE: (id: string) => `/api/traktor/${id}`,
};

export const MARKETPLACE_ENDPOINTS = {
  LIST: '/api/marketplace',
  BY_ID: (id: string) => `/api/marketplace/${id}`,
  CREATE: '/api/marketplace',
  UPDATE: (id: string) => `/api/marketplace/${id}`,
  DELETE: (id: string) => `/api/marketplace/${id}`,
};

export const JOBS_ENDPOINTS = {
  LIST: '/api/jobs',
  BY_ID: (id: string) => `/api/jobs/${id}`,
  CREATE: '/api/jobs',
  UPDATE: (id: string) => `/api/jobs/${id}`,
  DELETE: (id: string) => `/api/jobs/${id}`,
};

export const ITEMS_ENDPOINTS = {
  LIST: '/api/items',
  BY_ID: (id: string) => `/api/items/${id}`,
  CREATE: '/api/items',
  UPDATE: (id: string) => `/api/items/${id}`,
  DELETE: (id: string) => `/api/items/${id}`,
};

export const FAVORITES_ENDPOINTS = {
  LIST: '/api/favorites',
  ADD: '/api/favorites',
  REMOVE: (id: string) => `/api/favorites/${id}`,
  CHECK: (listingId: string, type: string) => `/api/favorites/check?listingId=${listingId}&type=${type}`,
};

export const CHATS_ENDPOINTS = {
  MY_CHATS: (userId: string) => `/api/chats/user/${userId}`,
  CREATE: '/api/chats/create',
  FIND: '/api/chats/conversation/find',
  BY_ID: (chatId: number) => `/api/chats/${chatId}`,
  MESSAGES: (chatId: number) => `/api/chats/${chatId}/messages`,
};

export const MESSAGES_ENDPOINTS = {
  SEND: '/api/messages/send',
  UNREAD_COUNT: (userId: string) => `/api/messages/unread/${userId}`,
};

export const NOTIFICATIONS_ENDPOINTS = {
  LIST: '/api/notifications',
  MARK_READ: (id: string) => `/api/notifications/read/${id}`,
  MARK_ALL_READ: '/api/notifications/read-all',
  UNREAD_COUNT: '/api/notifications/unread-count',
};

export const SEARCH_ENDPOINTS = {
  GLOBAL: '/api/search',
  SEMANTIC: '/api/search/semantic',
};

export const MY_ADS_ENDPOINTS = {
  LIST: '/api/listings/mine',
  DELETE: (id: string, type: string) => `/api/listings/${id}?type=${type}`,
};

export const BUSINESSES_ENDPOINTS = {
  LIST: '/api/businesses',
  BY_ID: (id: string) => `/api/businesses/${id}`,
  MY_BUSINESS: '/api/businesses/mine',
};

export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: '/api/Fee/sub-plans',
  MY_SUBSCRIPTION: '/api/subscription/mine',
  SUBSCRIBE: '/api/subscription',
  BY_ID: (id: string) => `/api/subscription/${id}`,
};

export const SEARCH_HISTORY_ENDPOINTS = {
  LIST: '/api/history-search',
  DELETE: (id: string) => `/api/history-search/${id}`,
};

export const REVIEWS_ENDPOINTS = {
  BY_USER: (userId: string) => `/api/reviews/user/${userId}`,
  CREATE: '/api/reviews',
};

export const UPLOAD_ENDPOINTS = {
  IMAGE: '/api/upload/image',
  IMAGES: '/api/upload/images',
};

export const FEED_ENDPOINTS = {
  FEED: '/api/feed',
  RECOMMENDATIONS: '/api/recommendations',
};

export const WANTED_ENDPOINTS = {
  LIST: '/api/wanted',
  BY_ID: (id: string) => `/api/wanted/${id}`,
  CREATE: '/api/wanted',
};

export const HAGE_ENDPOINTS = {
  CHAT: '/api/hage/chat',
};
