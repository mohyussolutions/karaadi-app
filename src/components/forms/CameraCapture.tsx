import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, Alert, Linking,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type CameraViewRef,
} from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { useThemeColors } from '../hooks/useTheme';
import { COLORS } from '../../util/colors/colors';
import type { CameraCaptureProps } from '../../util/types';

export function CameraCapture({ visible, onCapture, onClose, initialFacing = 'back' }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>(initialFacing);
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const cameraRef = useRef<CameraViewRef>(null);
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const Colors = useThemeColors();

  useEffect(() => {
    if (!visible) return;
    setCameraReady(false);
    setMountError(null);

    const timeout = setTimeout(() => {
      setCameraReady((ready) => {
        if (!ready) {
          setMountError(
            'Camera did not start after 8 seconds. If you are on the iOS Simulator, it has no real camera '
            + '— test on a physical device (Simulator > I/O > Camera can sometimes pass through your Mac’s webcam).',
          );
        }
        return ready;
      });
    }, 8000);

    return () => clearTimeout(timeout);
  }, [visible]);

  async function handleCapture() {
    if (!cameraRef.current || capturing || !cameraReady) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePicture({ base64: true, quality: 0.6 });
      if (photo?.base64) {
        onCapture(photo.base64, 'image/jpeg');
        onClose();
      }
    } catch (err) {
      console.warn('[CameraCapture] takePicture failed:', err);
      Alert.alert(
        t('postAd.cameraPermissionTitle'),
        t('postAd.cameraErrorMessage', { defaultValue: 'Failed to take photo. Please try again.' }),
      );
    } finally {
      setCapturing(false);
    }
  }

  function handleMountError(event: { message: string }) {
    console.warn('[CameraCapture] Camera failed to mount:', event.message);
    setMountError(
      event.message
      || 'Camera failed to start. If you are on the iOS Simulator, note it has no real camera — test on a physical device.',
    );
  }

  function toggleFacing() {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }

  function cycleFlash() {
    setFlash((f) => (f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off'));
  }

  const flashIcon = flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-auto' : 'flash-off';

  function PermissionScreen() {
    const canAskAgain = permission?.canAskAgain ?? true;

    function handlePermissionPress() {
      if (canAskAgain) {
        requestPermission();
      } else {
        Linking.openSettings();
      }
    }

    return (
      <View style={[s.permWrap, { backgroundColor: Colors.background }]}>
        <MaterialCommunityIcons name="camera-off" size={52} color={Colors.textMuted} />
        <Text style={[s.permTitle, { color: Colors.textPrimary }]}>
          {t('postAd.cameraPermissionTitle')}
        </Text>
        <Text style={[s.permSub, { color: Colors.textMuted }]}>
          {t('postAd.cameraPermissionMessage')}
        </Text>
        <TouchableOpacity
          style={[s.permBtn, { backgroundColor: Colors.primary }]}
          onPress={handlePermissionPress}
          activeOpacity={0.85}
        >
          <Text style={s.permBtnText}>
            {canAskAgain
              ? t('postAd.cameraGrant', { defaultValue: 'Allow Camera' })
              : t('postAd.cameraOpenSettings', { defaultValue: 'Open Settings' })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.permCancel} onPress={onClose}>
          <Text style={[s.permCancelText, { color: Colors.textMuted }]}>
            {t('auth.common.cancel', { defaultValue: 'Cancel' })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function MountErrorScreen() {
    return (
      <View style={[s.permWrap, { backgroundColor: Colors.background }]}>
        <MaterialCommunityIcons name="camera-off" size={52} color={Colors.textMuted} />
        <Text style={[s.permTitle, { color: Colors.textPrimary }]}>
          {t('postAd.cameraUnavailableTitle', { defaultValue: 'Camera unavailable' })}
        </Text>
        <Text style={[s.permSub, { color: Colors.textMuted }]}>
          {mountError}
        </Text>
        <TouchableOpacity style={s.permCancel} onPress={onClose}>
          <Text style={[s.permCancelText, { color: Colors.textMuted }]}>
            {t('auth.common.cancel', { defaultValue: 'Cancel' })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      {!permission?.granted ? (
        <PermissionScreen />
      ) : mountError ? (
        <MountErrorScreen />
      ) : (
        <View style={s.root}>
          <CameraView
            ref={cameraRef as any}
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={flash}
            onCameraReady={() => setCameraReady(true)}
            onMountError={handleMountError}
          />

          {!cameraReady && (
            <View style={[StyleSheet.absoluteFill, s.loadingOverlay]}>
              <Text style={s.loadingText}>
                {t('postAd.cameraStarting', { defaultValue: 'Starting camera…' })}
              </Text>
            </View>
          )}

          <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity style={s.iconBtn} onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={cycleFlash} hitSlop={8}>
              <MaterialCommunityIcons name={flashIcon as any} size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={[s.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={s.flipBtn} onPress={toggleFacing} hitSlop={8}>
              <MaterialCommunityIcons name="camera-flip-outline" size={28} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.shutterOuter, (capturing || !cameraReady) && s.shutterCapturing]}
              onPress={handleCapture}
              activeOpacity={0.8}
              disabled={!cameraReady || capturing}
            >
              <View style={s.shutterInner} />
            </TouchableOpacity>

            <View style={s.flipBtnSpacer} />
          </View>
        </View>
      )}
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.black },
  flipBtnSpacer: { width: 52 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, zIndex: 10,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.shadow42,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 36, zIndex: 10,
  },
  flipBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.shadow42,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterOuter: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterCapturing: { opacity: 0.5 },
  loadingOverlay: {
    backgroundColor: COLORS.black, alignItems: 'center', justifyContent: 'center',
  },
  loadingText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  shutterInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  permWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  permTitle: { fontSize: 20, fontWeight: '800', marginTop: 20, textAlign: 'center' },
  permSub: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  permBtn: {
    marginTop: 28, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: 14, width: '100%', alignItems: 'center',
  },
  permBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  permCancel: { marginTop: 14, paddingVertical: 8 },
  permCancelText: { fontSize: 14, fontWeight: '600' },
});
