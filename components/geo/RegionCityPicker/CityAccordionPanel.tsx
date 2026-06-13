import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { CityAccordionPanelProps } from '../../../utils/types';
import { createStyles } from '../../../utils/styles/geo/regionCityPicker.styles';

export function CityAccordionPanel({
  search, onSearchChange, cities, selectedCity, showUseTyped, savingCity,
  onSelectCity, onAddCustomCity, onClose,
}: CityAccordionPanelProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <View style={s.searchBox}>
          <MaterialCommunityIcons name="city-variant-outline" size={18} color={Colors.primary} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={onSearchChange}
            placeholder="Type any city name…"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={() => {
              if (search.trim()) onAddCustomCity(search.trim());
              else onClose();
            }}
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
        {showUseTyped && (
          <TouchableOpacity
            style={s.useTypedRow}
            onPress={() => !savingCity && onAddCustomCity(search.trim())}
            activeOpacity={0.8}
            disabled={savingCity}
          >
            <View style={s.useTypedIcon}>
              {savingCity
                ? <ActivityIndicator size="small" color={Colors.primary} />
                : <MaterialCommunityIcons name="plus" size={16} color={Colors.primary} />}
            </View>
            <Text style={s.useTypedText}>
              {savingCity
                ? 'Saving city…'
                : <>Add <Text style={s.useTypedBold}>"{search.trim()}"</Text></>}
            </Text>
          </TouchableOpacity>
        )}

        {cities.length === 0 && !showUseTyped && (
          <View style={s.emptyRow}>
            <Text style={s.emptyText}>
              {search.trim() ? `No matches — type to add "${search.trim()}"` : 'Type a city name above'}
            </Text>
          </View>
        )}

        {cities.map((c) => {
          const active = selectedCity === c.name;
          return (
            <TouchableOpacity key={c.id} style={s.option} onPress={() => onSelectCity(c.name)} activeOpacity={0.75}>
              <MaterialCommunityIcons
                name={active ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={active ? Colors.primary : Colors.gray300}
              />
              <Text style={[s.optionText, active && s.optionTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
