import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    actions: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 16, paddingVertical: 14,
      backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
    },
    callBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      borderWidth: 2, borderColor: Colors.primary, borderRadius: 14,
      paddingVertical: 13, paddingHorizontal: 18,
    },
    callText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
    msgBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14,
    },
    msgBtnDisabled: { backgroundColor: Colors.textMuted },
    msgBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
    actionsLeft: { flex: 1, minWidth: 0 },
    actionPrice: { fontSize: 16, fontWeight: '800', color: Colors.primary },
    actionTitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
    iconBtn: {
      width: 44, height: 44, borderRadius: 12, alignItems: 'center',
      justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border,
    },
  });
}
