import { CAT_PATHS } from "../../../actions/constants/paths";
import { CAT_COLORS } from "../../../utils/colors/colors";

import type {
  CategoryDefinition,
  CategoryFeeKeyMap,
  CategoryLabelMap,
  CategoryMeta,
  MainCategory,
  MainCategoryDefinition,
  NestedSubCategory,
  SubCategory,
  SubCategoryFeeFieldMap,
  SubCategoryListDefinition,
} from "../../../utils/types";

export const toCategory = ({
  key,
  name,
  icon,
  subCategories,
}: CategoryDefinition): SubCategory => ({
  key,
  name,
  icon,
  nested: subCategories,
});

export const toMainCategory = ({
  key,
  name,
  icon,
  slug,
  categories,
}: MainCategoryDefinition): MainCategory => ({
  key,
  name,
  icon,
  color: CAT_COLORS[slug],
  apiPath: CAT_PATHS[slug],
  subCategories: categories.map(toCategory),
});

export const buildCategoryFeeKeyMap = (
  categories: CategoryMeta[],
): CategoryFeeKeyMap =>
  Object.fromEntries(categories.map(({ key, feeKey }) => [key, feeKey]));

export const buildCategoryLabelMap = (
  categories: CategoryMeta[],
): CategoryLabelMap =>
  Object.fromEntries(
    categories.map(({ key, name, label }) => [key, label ?? name]),
  );

export const buildSubCategoryFeeFieldMap = (
  mainCategories: MainCategoryDefinition[],
): SubCategoryFeeFieldMap =>
  Object.fromEntries(
    mainCategories.map(({ key, categories }) => [
      key,
      Object.fromEntries(
        categories.map((category) => [category.key, category.feeField]),
      ),
    ]),
  );

export const createSubCategoryBuilder =
  (labelRoot: string, other: NestedSubCategory) =>
  <K extends string>({
    group,
    icons,
    items,
    includeOther = true,
  }: SubCategoryListDefinition<K>): NestedSubCategory[] => {
    const list = items.map((key) => ({
      key,
      labelKey: `${labelRoot}.${group}.${key}`,
      icon: icons[key],
    }));
    return includeOther ? [...list, other] : list;
  };

export const defineMainCategories = (definitions: MainCategoryDefinition[]) =>
  definitions;

export const defineCategories = (definitions: CategoryDefinition[]) =>
  definitions;

export const defineSubCategory = (subCategory: NestedSubCategory) =>
  subCategory;
