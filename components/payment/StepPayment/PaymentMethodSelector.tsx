import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import type { PaymentMethodSelectorProps } from '../../../util/types';
import { PAYMENT_METHODS } from '../payment.constants';
import { createStyles } from '../../../util/styles/payment/paymentMethodSelector.styles';

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{t('postAd.paymentMethod')}</Text>
      <View style={s.list}>
        {PAYMENT_METHODS.map((m) => {
          const active = selected === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[s.card, active && s.cardActive]}
              onPress={() => onChange(m.key)}
              activeOpacity={0.85}
            >
              <View style={[s.iconWrap, active && s.iconWrapActive]}>
                <MaterialCommunityIcons name="cellphone-wireless" size={22} color={active ? Colors.primary : Colors.textMuted} />
              </View>
              <View style={s.textCol}>
                <Text style={[s.label, active && s.labelActive]}>{m.label}</Text>
                <Text style={s.sub}>{m.sublabel}</Text>
              </View>
              <View style={[s.radio, active && s.radioActive]}>
                {active && <View style={s.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
