import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { createCommonStyles } from '../common/common.style';

export function createSubscriptionListStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { padding: 12, paddingBottom: 36 },
    row: { gap: 12, marginBottom: 12 },
  });
}

export function createCurrentStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card, borderRadius: 14, padding: 16,
      marginBottom: 16, borderWidth: 1.5, gap: 8,
    },
    cardActive: { borderColor: Colors.success },
    cardInactive: { borderColor: Colors.border },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    flexFull: { flex: 1 },
    label: {
      fontSize: 11, fontWeight: '600', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.4,
    },
    name: {
      fontSize: 17, fontWeight: '700', color: Colors.textPrimary,
      textTransform: 'capitalize',
    },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeActive: { backgroundColor: Colors.success + '18' },
    badgeInactive: { backgroundColor: Colors.border },
    badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
    badgeTextActive: { color: Colors.success },
    badgeTextInactive: { color: Colors.textMuted },
    expiryRow: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingTop: 4, borderTopWidth: 1, borderTopColor: Colors.border,
    },
    expiryText: { fontSize: 12, color: Colors.textMuted },
    noplan: { alignItems: 'center', paddingVertical: 20, gap: 4, marginBottom: 8 },
    noplanText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    noplanSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  });
}
