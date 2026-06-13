import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, FlatList,
  Modal, ActivityIndicator, Platform, KeyboardAvoidingView, Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import type { CityPickerModalProps } from '../../../utils/types';
import { createStyles } from './styles';

export function CityPickerModal({
  visible, onClose, search, onSearchChange, cities,
  selectedCity, showUseTyped, savingCity, onSelectCity, onAddCustomCity,
}: CityPickerModalProps) {
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
          <Text style={s.sheetTitle}>{t('createRealEstate.cityLabel')}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={s.searchBox}>
          <MaterialCommunityIcons name="city-variant-outline" size={18} color={Colors.primary} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={onSearchChange}
            placeholder="Type any city name…"
            placeholderTextColor={Colors.placeholder}
            autoFocus
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

        <FlatList
          data={cities}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            showUseTyped ? (
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
            ) : null
          }
          ListEmptyComponent={
            !showUseTyped ? (
              <View style={s.emptyRow}>
                <Text style={s.emptyText}>
                  {search.trim() ? `No matches — type to add "${search.trim()}"` : 'Type a city name above'}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item: c }) => {
            const active = selectedCity === c.name;
            return (
              <TouchableOpacity style={s.option} onPress={() => onSelectCity(c.name)} activeOpacity={0.75}>
                <MaterialCommunityIcons
                  name={active ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
                  color={active ? Colors.primary : Colors.gray300}
                />
                <Text style={[s.optionText, active && s.optionTextActive]}>{c.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}
