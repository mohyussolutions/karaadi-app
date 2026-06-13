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
    pickerText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
    pickerPlaceholder: { color: Colors.placeholder, fontWeight: '400' },
    loadingIcon: { marginRight: 6 },

    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      maxHeight: '75%',
      shadowColor: Colors.black, shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12, shadowRadius: 12, elevation: 20,
    },
    sheetHandle: {
      alignSelf: 'center', width: 40, height: 4,
      borderRadius: 2, backgroundColor: Colors.gray200, marginTop: 10, marginBottom: 4,
    },
    sheetHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    sheetTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary },

    searchBox: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      marginHorizontal: 12, marginVertical: 10,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
    searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

    listContent: { paddingBottom: 8 },
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

    subList: {
      marginLeft: 27, marginBottom: 4,
      borderLeftWidth: 2, borderLeftColor: Colors.gray100,
      paddingLeft: 12,
    },
    subOption: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingVertical: 10,
    },

    emptyRow: { alignItems: 'center', paddingVertical: 24 },
    emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 16 },

    useTypedRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
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
