import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
    req: { color: Colors.error },
    trigger: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: Colors.inputBg, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: 13,
      borderWidth: 1, borderColor: Colors.border,
    },
    triggerError: { borderColor: Colors.error },
    triggerVal: { fontSize: 15, color: Colors.text, flex: 1 },
    triggerPlaceholder: { fontSize: 15, color: Colors.placeholder, flex: 1 },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: {
      backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
      maxHeight: '75%', paddingBottom: 32,
    },
    sheetHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    searchRow: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      marginHorizontal: 12, marginVertical: 8,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 8,
      borderWidth: 1, borderColor: Colors.border,
    },
    searchInput: { flex: 1, fontSize: 14, color: Colors.text, paddingVertical: 0 },
    option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    optionActive: { backgroundColor: Colors.primaryGhost },
    optionText: { fontSize: 15, color: Colors.textPrimary },
    optionTextActive: { color: Colors.primary, fontWeight: '600' },
    sep: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  });
}
