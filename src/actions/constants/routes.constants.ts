import type { CategoryPatternRoute, RouteBuilder, RouteBuilderMap, StringMap } from '../../utils/types';

export const ROUTES = {
  tabsRoot: '/(tabs)',
  home: '/(tabs)/home',
  newAd: '/(tabs)/new-ad',
  messages: '/(tabs)/messages',

  login: '/(auth)/login',
  register: '/(auth)/register',
  confirmCode: '/(auth)/confirm',
  forgotPassword: '/(auth)/forgot-password',
  resetPassword: '/(auth)/reset-password',

  editProfile: '/profile/edit',
  myAds: '/profile/my-ads',
  myAdManage: '/profile/my-ads/[id]',
  favorites: '/profile/favorites',
  savedSearches: '/profile/saved-searches',
  wanted: '/profile/wanted',
  subscription: '/profile/subscription',
  profileBusinesses: '/profile/businesses',
  businessCreate: '/profile/business-create',
  chat: '/profile/chat',
  contactHistory: '/profile/contact-history',
  notifications: '/profile/notifications',
  verifyIdentity: '/profile/verify-identity',
  badge: '/profile/badge',
  tutorials: '/profile/tutorials',

  settings: '/profile/settings',
  settingsSecurity: '/profile/settings/security',
  settingsPrivacy: '/profile/settings/privacy',
  settingsPayment: '/profile/settings/payment',

  aboutKaraadi: '/profile/about-karaadi',
  about: '/profile/about-karaadi/about',
  terms: '/profile/about-karaadi/terms',
  contact: '/profile/about-karaadi/contact',
  supportChat: '/profile/about-karaadi/support',

  vehicleDetail: '/listing/vehicle/[id]',
  itemDetail: '/listing/item-detail/[id]',
  realEstateDetail: '/listing/real-estate/[id]',
  jobDetail: '/listing/job/[id]',
  subscriptionDetail: '/listing/subscription/[id]',
  report: '/listing/report/[id]',

  businessDetail: '/business/[id]',

  browseCategory: '/browse/[category]',
  browseSubcategory: '/browse/[category]/[subcategory]',
} as const;

export const PATHNAMES = {
  home: '/home',
  messages: '/messages',
  profile: '/profile',
  newAd: '/new-ad',
  businesses: '/businesses',
  business: '/business/',
  notifications: '/notifications',
  authGroup: '/(auth)',
  register: '/register',
  confirm: '/confirm',
  loading: '/loading',
} as const;

export const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
export const CHAT_RE = /^\/profile\/chat/;

export const USE_NOTIFICATION_TAP_ROUTES = {
  chat: ROUTES.chat,
  wanted: ROUTES.wanted,
  subscription: ROUTES.subscription,
  messages: ROUTES.messages,
  notifications: ROUTES.notifications,
} as const;

const vehicleRoute = (category: string): RouteBuilder => (id) => ({
  pathname: ROUTES.vehicleDetail,
  params: { id, category },
});

const buildCarsRoute = vehicleRoute('cars');
const buildBoatsRoute = vehicleRoute('boats');
const buildMotorcyclesRoute = vehicleRoute('motorcycles');
const buildFarmEquipmentRoute = vehicleRoute('farmequipment');
const buildRealEstateRoute: RouteBuilder = (id) => ({ pathname: ROUTES.realEstateDetail, params: { id } });
const buildJobRoute: RouteBuilder = (id) => ({ pathname: ROUTES.jobDetail, params: { id } });
const buildMarketplaceRoute: RouteBuilder = (id) => ({ pathname: ROUTES.itemDetail, params: { id } });

export const DEFAULT_DETAIL_ROUTE_BUILDER = buildMarketplaceRoute;

export const EXACT_CATEGORY_ROUTES: RouteBuilderMap = {
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

export const CATEGORY_PATTERN_ROUTES: CategoryPatternRoute[] = [
  { patterns: ['gawaari', 'car'], build: buildCarsRoute },
  { patterns: ['boat'], build: buildBoatsRoute },
  { patterns: ['motorcycle', 'matooro'], build: buildMotorcyclesRoute },
  { patterns: ['farm', 'equipment', 'traktor', 'tractor'], build: buildFarmEquipmentRoute },
  { patterns: ['estate', 'apartment', 'house', 'land', 'villa', 'iib', 'kira'], build: buildRealEstateRoute },
  { patterns: ['job'], build: buildJobRoute },
];

export const TRACKING_EXCLUDED_PATHS = [PATHNAMES.loading];

export const SITE_URL = 'https://www.karaadi.com';
export const PRIVACY_POLICY_PATH = '/privacy';
export const getSitePayUrl = (listingId: string) =>
  `${SITE_URL}/mine/pay/${encodeURIComponent(listingId)}`;

export const NEW_AD_RESUME_PATHS: StringMap = {
  category: PATHNAMES.newAd,
  plan: '/plan',
  payment: '/payment',
};

export const WEB_CREATE_AD_PREFIX = '/create-ad-for-';
export const WEB_CREATE_AD_SLUGS: StringMap = {
  Marketplace: 'marketplace',
  Cars: 'cars',
  RealEstate: 'real-estate',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'farmequipment',
  Jobs: 'jobs',
};
