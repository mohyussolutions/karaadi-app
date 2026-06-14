import { StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    box: { borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card, padding: 14, marginBottom: 16 },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
    iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.blueTint },
    title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    sub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    input: {
      backgroundColor: Colors.inputBg, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 11,
      fontSize: 17, color: Colors.textPrimary,
      borderWidth: 1.5, borderColor: Colors.border, letterSpacing: 0.5,
    },
    inputErr: { borderColor: Colors.error },
    errRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
    errText: { fontSize: 12, color: Colors.error },
    note: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 6,
      marginTop: 10, padding: 10, backgroundColor: Colors.primaryGhost,
      borderRadius: 8, borderWidth: 1, borderColor: Colors.blueTint,
    },
    noteText: { fontSize: 11, color: Colors.primary, flex: 1, lineHeight: 16 },
  });
}
