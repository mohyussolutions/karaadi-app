import type { MCIcon } from '../icons/icons';
import type { NestedSubCategory } from './browse.types';
import type { ModalProps } from './generic.types';

interface StepNavProps {
  onNext: () => void;
  onBack: () => void;
}

export type TFn = (key: string, opts?: Record<string, unknown>) => string;

export type ListingType = 'private' | 'public';

export interface ListingTypeOption {
  type: ListingType;
  labelKey: string;
  subKey: string;
  icon: MCIcon;
  bg: string;
  color: string;
}

export type Step = 'login' | 'type' | 'category' | 'form' | 'plan' | 'summary' | 'payment';

export type PaymentMethod = 'evc' | 'zaad' | 'sahal' | 'waafi';
export type PaymentStatus = 'idle' | 'polling' | 'success' | 'failed';

export interface PaymentMethodOption {
  key: PaymentMethod;
  label: string;
  sublabel: string;
  prefix: string;
  color: string;
}

export interface Plan {
  _id: string;
  key: string;
  label: string;
  days: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface AttrItem {
  label: string;
  value: string;
}

export interface CreatedItemSummary {
  title: string;
  price: number;
  images: string[];
  categoryTag: string;
  mainCategory: string;
  region?: string;
  city?: string;
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  type?: string;
  color?: string;
  description?: string;
  allAttrs?: AttrItem[];
}

export interface PlanStyle {
  color: string;
  icon: MCIcon;
  bg: string;
}

export interface NewAdState {
  step: Step;
  listingType: ListingType | null;
  categoryKey: string;
  businessId: string | null;
  plans: Plan[];
  plansLoading: boolean;
  selectedPlan: Plan | null;
  createdId: string;
  createdTitle: string;
  createdItem: CreatedItemSummary | null;
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  submitError: string | null;
  feeId: string;
  feeAmount: number;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'number' | 'dropdown' | 'phone' | 'multiselect';
  options?: Array<string | DropdownOption>;
  required?: boolean;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: Array<string | DropdownOption>;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export interface FormFieldProps {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export interface ImagePickerRowProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export interface StepCategoryProps extends StepNavProps {
  selected: string;
  onSelect: (key: string) => void;
}

export interface CategoryCardProps {
  category: import('./browse.types').MainCategory;
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

export interface UsePaymentFlowParams {
  plan: Plan;
  listingId: string;
  categoryKey: string;
}

export interface PaymentItem {
  id: string;
  totalAmount?: number;
  status?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
  boatId?: string;
  carId?: string;
  realEstateId?: string;
  motorcycleId?: string;
  farmequipmentId?: string;
  marketplaceId?: string;
  jobId?: string;
  subscriptionId?: string;
  businessId?: string;
}

export interface InitiatePaymentPayload {
  provider: PaymentMethod;
  phone: string;
  amount: number;
  planAmount: number;
  adId: string;
  planId: string;
  planType: string;
  feeId?: string;
  categoryType: string;
}

export interface ActivateListingPayload {
  isPaid: boolean;
  planId?: string;
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

export interface StepItem {
  key: string;
  label: string;
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
}

export interface ErrorBannerProps {
  message: string;
}

export interface PayFooterProps {
  total: number;
  methodMeta: PaymentMethodOption;
  onPay: () => void;
}

export interface ImageCarouselProps {
  images: string[];
  index: number;
  onChangeIndex: (i: number) => void;
}

export interface TitleSectionProps {
  item: CreatedItemSummary | null;
  categoryName?: string;
}

export interface AllFieldsGridProps {
  attrs: AttrItem[];
}

export interface DescriptionBoxProps {
  text: string;
}

export interface PriceBreakdownProps {
  plan: Plan;
  ps: PlanStyle;
  feeAmount: number;
}

export interface TotalDueProps {
  total: number;
}

export interface WantedAlertFormProps extends ModalProps {
  onCreated: (sub: import('./listing.types').Subscription) => void;
}

export type UseWantedAlertFormArgs = Omit<WantedAlertFormProps, 'visible'>;

export type ListingBody = Record<string, string | number | boolean | string[] | undefined>;

export interface UseSubmitListingArgs {
  categoryKey: string;
  listingType: ListingType | null;
  fields: FieldDef[];
  formData: Record<string, string>;
  images: string[];
  user: import('./user.types').User | null;
  onSuccess: () => void;
  t: TFn;
}
