import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Animated } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import type { PollingOverlayProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/payment/pollingOverlay.styles';
import { NATIVE_DRIVER } from '../../../util/animation';

export function PollingOverlay({ visible, attempt, maxAttempts, onCancel }: PollingOverlayProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible]);

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Animated.View style={[s.circle, { transform: [{ scale: pulse }] }]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </Animated.View>
          <Text style={s.title}>{t('postAd.waitingConfirmation')}</Text>
          <Text style={s.sub}>{t('postAd.approveOnApp')}</Text>
          <View style={s.progressRow}>
            <View style={s.bar}>
              <View style={[s.fill, { width: `${Math.min((attempt / maxAttempts) * 100, 100)}%` as any }]} />
            </View>
            <Text style={s.prog}>{attempt}/{maxAttempts}</Text>
          </View>
          <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
            <Text style={s.cancelText}>{t('mine.businesses.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
