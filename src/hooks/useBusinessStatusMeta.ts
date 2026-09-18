import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import type { MCIcon } from '../util/icons/icons';

export function useBusinessStatusMeta() {
  const { t } = useAppTranslation();
  return useMemo((): Record<string, { icon: MCIcon; colorKey: 'primary' | 'success' | 'error'; title: string; message: string }> => ({
    pending: {
      icon: 'clock-outline', colorKey: 'primary',
      title: t('mine.businesses.pendingTitle'),
      message: t('mine.businesses.pendingMessage'),
    },
    active: {
      icon: 'check-decagram', colorKey: 'success',
      title: t('mine.businesses.approvedTitle'),
      message: t('mine.businesses.approvedMessage'),
    },
    rejected: {
      icon: 'close-circle-outline', colorKey: 'error',
      title: t('mine.businesses.rejectedTitle'),
      message: t('mine.businesses.rejectedMessage'),
    },
  }), [t]);
}
