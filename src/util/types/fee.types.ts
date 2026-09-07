export interface FeeRecord {
  id?: string;
  _id?: string;
  isActive?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface SubPlanConfig extends FeeRecord {
  basic30?: number;
  standard60?: number;
  premium90?: number;
}

export interface SystemFeeConfig extends FeeRecord {
  taxRate?: number;
  waafi?: number;
  platformFee?: number;
  currency?: string;
  companyExpenses?: number;
}

export interface AllFeeConfigs {
  marketplace: FeeRecord[];
  realEstate: FeeRecord[];
  cars: FeeRecord[];
  motorcycles: FeeRecord[];
  boats: FeeRecord[];
  equipment: FeeRecord[];
  subscriptionFees: FeeRecord[];
  subPlans: SubPlanConfig[];
  system: SystemFeeConfig | null;
  businessPlans: FeeRecord[];
}
