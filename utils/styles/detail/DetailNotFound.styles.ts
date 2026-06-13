import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
    errorBack: {
      backgroundColor: Colors.primary, borderRadius: 12,
      paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
    },
    errorBackText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  });
}
