import React, { useState, useEffect, useRef } from 'react';
import {
  Animated, View, Text, TouchableOpacity, DeviceEventEmitter,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import type { ToastPayload } from '../../services/toastService';
import { createStyles } from './SaveToast.styles';

export default function SaveToast() {
  const [payload, setPayload] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('KARAADI_TOAST', (p: ToastPayload) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setPayload(p);
      translateY.setValue(24);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 180, friction: 12 }),
      ]).start();

      timerRef.current = setTimeout(dismiss, 2600);
    });
    return () => {
      sub.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function dismiss() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 24, duration: 180, useNativeDriver: true }),
    ]).start(() => setPayload(null));
  }

  if (!payload) return null;

  const isSaved = payload.type !== 'removed';
  const iconName = isSaved ? 'heart' : 'heart-outline';
  const iconColor = isSaved ? Colors.error : Colors.textMuted;
  const iconBg = isSaved ? 'rgba(239,68,68,0.18)' : Colors.whiteAlpha15;

  return (
    <Animated.View
      style={[
        styles.toast,
        { bottom: insets.bottom + 84, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.message} numberOfLines={1}>{payload.message}</Text>
      {payload.onView && (
        <TouchableOpacity
          style={styles.viewBtn}
          hitSlop={12}
          onPress={() => { dismiss(); payload.onView?.(); }}
          activeOpacity={0.75}
        >
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
