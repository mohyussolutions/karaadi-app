import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    activatingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
    activatingText: { fontSize: 14, color: Colors.textMuted },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 12, paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
      backgroundColor: Colors.card,
    },
    backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
    topBarSpacer: { width: 36 },
    topBarTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    scroll: { padding: 16, flexGrow: 1 },
    bottomSpacer: { height: 100 },
    errBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.errorGhost, borderRadius: 10, padding: 12, marginBottom: 12,
      borderWidth: 1, borderColor: Colors.error + '30',
    },
    errBannerText: { fontSize: 13, color: Colors.error, flex: 1 },
    footer: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 16, paddingBottom: 20, backgroundColor: Colors.card,
      borderTopWidth: 1, borderTopColor: Colors.border,
      shadowColor: Colors.black, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
      gap: 8,
    },
    payBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, borderRadius: 14, paddingVertical: 16,
      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    payBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
    secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    secText: { fontSize: 11, color: Colors.textMuted },
  });
}
