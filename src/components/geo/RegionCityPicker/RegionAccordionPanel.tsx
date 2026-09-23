import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { RegionAccordionPanelProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';
import { RegionRow } from './RegionRow';

export function RegionAccordionPanel({
  regions, selectedRegion, onSelectRegion, onClose,
}: RegionAccordionPanelProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.panel}>
      <View style={s.panelHeaderEnd}>
        <TouchableOpacity style={s.panelCloseBtn} onPress={onClose} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-up" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView overScrollMode="never"
        style={s.panelList}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {regions.length === 0 ? (
          <View style={s.emptyRow}>
            <Text style={s.emptyText}>{t('citySelect.noRegionsFound')}</Text>
          </View>
        ) : (
          regions.map((r) => (
            <RegionRow
              key={r.id}
              region={r}
              active={selectedRegion === r.name}
              onSelectRegion={onSelectRegion}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
