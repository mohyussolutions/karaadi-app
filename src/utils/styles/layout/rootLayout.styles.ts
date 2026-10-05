import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
  });
}
