import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, FlatList,
  Modal, Platform, KeyboardAvoidingView, Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { RegionPickerItem, RegionPickerModalProps } from '../../../utils/types';
import { createStyles } from './styles';

function RegionRow({
  region, active, selectedCity, onSelectRegion, onSelectCity,
}: {
  region: RegionPickerItem;
  active: boolean;
  selectedCity: string;
  onSelectRegion: (r: RegionPickerItem) => void;
  onSelectCity: (name: string) => void;
}) {
  const count = region.cities?.length ?? 0;
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View>
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

      {active && region.cities && region.cities.length > 0 && (
        <View style={s.subList}>
          {region.cities.map((c) => {
            const cityActive = selectedCity === c.name;
            return (
              <TouchableOpacity
                key={c.id}
                style={s.subOption}
                onPress={() => onSelectCity(c.name)}
                activeOpacity={0.75}
              >
                <MaterialCommunityIcons
                  name={cityActive ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20}
                  color={cityActive ? Colors.primary : Colors.gray300}
                />
                <Text style={[s.optionText, cityActive && s.optionTextActive]}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function RegionPickerModal({
  visible, onClose, search, onSearchChange, regions,
  selectedRegion, selectedCity, onSelectRegion, onSelectCity,
}: RegionPickerModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={s.sheetHandle} />
        <View style={s.sheetHeader}>
          <Text style={s.sheetTitle}>{t('createRealEstate.regionLabel')}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
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
        <FlatList
          data={regions}
          keyExtractor={(r) => r.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            <View style={s.emptyRow}>
              <Text style={s.emptyText}>No regions found</Text>
            </View>
          }
          renderItem={({ item: r }) => (
            <RegionRow
              region={r}
              active={selectedRegion === r.name}
              selectedCity={selectedCity}
              onSelectRegion={onSelectRegion}
              onSelectCity={onSelectCity}
            />
          )}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
