import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from './styles';
import type { PickerFieldsProps } from '../../../utils/types';

export function PickerFields({
  selectedRegion, cityText, loadingRegions, onOpenRegion, onOpenCity, onClearCity,
}: PickerFieldsProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.row}>
      <View style={s.fieldBlock}>
        <Text style={s.label}>{t('createRealEstate.regionLabel')}</Text>
        <TouchableOpacity
          style={[s.picker, !selectedRegion && s.pickerEmpty]}
          onPress={onOpenRegion}
          activeOpacity={0.8}
        >
          {loadingRegions ? (
            <ActivityIndicator size="small" color={Colors.primary} style={s.loadingIcon} />
          ) : (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={selectedRegion ? Colors.textPrimary : Colors.placeholder}
            />
          )}
          <Text style={[s.pickerText, !selectedRegion && s.pickerPlaceholder]} numberOfLines={1}>
            {selectedRegion || t('createRealEstate.regionLabel')}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={s.fieldBlock}>
        <Text style={s.label}>{t('createRealEstate.cityLabel')}</Text>
        <TouchableOpacity
          style={[s.picker, !selectedRegion && s.pickerDisabled]}
          onPress={onOpenCity}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="city-variant-outline"
            size={16}
            color={cityText ? Colors.textPrimary : Colors.placeholder}
          />
          <Text style={[s.pickerText, !cityText && s.pickerPlaceholder]} numberOfLines={1}>
            {cityText || (selectedRegion ? t('createRealEstate.cityLabel') : 'Select region first')}
          </Text>
          {cityText ? (
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onClearCity(); }} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
