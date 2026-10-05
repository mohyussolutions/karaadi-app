import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { overflow: 'hidden', backgroundColor: Colors.surface },
    fallback: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  });
}
