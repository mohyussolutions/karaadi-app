import { useState } from 'react';
import { Platform, View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useThemeColors, useThemedStyles } from '../../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../../hooks/useAppTranslation';
import { usePaymentFlow } from '../../../../../../hooks/usePaymentFlow';
import { LoadingSpinner } from '../../../../../../components/loading';
import { useAppSelector } from '../../../../../../store/store';
import type { StepPaymentProps } from '../../../../../../util/types';
import type { IOSPaymentScreenProps } from '../../../../../../util/types/new-ad.types';
import { IOS_PAY_ON_WEBSITE, MAX_POLL_ATTEMPTS, getSitePayUrl } from '../../../../../../constants';
import { CheckoutErrorBanner, CheckoutFooter, CheckoutHeader, CheckoutTopBar } from '../components/Checkout/Checkout';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector/PaymentMethodSelector';
import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { SelectedMethodCard } from '../components/SelectedMethodCard/SelectedMethodCard';
import { PollingOverlay } from '../components/PollingOverlay/PollingOverlay';
import { SuccessScreen } from '../components/SuccessScreen/SuccessScreen';
import { createStyles as createCheckoutStyles } from '../../../../../../util/styles/payment/checkout.styles';
import { createStyles } from '../../../../../../util/styles/payment/stepPayment.styles';

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
    <View style={c.root}>
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
    </View>
  );
}

export function StepPayment({
  plan, listingId, listingTitle, categoryKey,
  successRoute = '/profile/my-ads', onBack,
}: StepPaymentProps) {
  const router = useRouter();
  const c = useThemedStyles(createCheckoutStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector((state) => state.newAd.createdItem);
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
      <View style={c.root}>
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
              <CheckoutHeader
                icon="cellphone-lock"
                title={t('postAd.enterPhoneTitle')}
                subtitle={t('postAd.enterPhoneForMethod', { method: payment.methodMeta.label })}
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
              <CheckoutHeader
                icon="wallet-outline"
                title={t('postAd.choosePaymentMethod')}
                subtitle={t('postAd.choosePaymentMethodSub')}
              />
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
      </View>

      <PollingOverlay
        visible={payment.isPaying}
        attempt={payment.pollAttempt}
        maxAttempts={MAX_POLL_ATTEMPTS}
        onCancel={payment.handleCancel}
      />
    </>
  );
}
