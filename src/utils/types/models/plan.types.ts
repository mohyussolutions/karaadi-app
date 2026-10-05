import type { MCIcon } from '../app/icon.types';

export interface Plan {
  _id: string;
  key: string;
  label: string;
  days: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface PlanStyle {
  color: string;
  icon: MCIcon;
  bg: string;
}

export type PlanTierKey = 'premium90' | 'standard60' | 'basic30';

export interface PlanDefinition {
  key: PlanTierKey;
  label: string;
  days: number;
  popular: boolean;
  features: string[];
}

export type PlanStyleMap = Record<string, PlanStyle>;
export type PlanKeyRef = Partial<Pick<Plan, 'key'>>;
