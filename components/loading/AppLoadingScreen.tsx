import React from 'react';
import { View, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/loading/appLoadingScreen.styles';

export default function AppLoadingScreen() {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(200, width * 0.5);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={[styles.logo, { width: logoWidth }]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
    </View>
  );
}
