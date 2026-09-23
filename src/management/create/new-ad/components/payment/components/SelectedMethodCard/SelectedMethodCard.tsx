import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemedStyles } from '../../../../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../../../../hooks/useAppTranslation';
import type { SelectedMethodCardProps } from '../../../../../../../util/types';
import { PAYMENT_METHODS } from '../../../../../../../constants';
import { createStyles } from '../../../../../../../util/styles/payment/checkout.styles';
import { tint } from '../../../../../../../util/styles/common/dynamic.styles';

export function SelectedMethodCard({ method, onChange }: SelectedMethodCardProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const m = PAYMENT_METHODS.find((p) => p.key === method) ?? PAYMENT_METHODS[0];
  return (
    <View style={[s.option, s.optionActive, s.selectedOption]}>
      <View style={[s.optionIcon, tint(m.color)]}>
        <MaterialCommunityIcons name="cellphone-wireless" size={22} color={m.color} />
      </View>
      <View style={s.optionText}>
        <Text style={s.optionLabel}>{m.label}</Text>
        <Text style={s.optionSub}>{m.sublabel}</Text>
      </View>
      <TouchableOpacity style={s.changeBtn} onPress={onChange} hitSlop={8} activeOpacity={0.8}>
        <Text style={s.changeText}>{t('postAd.changeMethod')}</Text>
      </TouchableOpacity>
    </View>
  );
}
