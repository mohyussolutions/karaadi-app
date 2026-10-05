import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/new-ad/dropdown.styles';
import type { DropdownOptionRowProps } from "../../../utils/types";

export const DropdownOptionRow = memo(function DropdownOptionRow({
  option, selected, onSelect,
}: DropdownOptionRowProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      style={[s.option, selected && s.optionActive]}
      onPress={() => onSelect(option.value)}
      activeOpacity={0.75}
    >
      <Text style={[s.optionText, selected && s.optionTextActive]}>{option.label}</Text>
      {selected && <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />}
    </TouchableOpacity>
  );
});
