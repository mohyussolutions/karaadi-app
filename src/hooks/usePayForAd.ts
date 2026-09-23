import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../store/store';
import { prefillForPayment } from '../store/slices/newAdSlice';
import { ROUTES } from '../constants';
import type { ListingBase } from '../util/types';

export function usePayForAd() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback((item: ListingBase) => {
    dispatch(prefillForPayment({
      categoryKey: item.mainCategory,
      createdId: item._id || item.id,
      createdTitle: item.title,
      createdItem: {
        title: item.title,
        price: item.price,
        images: item.images,
        categoryTag: item.category || item.mainCategory,
        mainCategory: item.mainCategory,
        region: item.region || undefined,
        city: item.city || undefined,
        description: item.description || undefined,
      },
    }));
    router.push(ROUTES.newAd);
  }, [dispatch, router]);
}
