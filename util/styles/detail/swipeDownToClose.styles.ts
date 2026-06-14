import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    flex: { flex: 1 },
    handleBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      paddingVertical: 14,
      zIndex: 10,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.gray300,
      opacity: 0.9,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  });
}
