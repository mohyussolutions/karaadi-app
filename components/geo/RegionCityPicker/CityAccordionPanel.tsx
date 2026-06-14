import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { CityAccordionPanelProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';

export function CityAccordionPanel({
  search, onSearchChange, cities, selectedCity, savingCity,
  onSelectCity, onAddCustomCity, onClose,
}: CityAccordionPanelProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState('');

  function saveNewCity() {
    if (!newName.trim()) return;
    onAddCustomCity(newName.trim());
    setNewName('');
    setAddingNew(false);
  }

  return (
    <View style={s.panel}>
      <View style={s.panelHeader}>
        <View style={s.searchBox}>
          <MaterialCommunityIcons name="city-variant-outline" size={18} color={Colors.primary} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={onSearchChange}
            placeholder={t('citySelect.search')}
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={onClose}
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
        {cities.length === 0 ? (
          <View style={s.emptyRow}>
            <Text style={s.emptyText}>{t('citySelect.noResults')}</Text>
          </View>
        ) : (
          cities.map((c) => {
            const active = selectedCity === c.name;
            return (
              <TouchableOpacity key={c.id} style={[s.option, active && s.optionActive]} onPress={() => onSelectCity(c.name)} activeOpacity={0.75}>
                <Text style={[s.optionText, active && s.optionTextActive]}>{c.name}</Text>
                {active && (
                  <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={s.panelFooter}>
        {addingNew ? (
          <View style={s.addCityRow}>
            <TextInput
              style={s.addCityInput}
              value={newName}
              onChangeText={setNewName}
              placeholder={t('citySelect.newPlaceholder')}
              placeholderTextColor={Colors.placeholder}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={saveNewCity}
            />
            <TouchableOpacity
              style={[s.addCitySaveBtn, (savingCity || !newName.trim()) && s.addCitySaveBtnDisabled]}
              onPress={saveNewCity}
              disabled={savingCity || !newName.trim()}
            >
              {savingCity
                ? <ActivityIndicator size="small" color={Colors.white} />
                : <Text style={s.addCitySaveText}>{t('citySelect.save')}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={s.addCityCancelBtn} onPress={() => { setAddingNew(false); setNewName(''); }} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={s.useTypedRow} onPress={() => setAddingNew(true)} activeOpacity={0.8}>
            <View style={s.useTypedIcon}>
              <MaterialCommunityIcons name="plus" size={16} color={Colors.primary} />
            </View>
            <Text style={s.useTypedText}>{t('citySelect.addNew')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
