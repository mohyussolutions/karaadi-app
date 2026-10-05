import { useState } from 'react';
import { Platform, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useThemeColors, useThemedStyles } from '../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../hooks/app/useAppTranslation';
import { usePaymentFlow } from '../../../../../../../hooks/business/usePayments';
import { LoadingSpinner } from '../../../../../../loading';
import { useAppSelector } from '../../../../../../../store/store';
import type { IOSPaymentScreenProps, StepPaymentProps } from '../../../../../../../utils/types';
import { IOS_PAY_ON_WEBSITE, MAX_POLL_ATTEMPTS, getSitePayUrl, ROUTES } from '../../../../../../../actions/constants';
import { formatPrice } from '../../../../../../../lib/helpers';
import { AmountBlock, CheckoutErrorBanner, CheckoutFooter, CheckoutHeading, CheckoutTopBar } from '../components/Checkout/Checkout';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector/PaymentMethodSelector';
import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { SelectedMethodCard } from '../components/SelectedMethodCard/SelectedMethodCard';
import { PollingOverlay } from '../components/PollingOverlay/PollingOverlay';
import { SuccessScreen } from '../components/SuccessScreen/SuccessScreen';
import { createStyles as createCheckoutStyles } from '../../../../../../../utils/styles/payment/checkout.styles';
import { createStyles } from '../../../../../../../utils/styles/payment/stepPayment.styles';

import { selectNewAdCreatedItem } from '../../../../../../../store/slices/newAdSlice';
function ActivatingScreen() {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  return (
    <View style={s.activatingWrap}>
      <LoadingSpinner />
      <Text style={s.activatingText}>{t('postAd.activatingListing')}</Text>
    </View>
  );
}

function IOSPaymentScreen({ onBack, listingId }: IOSPaymentScreenProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const c = useThemedStyles(createCheckoutStyles);
  const { t } = useAppTranslation();
  return (
    <SafeAreaView style={c.root} edges={['left', 'right']}>
      <CheckoutTopBar onBack={onBack} />
      <View style={s.iosPaymentRoot}>
        <MaterialCommunityIcons name="web" size={56} color={Colors.primary} />
        <Text style={s.iosPaymentTitle}>{t('postAd.iosPaymentTitle')}</Text>
        <Text style={s.iosPaymentBody}>{t('postAd.iosPaymentBody')}</Text>
        <TouchableOpacity
          style={[c.primaryBtn, s.iosPaymentBtn]}
          onPress={() => Linking.openURL(getSitePayUrl(listingId))}
          activeOpacity={0.88}
        >
          <Text style={c.primaryBtnText}>{t('postAd.iosPaymentBtn')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function StepPayment({
  plan, listingId, listingTitle, categoryKey,
  successRoute = ROUTES.myAds, onBack,
}: StepPaymentProps) {
  const router = useRouter();
  const c = useThemedStyles(createCheckoutStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector(selectNewAdCreatedItem);
  const payment = usePaymentFlow({ plan, listingId, categoryKey });
  const [methodChosen, setMethodChosen] = useState(false);

  if (payment.autoActivating) return <ActivatingScreen />;

  if (IOS_PAY_ON_WEBSITE && Platform.OS === 'ios' && payment.total > 0) {
    return <IOSPaymentScreen onBack={onBack} listingId={listingId} />;
  }

  if (payment.payStatus === 'success') {
    return (
      <SuccessScreen
        plan={plan}
        listingTitle={listingTitle}
        listingId={listingId}
        categoryKey={categoryKey}
        createdItem={createdItem}
        onDone={() => router.replace(successRoute as Href)}
      />
    );
  }

  return (
    <>
      <SafeAreaView style={c.root} edges={['left', 'right']}>
        <CheckoutTopBar
          onBack={methodChosen ? () => setMethodChosen(false) : onBack}
          title={t('postAd.paymentMethod')}
        />

        <ScrollView
          overScrollMode="never"
          contentContainerStyle={c.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {methodChosen ? (
            <>
              <CheckoutHeading
                title={t('postAd.enterPhoneTitle')}
                subtitle={t('postAd.enterPhoneForMethod', { method: payment.methodMeta.label })}
              />
              <AmountBlock
                label={t('postAd.youPay')}
                amount={formatPrice(payment.total)}
                meta={t('postAd.payWithMethod')}
              />
              <SelectedMethodCard method={payment.method} onChange={() => setMethodChosen(false)} />
              <PhoneInput
                method={payment.method}
                value={payment.phone}
                onChange={payment.updatePhone}
                error={payment.phoneError}
              />
            </>
          ) : (
            <>
              <CheckoutHeading
                title={t('postAd.choosePaymentMethod')}
                subtitle={t('postAd.choosePaymentMethodSub')}
              />
              <AmountBlock label={t('postAd.youPay')} amount={formatPrice(payment.total)} />
              <PaymentMethodSelector
                selected={payment.method}
                onChange={(m) => { payment.selectMethod(m); setMethodChosen(true); }}
              />
            </>
          )}

          {payment.payStatus === 'failed' && !!payment.errorMsg && <CheckoutErrorBanner message={payment.errorMsg} />}
          <View style={c.bottomSpacer} />
        </ScrollView>

        {methodChosen && (
          <CheckoutFooter
            label={t('postAd.payVia', { total: payment.total, method: payment.methodMeta.label })}
            icon="lock"
            onPress={payment.handlePay}
            disabled={payment.isPaying}
            showSecureNote
          />
        )}
      </SafeAreaView>

      <PollingOverlay
        visible={payment.isPaying}
        attempt={payment.pollAttempt}
        maxAttempts={MAX_POLL_ATTEMPTS}
        onCancel={payment.handleCancel}
      />
    </>
  );
}
