import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card, borderRadius: 16, padding: 16,
      marginBottom: 14, borderWidth: 1, borderColor: Colors.border,
      gap: 12,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.border },
    info: { flex: 1, gap: 3 },
    name: { fontSize: 15, fontWeight: '700', color: Colors.text },
    sub: { fontSize: 13, color: Colors.textSecondary },
    starRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
    ratingText: { fontSize: 12, color: Colors.textSecondary, marginLeft: 4 },
    phoneBtn: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
    },
    msgBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13,
    },
    msgBtnDisabled: { backgroundColor: Colors.textMuted },
    msgText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  });
}
