import { Image, type ViewStyle, Platform, StatusBar, Dimensions } from 'react-native';
import type { PaymentMethodOption, Step } from '../util/types/new-ad.types';
import type { Language } from '../util/types/navigation.types';
import type { CategorySpecField, CategoryTypeConfig } from '../util/types/listing.types';
import type { NestedSubCategory, SubCategory, MainCategory } from '../util/types/browse.types';
import type { RouteBuilder } from '../util/types/common.types';
import { CAT_COLORS, COLORS, SPACING } from '../util/colors/colors';
import { formatDate } from '../util/helpers/ui.format';
import { CAT_PATHS } from '../api/paths';
import { MARKETPLACE_ENDPOINTS, REAL_ESTATE_ENDPOINTS, JOBS_ENDPOINTS } from '../api/endpoints';
import type { FeeArrayKey } from "../util/types/fee.types";
import type { VideoSource } from "expo-video";
import type { TabItem, MenuItem, SettingsRow, BizStepDef, NotificationFilter } from "../util/types";
import { NAV_ICONS } from "../util/icons/icons";
import type { FeedTierKey } from "../util/types/feedTier.types";
import type { PlanDefinition } from "../util/types/planCatalog.types";
import type { MCIcon } from "../util/icons/icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BusinessApplyFormState } from "../util/types/business.types";
import type { BusinessScreen } from "../management/create/business/helpers/business.helpers";
const NO_IMAGE_URI = Image.resolveAssetSource(require('../../assets/icon.png')).uri;

export const PLACEHOLDER_IMAGE = NO_IMAGE_URI;
export const CATEGORY_FEED_LIMIT = 200;
export const SITE_URL = 'https://www.karaadi.com';
export const getSitePayUrl = (listingId: string) =>
  `${SITE_URL}/mine/pay/${encodeURIComponent(listingId)}`;

export const DETAIL_PLACEHOLDER = NO_IMAGE_URI;

export const DESCRIPTION_TRUNCATE = 300;

export {
  FEED_GROUPS,
  FEED_DEFAULT_PAGE,
  FEED_MAX_ITEMS,
  type FeedGroup,
} from '../api/paths';

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
  { key: 'evc',    label: 'EVC Plus', sublabel: 'Hormuud (+252 61)', prefix: '61', color: COLORS.providerEvc },
  { key: 'waafi',  label: 'Waafi',    sublabel: 'Hormuud (+252 61)', prefix: '61', color: COLORS.providerWaafi },
  { key: 'zaad',   label: 'Zaad',     sublabel: 'Telesom (+252 63)', prefix: '63', color: COLORS.providerZaad },
  { key: 'sahal',  label: 'Sahal',    sublabel: 'Somtel (+252 90)',  prefix: '90', color: COLORS.providerSahal },
];

export const IOS_PAY_ON_WEBSITE = false;

export const MAX_POLL_ATTEMPTS = 30;
export const POLL_INTERVAL_MS  = 3000;

export const ACTIVATE_RETRY_ATTEMPTS = 3;
export const ACTIVATE_RETRY_DELAY_MS = 1500;

export const PHONE_REGEX = /^(\+?252|0)?(61|63|90)\d{7}$/;
export const PHONE_LOCAL_MAX_LENGTH = 10;
export const SOMALI_DIAL_CODE = '+252';

export const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
export const CHAT_RE = /^\/profile\/chat/;
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
  myAds: '/profile/my-ads',
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
export const REGEX_NON_DIGITS = /[^0-9]/g;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_PASSWORD_LOWERCASE = /[a-z]/;
export const REGEX_PASSWORD_UPPERCASE = /[A-Z]/;
export const REGEX_PASSWORD_DIGIT = /[0-9]/;
export const REGEX_PASSWORD_SPECIAL = /[@$!%*?&#_\-]/;
export const REGEX_SOMALI_PHONE_FULL = /^\+252\d{9}$/;
export const REGEX_SOMALI_PHONE_LOCAL = /^[69]\d{8}$/;
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
const WEB_DETAIL_PATHS: Array<[RegExp, string]> = [
  [/farm|tractor|traktor|equipment/, 'vehicles/Farmequipment'],
  [/motor|matooro/, 'vehicles/motorcycles'],
  [/boat|doon/, 'vehicles/boats'],
  [/car|gawaari|vehicle/, 'vehicles/cars'],
  [/real|guryo|property/, 'real-estate'],
  [/job|shaqo/, 'jobs'],
];

export const getListingShareUrl = (listingId: string, category?: string) => {
  const key = (category ?? '').toLowerCase();
  const path = WEB_DETAIL_PATHS.find(([re]) => re.test(key))?.[1] ?? 'item-details';
  return `${SITE_URL}/${path}/${encodeURIComponent(listingId)}`;
};

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

const VEHICLE_CONFIG: Record<string, CategoryTypeConfig> = {
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
export const DEFAULT_HEADER_CONTENT_HEIGHT = 104;
export const AUTH_HEADER_CONTENT_HEIGHT = 60;
export const PREFETCH_LIMIT = 20;
export const USE_NOTIFICATION_TAP_ROUTES = {
  chat: "/profile/chat",
  wanted: "/profile/wanted",
  subscription: "/profile/subscription",
  messages: "/(tabs)/messages",
  notifications: "/profile/notifications",
} as const;
export const TAB_BAR_ITEM_HEIGHT = 54;
export const TAB_BAR_GLASS_VERTICAL_PADDING = SPACING.xs * 2;
export const TAB_BAR_TOP_GAP = SPACING.xl;
export const MAX_STYLE_VARIANTS = 24;
export const CATEGORY_FEE_KEY: Record<string, FeeArrayKey> = {
  Cars: 'cars',
  Marketplace: 'marketplace',
  RealEstate: 'realEstate',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'equipment',
  Jobs: 'marketplace',
};
export const SUBCATEGORY_FEE_FIELD: Record<string, Record<string, string>> = {
  Marketplace: {
    antiques: 'art',
    electronics: 'electronics',
    animalAndSupplies: 'animal',
    sportsAndOutdoors: 'sports',
    furniture: 'furniture',
    fashion: 'fashion',
    education: 'other',
  },
  Cars: {
    carsForSale: 'carSale',
    leaseCars: 'carRent',
    trailers: 'trailer',
    carParts: 'carParts',
    truck: 'truck',
    electricCars: 'electricCar',
    buses: 'carSale',
  },
  RealEstate: {
    forRent: 'rent',
    forSale: 'sale',
    landForSale: 'land',
    farmForSale: 'farm',
    commercial: 'business',
  },
  Motorcycles: {
    forSale: 'motoSale',
    forRent: 'motoRent',
    spareParts: 'motoParts',
    other: 'other',
  },
  Boats: {
    boatsForSale: 'boatSale',
    boatsForRent: 'boatRent',
    boatEnginesForSale: 'boatEngine',
    boatParts: 'boatParts',
  },
  farmequipment: {
    tractor: 'tractorSale',
    tools: 'agriTool',
    harvester: 'harvester',
    fertilizerSpreader: 'other',
    plow: 'other',
    irrigation: 'other',
  },
};
export const SUB_PLANS_TTL = 60_000;
export const NOTIFICATIONS_FETCH_LIMIT = 100;
export const VISITOR_ID_KEY = 'karaadi_visitor_id_v1';
export const SKELETON_COUNT = 6;
export const STEP_INDEX: Record<Step, number> = {
  login: 0,
  type: 0,
  category: 1,
  form: 2,
  plan: 3,
  summary: 4,
  payment: 5,
};
export const STATUS_COLOR_KEY: Record<string, 'success' | 'primary' | 'error' | 'textMuted'> = {
  DONE: 'success',
  RESOLVED: 'success',
  IN_PROGRESS: 'primary',
  NEW: 'error',
};
export const DELETE_CONFIRM_TEXT = 'delete account';
export const NUM_COLUMNS = 2;
export const COLUMN_GAP = 10;
export const SUBSCRIPTION_H_PAD = 14;
export const TUTORIALS: { id: string; titleKey: string; source: VideoSource }[] = [
  { id: '1', titleKey: 'tutorials.video1', source: require('../../assets/videos/karaadi-tutorial-1.mp4') },
  { id: '2', titleKey: 'tutorials.video2', source: require('../../assets/videos/karaadi-tutorial-post-ad.mp4') },
  { id: '3', titleKey: 'tutorials.video3', source: require('../../assets/videos/karaadi-tutorial-business-account.mp4') },
];
export const TAB_ITEMS: TabItem[] = [
  {
    name: "home",
    labelKey: "nav.home",
    icon: NAV_ICONS.home.filled,
    iconOutline: NAV_ICONS.home.outline,
  },
  {
    name: "businesses",
    labelKey: "nav.business",
    icon: NAV_ICONS.business.filled,
    iconOutline: NAV_ICONS.business.outline,
  },
  {
    name: "new-ad",
    labelKey: "nav.newAd",
    icon: NAV_ICONS.newAd.filled,
    iconOutline: NAV_ICONS.newAd.outline,
  },
  {
    name: "messages",
    labelKey: "nav.messages",
    icon: NAV_ICONS.messages.filled,
    iconOutline: NAV_ICONS.messages.outline,
  },
  {
    name: "profile",
    labelKey: "nav.mine",
    icon: NAV_ICONS.profile.filled,
    iconOutline: NAV_ICONS.profile.outline,
  },
];
export const LOGIN_TAB_ITEM: TabItem = {
  name: "login",
  labelKey: "nav.login",
  icon: NAV_ICONS.login.filled,
  iconOutline: NAV_ICONS.login.outline,
};
export const PROFILE_MENU_ITEMS: MenuItem[] = [
  { icon: "tag-outline",              labelKey: "mine.account.myAds",           descKey: "descriptions.myAdsDesc",           route: "/profile/my-ads" },
  { icon: "account-circle-outline",   labelKey: "mine.account.myAccount",       descKey: "descriptions.myAccountDesc",       route: "/profile/edit" },
  { icon: "tune-variant",             labelKey: "mine.account.settings",        descKey: "descriptions.settingsDesc",        route: "/profile/settings" },
  { icon: "bookmark-outline",         labelKey: "mine.account.favorites",       descKey: "descriptions.favoritesDesc",       route: "/profile/favorites" },
  { icon: "text-search",              labelKey: "mine.account.savedSearches",   descKey: "descriptions.savedSearchesDesc",   route: "/profile/saved-searches" },
  { icon: "store-outline",            labelKey: "mine.account.forBusinesses",   descKey: "descriptions.forBusinessesDesc",   route: "/profile/businesses" },
  { icon: "clock-outline",            labelKey: "mine.account.contactHistory",  descKey: "descriptions.contactHistoryDesc",  route: "/profile/contact-history" },
  { icon: "crown-outline",            labelKey: "mine.account.mySubscriptions", descKey: "descriptions.mySubscriptionsDesc", route: "/profile/subscription" },
  { icon: "shield-check-outline",     labelKey: "mine.account.identityVerification", descKey: "descriptions.identityVerificationDesc", route: "/profile/verify-identity" },
  { icon: "certificate-outline",      labelKey: "mine.account.badge",           descKey: "descriptions.badgeDesc",           route: "/profile/badge" },
  { icon: "school-outline",           labelKey: "mine.account.tutorials",       descKey: "descriptions.tutorialsDesc",       route: "/profile/tutorials" },
];
export const SETTINGS_ROWS: SettingsRow[] = [
  {
    icon: "shield-lock-outline",
    labelKey: "mine.settings.security",
    route: "/profile/settings/Security",
  },
  {
    icon: "eye-off-outline",
    labelKey: "mine.settings.privacy",
    route: "/profile/settings/Privacy",
  },
  {
    icon: "credit-card-outline",
    labelKey: "mine.settingsPage.payments",
    route: "/profile/settings/Payment",
  },
  {
    icon: "crown-outline",
    labelKey: "mine.settings.subscription",
    route: "/profile/wanted",
  },
  {
    icon: "information-outline",
    labelKey: "mine.account.aboutKaraadi",
    route: "/profile/about-karaadi",
  },
];
export const BIZ_STEPS: BizStepDef[] = [
  { key: 'plan', labelKey: 'mine.businesses.stepPlan' },
  { key: 'apply', labelKey: 'mine.businesses.stepApply' },
  { key: 'approval', labelKey: 'mine.businesses.stepApproval' },
  { key: 'categories', labelKey: 'mine.businesses.stepCategories' },
  { key: 'post', labelKey: 'mine.businesses.stepPost' },
];
export const MODAL_ANIMATION = Platform.OS === "ios" ? "slide_from_bottom" : "none";
export const HIDDEN_TAB_BAR_ROUTES = ["/(auth)", "/profile/chat"];
export const NEW_AD_ROUTES = ["/(tabs)/new-ad", "/new-ad"];
export const GEO_CACHE_TTL = 3600_000;
export const NATIVE_DRIVER = Platform.OS !== 'web';
export const IGNORED_WARNS = [
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  '[expo-notifications] Listening to push token changes is not yet fully supported on web',
  '"shadow*" style props are deprecated. Use "boxShadow"',
  'props.pointerEvents is deprecated. Use style.pointerEvents',
  'bundle scheme is file - unable to connect to sharedPackageConnection',
];
export const TIER_ORDER: FeedTierKey[] = ['premium90', 'standard60', 'basic30', 'rest'];
export const PLAN_CATALOG: PlanDefinition[] = [
  {
    key: 'premium90',
    label: 'Premium',
    days: 90,
    popular: false,
    features: ['90 Maalmood', 'Social Media Boost', 'Safka hore (Top)', 'Taageero 24/7 ah'],
  },
  {
    key: 'standard60',
    label: 'Standard',
    days: 60,
    popular: true,
    features: ['60 Maalmood', 'Raadinta sare', 'Sawirro & Muuqaal', 'Taageero chat'],
  },
  {
    key: 'basic30',
    label: 'Basic',
    days: 30,
    popular: false,
    features: ['30 Maalmood', 'Raadinta aasaasiga ah', 'Taageero email'],
  },
];
export const REASON_OPTIONS = [
  { value: 'scam', labelKey: 'report.reasonScam' },
  { value: 'sold', labelKey: 'report.reasonSold' },
  { value: 'misleading', labelKey: 'report.reasonMisleading' },
  { value: 'prohibited', labelKey: 'report.reasonProhibited' },
  { value: 'offensive', labelKey: 'report.reasonOffensive' },
  { value: 'other', labelKey: 'report.reasonOther' },
] as const;
export const VEHICLE_REPORT_TYPES: Record<string, string> = {
  cars: 'CAR',
  boats: 'BOAT',
  motorcycles: 'MOTORCYCLE',
  'farm-equipment': 'TRAKTOR',
  farmequipment: 'TRAKTOR',
  traktor: 'TRAKTOR',
};
export const WHAT_ITEM_KEYS = [
  'about.items.realEstate',
  'about.items.vehicles',
  'about.items.marketplace',
  'about.items.jobs',
  'about.items.services',
];
export const PAGES: { id: string; icon: MCIcon; titleKey: string; route: string }[] = [
  { id: 'about', icon: 'information-outline', titleKey: 'about.heading', route: '/profile/about-karaadi/about' },
  { id: 'terms', icon: 'file-document-outline', titleKey: 'terms.heading', route: '/profile/about-karaadi/terms' },
  { id: 'contact', icon: 'email-outline', titleKey: 'contact.heading', route: '/profile/about-karaadi/contact' },
];
export const TERMS_ITEM_INDICES = [0, 1, 2, 3, 4, 5];
export const GRID_COLUMNS = 2;
export const GRID_H_PAD = 8;
export const MY_ADS_GRID_GAP = 8;
export const SECTIONS = [
  {
    title: 'Dejinta Karaadi',
    body: 'Xogta aan ka aruurinay adiga waxaa loo isticmaalaa in lagu habeeyo khibradaada Karaadi ee bogga iyo app-ka. Dejintan waxay khusaysaa macluumaadka akoonkaaga.',
  },
  {
    title: 'Fariimaha iyo Cusboonaysiinta',
    body: 'Karaadi waxay kuu soo diri doontaa wargeysyo, talooyin safar, tartamo iyo xog kale oo ku saabsan adeegyada iyo alaabta aad xiisaynayso.',
  },
  {
    title: 'Macluumaadkaaga Gaarka ah',
    body: "Xogtaada waxaa loo isticmaalaa in lagu tuso waxyaabaha aad xiisaynayso, laguugu soo bandhigo xayaysiisyo ku habboon, iyo inaad hesho macluumaad muhiim ah oo ku saabsan adeegyada Karaadi.",
  },
  {
    title: 'Xayeysiiska iyo Koontaroolka',
    body: "Xogtaada waxaa loo isticmaalaa in lagu habeeyo xayeysiiska aad aragto. Waxaad dooran kartaa in xayeysiiska lagu habeeyo da'da, jinsiga, danaha ama goobta aad ku sugan tahay.",
  },
];
const STATUSBAR_H =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 0;
export const DRAG_THRESHOLD = 80;
export const MD_LINK = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const DISMISS_DISTANCE = 120;
export const DISMISS_VELOCITY = 800;
export const MAX_DIMENSION = 1080;
export const JPEG_QUALITY = 0.8;
export const PUSH_TOKEN_CACHE_KEY = 'karaadi_push_token_v1';
export const FILTERS: NotificationFilter[] = ['all', 'unread', 'read'];
export const ICON_BY_TYPE: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  message: 'message-text',
  subscription_alert: 'bell-ring',
  subscription_match: 'bell-ring',
};
export const APPROVAL_POLL_INTERVAL_MS = 5000;
export const EMPTY: BusinessApplyFormState = {
  name: '', orgNumber: '', email: '', phone: '',
  contactName: '', website: '', address: '', description: '',
};
export const CHECKUP_INDEX: Record<BusinessScreen, number> = {
  plan: 0, apply: 1, approval: 2, categories: 3, post: 4,
};
export const STEP_CATEGORY_NUM_COLUMNS = 3;
export const MAX_IMAGES = 3;
export const CATEGORY_MAIN_LABEL: Record<string, string> = {
  Marketplace: 'Marketplace',
  Cars: 'Cars',
  RealEstate: 'Real Estate',
  Motorcycles: 'Motorcycles',
  Boats: 'Boats',
  farmequipment: 'Farm Equipment',
  Jobs: 'Jobs',
};
export const NUMERIC_KEYS = [
  'price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'sizeSqm',
  'hoursUsed', 'floor', 'totalFloors', 'doors',
];
export const BOOLEAN_KEYS = ['furnished', 'parking', 'hasGarage', 'hasGarden'];
export const SHEET_TOP = STATUSBAR_H + 48;
export const FAB_INIT_X = SCREEN_WIDTH - FAB_SIZE - 20;
export const FAB_INIT_Y = SCREEN_HEIGHT - FAB_SIZE - 100;
