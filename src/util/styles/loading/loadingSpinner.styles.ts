import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';

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
