import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    fill: { flex: 1 },
    rowWrap: { flex: 1 },
    row: { flex: 1, flexDirection: 'row' },
    sidebar: {
      borderRightWidth: 1,
      borderRightColor: Colors.gray100,
      backgroundColor: Colors.surface,
    },
    divider: { width: 1, backgroundColor: Colors.gray100 },
    mainArea: { flex: 1 },
  });
}
