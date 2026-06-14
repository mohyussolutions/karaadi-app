import React from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/loading/appLoadingScreen.styles';

export default function AppLoadingScreen() {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
    </View>
  );
}
