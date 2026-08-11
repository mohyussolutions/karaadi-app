import React, { useState } from 'react';
import type { ImagePickerRowProps } from '../../../../../util/types';
import { View, Image, TouchableOpacity, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { createStyles } from '../../../../../util/styles/new-ad/imagePickerRow.styles';
import { CameraCapture } from './CameraCapture';

const MIN_IMAGES = 2;
const MAX_IMAGES = 10;

export function ImagePickerRow({ images, onChange, error }: ImagePickerRowProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const remaining = MAX_IMAGES - images.length;
  const canAdd = remaining > 0;
  const [cameraOpen, setCameraOpen] = useState(false);

  function addDataUri(base64: string, mime: string) {
    const uri = `data:${mime};base64,${base64}`;
    onChange([...images, uri].slice(0, MAX_IMAGES));
  }

  function addAssets(assets: ImagePicker.ImagePickerAsset[]) {
    const uris = assets
      .filter((a) => !!a.base64)
      .map((a) => {
        const mime = a.mimeType === 'image/png' || a.mimeType === 'image/webp' ? a.mimeType : 'image/jpeg';
        return `data:${mime};base64,${a.base64}`;
      });
    onChange([...images, ...uris].slice(0, MAX_IMAGES));
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsMultipleSelection: true,
      quality: 0.6,
      base64: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) addAssets(result.assets);
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
          {images.length < MIN_IMAGES && (
            <Text style={s.minHint}>  {t('postAd.minPhotosHint', { min: MIN_IMAGES })}</Text>
          )}
        </Text>
      </View>

      <View style={[s.uploader, error ? s.uploaderError : null]}>
        {canAdd && (
          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtn} onPress={pickFromLibrary} activeOpacity={0.8}>
              <MaterialCommunityIcons name="image-plus" size={18} color={Colors.primary} />
              <Text style={s.actionText}>{t('postAd.chooseFromLibrary')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.actionBtn} onPress={() => setCameraOpen(true)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="camera-outline" size={18} color={Colors.primary} />
              <Text style={s.actionText}>{t('postAd.takePhoto')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
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
      </View>

      {!!error && <Text style={s.errorText}>{error}</Text>}

      <CameraCapture
        visible={cameraOpen}
        onCapture={addDataUri}
        onClose={() => setCameraOpen(false)}
      />
    </View>
  );
}

