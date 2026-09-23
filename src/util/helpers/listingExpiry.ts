import type { ListingExpiryInfo } from '../types/listing.types';

type Translate = (key: string, opts?: Record<string, unknown>) => string;

export function getListingExpiryInfo(
  expiryDate: string | null | undefined,
  t: Translate,
): ListingExpiryInfo | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;
  const urgent = !isExpired && daysLeft <= 7;
  const date = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const status = isExpired
    ? t('mine.myAds.expiredAgo', { count: Math.abs(daysLeft) })
    : daysLeft === 1
      ? t('mine.myAds.expiresTomorrow')
      : t('mine.myAds.daysLeft', { count: daysLeft });
  return { date, status, isExpired, urgent };
}
