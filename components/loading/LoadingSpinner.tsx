import React from 'react';
import type { LoadingSpinnerProps } from '../../utils/types';
import { ActivityIndicator, View } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/loading/loadingSpinner.styles';

export default function LoadingSpinner({
  fullScreen = false,
  size = 'large',
  color,
}: LoadingSpinnerProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const spinnerColor = color ?? Colors.primary;

  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={spinnerColor} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={spinnerColor} />;
}
