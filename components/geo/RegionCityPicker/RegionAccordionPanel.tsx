import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { RegionAccordionPanelProps, RegionPickerItem } from '../../../utils/types';
import { createStyles } from '../../../utils/styles/geo/regionCityPicker.styles';

function RegionRow({
  region, active, onSelectRegion,
}: {
  region: RegionPickerItem;
  active: boolean;
  onSelectRegion: (r: RegionPickerItem) => void;
}) {
  const count = region.cities?.length ?? 0;
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={s.option} onPress={() => onSelectRegion(region)} activeOpacity={0.75}>
      <MaterialCommunityIcons
        name={active ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={22}
        color={active ? Colors.primary : Colors.gray300}
      />
      <Text style={[s.optionText, active && s.optionTextActive]}>{region.name}</Text>
      <View style={[s.countBadge, active && s.countBadgeActive]}>
        <Text style={[s.countText, active && s.countTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function RegionAccordionPanel({
  search, onSearchChange, regions, selectedRegion, onSelectRegion, onClose,
}: RegionAccordionPanelProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <View style={s.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.primary} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={onSearchChange}
            placeholder="Search regions…"
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={s.panelCloseBtn} onPress={onClose} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-up" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.panelList}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {regions.length === 0 ? (
          <View style={s.emptyRow}>
            <Text style={s.emptyText}>No regions found</Text>
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
