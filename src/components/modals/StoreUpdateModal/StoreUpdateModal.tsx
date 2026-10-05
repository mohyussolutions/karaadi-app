import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import InAppUpdates, { IAUUpdateKind, type IosNeedsUpdateResponse } from 'sp-react-native-in-app-updates';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { createStyles } from '../../../utils/styles/modals/forceUpdateModal.styles';

const inAppUpdates = new InAppUpdates(false);
const currentVersion = Application.nativeApplicationVersion ?? undefined;
const SEMVER_PATTERN = /^\d+\.\d+(\.\d+)?$/;

function isValidStoreUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function StoreUpdateModal() {
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const [storeVersion, setStoreVersion] = useState<string | null>(null);
  const checking = useRef(false);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useAppTranslation();

  useEffect(() => {
    async function checkNeedsUpdate() {
      if (checking.current) return;
      checking.current = true;
      try {
        const result = await inAppUpdates.checkNeedsUpdate({ curVersion: currentVersion });
        if (!result.shouldUpdate) return;
        const nextVersion = result.storeVersion?.trim();
        setStoreVersion(nextVersion && SEMVER_PATTERN.test(nextVersion) ? nextVersion : null);
        if (Platform.OS === 'ios') {
          const trackViewUrl = (result as IosNeedsUpdateResponse).other?.trackViewUrl;
          const cleanUrl = trackViewUrl?.split('?')[0];
          if (!cleanUrl || !isValidStoreUrl(cleanUrl)) return;
          setStoreUrl(cleanUrl);
        }
        setVisible(true);
      } catch {
      } finally {
        checking.current = false;
      }
    }

    checkNeedsUpdate();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkNeedsUpdate();
    });
    return () => sub.remove();
  }, []);

  function handleDismiss() {
    setVisible(false);
  }

  async function handleUpdate() {
    setUpdating(true);
    try {
      if (Platform.OS === 'android') {
        try {
          await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
        } catch (err) {
          console.warn('StoreUpdateModal: Play Core update failed, falling back to Play Store', err);
          const packageName = Application.applicationId ?? 'com.karaadi.app';
          await Linking.openURL(`https://play.google.com/store/apps/details?id=${packageName}`);
        }
      } else if (storeUrl && isValidStoreUrl(storeUrl)) {
        await Linking.openURL(storeUrl);
      }
    } catch (err) {
      console.warn('StoreUpdateModal: failed to open store URL', err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleDismiss}
            hitSlop={8}
            accessibilityLabel={t('common.close')}
          >
            <MaterialCommunityIcons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="storefront-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{t('common.storeUpdateTitle')}</Text>
          {storeVersion && (
            <View style={styles.versionPill}>
              {currentVersion && (
                <>
                  <Text style={styles.versionOld}>{currentVersion}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={14} color={Colors.textSecondary} />
                </>
              )}
              <Text style={styles.versionNew}>{storeVersion}</Text>
            </View>
          )}
          <Text style={styles.message}>
            {storeVersion
              ? t('common.storeUpdateVersionMessage', { version: storeVersion })
              : t('common.storeUpdateMessage')}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.updateBtn, updating && styles.updateBtnDisabled]}
              onPress={handleUpdate}
              disabled={updating}
              activeOpacity={0.85}
            >
              <Text style={styles.updateBtnText}>
                {updating ? t('common.updating') : t('common.updateNow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
