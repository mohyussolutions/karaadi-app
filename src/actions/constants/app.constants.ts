import { Image, Platform, StatusBar, Dimensions } from 'react-native';
import type { AboutPageItem, BizStepDef, BusinessApplyFormState, BusinessStepIndexMap, CategorySpecField, CategoryTypeConfig, CategoryTypeConfigMap, ColorKeyMap, FeedTierKey, IconMap, Language, MenuItem, NotificationFilter, PaymentMethodOption, PlanDefinition, RegexReplacements, SettingsRow, SimpleTranslate, SpecItem, StatusColorMap, StepGuardMap, StepIndexMap, StringMap, TutorialVideo, WantedFormState } from '../../utils/types';
import { COLORS } from '../../utils/colors/colors';
import { formatDate } from '../../lib/helpers/format/ui.format';
import { CAT_PATHS } from './paths';
import { ROUTES, SITE_URL } from './routes.constants';
import { MAIN_CATEGORIES } from '../../categoriesListing/main-categories/mainCategories';
import { MARKETPLACE_ENDPOINTS, REAL_ESTATE_ENDPOINTS, JOBS_ENDPOINTS } from './endpoints';

const NO_IMAGE_URI = Image.resolveAssetSource(require('../../../assets/icon.png')).uri;

export const PLACEHOLDER_IMAGE = NO_IMAGE_URI;

export const DETAIL_PLACEHOLDER = NO_IMAGE_URI;

export const DESCRIPTION_TRUNCATE = 300;

export { FEED_GROUPS, FEED_DEFAULT_PAGE } from './api.constants';

export const HOME_FEED_INITIAL = 20;
export const HOME_FEED_FIRST_STEP = 20;
export const HOME_FEED_STEP = 30;
export const HOME_FEED_MAX = 120;
export const CATEGORY_FEED_LIMIT = 200;
export const CATEGORY_PAGE_SIZE = 50;
export const CATEGORY_FULL_PAGE_SIZE = 1000;

export const REAL_ESTATE_FOR_SALE = {
  categoryKey: 'RealEstate',
  subcategoryKey: 'forSale',
  include: ['forsale', 'iib'],
  exclude: ['farm', 'land', 'dhul', 'beer'],
} as const;
export const REGEX_CATEGORY_SEPARATORS = /[\s_-]+/g;
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
export const BUSINESS_FIELD_LIMITS = {
  name: 150,
  orgNumber: 50,
  contactName: 100,
  website: 200,
  address: 200,
  description: 2000,
} as const;

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
export const INVALID_PAYMENT_AMOUNT_MESSAGE = 'invalid payment amount';
export const SOMALI_DIAL_CODE = '+252';

export const LANGS: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'so', label: 'Soomaali' },
];
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

export const FAVORITES_H_PAD = 16;
export const FAVORITES_COL_GAP = 12;

const WEB_DETAIL_PATHS: RegexReplacements = [
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

export const SUB_I18N_GROUP: StringMap = {
  Marketplace: "marketplace",
  RealEstate: "realEstate",
  Cars: "cars",
  Motorcycles: "motorcycles",
  Boats: "boats",
  farmequipment: "farmEquipment",
  Jobs: "jobs",
};

export const CONDITION_COLOR_KEYS: ColorKeyMap = {
  new: 'success',
  used: 'warning',
  refurbished: 'info',
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

const VEHICLE_CONFIG: CategoryTypeConfigMap = {
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
  { key: 'createdAt', labelKey: 'jobsPage.labelPosted', format: (v) => formatDate(String(v)) },
];

export const JOBS_CONFIG: CategoryTypeConfig = {
  label: 'Job Details',
  endpoint: JOBS_ENDPOINTS.LIST,
  fields: JOBS_SPEC_FIELDS,
};

export function buildSpecItems(
  item: object | null | undefined,
  fields: CategorySpecField[],
  t: SimpleTranslate,
): SpecItem[] {
  const seen = new Set<string>();
  const result: SpecItem[] = [];

  for (const field of fields) {
    const raw = (item as Record<string, unknown> | null | undefined)?.[field.key];
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
export const DEFAULT_HEADER_CONTENT_HEIGHT = 112;
export const AUTH_HEADER_CONTENT_HEIGHT = 60;
export const PREFETCH_LIMIT = 20;
export const MAX_STYLE_VARIANTS = 24;
export const SUB_PLANS_TTL = 60_000;
export const NOTIFICATIONS_FETCH_LIMIT = 100;
export const VISITOR_ID_KEY = 'karaadi_visitor_id_v1';
export const SKELETON_COUNT = 6;
export const STEP_INDEX: StepIndexMap = {
  login: 0,
  type: 0,
  category: 1,
  form: 2,
  plan: 3,
  summary: 4,
  payment: 5,
};
export const STATUS_COLOR_KEY: StatusColorMap = {
  DONE: 'success',
  RESOLVED: 'success',
  IN_PROGRESS: 'primary',
  NEW: 'error',
};
export const DELETE_CONFIRM_TEXT = 'delete account';
export const NUM_COLUMNS = 2;
export const COLUMN_GAP = 10;
export const SUBSCRIPTION_H_PAD = 14;
export const TUTORIALS: TutorialVideo[] = [
  { id: '1', titleKey: 'tutorials.video1', source: require('../../../assets/videos/karaadi-tutorial-1.mp4') },
  { id: '2', titleKey: 'tutorials.video2', source: require('../../../assets/videos/karaadi-tutorial-post-ad.mp4') },
  { id: '3', titleKey: 'tutorials.video3', source: require('../../../assets/videos/karaadi-tutorial-business-account.mp4') },
];
export const PROFILE_MENU_ITEMS: MenuItem[] = [
  { icon: "tag-outline",              labelKey: "mine.account.myAds",           descKey: "descriptions.myAdsDesc",           route: ROUTES.myAds },
  { icon: "account-circle-outline",   labelKey: "mine.account.myAccount",       descKey: "descriptions.myAccountDesc",       route: ROUTES.editProfile },
  { icon: "tune-variant",             labelKey: "mine.account.settings",        descKey: "descriptions.settingsDesc",        route: ROUTES.settings },
  { icon: "bookmark-outline",         labelKey: "mine.account.favorites",       descKey: "descriptions.favoritesDesc",       route: ROUTES.favorites },
  { icon: "text-search",              labelKey: "mine.account.savedSearches",   descKey: "descriptions.savedSearchesDesc",   route: ROUTES.savedSearches },
  { icon: "store-outline",            labelKey: "mine.account.forBusinesses",   descKey: "descriptions.forBusinessesDesc",   route: ROUTES.profileBusinesses },
  { icon: "clock-outline",            labelKey: "mine.account.contactHistory",  descKey: "descriptions.contactHistoryDesc",  route: ROUTES.contactHistory },
  { icon: "crown-outline",            labelKey: "mine.account.mySubscriptions", descKey: "descriptions.mySubscriptionsDesc", route: ROUTES.subscription },
  { icon: "shield-check-outline",     labelKey: "mine.account.identityVerification", descKey: "descriptions.identityVerificationDesc", route: ROUTES.verifyIdentity },
  { icon: "certificate-outline",      labelKey: "mine.account.badge",           descKey: "descriptions.badgeDesc",           route: ROUTES.badge },
  { icon: "school-outline",           labelKey: "mine.account.tutorials",       descKey: "descriptions.tutorialsDesc",       route: ROUTES.tutorials },
];
export const SETTINGS_ROWS: SettingsRow[] = [
  {
    icon: "shield-lock-outline",
    labelKey: "mine.settings.security",
    route: ROUTES.settingsSecurity,
  },
  {
    icon: "eye-off-outline",
    labelKey: "mine.settings.privacy",
    route: ROUTES.settingsPrivacy,
  },
  {
    icon: "credit-card-outline",
    labelKey: "mine.settingsPage.payments",
    route: ROUTES.settingsPayment,
  },
  {
    icon: "crown-outline",
    labelKey: "mine.settings.subscription",
    route: ROUTES.wanted,
  },
  {
    icon: "information-outline",
    labelKey: "mine.account.aboutKaraadi",
    route: ROUTES.aboutKaraadi,
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
export const VEHICLE_REPORT_TYPES: StringMap = {
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
export const PAGES: AboutPageItem[] = [
  { id: 'support', icon: 'robot-outline', titleKey: 'supportChat.title', route: ROUTES.supportChat },
  { id: 'about', icon: 'information-outline', titleKey: 'about.heading', route: ROUTES.about },
  { id: 'terms', icon: 'file-document-outline', titleKey: 'terms.heading', route: ROUTES.terms },
  { id: 'contact', icon: 'email-outline', titleKey: 'contact.heading', route: ROUTES.contact },
];
export const TERMS_ITEM_INDICES = [0, 1, 2, 3, 4, 5];
export const MY_AD_GALLERY_H_PAD = 16;
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
export const ICON_BY_TYPE: IconMap = {
  message: 'message-text',
  subscription_alert: 'bell-ring',
  subscription_match: 'bell-ring',
};
export const APPROVAL_POLL_INTERVAL_MS = 5000;
export const EMPTY: BusinessApplyFormState = {
  name: '', orgNumber: '', email: '', phone: '',
  contactName: '', website: '', address: '', description: '',
};
export const CHECKUP_INDEX: BusinessStepIndexMap = {
  plan: 0, apply: 1, approval: 2, categories: 3, post: 4,
};
export const STEP_CATEGORY_NUM_COLUMNS = 3;
export const MAX_IMAGES = 3;
export const NUMERIC_KEYS = [
  'price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'sizeSqm',
  'hoursUsed', 'floor', 'totalFloors', 'doors',
];
export const BOOLEAN_KEYS = ['furnished', 'parking', 'hasGarage', 'hasGarden'];
export const SHEET_TOP = STATUSBAR_H + 48;
export const FAB_INIT_X = SCREEN_WIDTH - FAB_SIZE - 20;
export const FAB_INIT_Y = SCREEN_HEIGHT - FAB_SIZE - 100;

export const PASSWORD_RULES = [
  { id: 'length',  labelKey: 'auth.passwordRules.length',    test: (p: string) => p.length >= 8 },
  { id: 'lower',   labelKey: 'auth.passwordRules.lowercase', test: (p: string) => REGEX_PASSWORD_LOWERCASE.test(p) },
  { id: 'upper',   labelKey: 'auth.passwordRules.uppercase', test: (p: string) => REGEX_PASSWORD_UPPERCASE.test(p) },
  { id: 'digit',   labelKey: 'auth.passwordRules.digit',     test: (p: string) => REGEX_PASSWORD_DIGIT.test(p) },
  { id: 'special', labelKey: 'auth.passwordRules.special',   test: (p: string) => REGEX_PASSWORD_SPECIAL.test(p) },
] as const;

export const NEW_AD_GUARDS: StepGuardMap = {
  login: () => true,
  type: () => true,
  category: (s) => s.listingType !== null,
  form: (s) => !!s.categoryKey,
  plan: (s) => s.submitStatus === 'success' && !!s.createdId,
  summary: (s) => s.selectedPlan !== null,
  payment: (s) => s.selectedPlan !== null && s.submitStatus === 'success',
};

export const EMPTY_WANTED_FORM: WantedFormState = {
  title: '',
  category: MAIN_CATEGORIES[0].key,
  subCategory: '',
  nestedSubCategory: '',
  priceMin: '',
  priceMax: '',
  region: '',
  city: '',
  description: '',
  images: [],
};

export const SOMALI_DIAL_DIGITS = SOMALI_DIAL_CODE.replace('+', '');

export const PROFILE_AVATAR = placeholderAvatar(80, COLORS.primary.slice(1), 'Me');
export const EDIT_PROFILE_AVATAR = placeholderAvatar(100, COLORS.primary.slice(1), 'Me');
export const BUSINESS_LOGO_PLACEHOLDER = placeholderAvatar(80, COLORS.primary.slice(1), 'B');
export const CHAT_AVATAR_PLACEHOLDER = placeholderAvatar(48, COLORS.gray400.slice(1), '?');

export const EULA_ACCEPTED_KEY = 'karaadi_eula_accepted_v1';

export const SUPPORT_CHAT_POLL_MS = 8000;
export const SUPPORT_CHAT_MESSAGE_MAX = 2000;
export const SUPPORT_URL_REGEX =
  /(?:[a-z][a-z0-9+.-]*:\/\/|\bwww\.|\b(?:javascript|vbscript):|\bdata:[a-z]+\/|\b\d{1,3}(?:\.\d{1,3}){3}\b|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|so|io|app|dev|link|ly|xyz|info|me|co|biz|ru|tk|top|site|online|click|live|shop|store|ai|gg|to|cc|us|uk|de|in|ke|et|tv|page|bit|gl|cn|pw|ml|ga|cf|gq|zip|mov)\b)/i;

export const SEARCH_MAX_KEYWORDS = 8;
export const SEARCH_PRICE_TOLERANCE = 0.1;
export const REGEX_SEARCH_SPLIT = /[\s,]+/;
export const REGEX_SEARCH_CLEAN = /[^\wÀ-ɏ-]/g;
export const REGEX_THOUSANDS_COMMA = /,/g;

export const CHAT_MESSAGE_MAX_LENGTH = 500;
export const CHAT_SCROLL_DELAY_MS = 80;
export const CHAT_ITEM_MODELS: StringMap = {
  car: 'Car',
  cars: 'Car',
  boat: 'Boat',
  boats: 'Boat',
  motorcycle: 'Motorcycle',
  motorcycles: 'Motorcycle',
  farmequipment: 'Traktor',
  'farm-equipment': 'Traktor',
  traktor: 'Traktor',
  realestate: 'RealEstate',
  'real-estate': 'RealEstate',
  job: 'Job',
  jobs: 'Job',
  subscription: 'Subscription',
};
export const DEFAULT_CHAT_ITEM_MODEL = 'Marketplace';

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 128;
export const RESEND_CODE_COOLDOWN_MS = 30_000;
export const HTTP_TOO_MANY_REQUESTS = 429;
export const HTTP_LOCKED = 423;

export const INPUT_LIMITS = {
  search: 100,
  shortText: 120,
  phone: 20,
  orgNumber: 40,
  address: 200,
  url: 200,
  price: 12,
  longText: 1000,
  confirmText: 40,
} as const;

export const BRAND_LOGO = require('../../../assets/logo.jpg');
export const HEADER_SEARCH_DEBOUNCE_MS = 250;
export const LANG_DROPDOWN_TOP_OFFSET = 56;
