import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, Animated } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../../../hooks/app/useAppTranslation';
import type { PollingOverlayProps } from '../../../../../../../../utils/types';
import { createStyles } from '../../../../../../../../utils/styles/payment/pollingOverlay.styles';
import { scaleTransform, progressWidth } from '../../../../../../../../utils/styles/common/dynamic.styles';
import { NATIVE_DRIVER } from "../../../../../../../../actions/constants";

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
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent onRequestClose={onCancel}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Animated.View style={[s.circle, scaleTransform(pulse)]}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </Animated.View>
          <Text style={s.title}>{t('postAd.waitingConfirmation')}</Text>
          <Text style={s.sub}>{t('postAd.approveOnApp')}</Text>
          <View style={s.progressRow}>
            <View style={s.bar}>
              <View style={[s.fill, progressWidth(attempt / maxAttempts)]} />
            </View>
            <Text style={s.prog}>{attempt}/{maxAttempts}</Text>
          </View>
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.85}>
              <Text style={s.cancelText}>{t('mine.businesses.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
