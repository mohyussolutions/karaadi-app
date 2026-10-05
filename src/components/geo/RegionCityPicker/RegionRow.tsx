import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/geo/regionCityPicker.styles';
import type { RegionRowProps } from "../../../utils/types";

export const RegionRow = memo(function RegionRow({
  region, active, onSelectRegion,
}: RegionRowProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={[s.option, active && s.optionActive]} onPress={() => onSelectRegion(region)} activeOpacity={0.75}>
      <Text style={[s.optionText, active && s.optionTextActive]}>{region.name}</Text>
      {active && (
        <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );
});
