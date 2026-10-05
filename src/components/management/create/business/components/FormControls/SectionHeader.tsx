import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../hooks/app/useTheme';
import type { BusinessSectionHeaderProps } from '../../../../../../utils/types';
import { createStyles } from '../../../../../../utils/styles/business/businessCreate.styles';

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
