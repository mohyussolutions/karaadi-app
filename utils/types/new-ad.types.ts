export type ListingType = 'private' | 'public';

export type Step = 'login' | 'type' | 'category' | 'form' | 'plan' | 'summary' | 'payment';

export type PayMethod = 'evc' | 'zaad' | 'sahal';

export interface Plan {
  _id: string;
  key: string;
  label: string;
  days: number;
  price: number;
  features: string[];
  popular?: boolean;
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
  type: 'text' | 'textarea' | 'number' | 'dropdown' | 'phone';
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

export interface StepCategoryProps {
  selected: string;
  onSelect: (key: string) => void;
  onNext: () => void;
  onBack: () => void;
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

export interface StepSummaryProps {
  plan: Plan;
  categoryName?: string;
  onNext: () => void;
  onBack: () => void;
}

export interface StepPlanProps {
  plans: Plan[];
  loading: boolean;
  selected: Plan | null;
  onSelect: (p: Plan) => void;
  onNext: () => void;
  onBack: () => void;
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
}

export interface PhoneInputProps {
  method: PayMethod;
  value: string;
  onChange: (v: string) => void;
  error: string;
}

export interface PaymentMethodSelectorProps {
  selected: PayMethod;
  onChange: (m: PayMethod) => void;
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

export interface BusinessApplyFormState {
  name: string;
  orgNumber: string;
  email: string;
  phone: string;
  contactName: string;
  website: string;
  address: string;
  description: string;
}

export interface BusinessPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  maxListings: number;
  categories: string[];
  features: string[];
  isActive: boolean;
}

export interface StepItem {
  key: string;
  label: string;
}

export interface CheckoutBarProps {
  steps: StepItem[];
  currentIndex: number;
}
