import React from 'react';
import { Platform, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/detail/swipeDownToClose.styles';
import type { SwipeDownToCloseProps } from '../../util/types';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

/**
 * Android-only "pull down to close" wrapper for modal detail screens —
 * react-native-screens ignores gestureDirection="vertical" on Android,
 * so the native swipe-to-dismiss iOS gets for free has to be reimplemented here.
 */
export default function SwipeDownToClose({ children }: SwipeDownToCloseProps) {
  const router = useRouter();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const close = () => router.back();

  const pan = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      if (translateY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 }, () => {
          runOnJS(close)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (Platform.OS !== 'android') {
    return <>{children}</>;
  }

  return (
    <Animated.View style={[s.flex, animatedStyle]}>
      {children}
      <GestureDetector gesture={pan}>
        <View style={[s.handleBar, { top: insets.top }]}>
          <View style={s.handle} />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}
