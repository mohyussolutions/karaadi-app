import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useAppSelector } from '../../../store/store';
import type { StepSummaryProps } from '../../../utils/types';
import { OrderSummary } from '../StepPayment/OrderSummary';
import { createStyles } from '../../../utils/styles/payment/stepSummary.styles';

export function StepSummary({ plan, categoryName, onNext, onBack }: StepSummaryProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector((state) => state.newAd.createdItem);
  const feeAmount = useAppSelector((state) => state.newAd.feeAmount);
  const total = feeAmount + plan.price;

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('paymentPage.orderSummary')}</Text>
        <View style={s.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <OrderSummary plan={plan} item={createdItem} categoryName={categoryName} feeAmount={feeAmount} />
        <View style={s.bottomSpacer} />
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.continueBtn} onPress={onNext} activeOpacity={0.88}>
          <Text style={s.continueBtnText}>{t('postAd.continueToPayment', { price: total })}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
