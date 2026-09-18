import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';

export const CityRow = memo(function CityRow({
  name, active, onSelect,
}: {
  name: string;
  active: boolean;
  onSelect: (name: string) => void;
}) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={[s.option, active && s.optionActive]} onPress={() => onSelect(name)} activeOpacity={0.75}>
      <Text style={[s.optionText, active && s.optionTextActive]}>{name}</Text>
      {active && (
        <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );
});
