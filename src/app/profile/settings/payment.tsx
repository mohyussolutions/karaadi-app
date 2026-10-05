import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useTabBarClearance } from '../../../hooks/app/useResponsive';
import { LoadingSpinner } from '../../../components/loading';
import { usePaymentHistory } from '../../../hooks/business/usePayments';
import { formatPrice, getPaymentCategoryLabel, getPaymentStatus } from '../../../lib/helpers';
import { createStyles } from '../../../utils/styles/settings/paymentSettings.styles';
import { paddingBottomOf, textColor } from '../../../utils/styles/common/dynamic.styles';

export default function PaymentSettings() {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const clearance = useTabBarClearance();
  const { user, payments, loading, totalPaid } = usePaymentHistory();

  if (!user) return null;
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={[s.content, paddingBottomOf(clearance + 24)]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.totalBlock}>
          <Text style={s.totalLabel}>{t('mine.payments.totalPaid')}</Text>
          <Text style={s.totalValue}>{formatPrice(totalPaid)}</Text>
          <Text style={s.totalMeta}>{t('mine.payments.transactionsCount', { count: payments.length })}</Text>
        </View>

        <View style={s.body}>
          <Text style={s.heading} accessibilityRole="header">{t('mine.payments.history')}</Text>

          {payments.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>{t('mine.payments.noPaymentsYet')}</Text>
              <Text style={s.emptyMsg}>{t('mine.payments.noPaymentsDesc')}</Text>
            </View>
          ) : (
            payments.map((p) => {
              const status = getPaymentStatus(t, Colors, p.status);
              const date = p.paidAt ?? p.createdAt;
              const meta = [
                (p.paymentMethod ?? 'mobile').toUpperCase(),
                date ? new Date(date).toLocaleDateString('en-GB') : '',
              ].filter(Boolean).join(' · ');
              return (
                <View key={p.id} style={s.row}>
                  <View style={s.rowMain}>
                    <Text style={s.rowLabel}>{getPaymentCategoryLabel(t, p)}</Text>
                    <Text style={s.rowMeta}>{meta}</Text>
                    {!!p.transactionId && <Text style={s.txId} numberOfLines={1}>{p.transactionId}</Text>}
                  </View>
                  <View style={s.rowSide}>
                    <Text style={s.amount}>{formatPrice(p.totalAmount ?? 0)}</Text>
                    <Text style={[s.status, textColor(status.color)]}>{status.label}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
