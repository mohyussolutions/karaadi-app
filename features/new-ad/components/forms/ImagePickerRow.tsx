import React from 'react';
import type { ImagePickerRowProps } from '../../../../util/types';
import { View, Image, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { createStyles } from '../../../../util/styles/new-ad/imagePickerRow.styles';

const MIN_IMAGES = 2;
const MAX_IMAGES = 10;

export function ImagePickerRow({ images, onChange, error }: ImagePickerRowProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const remaining = MAX_IMAGES - images.length;
  const canAdd = remaining > 0;

  async function pick() {
    if (!canAdd) {
      Alert.alert(t('postAd.limitReachedTitle'), t('postAd.maxPhotosMessage', { max: MAX_IMAGES }));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsMultipleSelection: true,
      quality: 0.6,
      base64: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) {
      const dataUris = result.assets
        .filter(a => !!a.base64)
        .map(a => {
          const mime = a.mimeType === 'image/png' || a.mimeType === 'image/webp' ? a.mimeType : 'image/jpeg';
          return `data:${mime};base64,${a.base64}`;
        });
      onChange([...images, ...dataUris].slice(0, MAX_IMAGES));
    }
  }

  const countColor = images.length < MIN_IMAGES ? Colors.error : Colors.primary;

  return (
    <View style={s.wrap}>
      <View style={s.labelRow}>
        <Text style={s.label}>
          {t('postAd.photosLabel')} <Text style={s.req}>*</Text>
        </Text>
        <Text style={[s.counter, { color: countColor }]}>
          {images.length} / {MAX_IMAGES}
          {images.length < MIN_IMAGES && <Text style={s.minHint}>  {t('postAd.minPhotosHint', { min: MIN_IMAGES })}</Text>}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {canAdd && (
          <TouchableOpacity style={s.addBtn} onPress={pick} activeOpacity={0.75}>
            <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.primary} />
            <Text style={s.addText}>{t('postAd.addPhoto')}</Text>
          </TouchableOpacity>
        )}
        {images.map((uri, i) => (
          <View key={uri + i} style={s.imgWrap}>
            <Image source={{ uri }} style={s.thumb} />
            <TouchableOpacity
              style={s.remove}
              onPress={() => onChange(images.filter((_, idx) => idx !== i))}
              hitSlop={6}
            >
              <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        {!canAdd && (
          <View style={s.limitBadge}>
            <MaterialCommunityIcons name="check-circle" size={18} color={Colors.primary} />
            <Text style={s.limitText}>{t('postAd.maxReached')}</Text>
          </View>
        )}
      </ScrollView>

      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}
