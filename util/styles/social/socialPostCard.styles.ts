import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    shareSection: {
      width: '100%', backgroundColor: Colors.card, borderRadius: 14,
      padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
    },
    shareTitle: {
      fontSize: 11, fontWeight: '800', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
    },
    platformList: { gap: 8, marginBottom: 12 },
    platformRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
      paddingVertical: 10, paddingHorizontal: 12, backgroundColor: Colors.background,
    },
    platformIconBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    platformInfo: { flex: 1, minWidth: 0 },
    platformName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    platformStatus: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
    platformStatusError: { fontSize: 11, color: Colors.error, marginTop: 2 },
    checkCircle: {
      width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    confirmBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13,
    },
    confirmBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
    postingBanner: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: Colors.primaryGhost, borderRadius: 12, paddingVertical: 13,
      borderWidth: 1, borderColor: Colors.blueTint,
    },
    postingBannerText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
    doneBanner: {
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.success + '14', borderRadius: 12, paddingVertical: 13,
      borderWidth: 1, borderColor: Colors.success + '33',
    },
    doneBannerText: { color: Colors.successDark, fontSize: 14, fontWeight: '800' },
  });
}
