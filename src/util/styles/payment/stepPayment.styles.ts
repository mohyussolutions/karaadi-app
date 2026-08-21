import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { shadow } from '../../helpers/shadow';
import { createCommonStyles } from '../common/common.style';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    root: common.safeBase,
    activatingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
    activatingText: { fontSize: 14, color: Colors.textMuted },
    iosPaymentRoot: { justifyContent: 'center', alignItems: 'center', padding: 32 },
    iosPaymentTitle: { marginTop: 16, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.textMuted },
    iosPaymentBody: { color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    iosPaymentBtn: { marginTop: 24, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
    iosPaymentBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
    topBar: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 8,
    },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
    scroll: { padding: 16, flexGrow: 1 },
    bottomSpacer: { height: 100 },
    errBanner: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.errorGhost, borderRadius: 10, padding: 12, marginBottom: 12,
      borderWidth: 1, borderColor: Colors.error + '30',
    },
    errBannerText: { fontSize: 13, color: Colors.error, flex: 1 },
    footer: {
      position: 'absolute', left: 0, right: 0,
      paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14,
      backgroundColor: Colors.background,
      gap: 8,
    },
    payBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, borderRadius: 18, paddingVertical: 17,
      ...shadow({ color: Colors.black, offset: { width: 0, height: 4 }, opacity: 0.22, radius: 10, elevation: 5 }),
    },
    payBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
    secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    secText: { fontSize: 11, color: Colors.textMuted },
  });
}
