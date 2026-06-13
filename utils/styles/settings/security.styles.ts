import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    flexFull: { flex: 1 },
    loadingIndicator: { marginTop: 60 },
    bottomSpacer: { height: 32 },

    sectionRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 10, gap: 8, flexWrap: 'wrap',
    },
    sectionRowSpaced: { marginTop: 24 },
    sectionTitle: {
      fontSize: 13, fontWeight: '600', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.5,
    },
    sectionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    headerBtns: { flexDirection: 'row', gap: 8 },

    card: {
      backgroundColor: Colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 8,
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    },
    rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    iconWrap: {
      width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.gray100,
      alignItems: 'center', justifyContent: 'center',
    },
    rowTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
    activeTag: { fontSize: 12, color: Colors.success, fontWeight: '600', marginTop: 2 },
    rowMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    removeText: { fontSize: 13, color: Colors.error, fontWeight: '600' },
    metaRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    emptyText: { padding: 20, textAlign: 'center', color: Colors.textMuted, fontSize: 14 },

    outlineBtn: {
      paddingHorizontal: 10, paddingVertical: 6,
      backgroundColor: Colors.gray100, borderRadius: 8,
    },
    outlineBtnText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
    dangerBtn: {
      paddingHorizontal: 10, paddingVertical: 6,
      backgroundColor: Colors.errorGhost, borderRadius: 8,
    },
    dangerBtnText: { fontSize: 12, fontWeight: '700', color: Colors.error },
    btnDisabled: { opacity: 0.4 },
  });
}
