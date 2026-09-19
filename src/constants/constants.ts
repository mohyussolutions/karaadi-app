import { Image, type ViewStyle } from 'react-native';
import type { PaymentMethod, PaymentStatus, PaymentMethodOption } from '../util/types/new-ad.types';
import type { Language } from '../util/types/navigation.types';

export type { PaymentMethod, PaymentStatus, PaymentMethodOption };

const NO_IMAGE_URI = Image.resolveAssetSource(require('../../assets/icon.png')).uri;

export const PLACEHOLDER_IMAGE = NO_IMAGE_URI;

export const PLACEHOLDER = NO_IMAGE_URI;

export const INITIAL_DISPLAY = 50;
export const DISPLAY_INCREMENT = 20;
export const INITIAL_COUNT = 52;
export const INCREMENT = 20;
export const MAX_COUNT = 120;
export const LISTING_PAGE_SIZE = 12;
export const CATEGORY_FEED_LIMIT = 200;

export const BADGE_MAX_COUNT = 9;
export const BADGE_MAX_LABEL = '9+';

export const SITE_URL = 'https://karaadi.com';

export const DETAIL_PLACEHOLDER = NO_IMAGE_URI;

export const DESCRIPTION_TRUNCATE = 300;

export const FEED_BASE_PATH = '/api/feed';

export const FEED_GROUPS = {
  FAST: 'fast',
  SLOW: 'slow',
} as const;

export type FeedGroup = (typeof FEED_GROUPS)[keyof typeof FEED_GROUPS];

export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_PAGE_SIZE = 100;
export const FEED_MAX_ITEMS = 2000;

export const INITIAL_VISIBLE = 80;
export const READ_MORE_STEP = 40;
export const EAGER_PREFETCH_COUNT = 20;

export const FAVORITES_LIST_LIMIT = 200;
export const HAGE_SEARCH_LIMIT = 5;
export const SUBSCRIPTION_MATCH_LIMIT = 10;
export const RECOMMENDED_LIMIT = 10;

export const FEED_FALLBACK_LIMIT = {
  LARGE: 4,
  SMALL: 2,
} as const;

export const ALERTS_LAST_CHECKED_KEY = 'karaadi_alerts_last_checked_v1';
export const ALERTS_SEEN_IDS_KEY = 'karaadi_alerts_seen_ids_v1';
export const ALERTS_SEEN_IDS_MAX = 500;
export const ALERTS_MIN_CHECK_INTERVAL_MS = 5 * 60 * 1000;
export const ALERTS_POLL_INTERVAL_MS = 5 * 60 * 1000;
export const MESSAGE_DEDUPE_MAX = 200;

export const MIN_TITLE_LENGTH = 2;
export const MAX_TITLE_LENGTH = 200;
export const MAX_SHORT_TEXT_LENGTH = 100;
export const MAX_ADDRESS_LENGTH = 500;
export const MIN_DESCRIPTION_LENGTH = 5;
export const MAX_TEXTAREA_LENGTH = 5000;
export const MAX_PRICE = 100_000_000;
export const MIN_IMAGES_REQUIRED = 2;
export const IMAGE_MAX_COUNT = 10;
export const IMAGE_MAX_DATA_URI_LENGTH = 7_000_000;
export const IMAGE_COMPRESSION_STEPS = [
  { maxDimension: 1600, quality: 0.75 },
  { maxDimension: 1280, quality: 0.6 },
  { maxDimension: 1024, quality: 0.5 },
] as const;
export const WEBSITE_MAX_LENGTH = 200;
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const H_PAD = 12;
export const GAP = 8;
export const GRID_GAP = 6;
export const COL_GAP = 8;
export const IMG_H = 320;

export const TOP_ITEMS_DAYS = 90;
export const DAY_MS = 24 * 60 * 60 * 1000;

export const FILTER_KIND_REGION = 'region';
export const FILTER_KIND_CITY = 'city';

export const REQUEST_TIMEOUT_MS = 20000;
export const UPLOAD_TIMEOUT_MS = 120000;
export const RETRY_MAX_ATTEMPTS = 2;
export const RETRY_BASE_DELAY_MS = 500;
export const RETRY_MAX_DELAY_MS = 8000;
export const RETRY_STATUS_CODES = [429, 502, 503, 504];

export const SOCKET_RECONNECT_ATTEMPTS = 10;
export const SOCKET_RECONNECT_DELAY_MS = 1000;
export const SOCKET_RECONNECT_DELAY_MAX_MS = 30000;
export const SOCKET_RECONNECT_JITTER = 0.5;

export const AUTH_TOKEN_KEY = 'karaadi_token';
export const AUTH_USER_KEY = 'karaadi_user';

export const CONTENT_TYPE_HEADER = 'Content-Type';
export const JSON_CONTENT_TYPE = 'application/json';
export const AUTHORIZATION_HEADER = 'Authorization';
export const AUTH_TOKEN_HEADER = 'x-auth-token';
export const BEARER_PREFIX = 'Bearer ';

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { key: 'waafi',  label: 'Waafi',    sublabel: 'Hormuud (+252 61)',  prefix: '61', color: '#1A6FB0' },
  { key: 'evc',    label: 'EVC Plus', sublabel: 'Hormuud (+252 61)',  prefix: '61', color: '#E53935' },
  { key: 'zaad',   label: 'Zaad',     sublabel: 'Telesom (+252 63)',  prefix: '63', color: '#1976D2' },
  { key: 'sahal',  label: 'Sahal',    sublabel: 'Somtel (+252 90)',   prefix: '90', color: '#388E3C' },
];

export const MAX_POLL_ATTEMPTS = 30;
export const POLL_INTERVAL_MS  = 3000;

export const ACTIVATE_RETRY_ATTEMPTS = 3;
export const ACTIVATE_RETRY_DELAY_MS = 1500;

export const PHONE_REGEX = /^(\+?252|0)?(61|63|90)\d{7}$/;
export const PHONE_ERROR  = 'Enter a valid Somali number: 061XXXXXXX, +252 61XXXXXXX (EVC/Waafi), 063XXXXXXX (Zaad), 090XXXXXXX (Sahal)';

export const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
export const CHAT_RE = /^\/profile\/chat/;
export const DETAIL_RE = /^\/listing/;
export const TAB_PATHS = new Set(['/home', '/messages', '/profile', '/new-ad', '/businesses', '/notifications']);

export const LANGS: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'so', label: 'Soomaali' },
];

export const ROUTES = {
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgotPassword: '/(auth)/forgot-password',
  resetPassword: '/(auth)/reset-password',
  confirmCode: '/(auth)/confirm',
  home: '/(tabs)/home',
  newAd: '/(tabs)/new-ad',
  messages: '/(tabs)/messages',
  chat: '/profile/chat',
  favorites: '/profile/favorites',
  contactHistory: '/profile/contact-history',
  notifications: '/profile/notifications',
  businessCreate: '/profile/business-create',
  tutorials: '/profile/tutorials',
  vehicleDetail: '/listing/vehicle/[id]',
  itemDetail: '/listing/item-detail/[id]',
  realEstateDetail: '/listing/real-estate/[id]',
  jobDetail: '/listing/job/[id]',
  subscriptionDetail: '/listing/subscription/[id]',
  report: '/listing/report/[id]',
  browseCategory: '/browse/[category]',
  browseSubcategory: '/browse/[category]/[subcategory]',
} as const;

export const REGEX_HTTP_URL = /^https?:\/\//;
export const REGEX_URL_STRIP_PROTOCOL = /^https?:\/\/(www\.)?/i;
export const REGEX_WWW_PREFIX = /^www\./i;
export const REGEX_DOMAIN_CHARS = /[^a-zA-Z0-9.\-]/g;
export const REGEX_LINK_IN_TEXT = /https?:\/\/|www\./i;
export const REGEX_WHITESPACE = /\s/g;
export const REGEX_NON_DIGITS = /[^0-9]/g;
export const REGEX_HTML_TAGS = /<[^>]*>/g;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const REGEX_MONGO_ID = /^[0-9a-f]{24}$/i;
export const REGEX_DATA_IMAGE = /^data:image\//;
export const REGEX_BASE64_LONG = /^[A-Za-z0-9+/=]{100,}$/;
export const REGEX_PASSWORD_LOWERCASE = /[a-z]/;
export const REGEX_PASSWORD_UPPERCASE = /[A-Z]/;
export const REGEX_PASSWORD_DIGIT = /[0-9]/;
export const REGEX_PASSWORD_SPECIAL = /[@$!%*?&#_\-]/;
export const REGEX_SOMALI_PHONE_FULL = /^\+252\d{9}$/;
export const REGEX_SOMALI_PHONE_LOCAL = /^[69]\d{8}$/;
export const REGEX_ALPHANUMERIC_ID = /^[a-zA-Z0-9]+$/;
export const REGEX_WEBSITE = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
export const REGEX_USERNAME = /^[a-zA-Z0-9_.]+$/;
export const REGEX_PHONE_INPUT_FILTER = /[^0-9+\-()\s]/g;
export const REGEX_PHONE_CLEAN = /[\s\-()]/g;
export const REGEX_NUMBER_INPUT_FILTER = /[^0-9.]/g;
export const REGEX_DIGITS = /\d+/g;
export const REGEX_SOMALI_COUNTRY_CODE = /^\+?252/;
export const REGEX_LEADING_ZERO = /^0/;
export const REGEX_TRAILING_SLASH = /\/$/;
export const REGEX_CONFIRMATION_CODE = /^\d{6}$/;
export const REGEX_YEAR = /^\d{4}$/;

export const BP_SMALL = 400;
export const BP_TABLET = 768;
export const BOTTOM_PAD = 120;
export const TAB_SIDE_SM = 12;
export const TAB_SIDE_MD = 24;
export const FAB_SIZE = 56;

export const TABLET_HEADER_ICON_SIZES = {
  back: 34,
  notif: 30,
  langChevron: 18,
  search: 20,
  searchClear: 20,
};

export const TABLET_LANG_DROPDOWN_TOP_OFFSET = 68;

export const TABLET_MODAL_ICON_SIZES = {
  zoomClose: 26,
  videoClose: 26,
  filterClose: 24,
  filterCheckbox: 24,
  filterPin: 22,
  filterSearch: 22,
  filterClear: 20,
  shareIcon: 32,
};

export const GLASS_LIGHT: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.82)",
  borderColor: "rgba(0,0,0,0.08)",
};

export const GLASS_DARK: ViewStyle = {
  backgroundColor: "rgba(15,22,42,0.90)",
  borderColor: "rgba(255,255,255,0.10)",
};

export const FAVORITES_H_PAD = 16;
export const FAVORITES_COL_GAP = 12;
