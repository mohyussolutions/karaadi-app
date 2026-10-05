import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, Alert, Linking,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type CameraMountError,
  type CameraViewRef,
} from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/forms/cameraCapture.styles';
import { paddingBottomOf, paddingTopOf } from '../../../utils/styles/common/dynamic.styles';
import type { CameraCaptureProps, CameraFacing, CameraFlashMode, CameraRef, IconName } from '../../../utils/types';

export function CameraCapture({ visible, onCapture, onClose, initialFacing = 'back' }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraFacing>(initialFacing);
  const [flash, setFlash] = useState<CameraFlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const cameraRef = useRef<CameraViewRef>(null);
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

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

  function handleMountError(event: CameraMountError) {
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
      <View style={s.permWrap}>
        <MaterialCommunityIcons name="camera-off" size={52} color={Colors.textMuted} />
        <Text style={s.permTitle}>
          {t('postAd.cameraPermissionTitle')}
        </Text>
        <Text style={s.permSub}>
          {t('postAd.cameraPermissionMessage')}
        </Text>
        <TouchableOpacity
          style={s.permBtn}
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
          <Text style={s.permCancelText}>
            {t('auth.common.cancel', { defaultValue: 'Cancel' })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function MountErrorScreen() {
    return (
      <View style={s.permWrap}>
        <MaterialCommunityIcons name="camera-off" size={52} color={Colors.textMuted} />
        <Text style={s.permTitle}>
          {t('postAd.cameraUnavailableTitle', { defaultValue: 'Camera unavailable' })}
        </Text>
        <Text style={s.permSub}>
          {mountError}
        </Text>
        <TouchableOpacity style={s.permCancel} onPress={onClose}>
          <Text style={s.permCancelText}>
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
            ref={cameraRef as unknown as CameraRef}
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

          <View style={[s.topBar, paddingTopOf(insets.top + 8)]}>
            <TouchableOpacity style={s.iconBtn} onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={cycleFlash} hitSlop={8}>
              <MaterialCommunityIcons name={flashIcon as IconName} size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={[s.bottomBar, paddingBottomOf(insets.bottom + 16)]}>
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
