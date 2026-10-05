import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../hooks/app/useAppTranslation';
import { useAppSelector } from '../../../../../../../store/store';
import type { StepSummaryProps } from '../../../../../../../utils/types';
import { OrderSummary } from '../components/OrderSummary/OrderSummary';
import { CheckoutFooter, CheckoutTopBar } from '../components/Checkout/Checkout';
import { createStyles } from '../../../../../../../utils/styles/payment/checkout.styles';

import { selectNewAdCreatedItem, selectNewAdFeeAmount } from '../../../../../../../store/slices/newAdSlice';
export function StepSummary({ plan, categoryName, onNext, onBack }: StepSummaryProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector(selectNewAdCreatedItem);
  const feeAmount = useAppSelector(selectNewAdFeeAmount);
  const total = feeAmount + plan.price;

  return (
    <SafeAreaView style={s.root} edges={['left', 'right']}>
      <CheckoutTopBar onBack={onBack} title={t('postAd.summaryTitle', { defaultValue: 'Listing Summary' })} />

      <ScrollView overScrollMode="never" contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <OrderSummary plan={plan} item={createdItem} categoryName={categoryName} feeAmount={feeAmount} />
        <View style={s.bottomSpacer} />
      </ScrollView>

      <CheckoutFooter
        label={t('postAd.continueToPayment', { price: total })}
        icon="arrow-right"
        onPress={onNext}
      />
    </SafeAreaView>
  );
}
