import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../../../../../../../hooks/useTheme';
import type { PaymentMethodSelectorProps } from '../../../../../../../util/types';
import { PAYMENT_METHODS } from '../../../../../../../constants';
import { createStyles } from '../../../../../../../util/styles/payment/checkout.styles';
import { tint } from '../../../../../../../util/styles/common/dynamic.styles';

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.list}>
      {PAYMENT_METHODS.map((m) => {
        const active = selected === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            style={[s.option, active && s.optionActive]}
            onPress={() => onChange(m.key)}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <View style={[s.optionIcon, tint(m.color)]}>
              <MaterialCommunityIcons name="cellphone-wireless" size={22} color={m.color} />
            </View>
            <View style={s.optionText}>
              <Text style={s.optionLabel}>{m.label}</Text>
              <Text style={s.optionSub}>{m.sublabel}</Text>
            </View>
            <View style={[s.radio, active && s.radioActive]}>
              {active && <View style={s.radioDot} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
