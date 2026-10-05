import { useMemo } from 'react';

import { getCategoryContext } from '../../lib/helpers/category/listingCategory.selectors';

export const useCategoryContext = (categoryKey?: string, subCategoryKey?: string) =>
  useMemo(() => getCategoryContext(categoryKey, subCategoryKey), [categoryKey, subCategoryKey]);
