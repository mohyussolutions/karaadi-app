import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { RegionPickerItem } from '../../../util/types';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';

export const RegionRow = memo(function RegionRow({
  region, active, onSelectRegion,
}: {
  region: RegionPickerItem;
  active: boolean;
  onSelectRegion: (r: RegionPickerItem) => void;
}) {
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
