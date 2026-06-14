import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    list: { padding: 16, gap: 12 },

    createBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: Colors.primary, borderRadius: 14,
      paddingVertical: 14, marginHorizontal: 16, marginBottom: 4,
    },
    createBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },

    card: {
      backgroundColor: Colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: Colors.border, padding: 14,
      flexDirection: 'row', alignItems: 'center', gap: 12,
    },
    iconWrap: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
    },
    cardBody: { flex: 1, gap: 4 },
    keyword: { fontSize: 15, fontWeight: '700', color: Colors.text },
    meta: { fontSize: 12, color: Colors.textSecondary },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: Colors.primary + '18', borderRadius: 6,
      paddingHorizontal: 8, paddingVertical: 2,
    },
    categoryText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
    deleteBtn: {
      width: 34, height: 34, borderRadius: 17,
      backgroundColor: Colors.errorGhost, alignItems: 'center', justifyContent: 'center',
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20,
      padding: 20, gap: 14,
    },
    sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
    label: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: {
      borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: Colors.text,
      backgroundColor: Colors.inputBg,
    },
    row: { flexDirection: 'row', gap: 10 },
    half: { flex: 1 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
      backgroundColor: Colors.inputBg,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
    chipTextActive: { color: Colors.white },
    saveBtn: {
      backgroundColor: Colors.primary, borderRadius: 12,
      paddingVertical: 14, alignItems: 'center', marginTop: 4,
    },
    saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
    cancelBtn: { alignItems: 'center', paddingVertical: 10 },
    cancelText: { fontSize: 14, color: Colors.textSecondary },
    flexFull: { flex: 1 },
    textArea: { height: 70, textAlignVertical: 'top' },
  });
}

export function createSheetInlineStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    hint: {
      fontSize: 12,
      color: Colors.textSecondary,
      marginHorizontal: 16,
      marginBottom: 8,
      lineHeight: 17,
    },
    sheetWrap: {
      backgroundColor: Colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '92%',
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 14,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginVertical: 2,
    },
    sectionLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    fieldGroup: { gap: 4 },
    imageFieldGroup: { gap: 6 },
  });
}

export function createImagePickerStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4 },
    addBtn: {
      width: 76, height: 76, borderRadius: 10,
      borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primaryLight + '15',
    },
    addText: { fontSize: 10, color: Colors.primary, fontWeight: '600', marginTop: 2 },
    imgWrap: { position: 'relative' },
    thumb: { width: 76, height: 76, borderRadius: 10, backgroundColor: Colors.border },
    remove: { position: 'absolute', top: -6, right: -6 },
  });
}
