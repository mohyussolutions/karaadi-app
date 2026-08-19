import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import InAppUpdates, { IAUUpdateKind, type IosNeedsUpdateResponse } from 'sp-react-native-in-app-updates';
import { useThemeColors } from '../hooks/useTheme';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { styles } from '../../util/styles/modals/forceUpdateModal.styles';

const inAppUpdates = new InAppUpdates(__DEV__);

export default function StoreUpdateModal() {
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const checking = useRef(false);
  const Colors = useThemeColors();
  const { t } = useAppTranslation();

  useEffect(() => {
    async function checkNeedsUpdate() {
      if (checking.current) return;
      checking.current = true;
      try {
        const result = await inAppUpdates.checkNeedsUpdate({ curVersion: Application.nativeApplicationVersion ?? undefined });
        if (!result.shouldUpdate) return;
        if (Platform.OS === 'ios') {
          const trackViewUrl = (result as IosNeedsUpdateResponse).other?.trackViewUrl;
          if (!trackViewUrl) return;
          setStoreUrl(trackViewUrl.split('?')[0]);
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

  async function handleUpdate() {
    setUpdating(true);
    try {
      if (Platform.OS === 'android') {
        await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
      } else if (storeUrl) {
        await Linking.openURL(storeUrl);
      }
    } catch (err) {
      console.warn('StoreUpdateModal: failed to open store URL', err);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: Colors.primaryGhost }]}>
            <MaterialCommunityIcons name="storefront-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={[styles.title, { color: Colors.text }]}>{t('common.storeUpdateTitle')}</Text>
          <Text style={[styles.message, { color: Colors.textSecondary }]}>{t('common.storeUpdateMessage')}</Text>
          <TouchableOpacity
            style={[styles.updateBtn, { backgroundColor: Colors.primary }, updating && styles.updateBtnDisabled]}
            onPress={handleUpdate}
            disabled={updating}
            activeOpacity={0.85}
          >
            <Text style={[styles.updateBtnText, { color: Colors.white }]}>
              {updating ? t('common.updating') : t('common.updateNow')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
