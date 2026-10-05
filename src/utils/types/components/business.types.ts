import type { ReactNode } from 'react';
import type { MCIcon } from '../app/icon.types';
import type { Business, BusinessApplyFormState, BusinessPlan } from '../models/business.types';

export interface BusinessApplyStepProps {
  initialValues: BusinessApplyFormState;
  initialLogo?: string;
  isEditing: boolean;
  editId?: string;
  accountEmail: string;
  plan: BusinessPlan | null;
  onSuccess: (business: Business) => void;
  onCancel: () => void;
}

export interface BusinessApprovalStepProps {
  business: Business;
  onApproved: (biz: Business) => void;
}

export interface BusinessCategoriesStepProps {
  business: Business;
  onSaved: (biz: Business) => void;
}

export interface BusinessPlanCardProps {
  plan: BusinessPlan;
  selected: boolean;
  isBestValue: boolean;
  onSelect: (p: BusinessPlan) => void;
  compact?: boolean;
  width?: number;
}

export interface BusinessPlanStepProps {
  business: Business | null;
  onSelected: (result: BusinessPlan | Business) => void;
}

export interface BusinessPostStepProps {
  business: Business;
  onSelectCategory: (category: string) => void;
}

export interface BusinessSectionHeaderProps {
  title: string;
  icon: MCIcon;
}

export interface BusinessFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export interface BizStepDef {
  key: string;
  labelKey: string;
}
