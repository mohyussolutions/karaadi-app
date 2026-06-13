import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import type { PhoneInputProps } from '../../../utils/types';
import { PAYMENT_METHODS } from '../payment.constants';
import { createStyles } from './PhoneInput.styles';

export function PhoneInput({ method, value, onChange, error }: PhoneInputProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const m = PAYMENT_METHODS.find((p) => p.key === method)!;
  return (
    <View style={[s.box, { borderColor: m.color + '40', backgroundColor: m.color + '05' }]}>
      <View style={s.header}>
        <View style={[s.iconWrap, { backgroundColor: m.color + '15' }]}>
          <MaterialCommunityIcons name="cellphone-wireless" size={20} color={m.color} />
        </View>
        <View>
          <Text style={s.title}>{t('postAd.phoneNumberForMethod', { method: m.label })}</Text>
          <Text style={s.sub}>{t('postAd.enterPhoneForMethod', { method: m.label })}</Text>
        </View>
      </View>
      <TextInput
        style={[s.input, error ? s.inputErr : null]}
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9+\s\-()]/g, ''))}
        placeholder={`0${m.prefix}XXXXXXX  or  +252 ${m.prefix}XXXXXXX`}
        placeholderTextColor={Colors.placeholder}
        keyboardType="phone-pad"
        autoComplete="tel"
      />
      {!!error && (
        <View style={s.errRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={13} color={Colors.error} />
          <Text style={s.errText}>{error}</Text>
        </View>
      )}
      <View style={[s.note, { borderColor: m.color + '30', backgroundColor: m.color + '08' }]}>
        <MaterialCommunityIcons name="information-outline" size={13} color={m.color} />
        <Text style={[s.noteText, { color: m.color }]}>{t('postAd.paymentRequestNote', { method: m.label })}</Text>
      </View>
    </View>
  );
}
