import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
    },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.border },
    headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  });
}
