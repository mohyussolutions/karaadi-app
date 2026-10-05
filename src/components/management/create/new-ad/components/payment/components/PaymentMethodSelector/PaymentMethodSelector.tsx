import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../../../../../../hooks/app/useTheme';
import type { PaymentMethodSelectorProps } from '../../../../../../../../utils/types';
import { PAYMENT_METHODS } from '../../../../../../../../actions/constants';
import { createStyles } from '../../../../../../../../utils/styles/payment/checkout.styles';
import { bgColor } from '../../../../../../../../utils/styles/common/dynamic.styles';

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.section} accessibilityRole="radiogroup">
      {PAYMENT_METHODS.map((m) => {
        const active = selected === m.key;
        return (
          <TouchableOpacity
            key={m.key}
            style={s.methodRow}
            onPress={() => onChange(m.key)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <View style={[s.methodSwatch, bgColor(m.color)]} />
            <View style={s.methodText}>
              <Text style={[s.methodLabel, active && s.methodLabelActive]}>{m.label}</Text>
              <Text style={s.methodSub}>{m.sublabel}</Text>
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
