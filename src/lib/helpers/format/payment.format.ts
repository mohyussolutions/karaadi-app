import type { TFunction } from 'i18next';
import type { ColorPalette, PaymentItem, PaymentStatusConfig } from '../../../utils/types';

export function getPaymentStatus(t: TFunction, Colors: ColorPalette, status?: string | null): PaymentStatusConfig {
  switch ((status ?? '').toLowerCase()) {
    case 'completed':
    case 'success':
      return { label: t('mine.payments.status.completed'), color: Colors.success };
    case 'pending':
      return { label: t('mine.payments.status.pending'), color: Colors.warning };
    case 'failed':
    case 'declined':
      return { label: t('mine.payments.status.failed'), color: Colors.error };
    default:
      return { label: status || t('mine.payments.status.unknown'), color: Colors.textMuted };
  }
}

export function getPaymentCategoryLabel(t: TFunction, p: PaymentItem): string {
  if (p.boatId) return t('mine.payments.category.boat');
  if (p.carId) return t('mine.payments.category.car');
  if (p.realEstateId) return t('mine.payments.category.realEstate');
  if (p.motorcycleId) return t('mine.payments.category.motorcycle');
  if (p.farmequipmentId) return t('mine.payments.category.farmEquip');
  if (p.marketplaceId) return t('mine.payments.category.marketplace');
  if (p.jobId) return t('mine.payments.category.job');
  if (p.subscriptionId) return t('mine.payments.category.subscription');
  if (p.businessId) return t('mine.payments.category.business');
  return t('mine.payments.category.payment');
}
