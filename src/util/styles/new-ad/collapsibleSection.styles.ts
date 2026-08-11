import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: {
      marginBottom: 16,
      borderRadius: 18,
      backgroundColor: Colors.surface,
      borderWidth: 1.5,
      borderColor: Colors.border,
      overflow: 'hidden',
    },
    wrapError: { borderColor: Colors.error },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    titleError: { color: Colors.error },
    body: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 2 },
  });
}
