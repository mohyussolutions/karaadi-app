import { Image, type ViewStyle } from 'react-native';
import type { PaymentMethod, PaymentStatus, PaymentMethodOption } from '../util/types/new-ad.types';
import type { Language } from '../util/types/navigation.types';
import type { CategorySpecField, CategoryTypeConfig } from '../util/types/listing.types';
import type { NestedSubCategory, SubCategory, MainCategory } from '../util/types/browse.types';
import type { RouteBuilder } from '../util/types/common.types';
import { CAT_COLORS } from '../util/colors/colors';
import { formatDate } from '../util/helpers/ui.format';
import { CAT_PATHS } from '../api/paths';
import { MARKETPLACE_ENDPOINTS, REAL_ESTATE_ENDPOINTS, JOBS_ENDPOINTS } from '../api/endpoints';

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

export const INITIAL_VISIBLE = 20;
export const FEED_REVEAL_STEPS = [40, 20] as const;
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
  myAdManage: '/profile/my-ads/[id]',
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

export type { NestedSubCategory, SubCategory, MainCategory };
export { CAT_COLORS };

export const PRIORITY_CONFIG = {
  PREMIUM:  { label: 'PREMIUM' },
  STANDARD: { label: 'STANDARD' },
  BASIC:    { label: 'BASIC' },
} as const;

export const GRID_CONFIG = {
  PAGE_SIZE:      20,
  INITIAL_PAGE:   1,
  INITIAL_LOAD:   60,
  ITEMS_PER_LOAD: 10,
  MAX_ITEMS:      120,
  MAX_LOADS:      3,
} as const;

export const OPTION = {
  Public:  'Public',
  Private: 'Private',
} as const;

export const TOAST_TIMINGS = {
  FADE_IN: 250,
  DISPLAY: 2200,
  FADE_OUT: 300,
} as const;

export const LANGUAGES: Language[] = [
  { code: 'so', label: 'SOMALI' },
  { code: 'en', label: 'ENGLISH' },
];

export const SOCKET_EVENTS = {
  EMIT: {
    JOIN_CHAT:                  'joinChat',
    LEAVE_CHAT:                 'leaveChat',
    SEND_MESSAGE:               'sendMessage',
    TYPING:                     'typing',
    MARK_AS_READ:               'markAsRead',
    MARK_MULTIPLE_AS_READ:      'markMultipleAsRead',
    GET_ONLINE_STATUS:          'getOnlineStatus',
    SUBSCRIBE_NOTIFICATION:     'subscribeNotification',
    UNSUBSCRIBE_NOTIFICATION:   'unsubscribeNotification',
  },
  ON: {
    CHAT_HISTORY:               'chatHistory',
    RECEIVE_MESSAGE:            'receiveMessage',
    NEW_MESSAGE:                'newMessage',
    MESSAGE_SENT:                'messageSent',
    USER_TYPING:                'userTyping',
    MESSAGE_READ:                'messageRead',
    MESSAGES_READ:              'messagesRead',
    MESSAGES_MARKED_AS_READ:    'messagesMarkedAsRead',
    ONLINE_STATUS:              'onlineStatus',
    UNREAD_COUNT_UPDATE:        'unreadCountUpdate',
    SEND_MESSAGE_ERROR:         'sendMessageError',
    CHAT_ERROR:                 'chatError',
    ERROR:                      'error',
    MESSAGE_DELETED:            'messageDeleted',
    MESSAGE_UPDATED:            'messageUpdated',
  },
} as const;

export const getListingShareUrl = (listingId: string) => `${SITE_URL}/listing/${listingId}`;

export const placeholderAvatar = (size: number, bgColor: string, text: string) =>
  `https://placehold.co/${size}x${size}/${bgColor}/ffffff?text=${encodeURIComponent(text)}`;

export const SOCIAL_SHARE_URLS = {
  whatsappApp: (text: string) => `whatsapp://send?text=${encodeURIComponent(text)}`,
  whatsappWeb: (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`,
  facebook: (text: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`,
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/profile.php?id=61591596954242',
  TIKTOK: 'https://www.tiktok.com/@karaadi_',
  DEVELOPER: 'https://www.mohyus.com/',
} as const;

export const SOCIAL_LINK_BUILDERS = {
  whatsapp: (value: string) => `https://wa.me/${value.replace(REGEX_NON_DIGITS, '')}`,
  facebook: (value: string) => (value.startsWith('http') ? value : `https://facebook.com/${value}`),
  instagram: (value: string) => (value.startsWith('http') ? value : `https://instagram.com/${value}`),
  tiktok: (value: string) => (value.startsWith('http') ? value : `https://tiktok.com/@${value}`),
  website: (value: string) => (value.startsWith('http') ? value : `https://${value}`),
} as const;

export const SOCIAL_BRAND_COLORS = {
  whatsapp: { color: '#25D366', bg: '#E9FBF0' },
  facebook: { color: '#1877F2', bg: '#E7F0FF' },
  instagram: { color: '#E1306C' },
  tiktok: { color: '#010101', bg: '#F0F0F0' },
} as const;

const OTHER: NestedSubCategory = {
  key: "other",
  labelKey: "common.other",
  icon: "dots-horizontal-circle-outline",
};

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    key: "Marketplace",
    name: "Marketplace",
    icon: "sofa-outline",
    color: CAT_COLORS.marketplace,
    apiPath: CAT_PATHS.marketplace,
    subCategories: [
      {
        key: "antiques",
        name: "Antiques & Art",
        icon: "palette",
        nested: [
          {
            key: "bowls",
            labelKey: "subcategories.marketplaceNested.antiques.bowls",
            icon: "bowl",
          },
          {
            key: "parts",
            labelKey: "subcategories.marketplaceNested.antiques.parts",
            icon: "puzzle-outline",
          },
          {
            key: "coffeeService",
            labelKey: "subcategories.marketplaceNested.antiques.coffeeService",
            icon: "coffee-outline",
          },
          {
            key: "porcelain",
            labelKey: "subcategories.marketplaceNested.antiques.porcelain",
            icon: "cup",
          },
          {
            key: "vintage",
            labelKey: "subcategories.marketplaceNested.antiques.vintage",
            icon: "clock-time-four-outline",
          },
          OTHER,
        ],
      },
      {
        key: "electronics",
        name: "Electronics",
        icon: "television",
        nested: [
          {
            key: "mobilePhones",
            labelKey:
              "subcategories.marketplaceNested.electronics.mobilePhones",
            icon: "cellphone",
          },
          {
            key: "laptopsComputers",
            labelKey:
              "subcategories.marketplaceNested.electronics.laptopsComputers",
            icon: "laptop",
          },
          {
            key: "tvsAccessories",
            labelKey:
              "subcategories.marketplaceNested.electronics.tvsAccessories",
            icon: "television",
          },
          {
            key: "camerasPhotography",
            labelKey:
              "subcategories.marketplaceNested.electronics.camerasPhotography",
            icon: "camera-outline",
          },
          {
            key: "homeAppliances",
            labelKey:
              "subcategories.marketplaceNested.electronics.homeAppliances",
            icon: "washing-machine",
          },
          OTHER,
        ],
      },
      {
        key: "animalAndSupplies",
        name: "Animals & Supplies",
        icon: "paw-outline",
        nested: [
          {
            key: "camels",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.camels",
            icon: "paw",
          },
          {
            key: "goats",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.goats",
            icon: "paw-outline",
          },
          {
            key: "cattle",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.cattle",
            icon: "cow",
          },
          {
            key: "sheep",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.sheep",
            icon: "sheep",
          },
          {
            key: "horses",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.horses",
            icon: "horse-variant",
          },
          {
            key: "donkeys",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.donkeys",
            icon: "donkey",
          },
          {
            key: "poultry",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.poultry",
            icon: "turkey",
          },
          {
            key: "feed",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.feed",
            icon: "grain",
          },
          {
            key: "vetSupplies",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.vetSupplies",
            icon: "needle",
          },
          {
            key: "accessories",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.accessories",
            icon: "tag-outline",
          },
          OTHER,
        ],
      },
      {
        key: "sportsAndOutdoors",
        name: "Sports & Outdoors",
        icon: "soccer",
        nested: [
          {
            key: "gymEquipment",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.gymEquipment",
            icon: "dumbbell",
          },
          {
            key: "bicycles",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.bicycles",
            icon: "bicycle",
          },
          {
            key: "sportingGoods",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.sportingGoods",
            icon: "basketball",
          },
          {
            key: "campingGear",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.campingGear",
            icon: "tent",
          },
          {
            key: "toys",
            labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.toys",
            icon: "puzzle",
          },
          OTHER,
        ],
      },
      {
        key: "furniture",
        name: "Furniture",
        icon: "sofa-outline",
        nested: [
          {
            key: "sofasCouches",
            labelKey: "subcategories.marketplaceNested.furniture.sofasCouches",
            icon: "sofa-outline",
          },
          {
            key: "bedsMattresses",
            labelKey:
              "subcategories.marketplaceNested.furniture.bedsMattresses",
            icon: "bed-outline",
          },
          {
            key: "tablesDesks",
            labelKey: "subcategories.marketplaceNested.furniture.tablesDesks",
            icon: "table-furniture",
          },
          {
            key: "kitchenFurnishings",
            labelKey:
              "subcategories.marketplaceNested.furniture.kitchenFurnishings",
            icon: "stove",
          },
          OTHER,
        ],
      },
      {
        key: "fashion",
        name: "Fashion",
        icon: "tshirt-crew-outline",
        nested: [
          {
            key: "mensClothing",
            labelKey: "subcategories.marketplaceNested.fashion.mensClothing",
            icon: "tshirt-crew-outline",
          },
          {
            key: "womensClothing",
            labelKey: "subcategories.marketplaceNested.fashion.womensClothing",
            icon: "hanger",
          },
          {
            key: "shoesFootwear",
            labelKey: "subcategories.marketplaceNested.fashion.shoesFootwear",
            icon: "shoe-heel",
          },
          {
            key: "bagsWallets",
            labelKey: "subcategories.marketplaceNested.fashion.bagsWallets",
            icon: "bag-personal-outline",
          },
          OTHER,
        ],
      },
      {
        key: "education",
        name: "Education",
        icon: "school-outline",
        nested: [
          {
            key: "books",
            labelKey: "subcategories.marketplaceNested.education.books",
            icon: "book-open-variant",
          },
          {
            key: "library",
            labelKey: "subcategories.marketplaceNested.education.library",
            icon: "library",
          },
          {
            key: "schoolSupplies",
            labelKey: "subcategories.marketplaceNested.education.schoolSupplies",
            icon: "pencil-box-outline",
          },
          {
            key: "stationery",
            labelKey: "subcategories.marketplaceNested.education.stationery",
            icon: "notebook-outline",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "RealEstate",
    name: "Real Estate",
    icon: "home-outline",
    color: CAT_COLORS.realEstate,
    apiPath: CAT_PATHS.realEstate,
    subCategories: [
      {
        key: "forRent",
        name: "For Rent",
        icon: "home-outline",
        nested: [
          {
            key: "apartmentFlat",
            labelKey: "subcategories.realEstateNested.forRent.apartmentFlat",
            icon: "office-building-outline",
          },
          {
            key: "houseVilla",
            labelKey: "subcategories.realEstateNested.forRent.houseVilla",
            icon: "home-outline",
          },
          {
            key: "commercialOffice",
            labelKey: "subcategories.realEstateNested.forRent.commercialOffice",
            icon: "store-outline",
          },
          {
            key: "warehouseStorage",
            labelKey: "subcategories.realEstateNested.forRent.warehouseStorage",
            icon: "warehouse",
          },
          {
            key: "singleRoom",
            labelKey: "subcategories.realEstateNested.forRent.singleRoom",
            icon: "door-open",
          },
          OTHER,
        ],
      },
      {
        key: "forSale",
        name: "For Sale",
        icon: "currency-usd",
        nested: [
          {
            key: "newHouseVilla",
            labelKey: "subcategories.realEstateNested.forSale.newHouseVilla",
            icon: "home-plus-outline",
          },
          {
            key: "usedHouseVilla",
            labelKey: "subcategories.realEstateNested.forSale.usedHouseVilla",
            icon: "home-outline",
          },
          {
            key: "apartmentFlatForSale",
            labelKey:
              "subcategories.realEstateNested.forSale.apartmentFlatForSale",
            icon: "office-building-outline",
          },
          {
            key: "completedBuilding",
            labelKey:
              "subcategories.realEstateNested.forSale.completedBuilding",
            icon: "office-building",
          },
          OTHER,
        ],
      },
      {
        key: "landForSale",
        name: "Land For Sale",
        icon: "terrain",
        nested: [
          {
            key: "residentialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.residentialLand",
            icon: "land-plots",
          },
          {
            key: "commercialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.commercialLand",
            icon: "store-outline",
          },
          {
            key: "industrialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.industrialLand",
            icon: "factory",
          },
          OTHER,
        ],
      },
      {
        key: "farmForSale",
        name: "Farms For Sale",
        icon: "barn",
        nested: [
          {
            key: "agriculturalLand",
            labelKey:
              "subcategories.realEstateNested.farmForSale.agriculturalLand",
            icon: "sprout-outline",
          },
          {
            key: "livestockFarm",
            labelKey:
              "subcategories.realEstateNested.farmForSale.livestockFarm",
            icon: "cow",
          },
          {
            key: "treeForestFarms",
            labelKey:
              "subcategories.realEstateNested.farmForSale.treeForestFarms",
            icon: "tree-outline",
          },
          OTHER,
        ],
      },
      {
        key: "commercial",
        name: "Commercial",
        icon: "office-building-outline",
        nested: [
          {
            key: "retailSpaceShop",
            labelKey:
              "subcategories.realEstateNested.commercial.retailSpaceShop",
            icon: "store-outline",
          },
          {
            key: "hotelGuesthouse",
            labelKey:
              "subcategories.realEstateNested.commercial.hotelGuesthouse",
            icon: "bed-outline",
          },
          {
            key: "commercialBuilding",
            labelKey:
              "subcategories.realEstateNested.commercial.commercialBuilding",
            icon: "office-building",
          },
          {
            key: "largeWarehouse",
            labelKey:
              "subcategories.realEstateNested.commercial.largeWarehouse",
            icon: "warehouse",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "Cars",
    name: "Cars",
    icon: "car-outline",
    color: CAT_COLORS.cars,
    apiPath: CAT_PATHS.cars,
    subCategories: [
      {
        key: "carsForSale",
        name: "Cars For Sale",
        icon: "car-side",
        nested: [
          {
            key: "sedan",
            labelKey: "subcategories.carsNested.carsForSale.sedan",
            icon: "car-outline",
          },
          {
            key: "suv",
            labelKey: "subcategories.carsNested.carsForSale.suv",
            icon: "car-sports",
          },
          {
            key: "hatchback",
            labelKey: "subcategories.carsNested.carsForSale.hatchback",
            icon: "car-outline",
          },
          {
            key: "convertible",
            labelKey: "subcategories.carsNested.carsForSale.convertible",
            icon: "car-convertible",
          },
          {
            key: "minivan",
            labelKey: "subcategories.carsNested.carsForSale.minivan",
            icon: "van-passenger",
          },
          OTHER,
        ],
      },
      {
        key: "leaseCars",
        name: "Lease Cars",
        icon: "car-key",
        nested: [
          {
            key: "sedanLease",
            labelKey: "subcategories.carsNested.lease.sedanLease",
            icon: "car-outline",
          },
          {
            key: "suvLease",
            labelKey: "subcategories.carsNested.lease.suvLease",
            icon: "car-sports",
          },
          {
            key: "vanMinibusLease",
            labelKey: "subcategories.carsNested.lease.vanMinibusLease",
            icon: "van-passenger",
          },
          {
            key: "truckPickupLease",
            labelKey: "subcategories.carsNested.lease.truckPickupLease",
            icon: "truck-outline",
          },
          {
            key: "otherLeaseVehicles",
            labelKey: "subcategories.carsNested.lease.otherLeaseVehicles",
            icon: "car-key",
          },
        ],
      },
      {
        key: "trailers",
        name: "Trailers",
        icon: "truck-trailer",
        nested: [
          {
            key: "trailerSpareParts",
            labelKey: "subcategories.carsNested.trailers.trailerSpareParts",
            icon: "wrench-outline",
          },
          {
            key: "heavyDutyTrailer",
            labelKey: "subcategories.carsNested.trailers.heavyDutyTrailer",
            icon: "truck-trailer",
          },
          {
            key: "otherTrailers",
            labelKey: "subcategories.carsNested.trailers.otherTrailers",
            icon: "dots-horizontal-circle-outline",
          },
        ],
      },
      {
        key: "carParts",
        name: "Car Parts",
        icon: "tools",
        nested: [
          {
            key: "engines",
            labelKey: "subcategories.carsNested.parts.engines",
            icon: "engine-outline",
          },
          {
            key: "tiresRims",
            labelKey: "subcategories.carsNested.parts.tiresRims",
            icon: "tire",
          },
          {
            key: "bodyParts",
            labelKey: "subcategories.carsNested.parts.bodyParts",
            icon: "car-wrench",
          },
          OTHER,
        ],
      },
      {
        key: "truck",
        name: "Trucks",
        icon: "truck",
        nested: [
          {
            key: "pickupTruck",
            labelKey: "subcategories.carsNested.trucks.pickupTruck",
            icon: "truck-outline",
          },
          {
            key: "heavyTruck",
            labelKey: "subcategories.carsNested.trucks.heavyTruck",
            icon: "truck",
          },
          {
            key: "truckSpareParts",
            labelKey: "subcategories.carsNested.trucks.truckSpareParts",
            icon: "wrench-outline",
          },
          {
            key: "flatbedTankTruck",
            labelKey: "subcategories.carsNested.trucks.flatbedTankTruck",
            icon: "tanker-truck",
          },
          {
            key: "otherTrucks",
            labelKey: "subcategories.carsNested.trucks.otherTrucks",
            icon: "dots-horizontal-circle-outline",
          },
        ],
      },
      {
        key: "electricCars",
        name: "Electric Cars",
        icon: "car-electric-outline",
        nested: [
          {
            key: "electricSedan",
            labelKey: "subcategories.carsNested.electric.electricSedan",
            icon: "car-electric-outline",
          },
          {
            key: "electricSUV",
            labelKey: "subcategories.carsNested.electric.electricSUV",
            icon: "car-electric-outline",
          },
          {
            key: "otherElectricCar",
            labelKey: "subcategories.carsNested.electric.otherElectricCar",
            icon: "car-key",
          },
        ],
      },
      {
        key: "buses",
        name: "Buses",
        icon: "bus",
        nested: [
          {
            key: "coachBuses",
            labelKey: "subcategories.carsNested.buses.coachBuses",
            icon: "bus-double-decker",
          },
          {
            key: "minibuses",
            labelKey: "subcategories.carsNested.buses.minibuses",
            icon: "van-passenger",
          },
          {
            key: "schoolBuses",
            labelKey: "subcategories.carsNested.buses.schoolBuses",
            icon: "bus-school",
          },
          {
            key: "cityBuses",
            labelKey: "subcategories.carsNested.buses.cityBuses",
            icon: "bus",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "Motorcycles",
    name: "Motorcycles",
    icon: "motorbike",
    color: CAT_COLORS.motorcycles,
    apiPath: CAT_PATHS.motorcycles,
    subCategories: [
      {
        key: "forSale",
        name: "For Sale",
        icon: "motorbike",
        nested: [
          {
            key: "motorcycle",
            labelKey: "subcategories.motorcyclesNested.forSale.motorcycle",
            icon: "motorbike",
          },
          {
            key: "vespa",
            labelKey: "subcategories.motorcyclesNested.forSale.vespa",
            icon: "motorbike",
          },
          {
            key: "bajaj",
            labelKey: "subcategories.motorcyclesNested.forSale.bajaj",
            icon: "motorbike",
          },
          {
            key: "sportBikes",
            labelKey: "subcategories.motorcyclesNested.forSale.sportBikes",
            icon: "bicycle",
          },
          {
            key: "cargo",
            labelKey: "subcategories.motorcyclesNested.forSale.cargo",
            icon: "truck-cargo-container",
          },
          OTHER,
        ],
      },
      {
        key: "forRent",
        name: "For Rent",
        icon: "car-key",
        nested: [
          {
            key: "motorcycleRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.motorcycleRental",
            icon: "motorbike",
          },
          {
            key: "vespaRental",
            labelKey: "subcategories.motorcyclesNested.forRent.vespaRental",
            icon: "motorbike",
          },
          {
            key: "cargoMotorcycleRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.cargoMotorcycleRental",
            icon: "truck-cargo-container",
          },
          {
            key: "bajajForRent",
            labelKey: "subcategories.motorcyclesNested.forRent.bajajForRent",
            icon: "motorbike",
          },
          {
            key: "cargoBajajRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.cargoBajajRental",
            icon: "truck-cargo-container",
          },
          {
            key: "dailyBajajRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.dailyBajajRental",
            icon: "motorbike",
          },
          OTHER,
        ],
      },
      {
        key: "spareParts",
        name: "Spare Parts",
        icon: "tools",
        nested: [
          {
            key: "motorcycleEngines",
            labelKey: "subcategories.motorcyclesNested.parts.motorcycleEngines",
            icon: "engine-outline",
          },
          {
            key: "tiresRims",
            labelKey: "subcategories.motorcyclesNested.parts.tiresRims",
            icon: "tire",
          },
          {
            key: "protectiveGear",
            labelKey: "subcategories.motorcyclesNested.parts.protectiveGear",
            icon: "shield-outline",
          },
          {
            key: "bajajEngines",
            labelKey: "subcategories.motorcyclesNested.parts.bajajEngines",
            icon: "engine-outline",
          },
          {
            key: "bajajBodyParts",
            labelKey: "subcategories.motorcyclesNested.parts.bajajBodyParts",
            icon: "wrench-outline",
          },
          OTHER,
        ],
      },
      {
        key: "other",
        name: "Other",
        icon: "toolbox-outline",
        nested: [
          {
            key: "miscellaneousEquipment",
            labelKey:
              "subcategories.motorcyclesNested.other.miscellaneousEquipment",
            icon: "toolbox-outline",
          },
        ],
      },
    ],
  },
  {
    key: "Boats",
    name: "Boats",
    icon: "sail-boat",
    color: CAT_COLORS.boats,
    apiPath: CAT_PATHS.boats,
    subCategories: [
      {
        key: "boatsForSale",
        name: "Boats For Sale",
        icon: "sail-boat",
        nested: [
          {
            key: "fishingBoat",
            labelKey: "subcategories.boatsNested.boatsForSale.fishingBoat",
            icon: "fish",
          },
          {
            key: "leisureYacht",
            labelKey: "subcategories.boatsNested.boatsForSale.leisureYacht",
            icon: "sail-boat",
          },
          {
            key: "sailboat",
            labelKey: "subcategories.boatsNested.boatsForSale.sailboat",
            icon: "sail-boat",
          },
          {
            key: "speedboat",
            labelKey: "subcategories.boatsNested.boatsForSale.speedboat",
            icon: "ferry",
          },
          OTHER,
        ],
      },
      {
        key: "boatsForRent",
        name: "Boats For Rent",
        icon: "ferry",
        nested: [
          {
            key: "fishingBoatRental",
            labelKey:
              "subcategories.boatsNested.boatsForRent.fishingBoatRental",
            icon: "fish",
          },
          {
            key: "yachtCharter",
            labelKey: "subcategories.boatsNested.boatsForRent.yachtCharter",
            icon: "sail-boat",
          },
          OTHER,
        ],
      },
      {
        key: "boatEnginesForSale",
        name: "Boat Engines",
        icon: "engine-outline",
        nested: [
          {
            key: "outboardEngine",
            labelKey: "subcategories.boatsNested.engines.outboardEngine",
            icon: "engine-outline",
          },
          {
            key: "inboardEngine",
            labelKey: "subcategories.boatsNested.engines.inboardEngine",
            icon: "engine-outline",
          },
          {
            key: "usedEngine",
            labelKey: "subcategories.boatsNested.engines.usedEngine",
            icon: "wrench-outline",
          },
          OTHER,
        ],
      },
      {
        key: "boatParts",
        name: "Boat Parts",
        icon: "tools",
        nested: [
          {
            key: "engineParts",
            labelKey: "subcategories.boatsNested.parts.engineParts",
            icon: "wrench-outline",
          },
          {
            key: "navigationEquipment",
            labelKey: "subcategories.boatsNested.parts.navigationEquipment",
            icon: "compass-outline",
          },
          {
            key: "safetyGear",
            labelKey: "subcategories.boatsNested.parts.safetyGear",
            icon: "shield-outline",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "farmequipment",
    name: "Farm Equipments",
    icon: "tractor",
    color: CAT_COLORS.farmEquipment,
    apiPath: CAT_PATHS.farmEquipment,
    subCategories: [
      {
        key: "tractor",
        name: "Tractors",
        icon: "tractor",
        nested: [
          {
            key: "newTractor",
            labelKey: "subcategories.traktorNested.tractorForSale.newTractor",
            icon: "tractor",
          },
          {
            key: "usedTractor",
            labelKey: "subcategories.traktorNested.tractorForSale.usedTractor",
            icon: "tractor",
          },
          OTHER,
        ],
      },
      {
        key: "tools",
        name: "Farm Tools",
        icon: "tools",
        nested: [
          {
            key: "plowTillageEquipment",
            labelKey:
              "subcategories.traktorNested.farmTools.plowTillageEquipment",
            icon: "shovel",
          },
          {
            key: "seedingEquipment",
            labelKey: "subcategories.traktorNested.farmTools.seedingEquipment",
            icon: "seed-outline",
          },
          {
            key: "harvestingEquipment",
            labelKey:
              "subcategories.traktorNested.farmTools.harvestingEquipment",
            icon: "corn",
          },
          OTHER,
        ],
      },
      {
        key: "fertilizerSpreader",
        name: "Fertilizer Spreaders",
        icon: "spray-bottle",
        nested: [
          {
            key: "mountedSpreader",
            labelKey:
              "subcategories.traktorNested.fertilizerSpreader.mountedSpreader",
            icon: "spray-bottle",
          },
          {
            key: "towedSpreader",
            labelKey:
              "subcategories.traktorNested.fertilizerSpreader.towedSpreader",
            icon: "spray-bottle",
          },
          OTHER,
        ],
      },
      {
        key: "harvester",
        name: "Grain Harvesters",
        icon: "grain",
        nested: [
          {
            key: "selfPropelledHarvester",
            labelKey:
              "subcategories.traktorNested.grainHarvester.selfPropelledHarvester",
            icon: "tractor",
          },
          {
            key: "pullTypeHarvester",
            labelKey:
              "subcategories.traktorNested.grainHarvester.pullTypeHarvester",
            icon: "tractor",
          },
          OTHER,
        ],
      },
      {
        key: "plow",
        name: "Plows",
        icon: "shovel",
        nested: [
          {
            key: "moldboardPlow",
            labelKey: "subcategories.traktorNested.plow.moldboardPlow",
            icon: "shovel",
          },
          {
            key: "discPlow",
            labelKey: "subcategories.traktorNested.plow.discPlow",
            icon: "shovel",
          },
          {
            key: "subsoilPlow",
            labelKey: "subcategories.traktorNested.plow.subsoilPlow",
            icon: "shovel",
          },
          OTHER,
        ],
      },
      {
        key: "irrigation",
        name: "Irrigation Systems",
        icon: "water-outline",
        nested: [
          {
            key: "dripIrrigation",
            labelKey: "subcategories.traktorNested.irrigation.dripIrrigation",
            icon: "water-outline",
          },
          {
            key: "sprinklerIrrigation",
            labelKey:
              "subcategories.traktorNested.irrigation.sprinklerIrrigation",
            icon: "sprinkler",
          },
          {
            key: "floodIrrigation",
            labelKey: "subcategories.traktorNested.irrigation.floodIrrigation",
            icon: "waves",
          },
          {
            key: "waterPumps",
            labelKey: "subcategories.traktorNested.irrigation.waterPumps",
            icon: "pump",
          },
          OTHER,
        ],
      },
    ],
  },
];

export const getCategoryByKey = (key: string): MainCategory | undefined =>
  MAIN_CATEGORIES.find((c) => c.key === key);

const buildCarsRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'cars' } });
const buildBoatsRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'boats' } });
const buildMotorcyclesRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'motorcycles' } });
const buildFarmEquipmentRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'farmequipment' } });
const buildRealEstateRoute: RouteBuilder = (id) => ({ pathname: ROUTES.realEstateDetail, params: { id } });
const buildJobRoute: RouteBuilder = (id) => ({ pathname: ROUTES.jobDetail, params: { id } });
const buildMarketplaceRoute: RouteBuilder = (id) => ({ pathname: ROUTES.itemDetail, params: { id } });

export const DEFAULT_DETAIL_ROUTE_BUILDER = buildMarketplaceRoute;

export const EXACT_CATEGORY_ROUTES: Record<string, RouteBuilder> = {
  gawaari: buildCarsRoute,
  car: buildCarsRoute,
  cars: buildCarsRoute,
  boat: buildBoatsRoute,
  boats: buildBoatsRoute,
  motorcycle: buildMotorcyclesRoute,
  motorcycles: buildMotorcyclesRoute,
  matooro: buildMotorcyclesRoute,
  equipment: buildFarmEquipmentRoute,
  farmequipment: buildFarmEquipmentRoute,
  'farm equipment': buildFarmEquipmentRoute,
  'farm-equipment': buildFarmEquipmentRoute,
  traktor: buildFarmEquipmentRoute,
  tractor: buildFarmEquipmentRoute,
  realestate: buildRealEstateRoute,
  'real estate': buildRealEstateRoute,
  'real-estate': buildRealEstateRoute,
  marketplace: buildMarketplaceRoute,
  electronics: buildMarketplaceRoute,
  fashion: buildMarketplaceRoute,
  furniture: buildMarketplaceRoute,
  animals: buildMarketplaceRoute,
  sports: buildMarketplaceRoute,
  antiques: buildMarketplaceRoute,
  job: buildJobRoute,
  jobs: buildJobRoute,
  fulltime: buildJobRoute,
  parttime: buildJobRoute,
  freelance: buildJobRoute,
};

export const CATEGORY_PATTERN_ROUTES: { patterns: string[]; build: RouteBuilder }[] = [
  { patterns: ['gawaari', 'car'], build: buildCarsRoute },
  { patterns: ['boat'], build: buildBoatsRoute },
  { patterns: ['motorcycle', 'matooro'], build: buildMotorcyclesRoute },
  { patterns: ['farm', 'equipment', 'traktor', 'tractor'], build: buildFarmEquipmentRoute },
  { patterns: ['estate', 'apartment', 'house', 'land', 'villa', 'iib', 'kira'], build: buildRealEstateRoute },
  { patterns: ['job'], build: buildJobRoute },
];

export const SUB_I18N_GROUP: Record<string, string> = {
  Marketplace: "marketplace",
  RealEstate: "realEstate",
  Cars: "cars",
  Motorcycles: "motorcycles",
  Boats: "boats",
  farmequipment: "farmEquipment",
  Jobs: "jobs",
};

export const CONDITION_COLORS: Record<string, string> = {
  new: '#16A34A',
  used: '#D97706',
  refurbished: '#2563EB',
};

export function getConditionColor(condition?: string): string | null {
  if (!condition) return null;
  return CONDITION_COLORS[condition.toLowerCase()] ?? null;
}

export const ITEM_MODEL_MAP: Record<string, string> = {
  cars: 'Car',
  boats: 'Boat',
  motorcycles: 'Motorcycle',
  farmequipment: 'Traktor',
  'farm-equipment': 'Traktor',
  traktor: 'Traktor',
  realestate: 'RealEstate',
  'real-estate': 'RealEstate',
  jobs: 'Job',
  job: 'Job',
  marketplace: 'Marketplace',
  subscription: 'Subscription',
};

export function getItemModel(category?: string): string {
  return ITEM_MODEL_MAP[category?.toLowerCase() ?? ''] ?? 'Marketplace';
}

const VEHICLE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'brand', labelKey: 'vehicleDetail.make' },
  { key: 'model', labelKey: 'vehicleDetail.model' },
  { key: 'vehicleModel', labelKey: 'vehicleDetail.model' },
  { key: 'modelName', labelKey: 'vehicleDetail.model' },
  { key: 'boatModel', labelKey: 'vehicleDetail.model' },
  { key: 'traktortModel', labelKey: 'vehicleDetail.model' },
  { key: 'year', labelKey: 'vehicleDetail.year' },
  { key: 'mileage', labelKey: 'vehicleDetail.mileage', format: (v) => `${Number(v).toLocaleString()} km` },
  { key: 'hours', labelKey: 'vehicleDetail.hours', format: (v) => `${v} h` },
  { key: 'fuelType', labelKey: 'vehicleDetail.fuelType' },
  { key: 'transmission', labelKey: 'vehicleDetail.transmission' },
  { key: 'color', labelKey: 'vehicleDetail.color' },
  { key: 'type', labelKey: 'vehicleDetail.type' },
  { key: 'length', labelKey: 'vehicleDetail.length', format: (v) => `${v} ft` },
];

export const VEHICLE_CONFIG: Record<string, CategoryTypeConfig> = {
  cars: { label: 'Car Details', endpoint: CAT_PATHS.cars, fields: VEHICLE_SPEC_FIELDS },
  boats: { label: 'Boat Details', endpoint: CAT_PATHS.boats, fields: VEHICLE_SPEC_FIELDS },
  motorcycles: { label: 'Motorcycle Details', endpoint: CAT_PATHS.motorcycles, fields: VEHICLE_SPEC_FIELDS },
  farmequipment: { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
  'farm-equipment': { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
  traktor: { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
};

export function getVehicleConfig(category: string): CategoryTypeConfig {
  return VEHICLE_CONFIG[category?.toLowerCase()] ?? VEHICLE_CONFIG.cars;
}

const MARKETPLACE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'condition', labelKey: 'vehicleDetail.condition', icon: 'tag-outline' },
  { key: 'subcategory', labelKey: 'vehicleDetail.subcategory', icon: 'shape-outline' },
  { key: 'nestedSubcategory', labelKey: 'vehicleDetail.type', icon: 'dots-horizontal-circle-outline' },
];

export const MARKETPLACE_CONFIG: CategoryTypeConfig = {
  label: 'Marketplace Details',
  endpoint: MARKETPLACE_ENDPOINTS.LIST,
  fields: MARKETPLACE_SPEC_FIELDS,
};

export function getMarketplaceConfig(): CategoryTypeConfig {
  return MARKETPLACE_CONFIG;
}

const REAL_ESTATE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'propertyType', labelKey: 'realEstateDetail.propertyTypeLabel' },
  { key: 'category', labelKey: 'realEstateDetail.categoryLabel' },
  { key: 'subcategory', labelKey: 'realEstateDetail.subcategoryLabel' },
  { key: 'bedrooms', labelKey: 'realEstateDetail.bedroomsLabel' },
  { key: 'bathrooms', labelKey: 'realEstateDetail.bathroomsLabel' },
  { key: 'area', labelKey: 'realEstateDetail.sizeSqmLabel', format: (v, t) => `${v} ${t('realEstateDetail.sqm')}` },
  { key: 'floor', labelKey: 'realEstateDetail.floorLabel' },
  { key: 'totalFloors', labelKey: 'realEstateDetail.totalFloorsLabel' },
  {
    key: 'furnished',
    labelKey: 'realEstateDetail.furnished',
    format: (v, t) => (v ? t('vehicleDetail.furnishedYes') : t('vehicleDetail.furnishedNo')),
  },
];

export const REAL_ESTATE_CONFIG: CategoryTypeConfig = {
  label: 'Real Estate Details',
  endpoint: REAL_ESTATE_ENDPOINTS.LIST,
  fields: REAL_ESTATE_SPEC_FIELDS,
};

export function getRealEstateConfig(): CategoryTypeConfig {
  return REAL_ESTATE_CONFIG;
}

const JOBS_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'company', labelKey: 'jobsPage.labelCompany' },
  { key: 'employmentType', labelKey: 'jobsPage.labelJobType' },
  { key: 'type', labelKey: 'jobsPage.labelJobType' },
  { key: 'salary', labelKey: 'jobsPage.labelSalary' },
  { key: 'location', labelKey: 'jobsPage.labelLocation' },
  { key: 'createdAt', labelKey: 'jobsPage.labelPosted', format: (v) => formatDate(v) },
];

export const JOBS_CONFIG: CategoryTypeConfig = {
  label: 'Job Details',
  endpoint: JOBS_ENDPOINTS.LIST,
  fields: JOBS_SPEC_FIELDS,
};

export function getJobsConfig(): CategoryTypeConfig {
  return JOBS_CONFIG;
}

export function buildSpecItems(
  item: any,
  fields: CategorySpecField[],
  t: (key: string) => string,
): { label: string; value: string; icon?: string }[] {
  const seen = new Set<string>();
  const result: { label: string; value: string; icon?: string }[] = [];

  for (const field of fields) {
    const raw = item?.[field.key];
    if (raw === undefined || raw === null || raw === '') continue;
    const label = t(field.labelKey);
    if (seen.has(label)) continue;
    seen.add(label);
    result.push({
      label,
      value: field.format ? field.format(raw, t) : String(raw),
      icon: field.icon,
    });
  }
  return result;
}
