import React from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useThemeColors, useThemedStyles, type ColorPalette } from '../../../hooks/useTheme';
import { usePaymentHistory, type PaymentItem } from '../../../hooks/usePaymentHistory';
import { createStyles } from '../../../util/styles/settings/payment.styles';
import type { PaymentStatusConfig, PaymentCategoryInfo } from '../../../util/types';

function getStatusConfig(t: TFunction, Colors: ColorPalette): Record<string, PaymentStatusConfig> {
  return {
    completed: { label: t('mine.payments.status.completed'), color: Colors.success, bg: Colors.success + '20', icon: 'check-circle-outline' },
    success:   { label: t('mine.payments.status.completed'), color: Colors.success, bg: Colors.success + '20', icon: 'check-circle-outline' },
    pending:   { label: t('mine.payments.status.pending'),   color: Colors.warning, bg: Colors.warning + '20', icon: 'clock-outline' },
    failed:    { label: t('mine.payments.status.failed'),    color: Colors.error,   bg: Colors.errorGhost,     icon: 'close-circle-outline' },
    declined:  { label: t('mine.payments.status.failed'),    color: Colors.error,   bg: Colors.errorGhost,     icon: 'close-circle-outline' },
  };
}

function getCategory(t: TFunction, p: PaymentItem, Colors: ColorPalette): PaymentCategoryInfo {
  if (p.boatId)          return { label: t('mine.payments.category.boat'),         icon: 'sail-boat',        color: Colors.catBoats };
  if (p.carId)           return { label: t('mine.payments.category.car'),          icon: 'car-outline',      color: Colors.catCars };
  if (p.realEstateId)    return { label: t('mine.payments.category.realEstate'),   icon: 'home-outline',     color: Colors.catRealEstate };
  if (p.motorcycleId)    return { label: t('mine.payments.category.motorcycle'),   icon: 'motorbike',        color: Colors.catMotorcycles };
  if (p.farmequipmentId) return { label: t('mine.payments.category.farmEquip'),    icon: 'tractor-variant',  color: Colors.catFarmEquipment };
  if (p.marketplaceId)   return { label: t('mine.payments.category.marketplace'),  icon: 'storefront-outline', color: Colors.catMarketplace };
  if (p.jobId)           return { label: t('mine.payments.category.job'),          icon: 'briefcase-outline', color: Colors.catJobs };
  if (p.subscriptionId)  return { label: t('mine.payments.category.subscription'), icon: 'bell-outline',     color: Colors.primary };
  if (p.businessId)      return { label: t('mine.payments.category.business'),     icon: 'domain',           color: Colors.secondary };
  return                        { label: t('mine.payments.category.payment'),      icon: 'receipt',          color: Colors.gray400 };
}

export default function PaymentSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, payments, loading, totalPaid } = usePaymentHistory();

  const Colors = useThemeColors();
  const STATUS_CONFIG = getStatusConfig(t, Colors);
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (!user) return null;

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['bottom']}>
        <ActivityIndicator style={s.loadingIndicator} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>

        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>{t('mine.payments.totalPaid')}</Text>
            <Text style={s.summaryValue}>${totalPaid.toLocaleString()}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>{t('mine.payments.transactions')}</Text>
            <Text style={s.summaryValue}>{payments.length}</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>{t('mine.payments.history')}</Text>

        {payments.length === 0 ? (
          <View style={s.emptyCard}>
            <MaterialCommunityIcons name="receipt" size={40} color={Colors.gray300} />
            <Text style={s.emptyTitle}>{t('mine.payments.noPaymentsYet')}</Text>
            <Text style={s.emptyMsg}>
              {t('mine.payments.noPaymentsDesc')}
            </Text>
          </View>
        ) : (
          <View style={s.card}>
            {payments.map((p, i) => {
              const statusKey = (p.status ?? '').toLowerCase();
              const status: PaymentStatusConfig = STATUS_CONFIG[statusKey] ?? {
                label: p.status ?? t('mine.payments.status.unknown'), color: Colors.gray500,
                bg: Colors.gray100, icon: 'receipt',
              };
              const cat = getCategory(t, p, Colors);
              const date = p.paidAt ?? p.createdAt;
              return (
                <View key={p.id} style={[s.row, i < payments.length - 1 && s.rowDivider]}>
                  <View style={[s.catIcon, { backgroundColor: cat.color + '18' }]}>
                    <MaterialCommunityIcons name={cat.icon as any} size={20} color={cat.color} />
                  </View>
                  <View style={s.flexFull}>
                    <Text style={s.rowLabel}>{cat.label}</Text>
                    {p.transactionId && (
                      <Text style={s.txId} numberOfLines={1}>{p.transactionId}</Text>
                    )}
                    <Text style={s.rowMeta}>
                      {(p.paymentMethod ?? 'mobile').toUpperCase()}
                      {date ? `  ·  ${new Date(date).toLocaleDateString('en-GB')}` : ''}
                    </Text>
                  </View>
                  <View style={s.amountCol}>
                    <Text style={s.amount}>${(p.totalAmount ?? 0).toLocaleString()}</Text>
                    <View style={[s.badge, { backgroundColor: status.bg }]}>
                      <MaterialCommunityIcons name={status.icon as any} size={11} color={status.color} />
                      <Text style={[s.badgeText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
