import { View, ScrollView } from 'react-native';
import { useThemedStyles } from '../../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../../hooks/useAppTranslation';
import { useAppSelector } from '../../../../../../store/store';
import type { StepSummaryProps } from '../../../../../../util/types';
import { OrderSummary } from '../components/OrderSummary/OrderSummary';
import { CheckoutFooter, CheckoutTopBar } from '../components/Checkout/Checkout';
import { createStyles } from '../../../../../../util/styles/payment/checkout.styles';

export function StepSummary({ plan, categoryName, onNext, onBack }: StepSummaryProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector((state) => state.newAd.createdItem);
  const feeAmount = useAppSelector((state) => state.newAd.feeAmount);
  const total = feeAmount + plan.price;

  return (
    <View style={s.root}>
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
    </View>
  );
}
