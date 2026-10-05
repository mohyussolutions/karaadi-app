import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { H_PAD } from '../../../actions/constants';
import { createCommonStyles } from '../common/common.styles';
export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    outerRow: { flexDirection: 'row' },
    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: Colors.gray200,
      backgroundColor: Colors.background,
    },
    sidebarContent: { paddingVertical: 8 },
    scroll: { paddingBottom: 120 },
    section: { paddingTop: 8 },
    videoSection: { paddingTop: 8, paddingHorizontal: H_PAD },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    postBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primary,
      marginHorizontal: H_PAD,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 10,
      paddingVertical: 13,
      paddingHorizontal: 16,
      gap: 8,
    },
    postBtnText: { flex: 1, color: Colors.white, fontWeight: '700', fontSize: 15 },
    empty: { textAlign: 'center', color: Colors.textMuted, padding: 32 },
    recSection: { marginTop: 8 },
    recTitle: { paddingHorizontal: H_PAD, marginBottom: 8 },
    recListContent: { paddingHorizontal: H_PAD },
    recCard: { marginRight: 8 },
    mainFlex: { flex: 1 },
  });
}
