import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createCommonStyles } from '../common/common.styles';
import { RADII } from '../../colors/colors';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { padding: 16 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },

    planBadge: {
      alignSelf: 'center',
      backgroundColor: Colors.primaryGhost,
      borderRadius: RADII.pill,
      paddingHorizontal: 14,
      paddingVertical: 5,
      marginBottom: 12,
    },
    planBadgeText: { color: Colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

    card: {
      backgroundColor: Colors.card,
      borderRadius: RADII.xxl,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: 'hidden',
      marginBottom: 12,
    },

    galleryWrap: { backgroundColor: Colors.surface, overflow: 'hidden' },
    soldBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: Colors.error,
      borderRadius: RADII.sm,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    soldBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    counter: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: Colors.shadow45,
      borderRadius: RADII.pill,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    counterText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
    dots: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.whiteAlpha50 },
    dotActive: { width: 16, backgroundColor: Colors.white },

    body: { padding: 16, gap: 8 },
    title: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, lineHeight: 22 },
    description: { fontSize: 13, color: Colors.textMuted, lineHeight: 18 },
    priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    price: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
    typeBadge: {
      backgroundColor: Colors.surface,
      borderRadius: RADII.pill,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    typeText: { fontSize: 11, color: Colors.textMuted, textTransform: 'capitalize' },

    expiryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: RADII.lg,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    expiryLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
    expiryValue: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary },
    expiryValueWarning: { color: Colors.warning },
    expiryValueDanger: { color: Colors.error },

    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: RADII.lg,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    },
    toggleTextWrap: { flex: 1 },
    toggleTitle: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
    toggleDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 15 },

    viewAdBtn: {
      backgroundColor: Colors.primary,
      borderRadius: RADII.lg,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    viewAdBtnText: { color: Colors.white, fontSize: 14, fontWeight: '800' },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    backLinkBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 12 },
    backLinkText: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
  });
}
