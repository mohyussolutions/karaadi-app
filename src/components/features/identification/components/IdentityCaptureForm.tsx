import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { CameraCapture } from '../../../forms/CameraCapture';
import { compressToDataUri } from '../util/compressImage';
import { createStyles } from '../../../../util/styles/profile/verifyIdentity.styles';
import type { SlotKey, IdentityCaptureFormProps, SlotProps } from '../../../../util/types';

function rawDataUri(base64: string, mime: string) {
  return `data:${mime};base64,${base64}`;
}

function Slot({
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
            <MaterialCommunityIcons name={icon as any} size={32} color={Colors.gray400} />
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

export function IdentityCaptureForm({
  submitting, idCardRequired = true, selfieRequired = true, onSubmit, onSuccess,
}: IdentityCaptureFormProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [idCameraOpen, setIdCameraOpen] = useState(false);
  const [selfieCameraOpen, setSelfieCameraOpen] = useState(false);
  const [preview, setPreview] = useState<{ slot: SlotKey; uri: string } | null>(null);
  const [compressing, setCompressing] = useState<SlotKey | null>(null);
  const [submitError, setSubmitError] = useState(false);

  function setSlotImage(slot: SlotKey, uri: string) {
    if (slot === 'idCard') setIdCardImage(uri);
    else setSelfieImage(uri);
  }

  function clearSlot(slot: SlotKey) {
    if (slot === 'idCard') setIdCardImage(null);
    else setSelfieImage(null);
  }

  async function acceptPreview() {
    if (!preview) return;
    const { slot, uri } = preview;
    setPreview(null);
    setCompressing(slot);
    try {
      const compressed = await compressToDataUri(uri);
      setSlotImage(slot, compressed);
    } catch {
      setSlotImage(slot, uri);
    } finally {
      setCompressing(null);
    }
  }

  function retakePreview() {
    if (!preview) return;
    const slot = preview.slot;
    setPreview(null);
    if (slot === 'idCard') setIdCameraOpen(true);
    else setSelfieCameraOpen(true);
  }

  async function pickFromLibrary(slot: SlotKey) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      quality: 1,
    });
    if (result.canceled || !result.assets[0]?.uri) return;
    setCompressing(slot);
    try {
      const compressed = await compressToDataUri(result.assets[0].uri);
      setSlotImage(slot, compressed);
    } catch {
    } finally {
      setCompressing(null);
    }
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitError(false);
    const ok = await onSubmit(idCardImage ?? undefined, selfieImage ?? undefined);
    if (ok) {
      setIdCardImage(null);
      setSelfieImage(null);
      onSuccess?.();
    } else {
      setSubmitError(true);
    }
  }

  const idCardSatisfied = !idCardRequired || !!idCardImage;
  const selfieSatisfied = !selfieRequired || !!selfieImage;
  const hasAnyImage = !!idCardImage || !!selfieImage;
  const canSubmit = idCardSatisfied && selfieSatisfied && hasAnyImage && !submitting && !compressing;

  return (
    <>
      <Slot
        slotKey="idCard"
        label={t('mine.identification.idCardLabel') + (idCardRequired ? '' : ` ${t('mine.identification.optionalTag')}`)}
        hint={t('mine.identification.idCardHint')}
        icon="card-account-details-outline"
        image={idCardImage}
        compressing={compressing === 'idCard'}
        s={s}
        Colors={Colors}
        t={t}
        onTakePhoto={() => setIdCameraOpen(true)}
        onUpload={pickFromLibrary}
        onClear={clearSlot}
      />
      <Slot
        slotKey="selfie"
        label={t('mine.identification.selfieLabel') + (selfieRequired ? '' : ` ${t('mine.identification.optionalTag')}`)}
        hint={t('mine.identification.selfieHint')}
        icon="face-recognition"
        image={selfieImage}
        compressing={compressing === 'selfie'}
        s={s}
        Colors={Colors}
        t={t}
        onTakePhoto={() => setSelfieCameraOpen(true)}
        onUpload={pickFromLibrary}
        onClear={clearSlot}
      />

      <TouchableOpacity
        style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {submitting ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={s.submitBtnText}>{t('mine.identification.submit')}</Text>
        )}
      </TouchableOpacity>

      {submitError && <Text style={s.errorText}>{t('mine.identification.submitError')}</Text>}

      <CameraCapture
        visible={idCameraOpen}
        onCapture={(b64, mime) => setPreview({ slot: 'idCard', uri: rawDataUri(b64, mime) })}
        onClose={() => setIdCameraOpen(false)}
      />
      <CameraCapture
        visible={selfieCameraOpen}
        initialFacing="front"
        onCapture={(b64, mime) => setPreview({ slot: 'selfie', uri: rawDataUri(b64, mime) })}
        onClose={() => setSelfieCameraOpen(false)}
      />

      <Modal visible={!!preview} animationType="fade" statusBarTranslucent onRequestClose={() => setPreview(null)}>
        <View style={[s.previewRoot, { backgroundColor: Colors.black }]}>
          {preview && <Image source={{ uri: preview.uri }} style={s.previewImage} contentFit="contain" />}
          <View style={[s.previewActions, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={s.previewBtnSecondary} onPress={retakePreview}>
              <MaterialCommunityIcons name="camera-retake-outline" size={18} color={Colors.white} />
              <Text style={s.previewBtnSecondaryText}>{t('mine.identification.retakePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.previewBtnPrimary} onPress={acceptPreview}>
              <MaterialCommunityIcons name="check" size={18} color={Colors.white} />
              <Text style={s.previewBtnPrimaryText}>{t('mine.identification.usePhoto')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
