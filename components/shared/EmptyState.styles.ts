import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 12,
    },
    title: { fontSize: 17, fontWeight: '700', color: Colors.textSecondary, textAlign: 'center' },
    message: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  });
}
