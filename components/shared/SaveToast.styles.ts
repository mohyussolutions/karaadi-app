import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#1E293B',
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 12,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
      elevation: 10,
      zIndex: 9999,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: '#F8FAFC',
      letterSpacing: 0.1,
    },
    viewBtn: {
      backgroundColor: Colors.whiteAlpha15,
      borderRadius: 16,
      paddingVertical: 7,
      paddingHorizontal: 14,
    },
    viewBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.white,
      letterSpacing: 0.2,
    },
  });
}
