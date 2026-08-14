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
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE_IMAGE: '/api/users/profile/image',
  UPDATE_USERNAME: '/api/users/profile/username',
  UPDATE_PHONE: '/api/users/profile/phone',
  UPDATE_PHONE_VISIBILITY: '/api/users/profile/phone-visibility',
  UPDATE_PUSH_TOKEN: '/api/users/profile/push-token',
  DELETE_ACCOUNT: '/api/users/delete-account',
  GET_BY_ID: (id: string) => `/api/users/${id}`,
};

export const FAVORITES_ENDPOINTS = {
  LIST: '/api/favorites/my',
  ADD: '/api/favorites',
  REMOVE: (id: string) => `/api/favorites/${id}`,
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

export const SUPPORT_ENDPOINTS = {
  TICKETS: '/api/contactUs/tickets',
  TICKET_BY_ID: (ticketId: number | string) => `/api/contactUs/tickets/${ticketId}`,
  MESSAGES: (ticketId: number | string) => `/api/contactUs/tickets/${ticketId}/messages`,
};

export const NOTIFICATIONS_ENDPOINTS = {
  LIST: (userId: string) => `/api/notifications/user/${userId}`,
  MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  MARK_ALL_READ: (userId: string) => `/api/notifications/user/${userId}/read-all`,
  STATS: (userId: string) => `/api/notifications/user/${userId}/stats`,
  CLEAR_ALL: (userId: string) => `/api/notifications/user/${userId}/clear-all`,
  DELETE: (id: string) => `/api/notifications/${id}`,
};

export const SEARCH_ENDPOINTS = {
  GLOBAL: '/api/search',
  SEMANTIC: '/api/search/semantic',
};

export const MY_ADS_ENDPOINTS = {
  LIST: '/api/listings/my-ads',
  DELETE: (id: string) => `/api/listings/delete/${id}`,
};

export const BUSINESSES_ENDPOINTS = {
  LIST: '/api/businesses',
  BY_ID: (id: string) => `/api/businesses/${id}`,
  MY: '/api/businesses/my',
  CREATE: '/api/businesses',
  UPDATE: (id: string) => `/api/businesses/${id}`,
  DELETE: (id: string) => `/api/businesses/${id}`,
};

export const BUSINESS_PLAN_ENDPOINTS = {
  PLANS: '/api/business-plans',
  SELECT_PLAN: (id: string) => `/api/businesses/${id}/select-plan`,
  EXTEND_PLAN: (id: string) => `/api/businesses/${id}/extend-plan`,
};

export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: '/api/Fee/sub-plans',
  MY: '/api/subscription/my',
  SUBSCRIBE: '/api/subscription',
  BY_ID: (id: string) => `/api/subscription/${id}`,
};

export const PAYMENT_ENDPOINTS = {
  ME:               '/api/payments/me',
  MOBILE_INITIATE:  '/api/payments/mobile/initiate',
  MOBILE_STATUS:    (ref: string) => `/api/payments/mobile/status/${ref}`,
  WAAFI_INITIATE:   '/api/payments/waafi/initiate',
  WAAFI_STATUS:     (ref: string) => `/api/payments/waafi/status/${ref}`,
  AD_PATCH:         (id: string)  => `/api/listings/${id}`,
  CREATE:           '/api/payments',
  ACTIVATE:         (category: string, id: string) => `/api/${category}/${id}/payment`,
};

export const SEARCH_HISTORY_ENDPOINTS = {
  LIST: '/api/history-search',
  LOG: '/api/history-search/log',
  DELETE: (id: string) => `/api/history-search/${id}`,
};

export const REVIEWS_ENDPOINTS = {
  BY_USER: (userId: string) => `/api/reviews/user/${userId}`,
  CREATE: '/api/reviews',
};

export const IMAGE_ENDPOINTS = {
  UPLOAD: '/api/images/upload',
};

export const FEED_ENDPOINTS = {
  FEED: '/api/feed',
  GROUP: (group: 'fast' | 'slow', page = 1, pageSize = 100) =>
    `/api/feed?group=${group}&page=${page}&pageSize=${pageSize}`,
  RECOMMENDATIONS: '/api/recommendations',
};

export const HAGE_ENDPOINTS = {
  CHAT: '/api/hage/chat',
};

export const SOCIAL_ENDPOINTS = {
  STATUS:          '/api/social/status',
  POST:            '/api/social/post',
  FACEBOOK_STATUS: '/api/social/facebook/status',
};

export const REPORT_ENDPOINTS = {
  CREATE: '/api/reports',
};

export const BLOCK_ENDPOINTS = {
  BLOCK:   (userId: string) => `/api/users/${userId}/block`,
  UNBLOCK: (userId: string) => `/api/users/${userId}/unblock`,
  LIST:    '/api/users/blocked',
};

export const SECURITY_ENDPOINTS = {
  SESSIONS: '/api/users/sessions',
  SESSION_LOGOUT: (id: string) => `/api/users/sessions/${id}/logout`,
  SESSIONS_LOGOUT_ALL: '/api/users/sessions/logout-all',
  LOGIN_HISTORY: '/api/users/login-history',
  LOGIN_HISTORY_DELETE: (id: number) => `/api/users/login-history/${id}`,
};

export const GEO_ENDPOINTS = {
  REGIONS: '/api/locations/regions',
  CITIES: '/api/locations/cities',
};

export const FEE_ENDPOINTS = {
  BASE: '/api/Fee',
};

export const IDENTIFICATION_ENDPOINTS = {
  STATUS: '/api/identification/status',
  SUBMIT: '/api/identification/submit',
};
