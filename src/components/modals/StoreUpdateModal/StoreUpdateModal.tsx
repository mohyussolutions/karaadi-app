import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import InAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { createStyles } from '../../../utils/styles/modals/forceUpdateModal.styles';

const inAppUpdates = new InAppUpdates(false);
const currentVersion = Application.nativeApplicationVersion ?? undefined;
const currentBuild = Application.nativeBuildVersion ?? undefined;
const bundleId = Application.applicationId ?? 'com.karaadi.app';
const SEMVER_PATTERN = /^\d+\.\d+(\.\d+)?$/;
const ITUNES_LOOKUP_URL = 'https://itunes.apple.com/lookup';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=';

function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function isValidStoreUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

// The timestamp param bypasses Apple's CDN cache so a new release is seen right away.
async function fetchAppStoreRelease(): Promise<{ version: string; url: string } | null> {
  const response = await fetch(
    `${ITUNES_LOOKUP_URL}?bundleId=${encodeURIComponent(bundleId)}&_=${Date.now()}`,
  );
  if (!response.ok) return null;
  const json = await response.json();
  const entry = json?.results?.[0];
  const version = typeof entry?.version === 'string' ? entry.version.trim() : '';
  const url = typeof entry?.trackViewUrl === 'string' ? entry.trackViewUrl.split('?')[0] : '';
  if (!SEMVER_PATTERN.test(version) || !isValidStoreUrl(url)) return null;
  return { version, url };
}

async function openPlayStoreUpdate(): Promise<void> {
  try {
    await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
  } catch (err) {
    console.warn('StoreUpdateModal: Play Core update failed, falling back to Play Store', err);
    await Linking.openURL(`${PLAY_STORE_URL}${bundleId}`);
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
    async function checkAppStore() {
      const release = await fetchAppStoreRelease();
      if (!release || !currentVersion || compareSemver(release.version, currentVersion) <= 0) return;
      setStoreVersion(release.version);
      setStoreUrl(release.url);
      setVisible(true);
    }

    async function checkPlayStore() {
      const result = await inAppUpdates.checkNeedsUpdate({ curVersion: currentBuild });
      if (!result.shouldUpdate) return;
      setStoreVersion(null);
      setVisible(true);
    }

    async function checkNeedsUpdate() {
      if (checking.current) return;
      checking.current = true;
      try {
        await (Platform.OS === 'ios' ? checkAppStore() : checkPlayStore());
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
        await openPlayStoreUpdate();
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
