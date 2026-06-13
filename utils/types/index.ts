import type { ComponentProps } from 'react';
import type MaterialCommunityIconsType from '@expo/vector-icons/MaterialCommunityIcons';

export type {
  NestedSubCategory, SubCategory, MainCategory,
  CategoryGridProps, NestedChipsProps, SidebarNestedProps, GridProps, SidebarProps,
  ChipItemProps, NestedItemProps, LocationFilterModalProps, FilterRow,
} from './category.types';

export type IconName = ComponentProps<typeof MaterialCommunityIconsType>['name'];

export type { User, AuthResponse } from './user.types';
export type {
  SpecRow, DetailCardProps, ImageGalleryProps, RecommendedSectionProps,
  ZoomModalProps, DetailNotFoundProps, SellerCardProps, MessageBanner,
  DetailActionBarProps, SocialShareSheetProps, SocialAction, SocialPostCardProps,
  NotificationBannerProps, SwipeDownToCloseProps,
} from './detail.types';
export type {
  Region, City, RegionPickerItem, CityPickerItem, RegionCityPickerProps, PickerFieldsProps,
  CityAccordionPanelProps, RegionAccordionPanelProps,
  TabItem, LoadingSpinnerProps, EmptyStateProps, ListingCardProps, MyAdCardProps,
  SplashScreenProps, ResponsiveLayoutProps, ResponsiveInfo, MenuItem, SettingsRow,
  PaymentStatusConfig, PaymentCategoryInfo,
} from './shared.types';
export type {
  ListingBase, Car, RealEstate, Motorcycle, Boat,
  MarketplaceItem, FarmEquipment, Job, WantedItem,
  AnyListing, PaginatedResponse, VehicleListing,
  Subscription, SubscriptionPayload, Favorite, SearchResult, WantedFormState,
} from './listing.types';
export type { Chat, ChatMessage, ChatUser, Chatroom } from './chat.types';
export type {
  ListingType, Step, PayMethod, Plan, BusinessPlan, BusinessApplyFormState,
  DropdownOption, FieldDef,
  DropdownProps, FormFieldProps, ImagePickerRowProps,
  StepCategoryProps, StepPaymentProps, StepPlanProps, StepSummaryProps, StepTypeProps, StepFormProps,
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
