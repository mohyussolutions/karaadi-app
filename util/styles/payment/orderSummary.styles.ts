import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette, width = 390) {
  const IMG_H = Math.round((width - 32) * 0.56);
  return StyleSheet.create({
    wrap: { marginBottom: 20 },
    imgBox: { borderRadius: 14, overflow: 'hidden', marginBottom: 12, height: IMG_H },
    img: { width: '100%', height: '100%' },
    arrow: {
      position: 'absolute', top: '50%', marginTop: -18,
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: Colors.shadow45, alignItems: 'center', justifyContent: 'center',
    },
    arrowL: { left: 8 }, arrowR: { right: 8 },
    dots: { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
    dotActive: { backgroundColor: Colors.white, width: 16 },
    card: { backgroundColor: Colors.card, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
    titleSection: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    listingTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: Colors.primaryGhost, borderRadius: 20,
      paddingHorizontal: 8, paddingVertical: 4,
    },
    chipText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
    chipTextMuted: { color: Colors.textMuted },
    attrsGrid: {
      flexDirection: 'row', flexWrap: 'wrap', gap: 8,
      padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
    },
    attrCell: {
      backgroundColor: Colors.gray50, borderRadius: 10,
      paddingHorizontal: 10, paddingVertical: 8, minWidth: '28%', flex: 1,
    },
    attrLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
    attrValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
    descBox: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
    descLabel: { fontSize: 9, fontWeight: '800', color: Colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
    descText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
    breakdown: { padding: 14 },
    breakdownLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 },
    bRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.gray50, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 6 },
    planBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    bKey: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
    bDays: { fontSize: 12, color: Colors.textMuted },
    bVal: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
    green: { color: Colors.successDark },
    totalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, margin: 10, borderRadius: 14 },
    totalBoxFree: { backgroundColor: Colors.success + '15' },
    totalBoxPaid: { backgroundColor: Colors.primary },
    totalLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    totalLabel: { fontSize: 14, fontWeight: '800' },
    totalAmt: { fontSize: 28, fontWeight: '900' },
    textWhite: { color: Colors.white },
  });
}
