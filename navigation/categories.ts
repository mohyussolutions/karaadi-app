export {
  MAIN_CATEGORIES,
  SUB_I18N_GROUP,
  getCategoryByKey,
} from "../constants/categories";
export type {
  MainCategory,
  SubCategory,
  NestedSubCategory,
} from "../constants/categories";

import { MAIN_CATEGORIES, SubCategory } from "../constants/categories";

export function getSubCategory(
  catKey: string,
  subKey: string,
): SubCategory | undefined {
  const lower = catKey.toLowerCase();
  const cat = MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower);
  return cat?.subCategories.find((s) => s.key === subKey);
}

export function getCategoryRoute(catKey: string): string {
  return `/browse/${catKey.toLowerCase()}`;
}

export function getSubcategoryRoute(catKey: string, subKey: string): string {
  return `/browse/${catKey.toLowerCase()}/${subKey}`;
}

export function getCategoryColor(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.color ??
    "#6B7280"
  );
}

export function getCategoryIcon(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.icon ??
    "tag-outline"
  );
}

export function getCategoryApiPath(catKey: string): string {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.apiPath ??
    `/api/${lower}`
  );
}

export function getAllSubCategories(catKey: string): SubCategory[] {
  const lower = catKey.toLowerCase();
  return (
    MAIN_CATEGORIES.find((c) => c.key.toLowerCase() === lower)?.subCategories ??
    []
  );
}
