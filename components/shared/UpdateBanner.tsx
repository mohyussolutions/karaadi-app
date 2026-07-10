import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { createStyles } from '../../util/styles/shared/updateBanner.styles';
import { NATIVE_DRIVER } from '../../util/animation';

export default function UpdateBanner() {
  const [visible, setVisible] = useState(false);
  const [reloading, setReloading] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const checking = useRef(false);
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
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
          Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: NATIVE_DRIVER }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: NATIVE_DRIVER, tension: 180, friction: 12 }),
          ]).start();
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

  async function handleReload() {
    setReloading(true);
    try {
      await Updates.reloadAsync();
    } catch {
      setReloading(false);
    }
  }

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toast, { bottom: insets.bottom + 84, opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="cloud-download-outline" size={18} color={Colors.white} />
      </View>
      <Text style={styles.message} numberOfLines={1}>{t('common.updateAvailable')}</Text>
      <TouchableOpacity
        style={styles.reloadBtn}
        hitSlop={12}
        onPress={handleReload}
        disabled={reloading}
        activeOpacity={0.75}
      >
        <Text style={styles.reloadBtnText}>{reloading ? t('common.updating') : t('common.restart')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
