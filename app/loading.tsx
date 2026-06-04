import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import COLORS from '../src/constants/colors';

export default function Loading() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 24,
  },
});
