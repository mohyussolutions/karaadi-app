import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';
import type { PickerFieldsProps } from '../../../util/types';

export function PickerFields({
  selectedRegion, cityText, loadingRegions, regionExpanded, cityExpanded,
  onToggleRegion, onToggleCity, onClearCity,
}: PickerFieldsProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.row}>
      <View style={s.fieldBlock}>
        <Text style={s.label}>{t('createRealEstate.regionLabel')}</Text>
        <TouchableOpacity
          style={[s.picker, !selectedRegion && s.pickerEmpty, regionExpanded && s.pickerActive]}
          onPress={onToggleRegion}
          activeOpacity={0.8}
        >
          {loadingRegions ? (
            <ActivityIndicator size="small" color={Colors.primary} style={s.loadingIcon} />
          ) : (
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={regionExpanded || selectedRegion ? Colors.primary : Colors.placeholder}
            />
          )}
          <Text style={[s.pickerText, !selectedRegion && s.pickerPlaceholder, regionExpanded && s.pickerTextActive]} numberOfLines={1}>
            {selectedRegion || t('createRealEstate.regionLabel')}
          </Text>
          <MaterialCommunityIcons
            name={regionExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={regionExpanded ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={s.fieldBlock}>
        <Text style={s.label}>{t('createRealEstate.cityLabel')}</Text>
        <TouchableOpacity
          style={[s.picker, !selectedRegion && s.pickerDisabled, cityExpanded && s.pickerActive]}
          onPress={onToggleCity}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="city-variant-outline"
            size={16}
            color={cityExpanded || cityText ? Colors.primary : Colors.placeholder}
          />
          <Text style={[s.pickerText, !cityText && s.pickerPlaceholder, cityExpanded && s.pickerTextActive]} numberOfLines={1}>
            {cityText || (selectedRegion ? t('createRealEstate.cityLabel') : t('citySelect.selectRegionFirst'))}
          </Text>
          {cityText ? (
            <TouchableOpacity onPress={(e) => { e.stopPropagation(); onClearCity(); }} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : (
            <MaterialCommunityIcons
              name={cityExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={cityExpanded ? Colors.primary : Colors.textMuted}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
