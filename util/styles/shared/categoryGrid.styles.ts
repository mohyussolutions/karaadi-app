import { Dimensions, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const GAP = 6;
export const COLS = 3;
const CELL_W = (width - H_PAD * 2 - GAP * (COLS - 1)) / COLS;

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: { paddingHorizontal: H_PAD, paddingVertical: 4, gap: 6 },
    row: { flexDirection: 'row', gap: 6 },
    cell: {
      width: CELL_W,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      gap: 6,
    },
    cellPressed: {},
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapPressed: {
      backgroundColor: Colors.primary,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.gray700,
      textAlign: 'center',
      lineHeight: 16,
      paddingHorizontal: 3,
    },
    labelPressed: {
      color: Colors.primary,
    },
  });
}
