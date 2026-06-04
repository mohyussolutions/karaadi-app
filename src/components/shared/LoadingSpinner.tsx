import React from 'react';
import { ActivityIndicator, View, Image, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

interface Props {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingSpinner({
  fullScreen = false,
  size = 'large',
  color = COLORS.primary,
}: Props) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <Image
          source={require('../../../assets/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size={size} color={color} style={styles.spinner} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={color} />;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 200,
    height: 72,
  },
  spinner: {
    marginTop: 32,
  },
});
