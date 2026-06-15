import { MAIN_CATEGORIES } from '../../constants/categories';

export const BUSINESS_TYPE_ICON: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.icon]),
);

export const BUSINESS_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.name]),
);
