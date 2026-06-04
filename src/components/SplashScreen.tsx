import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';
import COLORS from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(onFinish);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const ICON_SIZE = width * 0.42;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={{ width: ICON_SIZE, height: ICON_SIZE, overflow: 'hidden' }}>
        <Image
          source={require('../../assets/logo.jpg')}
          style={{ position: 'absolute', left: 0, top: 0, width: ICON_SIZE * 3.1, height: ICON_SIZE }}
          resizeMode="stretch"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
