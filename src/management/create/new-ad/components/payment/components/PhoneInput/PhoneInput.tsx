import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../../../hooks/useAppTranslation';
import type { PhoneInputProps } from '../../../../../../../util/types';
import {
  PAYMENT_METHODS, PHONE_LOCAL_MAX_LENGTH, REGEX_NON_DIGITS, SOMALI_DIAL_CODE,
} from '../../../../../../../constants';
import { createStyles } from '../../../../../../../util/styles/payment/checkout.styles';

const DIAL_DIGITS = SOMALI_DIAL_CODE.replace('+', '');

function toLocalDigits(input: string): string {
  const digits = input.replace(REGEX_NON_DIGITS, '');
  const local = digits.startsWith(DIAL_DIGITS) ? digits.slice(DIAL_DIGITS.length) : digits;
  return local.slice(0, PHONE_LOCAL_MAX_LENGTH);
}

export function PhoneInput({ method, value, onChange, error }: PhoneInputProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const [focused, setFocused] = useState(false);
  const m = PAYMENT_METHODS.find((p) => p.key === method) ?? PAYMENT_METHODS[0];

  return (
    <View style={s.card}>
      <Text style={s.fieldLabel}>{t('postAd.phoneNumberForMethod', { method: m.label })}</Text>
      <View style={[s.inputRow, focused && s.inputRowFocused, !!error && s.inputRowError]}>
        <View style={s.dialCode}>
          <Text style={s.dialCodeText}>{SOMALI_DIAL_CODE}</Text>
        </View>
        <TextInput
          style={s.input}
          value={value}
          onChangeText={(v) => onChange(toLocalDigits(v))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`${m.prefix}XXXXXXX`}
          placeholderTextColor={Colors.placeholder}
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          maxLength={PHONE_LOCAL_MAX_LENGTH}
          returnKeyType="done"
          accessibilityLabel={t('postAd.phoneNumberForMethod', { method: m.label })}
        />
        <View style={s.inputLock}>
          <MaterialCommunityIcons name="lock-outline" size={18} color={Colors.textMuted} />
        </View>
      </View>

      {!!error && (
        <View style={s.errRow}>
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color={Colors.error} />
          <Text style={s.errText}>{error}</Text>
        </View>
      )}

      <View style={s.note}>
        <MaterialCommunityIcons name="cellphone-message" size={16} color={Colors.primary} />
        <Text style={s.noteText}>{t('postAd.paymentRequestNote', { method: m.label })}</Text>
      </View>
      <View style={s.note}>
        <MaterialCommunityIcons name="shield-lock-outline" size={16} color={Colors.success} />
        <Text style={s.noteText}>{t('postAd.phoneSecureNote')}</Text>
      </View>
    </View>
  );
}
