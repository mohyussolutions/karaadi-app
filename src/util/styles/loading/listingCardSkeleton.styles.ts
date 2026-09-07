import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors.gray100,
    },
    img: { width: '100%', aspectRatio: 1, backgroundColor: Colors.gray100 },
    body: { padding: 10, gap: 4 },
    line: { backgroundColor: Colors.gray100, borderRadius: 6 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  });
}
