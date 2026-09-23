import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { createCommonStyles } from '../common/common.styles';
import { RADII } from '../../colors/colors';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { padding: 16, paddingBottom: 40 },

    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backBtn: { marginRight: 8, padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },

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
      borderColor: Colors.gray100,
      overflow: 'hidden',
    },

    mainImageWrap: {
      width: '100%',
      aspectRatio: 1.3,
      backgroundColor: Colors.slate100,
      position: 'relative',
    },
    mainImage: { width: '100%', height: '100%' },
    soldOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: Colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
    },
    soldOverlayText: {
      backgroundColor: Colors.amber,
      color: Colors.slate900,
      fontWeight: '900',
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: RADII.pill,
    },

    gridWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      padding: 8,
    },
    gridItem: {
      aspectRatio: 1,
      borderRadius: RADII.md,
      overflow: 'hidden',
      backgroundColor: Colors.slate100,
    },

    body: { padding: 16, gap: 8 },
    title: { fontSize: 17, fontWeight: '800', color: Colors.slate900, lineHeight: 22 },
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
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: Colors.surface,
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
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: Colors.surface,
      borderRadius: RADII.lg,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    },
    toggleTextWrap: { flex: 1 },
    toggleTitle: { fontSize: 13, fontWeight: '800', color: Colors.slate900, marginBottom: 2 },
    toggleDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 15 },

    viewAdBtn: {
      marginHorizontal: 16,
      marginBottom: 4,
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
