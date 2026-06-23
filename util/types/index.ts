export type { Params, ExtraHeaders, ApiData, ApiResponse, RequestOptions } from './api.types';

export type { User, AuthResponse } from './user.types';
export type {
  ListingBase, Car, RealEstate, Motorcycle, Boat,
  MarketplaceItem, FarmEquipment, Job, WantedItem,
  AnyListing, PaginatedResponse, VehicleListing,
  Subscription, SubscriptionPayload, Favorite, SearchResult, WantedFormState,
  VehicleSpecField, VehicleTypeConfig,
} from './listing.types';
export type { Chat, ChatMessage, ChatUser, Chatroom } from './chat.types';
export type { HageMessage, ListingRef, HageChatResult, RawListingRef, HageChatApiResponse } from './hage.types';

export { BUSINESS_TYPE_ICON, BUSINESS_TYPE_LABEL } from './business.types';
export type { BusinessPlan, BusinessApplyFormState } from './business.types';

export type {
  NestedSubCategory, SubCategory, MainCategory,
  CategoryGridProps, NestedChipsProps, SidebarNestedProps, GridProps, SidebarProps,
  ChipItemProps, NestedItemProps, LocationFilterModalProps, FilterRow,
  SubcategoryHeaderProps,
} from './category.types';

export type {
  Region, City, RegionPickerItem, CityPickerItem,
  RegionCityPickerProps, PickerFieldsProps, CityAccordionPanelProps, RegionAccordionPanelProps,
} from './geo.types';

export type {
  TabItem, MenuItem, SettingsRow, Language, BizStepDef, ResponsiveInfo,
} from './navigation.types';

export type {
  ImageGalleryProps, ZoomModalProps,
  SpecRow, DetailCardProps, DetailNotFoundProps, SwipeDownToCloseProps,
  DetailActionBarProps, RecommendedSectionProps,
  SellerCardProps, ListingCardProps, MyAdCardProps,
  SocialShareSheetProps, SocialAction, SocialPostCardProps,
  MessageBanner, NotificationBannerProps,
  LoadingSpinnerProps, EmptyStateProps, SplashScreenProps, ResponsiveLayoutProps,
  PaymentStatusConfig, PaymentCategoryInfo,
} from './component.types';

export type {
  ListingType, Step, PayMethod, Plan, CreatedItemSummary, NewAdState,
  DropdownOption, FieldDef,
  DropdownProps, FormFieldProps, ImagePickerRowProps,
  StepCategoryProps, StepPaymentProps, StepSummaryProps,
  StepPlanProps, StepTypeProps, StepFormProps,
  SuccessScreenProps, PhoneInputProps, PaymentMethodSelectorProps,
  PollingOverlayProps, OrderSummaryProps, StepItem, CheckoutBarProps,
} from './new-ad.types';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

import type { ComponentProps } from 'react';
import type MaterialCommunityIconsType from '@expo/vector-icons/MaterialCommunityIcons';
export type IconName = ComponentProps<typeof MaterialCommunityIconsType>['name'];
