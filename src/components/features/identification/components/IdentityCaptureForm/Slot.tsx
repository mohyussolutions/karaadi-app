import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SlotProps } from '../../../../../util/types';
import type { IconName } from '../../../../../util/icons/icons';

export function Slot({
  slotKey, label, hint, icon, image, compressing, s, Colors, t, onTakePhoto, onUpload, onClear,
}: SlotProps) {
  return (
    <>
      <Text style={s.sectionTitle}>{label}</Text>
      <Text style={s.sectionHint}>{hint}</Text>
      <View style={[s.slot, image && s.slotFilled]}>
        {compressing ? (
          <View style={s.slotEmpty}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : image ? (
          <>
            <Image source={{ uri: image }} style={s.slotImage} contentFit="cover" />
            <TouchableOpacity style={s.retakeBar} onPress={() => onClear(slotKey)}>
              <MaterialCommunityIcons name="refresh" size={16} color={Colors.primary} />
              <Text style={s.retakeText}>{t('mine.identification.retake')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={s.slotEmpty}>
            <MaterialCommunityIcons name={icon as IconName} size={32} color={Colors.gray400} />
            <Text style={s.slotLabel}>{label}</Text>
            <View style={s.slotActionRow}>
              <TouchableOpacity style={s.slotActionBtn} onPress={onTakePhoto}>
                <MaterialCommunityIcons name="camera-outline" size={16} color={Colors.primary} />
                <Text style={s.slotActionText}>{t('postAd.takePhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.slotActionBtn} onPress={() => onUpload(slotKey)}>
                <MaterialCommunityIcons name="image-plus" size={16} color={Colors.primary} />
                <Text style={s.slotActionText}>{t('postAd.chooseFromLibrary')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
