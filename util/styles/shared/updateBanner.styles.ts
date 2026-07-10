import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.toastBg,
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 12,
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 6 }, opacity: 0.22, radius: 16, elevation: 10 }),
      zIndex: 9999,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.whiteAlpha15,
    },
    message: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: Colors.toastText,
      letterSpacing: 0.1,
    },
    reloadBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 16,
      paddingVertical: 7,
      paddingHorizontal: 14,
    },
    reloadBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.white,
      letterSpacing: 0.2,
    },
  });
}
