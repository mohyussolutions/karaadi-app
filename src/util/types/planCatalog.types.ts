export type PlanTierKey = 'premium90' | 'standard60' | 'basic30';

export interface PlanDefinition {
  key: PlanTierKey;
  label: string;
  days: number;
  popular: boolean;
  features: string[];
}
