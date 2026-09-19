import { useRef, useState } from 'react';
import type { ImagePickerRowProps } from '../../../util/types';
import { View, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { createStyles } from '../../../util/styles/newAd/imagePickerRow.styles';
import { compressImageToDataUri } from '../../../util/helpers/imageCompression';
import { IMAGE_MAX_COUNT, MIN_IMAGES_REQUIRED } from '../../../constants/constants';
import { CameraCapture } from '../CameraCapture/CameraCapture';

interface ImageSource {
  uri: string;
  width?: number;
  height?: number;
}

export function ImagePickerRow({ images, onChange, error }: ImagePickerRowProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const remaining = IMAGE_MAX_COUNT - images.length;
  const canAdd = remaining > 0;
  const [cameraOpen, setCameraOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  async function addSources(sources: ImageSource[]) {
    setProcessing(true);
    try {
      const added: string[] = [];
      for (const { uri, width, height } of sources) {
        const size = width && height ? { width, height } : undefined;
        const dataUri = await compressImageToDataUri(uri, size).catch(() => null);
        if (dataUri) added.push(dataUri);
      }
      if (added.length) onChange([...imagesRef.current, ...added].slice(0, IMAGE_MAX_COUNT));
      if (added.length < sources.length) {
        Alert.alert(t('postAd.imageProcessFailed', { count: sources.length - added.length }));
      }
    } finally {
      setProcessing(false);
    }
  }

  function addCameraPhoto(base64: string, mime: string) {
    addSources([{ uri: `data:${mime};base64,${base64}` }]);
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) {
      addSources(result.assets.map(({ uri, width, height }) => ({ uri, width, height })));
    }
  }

  const countColor = images.length < MIN_IMAGES_REQUIRED ? Colors.error : Colors.primary;

  return (
    <View style={s.wrap}>
      <View style={s.labelRow}>
        <Text style={s.label}>
          {t('postAd.photosLabel')} <Text style={s.req}>*</Text>
        </Text>
        <Text style={[s.counter, { color: countColor }]}>
          {images.length} / {IMAGE_MAX_COUNT}
          {images.length < MIN_IMAGES_REQUIRED && (
            <Text style={s.minHint}>  {t('postAd.minPhotosHint', { min: MIN_IMAGES_REQUIRED })}</Text>
          )}
        </Text>
      </View>

      <View style={[s.uploader, error ? s.uploaderError : null]}>
        {canAdd && (
          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtn} onPress={pickFromLibrary} activeOpacity={0.8} disabled={processing}>
              <MaterialCommunityIcons name="image-plus" size={18} color={Colors.primary} />
              <Text style={s.actionText}>{t('postAd.chooseFromLibrary')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.actionBtn} onPress={() => setCameraOpen(true)} activeOpacity={0.8} disabled={processing}>
              <MaterialCommunityIcons name="camera-outline" size={18} color={Colors.primary} />
              <Text style={s.actionText}>{t('postAd.takePhoto')}</Text>
            </TouchableOpacity>
            {processing && <ActivityIndicator size="small" color={Colors.primary} />}
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
        onCapture={addCameraPhoto}
        onClose={() => setCameraOpen(false)}
      />
    </View>
  );
}

