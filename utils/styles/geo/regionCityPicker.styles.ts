import { StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrapper: { marginBottom: 14 },
    row: { flexDirection: 'row', gap: 10 },
    fieldBlock: { flex: 1 },
    label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },

    picker: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 13 : 11,
    },
    pickerEmpty: { borderColor: Colors.border },
    pickerDisabled: { opacity: 0.55 },
    pickerActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    pickerText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
    pickerTextActive: { color: Colors.primary, fontWeight: '700' },
    pickerPlaceholder: { color: Colors.placeholder, fontWeight: '400' },
    loadingIcon: { marginRight: 6 },

    panel: {
      marginTop: 8,
      backgroundColor: Colors.card,
      borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border,
      overflow: 'hidden',
    },
    panelHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 10, paddingTop: 10,
    },
    panelCloseBtn: {
      width: 36, height: 36, borderRadius: 10,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.gray100,
    },
    panelList: { maxHeight: 260, marginTop: 4 },

    searchBox: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
    searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

    listContent: { paddingBottom: 8, paddingHorizontal: 4 },
    option: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingHorizontal: 16, paddingVertical: 13,
    },
    optionText: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
    optionTextActive: { fontWeight: '700' },
    countBadge: {
      minWidth: 26, paddingHorizontal: 8, paddingVertical: 2,
      borderRadius: 999, backgroundColor: Colors.gray100,
      alignItems: 'center', justifyContent: 'center',
    },
    countBadgeActive: { backgroundColor: Colors.primaryGhost },
    countText: { fontSize: 11, fontWeight: '700', color: Colors.gray500 },
    countTextActive: { color: Colors.primary },

    emptyRow: { alignItems: 'center', paddingVertical: 24 },
    emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 16 },

    useTypedRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 12, paddingVertical: 12, marginHorizontal: 8, marginTop: 6,
      borderRadius: 10,
      backgroundColor: Colors.primaryGhost,
    },
    useTypedIcon: {
      width: 30, height: 30, borderRadius: 15,
      backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.primary,
      alignItems: 'center', justifyContent: 'center',
    },
    useTypedText: { fontSize: 15, color: Colors.primary },
    useTypedBold: { fontWeight: '700' },
  });
}
