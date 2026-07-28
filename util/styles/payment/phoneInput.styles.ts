import { StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    box: { borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, padding: 16, marginBottom: 16 },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
    iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1 },
    title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    sub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    input: {
      backgroundColor: Colors.card, borderRadius: 14,
      paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 15 : 12,
      fontSize: 17, color: Colors.textPrimary,
      borderWidth: 1.5, borderColor: Colors.border, letterSpacing: 0.5,
    },
    inputErr: { borderColor: Colors.error },
    errRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    errText: { fontSize: 12, color: Colors.error },
    note: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 6,
      marginTop: 12, padding: 12, backgroundColor: Colors.card,
      borderRadius: 12,
    },
    noteText: { fontSize: 11, flex: 1, lineHeight: 16 },
  });
}
