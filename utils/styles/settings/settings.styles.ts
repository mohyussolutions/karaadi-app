import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    sectionTitle: {
      fontSize: 12, fontWeight: '700', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, paddingHorizontal: 4,
    },
    section: {
      backgroundColor: Colors.card, borderRadius: 14, overflow: 'hidden',
      borderWidth: 1, borderColor: Colors.border,
    },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingHorizontal: 16, paddingVertical: 14,
    },
    iconWrap: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: Colors.primary + '18',
      alignItems: 'center', justifyContent: 'center',
    },
    rowLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
    rowTextWrap: { flex: 1 },
    rowSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    modeSection: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
    modeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    modeRow: { flexDirection: 'row', gap: 8 },
    modeBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
      paddingVertical: 10, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      backgroundColor: Colors.background,
    },
    modeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    modeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    modeBtnTextActive: { color: Colors.white },
    sectionTitleSpaced: { marginTop: 20 },
    bottomSpacer: { height: 40 },
  });
}
