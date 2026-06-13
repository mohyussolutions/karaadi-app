import React, { useEffect, useRef } from 'react';
import type { SplashScreenProps } from '../../utils/types';
import { Image, Animated, Dimensions } from 'react-native';
import { useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from './SplashScreen.styles';

const { width } = Dimensions.get('window');
const LOGO_W = Math.round(width * 0.6);
const LOGO_H = Math.round(LOGO_W / 3.15);

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onFinish);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={{ width: LOGO_W, height: LOGO_H }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
