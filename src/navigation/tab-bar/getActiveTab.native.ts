import { DEFAULT_TAB, TAB_ROUTE_PREFIXES } from '../../actions/constants';
import type { TabName } from '../../utils/types';

export const getActiveTab = (pathname: string): TabName =>
  (Object.entries(TAB_ROUTE_PREFIXES).find(([, prefixes]) =>
    prefixes.some((prefix) => pathname.startsWith(prefix)),
  )?.[0] as TabName | undefined) ?? DEFAULT_TAB;
