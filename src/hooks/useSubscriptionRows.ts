import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import { subscriptionToListingItem, subscriptionPriceLabel } from '../util/helpers';
import type { Subscription } from '../util/types';

export function useSubscriptionRows(subs: Subscription[]) {
  const { t } = useAppTranslation();
  return useMemo(() => subs.map((sub) => ({
    sub,
    listingItem: subscriptionToListingItem(sub),
    priceLabel: subscriptionPriceLabel(sub, t('priceOnRequest')),
  })), [subs, t]);
}
