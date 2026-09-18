import { memo } from 'react';
import type { DropdownOption } from '../../../util/types';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/newAd/dropdown.styles';

export const DropdownOptionRow = memo(function DropdownOptionRow({
  option, selected, onSelect,
}: {
  option: DropdownOption;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
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
