import { StyleSheet, type TextStyle } from 'react-native';
import type { ColorPalette } from '../../types';
import { createCommonStyles } from '../common/common.styles';

const PAGE_PAD = 20;
const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { flexGrow: 1 },

    totalBlock: { backgroundColor: Colors.primary, paddingHorizontal: PAGE_PAD, paddingTop: 28, paddingBottom: 32 },
    totalLabel: { fontSize: 13, fontWeight: '700', color: Colors.whiteAlpha80 },
    totalValue: { ...tabular, fontSize: 40, lineHeight: 46, fontWeight: '800', color: Colors.textOnPrimary, letterSpacing: -1, marginTop: 6 },
    totalMeta: { fontSize: 14, color: Colors.whiteAlpha80, marginTop: 8 },

    body: { paddingHorizontal: PAGE_PAD, paddingTop: 32 },
    heading: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3, marginBottom: 8 },

    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    rowMain: { flex: 1 },
    rowLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    rowMeta: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
    txId: { ...tabular, fontSize: 12, color: Colors.textMuted, marginTop: 4 },
    rowSide: { alignItems: 'flex-end' },
    amount: { ...tabular, fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
    status: { fontSize: 12, fontWeight: '700', marginTop: 4 },

    empty: { paddingTop: 16, paddingRight: 40 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
    emptyMsg: { fontSize: 15, lineHeight: 22, color: Colors.textMuted, marginTop: 6 },
  });
}
