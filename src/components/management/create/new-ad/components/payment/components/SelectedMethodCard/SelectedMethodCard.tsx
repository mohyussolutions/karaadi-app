import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../../hooks/app/useAppTranslation';
import type { SelectedMethodCardProps } from '../../../../../../../../utils/types';
import { PAYMENT_METHODS } from '../../../../../../../../actions/constants';
import { createStyles } from '../../../../../../../../utils/styles/payment/checkout.styles';
import { bgColor } from '../../../../../../../../utils/styles/common/dynamic.styles';

export function SelectedMethodCard({ method, onChange }: SelectedMethodCardProps) {
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const m = PAYMENT_METHODS.find((p) => p.key === method) ?? PAYMENT_METHODS[0];
  return (
    <View style={[s.methodRow, s.section]}>
      <View style={[s.methodSwatch, bgColor(m.color)]} />
      <View style={s.methodText}>
        <Text style={s.methodLabel}>{m.label}</Text>
        <Text style={s.methodSub}>{m.sublabel}</Text>
      </View>
      <TouchableOpacity onPress={onChange} hitSlop={12} accessibilityRole="button">
        <Text style={s.changeLink}>{t('postAd.changeMethod')}</Text>
      </TouchableOpacity>
    </View>
  );
}
