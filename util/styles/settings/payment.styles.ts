import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },

    summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    summaryCard: {
      flex: 1, backgroundColor: Colors.card, borderRadius: 12,
      padding: 16, borderWidth: 1, borderColor: Colors.border,
    },
    summaryLabel: {
      fontSize: 11, fontWeight: '600', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.5,
    },
    summaryValue: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 4 },

    sectionTitle: {
      fontSize: 13, fontWeight: '600', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
    },
    card: {
      backgroundColor: Colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 8,
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14, gap: 12,
    },
    rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    catIcon: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
    txId: { fontSize: 11, color: Colors.textMuted, fontVariant: ['tabular-nums'], marginTop: 1 },
    rowMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
    amount: { fontSize: 15, fontWeight: '700', color: Colors.text },
    badge: {
      flexDirection: 'row', alignItems: 'center', gap: 3,
      paddingHorizontal: 7, paddingVertical: 3, borderRadius: 99,
    },
    badgeText: { fontSize: 10, fontWeight: '700' },

    emptyCard: {
      alignItems: 'center', paddingVertical: 48, gap: 10,
      backgroundColor: Colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border,
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
    emptyMsg: {
      fontSize: 13, color: Colors.textMuted, textAlign: 'center',
      paddingHorizontal: 24, lineHeight: 19,
    },
    loadingIndicator: { marginTop: 60 },
    flexFull: { flex: 1 },
    amountCol: { alignItems: 'flex-end', gap: 4 },
    bottomSpacer: { height: 32 },
  });
}
