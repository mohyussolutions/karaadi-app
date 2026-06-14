import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: 16 },
    bottomSpacer: { height: 8 },

    hero: {
      height: 220, backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center', gap: 12,
    },
    heroIcon: {
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center',
      shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    categoryBadge: {
      backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    },
    categoryBadgeText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
    body: { padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, lineHeight: 30, marginBottom: 6 },
    price: { fontSize: 26, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    card: {
      backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 14,
      borderWidth: 1, borderColor: Colors.border,
    },
    cardTitle: {
      fontSize: 12, fontWeight: '700', color: Colors.gray500,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
    },

    infoRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    infoRowLast: { borderBottomWidth: 0 },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoLabel: { fontSize: 14, color: Colors.gray500 },
    infoValue: {
      fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
      textAlign: 'right', flex: 1, marginLeft: 16,
    },
    description: { fontSize: 15, color: Colors.gray700, lineHeight: 24 },
    iconBtn: {
      width: 44, height: 44, borderRadius: 12, alignItems: 'center',
      justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border,
    },
  });
}
