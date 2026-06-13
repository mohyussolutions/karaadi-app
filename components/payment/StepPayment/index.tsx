import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useAppSelector } from '../../../store';
import type { StepPaymentProps } from '../../../utils/types';
import { MAX_POLL_ATTEMPTS, type PaymentMethodOption } from '../payment.constants';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PhoneInput } from './PhoneInput';
import { PollingOverlay } from './PollingOverlay';
import { SuccessScreen } from './SuccessScreen';
import { usePaymentFlow } from './usePaymentFlow';
import { createStyles } from '../../../utils/styles/payment/stepPayment.styles';

function ActivatingScreen() {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  return (
    <View style={s.root}>
      <View style={s.activatingWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={s.activatingText}>{t('postAd.activatingListing')}</Text>
      </View>
    </View>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  return (
    <View style={s.topBar}>
      <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={s.topBarTitle}>{t('postAd.completePayment')}</Text>
      <View style={s.topBarSpacer} />
    </View>
  );
}

function ErrorBanner({ message }: { message: string }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.errBanner}>
      <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
      <Text style={s.errBannerText}>{message}</Text>
    </View>
  );
}

function PayFooter({ total, methodMeta, onPay }: { total: number; methodMeta: PaymentMethodOption; onPay: () => void }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  return (
    <View style={s.footer}>
      <TouchableOpacity style={[s.payBtn, { backgroundColor: Colors.primary }]} onPress={onPay} activeOpacity={0.88}>
        <MaterialCommunityIcons name="lock" size={18} color={Colors.white} />
        <Text style={s.payBtnText}>{t('postAd.payVia', { total, method: methodMeta.label })}</Text>
      </TouchableOpacity>
      <View style={s.secRow}>
        <MaterialCommunityIcons name="shield-check-outline" size={13} color={Colors.success} />
        <Text style={s.secText}>{t('postAd.securedCheckout')}</Text>
      </View>
    </View>
  );
}

export function StepPayment({
  plan, listingId, listingTitle, categoryKey,
  successRoute = '/profile/my-ads', onBack,
}: StepPaymentProps) {
  const router = useRouter();
  const s = useThemedStyles(createStyles);
  const createdItem = useAppSelector((state) => state.newAd.createdItem);
  const payment = usePaymentFlow({ plan, listingId, categoryKey });

  if (payment.autoActivating) return <ActivatingScreen />;

  if (payment.payStatus === 'success') {
    return (
      <SuccessScreen
        plan={plan}
        listingTitle={listingTitle}
        listingId={listingId}
        createdItem={createdItem}
        onDone={() => router.replace(successRoute as any)}
      />
    );
  }

  return (
    <>
      <View style={s.root}>
        <TopBar onBack={onBack} />

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <PaymentMethodSelector selected={payment.method} onChange={payment.selectMethod} />
          <PhoneInput method={payment.method} value={payment.phone} onChange={payment.updatePhone} error={payment.phoneError} />

          {payment.payStatus === 'failed' && !!payment.errorMsg && <ErrorBanner message={payment.errorMsg} />}
          <View style={s.bottomSpacer} />
        </ScrollView>

        <PayFooter total={payment.total} methodMeta={payment.methodMeta} onPay={payment.handlePay} />
      </View>

      <PollingOverlay
        visible={payment.payStatus === 'polling'}
        attempt={payment.pollAttempt}
        maxAttempts={MAX_POLL_ATTEMPTS}
        onCancel={payment.handleCancel}
      />
    </>
  );
}
