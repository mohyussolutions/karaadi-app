import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export const H_PAD = 12;
export const COL_GAP = 8;

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    outerRow: { flexDirection: 'row' },
    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: Colors.gray200,
      backgroundColor: Colors.surface,
    },
    sidebarContent: { paddingVertical: 8 },
    scroll: { paddingBottom: 32 },
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
    colWrapper: { paddingHorizontal: H_PAD, gap: COL_GAP, marginBottom: COL_GAP },
    empty: { textAlign: 'center', color: Colors.textMuted, padding: 32 },
    readMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      marginHorizontal: H_PAD,
      marginTop: 4,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
    },
    readMoreText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
    recSection: { marginTop: 8 },
    recTitle: { paddingHorizontal: H_PAD, marginBottom: 8 },
    recListContent: { paddingHorizontal: H_PAD, gap: 8 },
    mainFlex: { flex: 1 },
  });
}
