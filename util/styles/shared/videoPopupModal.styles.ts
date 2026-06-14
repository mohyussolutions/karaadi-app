import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    player: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: Colors.black,
    },
    video: { width: '100%', height: '100%' },
    closeBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 1,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
  });
}
