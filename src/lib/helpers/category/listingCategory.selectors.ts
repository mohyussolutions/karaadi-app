import { SUB_I18N_GROUP } from '../../../actions/constants/app.constants';
import {
  MAIN_CATEGORIES,
  MAIN_CATEGORY_DEFINITIONS,
} from '../../../categoriesListing/main-categories/mainCategories';

import { buildCategoryFeeKeyMap, buildCategoryLabelMap, buildSubCategoryFeeFieldMap } from './listingCategory.builders';

import type { CategoryContext, MainCategory, SubCategory } from '../../../utils/types';

const MAIN_CATEGORY_BY_KEY = new Map(MAIN_CATEGORIES.map((category) => [category.key, category]));

export const getCategoryByKey = (key: string): MainCategory | undefined => MAIN_CATEGORY_BY_KEY.get(key);

export const getSubCategoryByKey = (category: MainCategory | undefined, key?: string): SubCategory | undefined =>
  category?.subCategories.find((subCategory) => subCategory.key === key);

export const getCategoryI18nGroup = (key: string): string => SUB_I18N_GROUP[key] ?? key.toLowerCase();

export const getCategoryContext = (categoryKey?: string, subCategoryKey?: string): CategoryContext => {
  const category = categoryKey ? getCategoryByKey(categoryKey) : undefined;
  return {
    category,
    subCategory: getSubCategoryByKey(category, subCategoryKey),
    i18nGroup: categoryKey ? getCategoryI18nGroup(categoryKey) : '',
  };
};

export const PAGED_CATEGORY_KEYS = MAIN_CATEGORIES.map((category) => category.key);

export const CATEGORY_FEE_KEY = buildCategoryFeeKeyMap(MAIN_CATEGORY_DEFINITIONS);

export const SUBCATEGORY_FEE_FIELD = buildSubCategoryFeeFieldMap(MAIN_CATEGORY_DEFINITIONS);

export const CATEGORY_MAIN_LABEL = buildCategoryLabelMap(MAIN_CATEGORY_DEFINITIONS);
