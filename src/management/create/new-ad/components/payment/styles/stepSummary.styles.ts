import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../../../../components/hooks/useTheme';
import { shadow } from '../../../../../../util/shadow';
import { createCommonStyles } from '../../../../../../util/styles/common/common.style';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    root: common.safeBase,
    topBar: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
    },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
    scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, flexGrow: 1 },
    hero: {
      alignItems: 'center',
      paddingVertical: 16,
      marginBottom: 6,
    },
    heroIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 21,
      fontWeight: '800',
      color: Colors.textPrimary,
      textAlign: 'center',
    },
    heroSub: {
      fontSize: 13,
      color: Colors.textMuted,
      textAlign: 'center',
      marginTop: 4,
    },
    bottomSpacer: { height: 88 },
    footer: {
      position: 'absolute', left: 0, right: 0,
      paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderWidth: 1,
      borderColor: Colors.border,
      borderBottomWidth: 0,
      ...shadow({ color: Colors.black, offset: { width: 0, height: -4 }, opacity: 0.08, radius: 14, elevation: 7 }),
    },
    continueBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 17,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.3, radius: 8, elevation: 5 }),
    },
    continueBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  });
}
