import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
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
    footer: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 16, backgroundColor: Colors.card,
      borderTopWidth: 1, borderTopColor: Colors.border,
      ...shadow({ color: Colors.black, offset: { width: 0, height: -2 }, opacity: 0.06, radius: 8, elevation: 4 }),
    },
    continueBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.3, radius: 8, elevation: 5 }),
    },
    continueBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  });
}
