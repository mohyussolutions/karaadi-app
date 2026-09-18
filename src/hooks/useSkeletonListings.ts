import { useMemo } from 'react';
import type { ListingBase } from '../util/types/listing.types';

export function useSkeletonListings(count: number) {
  return useMemo(
    () => Array.from({ length: count }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }) as unknown as ListingBase),
    [count],
  );
}
