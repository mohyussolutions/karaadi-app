import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    list: { flexGrow: 1 },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 14,
    },
    query: { flex: 1, fontSize: 15, color: Colors.text },
    separator: { height: 1, backgroundColor: Colors.border },
  });
}
