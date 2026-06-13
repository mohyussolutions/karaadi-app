import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getImageUrl,
  formatPrice,
  formatDate,
  formatTimeAgo,
  truncate,
} from '../utils/helpers';

export function useFormat() {
  const { t } = useTranslation();

  const price = useCallback(
    (value: number, currency = '$') =>
      value > 0 ? formatPrice(value, currency) : t('priceOnRequest'),
    [t],
  );

  const date = useCallback((d: string) => formatDate(d), []);

  const timeAgo = useCallback((d: string) => formatTimeAgo(d), []);

  const imageUrl = useCallback((path?: string | null) => getImageUrl(path), []);

  const cut = useCallback((text: string, max: number) => truncate(text, max), []);

  return { price, date, timeAgo, imageUrl, cut };
}
