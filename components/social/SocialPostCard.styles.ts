import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    shareSection: {
      width: '100%', backgroundColor: Colors.card, borderRadius: 14,
      padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
    },
    shareTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
    shareSub: { fontSize: 12, color: Colors.textMuted, marginBottom: 14 },
    platformsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    platformBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
      borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
      paddingVertical: 10, paddingHorizontal: 12, backgroundColor: Colors.background,
    },
    platformBtnOn: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    platformIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    platformLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    platformLabelOn: { color: Colors.primary },
    stateIcon: { marginLeft: 2 },
    postBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13,
    },
    postBtnDisabled: { opacity: 0.45 },
    postBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  });
}
