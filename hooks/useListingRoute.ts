import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { getListingDetailRoute } from '../utils/helpers';
import type { ListingBase } from '../utils/types/listing.types';

export function useListingRoute() {
  const router = useRouter();

  const navigate = useCallback(
    (item: Partial<ListingBase> & { id?: string; _id?: string }, categoryKey?: string) => {
      router.push(getListingDetailRoute(item as any, categoryKey) as any);
    },
    [router],
  );

  const getRoute = useCallback(
    (item: Partial<ListingBase> & { id?: string; _id?: string }, categoryKey?: string) => {
      return getListingDetailRoute(item as any, categoryKey);
    },
    [],
  );

  return { navigate, getRoute };
}
