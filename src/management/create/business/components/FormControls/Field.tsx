import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../../../hooks/useTheme';
import type { BusinessFieldProps } from '../../../../../util/types/component.types';
import { createStyles } from '../../../../../util/styles/business/businessCreate.styles';

export function Field({ label, required, error, children }: BusinessFieldProps) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>
        {label}{required && <Text style={s.req}> *</Text>}
      </Text>
      {children}
      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}
