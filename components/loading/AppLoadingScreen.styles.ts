import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.background,
    },
    logo: {
      width: 200,
      height: 72,
    },
    spinner: {
      marginTop: 24,
    },
  });
}
