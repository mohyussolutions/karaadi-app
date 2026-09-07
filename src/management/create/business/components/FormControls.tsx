import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import type { BusinessSectionHeaderProps, BusinessFieldProps } from '../../../../util/types/component.types';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';

export function SectionHeader({ title, icon }: BusinessSectionHeaderProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={16} color={Colors.primary} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

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
