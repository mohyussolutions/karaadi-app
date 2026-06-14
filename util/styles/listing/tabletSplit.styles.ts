import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createTabletSplitStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    row: { flex: 1, flexDirection: 'row' },
    leftCol: { flex: 0.45, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.gray200 },
    rightCol: { flex: 0.55 },
  });
}

export function createTabletSplitNarrowStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    row: { flex: 1, flexDirection: 'row' },
    leftCol: { flex: 0.40, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.gray200 },
    rightCol: { flex: 0.60 },
  });
}
