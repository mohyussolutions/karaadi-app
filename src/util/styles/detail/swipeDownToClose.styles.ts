import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { shadow } from '../../helpers/shadow';

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
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 1 }, opacity: 0.4, radius: 2, elevation: 2 }),
    },
  });
}
