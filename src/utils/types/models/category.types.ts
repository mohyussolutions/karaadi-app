import type { CAT_PATHS } from '../../../actions/constants/paths';
import type { FeeArrayKey } from './fee.types';

export type CategorySlug = Exclude<keyof typeof CAT_PATHS, 'jobs'>;

export interface SubCategoryListDefinition<K extends string = string> {
  group: string;
  icons: Record<K, string>;
  items: K[];
  includeOther?: boolean;
}

export interface NestedSubCategory {
  key: string;
  labelKey: string;
  icon: string;
}

export interface SubCategory {
  key: string;
  name: string;
  icon: string;
  nested?: NestedSubCategory[];
}

export interface MainCategory {
  key: string;
  name: string;
  icon: string;
  color: string;
  apiPath: string;
  subCategories: SubCategory[];
}

export type CategoryFeeKeyMap = Record<string, FeeArrayKey>;

export type SubCategoryFeeFieldMap = Record<string, Record<string, string>>;

export type CategoryLabelMap = Record<string, string>;

export interface CategoryDefinition {
  key: string;
  name: string;
  icon: string;
  feeField: string;
  subCategories: NestedSubCategory[];
}

export interface CategoryMeta {
  key: string;
  name: string;
  label?: string;
  feeKey: FeeArrayKey;
}

export interface MainCategoryDefinition extends CategoryMeta {
  icon: string;
  slug: CategorySlug;
  categories: CategoryDefinition[];
}

export interface CategoryContext {
  category: MainCategory | undefined;
  subCategory: SubCategory | undefined;
  i18nGroup: string;
}
