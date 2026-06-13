import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import type { PaymentMethodSelectorProps } from '../../../utils/types';
import { PAYMENT_METHODS } from '../payment.constants';
import { createStyles } from './PaymentMethodSelector.styles';

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
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
              style={[s.card, active && { borderColor: m.color, backgroundColor: m.color + '08' }]}
              onPress={() => onChange(m.key)}
              activeOpacity={0.85}
            >
              <View style={[s.iconWrap, { backgroundColor: m.color + '15' }]}>
                <MaterialCommunityIcons name="cellphone-wireless" size={22} color={m.color} />
              </View>
              <View style={s.textCol}>
                <Text style={[s.label, active && { color: m.color, fontWeight: '700' }]}>{m.label}</Text>
                <Text style={s.sub}>{m.sublabel}</Text>
              </View>
              <View style={[s.radio, active && { borderColor: m.color }]}>
                {active && <View style={[s.radioDot, { backgroundColor: m.color }]} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
