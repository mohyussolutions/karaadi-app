import { Dimensions, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      width,
      height,
      backgroundColor: Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
  });
}
