import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, gap: 12 },
    currentPlan: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.premium + '20', borderRadius: 10, padding: 12, marginBottom: 8,
    },
    currentPlanText: { fontSize: 14, color: Colors.text },
    planCard: {
      backgroundColor: Colors.card, borderRadius: 14, padding: 16,
      borderWidth: 1, borderColor: Colors.gray100,
    },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    planName: { fontSize: 18, fontWeight: '700', color: Colors.text },
    planPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
    planPer: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    featureText: { fontSize: 14, color: Colors.textSecondary },
    subscribeBtn: {
      backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12,
      alignItems: 'center', marginTop: 14,
    },
    subscribeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  });
}

export function createCurrentStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1.5,
      gap: 8,
    },
    cardActive: { borderColor: Colors.success },
    cardInactive: { borderColor: Colors.border },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    flexFull: { flex: 1 },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    name: {
      fontSize: 17,
      fontWeight: '700',
      color: Colors.textPrimary,
      textTransform: 'capitalize',
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeActive: { backgroundColor: Colors.success + '18' },
    badgeInactive: { backgroundColor: Colors.border },
    badgeText: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.6,
    },
    badgeTextActive: { color: Colors.success },
    badgeTextInactive: { color: Colors.textMuted },
    expiryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    expiryText: {
      fontSize: 12,
      color: Colors.textMuted,
    },
    noplan: {
      alignItems: 'center',
      paddingVertical: 20,
      gap: 4,
      marginBottom: 8,
    },
    noplanText: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.textPrimary,
    },
    noplanSub: {
      fontSize: 13,
      color: Colors.textMuted,
      textAlign: 'center',
    },
  });
}
