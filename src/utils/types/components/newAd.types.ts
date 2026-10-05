import type { ComponentType } from 'react';
import type { WantedFormState } from '../models/listing.types';
import type { MCIcon } from '../app/icon.types';
import type { ModalProps } from './modals.types';
import type { MainCategory, NestedSubCategory } from '../models/category.types';
import type { Subscription } from '../models/listing.types';
import type { CreatedItemSummary, ListingType, StepItem } from '../models/newAd.types';
import type { PaymentMethod } from '../models/payment.types';
import type { Plan } from '../models/plan.types';

export interface SectionTitleProps {
  label: string;
}

export interface WantedImagePickerRowProps {
  images: string[];
  onPick: () => void;
  onRemove: (index: number) => void;
}

export interface StepNavProps {
  onNext: () => void;
  onBack: () => void;
}

export interface StepCategoryProps extends StepNavProps {
  selected: string;
  onSelect: (key: string) => void;
}

export interface CategoryCardProps {
  category: MainCategory;
  selected: boolean;
  onPress: (key: string) => void;
}

export interface StepPaymentProps {
  plan: Plan;
  listingId: string;
  listingTitle: string;
  categoryKey: string;
  entityModel?: string;
  successRoute?: string;
  onBack: () => void;
}

export interface StepSummaryProps extends StepNavProps {
  plan: Plan;
  categoryName?: string;
}

export interface StepPlanProps extends StepNavProps {
  plans: Plan[];
  loading: boolean;
  selected: Plan | null;
  onSelect: (p: Plan) => void;
}

export interface StepTypeProps {
  onSelect: (type: ListingType) => void;
}

export interface StepFormProps {
  categoryKey: string;
  listingType: ListingType | null;
  onSuccess: () => void;
  onBack: () => void;
}

export interface SuccessScreenProps {
  plan: Plan;
  listingTitle: string;
  listingId: string;
  categoryKey?: string;
  createdItem: CreatedItemSummary | null;
  onDone: () => void;
  isPremium90?: boolean;
}

export interface PhoneInputProps {
  method: PaymentMethod;
  value: string;
  onChange: (v: string) => void;
  error: string;
}

export interface SelectedMethodCardProps {
  method: PaymentMethod;
  onChange: () => void;
}

export interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}

export interface PollingOverlayProps {
  visible: boolean;
  attempt: number;
  maxAttempts: number;
  onCancel: () => void;
}

export interface OrderSummaryProps {
  plan: Plan;
  item: CreatedItemSummary | null;
  categoryName?: string;
  feeAmount: number;
}

export interface CheckoutBarProps {
  steps: StepItem[];
  currentIndex: number;
}

export interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  isBestValue: boolean;
  onSelect: (p: Plan) => void;
  compact?: boolean;
  width?: number;
}

export interface NestedSubcategoryPickerProps {
  options: NestedSubCategory[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedKey: string;
  onSelect: (key: string) => void;
}

export interface TopBarProps {
  onBack: () => void;
  title?: string;
}

export interface IOSPaymentScreenProps {
  onBack: () => void;
  listingId: string;
}

export interface ErrorBannerProps {
  message: string;
}

export interface CheckoutHeadingProps {
  title: string;
  subtitle?: string;
}

export interface AmountBlockProps {
  label: string;
  amount: string;
  meta?: string;
  free?: boolean;
}

export interface LedgerRowProps {
  label: string;
  value: string;
  free?: boolean;
}

export interface CheckoutFooterProps {
  label: string;
  icon: MCIcon;
  onPress: () => void;
  disabled?: boolean;
  showSecureNote?: boolean;
}

export interface ImageCarouselProps {
  images: string[];
  index: number;
  onChangeIndex: (i: number) => void;
}

export interface WantedAlertFormProps extends ModalProps {
  onCreated: (sub: Subscription) => void;
}

export type CategoryFormProps = Omit<StepFormProps, 'categoryKey'>;

export type CategoryFormMap = Record<string, ComponentType<CategoryFormProps>>;
export type NestedSubcategoryOptions = NestedSubcategoryPickerProps['options'];
export type WantedFormField = keyof WantedFormState;
