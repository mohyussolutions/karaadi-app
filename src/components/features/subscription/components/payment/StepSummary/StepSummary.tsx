import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../hooks/useAppTranslation';
import { useTabBarClearance } from '../../../../../hooks/useTabBarClearance';
import { useAppSelector } from '../../../../../../store/store';
import type { StepSummaryProps } from '../../../../../../util/types';
import { OrderSummary } from '../StepPayment/OrderSummary';
import { createStyles } from '../../../../../../util/styles/payment/stepSummary.styles';

export function StepSummary({ plan, categoryName, onNext, onBack }: StepSummaryProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const createdItem = useAppSelector((state) => state.newAd.createdItem);
  const feeAmount = useAppSelector((state) => state.newAd.feeAmount);
  const total = feeAmount + plan.price;
  const clearance = useTabBarClearance();

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <MaterialCommunityIcons name="file-document-check-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={s.heroTitle}>{t('postAd.summaryTitle', { defaultValue: 'Listing Summary' })}</Text>
          <Text style={s.heroSub}>{t('postAd.summarySub', { defaultValue: 'Review your listing details before payment' })}</Text>
        </View>
        <OrderSummary plan={plan} item={createdItem} categoryName={categoryName} feeAmount={feeAmount} />
        <View style={s.bottomSpacer} />
      </ScrollView>

      <View style={[s.footer, { bottom: clearance }]}>
        <TouchableOpacity style={s.continueBtn} onPress={onNext} activeOpacity={0.88}>
          <Text style={s.continueBtnText}>{t('postAd.continueToPayment', { price: total })}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
