import { useEffect, useRef, useState } from 'react';
import { AppState, Modal, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useThemeColors } from '../hooks/useTheme';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { styles } from '../../util/styles/modals/forceUpdateModal.styles';

export default function ForceUpdateModal() {
  const [visible, setVisible] = useState(false);
  const [reloading, setReloading] = useState(false);
  const checking = useRef(false);
  const Colors = useThemeColors();
  const { t } = useAppTranslation();

  useEffect(() => {
    if (!Updates.isEnabled) return;

    async function checkForUpdate() {
      if (checking.current) return;
      checking.current = true;
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          setVisible(true);
        }
      } catch {
      } finally {
        checking.current = false;
      }
    }

    checkForUpdate();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkForUpdate();
    });
    return () => sub.remove();
  }, []);

  async function handleUpdate() {
    setReloading(true);
    try {
      await Updates.reloadAsync();
    } catch {
      setReloading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: Colors.primaryGhost }]}>
            <MaterialCommunityIcons name="cloud-download-outline" size={36} color={Colors.primary} />
          </View>
          <Text style={[styles.title, { color: Colors.text }]}>{t('common.forceUpdateTitle')}</Text>
          <Text style={[styles.message, { color: Colors.textSecondary }]}>{t('common.forceUpdateMessage')}</Text>
          <TouchableOpacity
            style={[styles.updateBtn, { backgroundColor: Colors.primary }, reloading && styles.updateBtnDisabled]}
            onPress={handleUpdate}
            disabled={reloading}
            activeOpacity={0.85}
          >
            <Text style={[styles.updateBtnText, { color: Colors.white }]}>
              {reloading ? t('common.updating') : t('common.updateNow')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
