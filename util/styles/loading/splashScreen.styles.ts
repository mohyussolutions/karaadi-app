import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
  });
}
