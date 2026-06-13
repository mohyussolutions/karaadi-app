import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    flex: { flex: 1 },
    handleBar: {
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: Colors.background,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.gray300,
    },
  });
}
