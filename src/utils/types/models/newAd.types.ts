import type { TFn } from '../app/i18n.types';
import type { MCIcon } from '../app/icon.types';
import type { DropdownOption } from '../components/forms.types';
import type { Plan } from './plan.types';

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

export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'number' | 'dropdown' | 'phone' | 'multiselect';
  options?: Array<string | DropdownOption>;
  required?: boolean;
}

export interface StepItem {
  key: string;
  label: string;
}

export type ListingBody = Record<string, string | number | boolean | string[] | undefined>;

export type FieldCheck = (field: FieldDef, formData: Record<string, string>, t: TFn) => string | undefined;

export type StepIndexMap = Record<Step, number>;
export type StepGuardMap = Record<Step, (state: NewAdState) => boolean>;
export type FieldDefMap = Record<string, FieldDef[]>;
