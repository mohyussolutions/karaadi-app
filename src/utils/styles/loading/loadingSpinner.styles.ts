import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    fullScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.background,
    },
  });
}
