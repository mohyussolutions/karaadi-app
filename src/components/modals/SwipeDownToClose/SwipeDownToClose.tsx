import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/detail/swipeDownToClose.styles';
import type { SwipeDownToCloseProps } from '../../../utils/types';
import { useHideGlobalChrome } from '../../../navigation/header/headerVisibility';
import { SCREEN_HEIGHT, DISMISS_DISTANCE, DISMISS_VELOCITY } from "../../../actions/constants";
import { paddingTopOf, topOf } from '../../../utils/styles/common/dynamic.styles';

export default function SwipeDownToClose({ children }: SwipeDownToCloseProps) {
  const router = useRouter();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  useHideGlobalChrome();

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

  return (
    <Animated.View style={[s.flex, paddingTopOf(insets.top), animatedStyle]}>
      {children}
      <GestureDetector gesture={pan}>
        <View style={[s.handleBar, topOf(insets.top)]}>
          <View style={s.handle} />
        </View>
      </GestureDetector>
    </Animated.View>
  );
}
