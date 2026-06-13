import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: Colors.shadow55, alignItems: 'center', justifyContent: 'center', padding: 24 },
    card: { width: '100%', backgroundColor: Colors.card, borderRadius: 20, padding: 24, alignItems: 'center', gap: 12 },
    circle: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    title: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
    sub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
    bar: { flex: 1, height: 4, backgroundColor: Colors.gray100, borderRadius: 2, overflow: 'hidden' },
    fill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
    prog: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', width: 36, textAlign: 'right' },
    cancelBtn: { marginTop: 4, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
    cancelText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  });
}
