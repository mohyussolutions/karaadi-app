import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    bottomSpacer: { height: 100 },
    body: { backgroundColor: Colors.card, padding: 16 },

    titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
    title: { flex: 1, fontSize: 22, fontWeight: '800', color: Colors.textPrimary, lineHeight: 30 },
    conditionBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 4 },
    conditionText: { fontSize: 12, fontWeight: '700' },
    price: { fontSize: 26, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
    metaRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 14, flexWrap: 'wrap', gap: 8,
    },
    locPill: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: Colors.primaryGhost, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    },
    locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    dateText: { fontSize: 12, color: Colors.textMuted },

    metaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    metaChip: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: Colors.primaryGhost, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    },
    metaChipText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
    card: {
      backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 14,
      borderWidth: 1, borderColor: Colors.border,
    },
    cardTitle: {
      fontSize: 12, fontWeight: '700', color: Colors.gray500,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
    },
    description: { fontSize: 15, color: Colors.gray700, lineHeight: 24 },
    readMoreBtn: { marginTop: 8 },
    readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    soldBanner: {
      backgroundColor: Colors.amber, borderRadius: 12, paddingVertical: 12,
      alignItems: 'center', marginBottom: 4,
    },
    soldBannerText: { color: Colors.gray800, fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  });
}
