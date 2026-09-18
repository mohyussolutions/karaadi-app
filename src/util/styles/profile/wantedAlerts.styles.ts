import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const topSheet = (Colors: ColorPalette) =>
  ({
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }) as const;

const upperLabel = (Colors: ColorPalette, fontSize: number, letterSpacing: number) =>
  ({
    fontSize,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing,
  }) as const;

const listStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    list: { padding: 16, gap: 12 },
    createBtn: {
      flexDirection: "row",
      ...centered,
      gap: 8,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      marginHorizontal: 16,
      marginBottom: 4,
    },
    createBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  } as const;
};

const formSheetStyles = (Colors: ColorPalette) =>
  ({
    modalOverlay: {
      flex: 1,
      backgroundColor: Colors.shadow40,
      justifyContent: "flex-end",
    },
    sheet: { ...topSheet(Colors), padding: 20, gap: 14 },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 4,
    },
    label: { ...upperLabel(Colors, 12, 0.5), marginBottom: 4 },
    input: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 11,
      fontSize: 15,
      color: Colors.text,
      backgroundColor: Colors.inputBg,
    },
    row: { flexDirection: "row", gap: 10 },
    half: { flex: 1 },
    flexFull: { flex: 1 },
    textArea: { height: 70, textAlignVertical: "top" },
  }) as const;

const chipStyles = (Colors: ColorPalette) =>
  ({
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.inputBg,
    },
    chipActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
    chipTextActive: { color: Colors.white },
  }) as const;

const buttonStyles = (Colors: ColorPalette) =>
  ({
    saveBtn: {
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 4,
    },
    saveBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
    cancelBtn: { alignItems: "center", paddingVertical: 10 },
    cancelText: { fontSize: 14, color: Colors.textSecondary },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...listStyles(Colors),
    ...formSheetStyles(Colors),
    ...chipStyles(Colors),
    ...buttonStyles(Colors),
  });

const inlineSheetStyles = (Colors: ColorPalette) =>
  ({
    hint: {
      fontSize: 12,
      color: Colors.textSecondary,
      marginHorizontal: 16,
      marginBottom: 8,
      lineHeight: 17,
    },
    sheetWrap: { ...topSheet(Colors), maxHeight: "92%" },
    sheetHeader: {
      ...rowCentered,
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 8,
    },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  }) as const;

const inlineSectionStyles = (Colors: ColorPalette) =>
  ({
    sectionRow: { ...rowCentered, gap: 8, marginVertical: 2 },
    sectionLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },
    sectionLabel: upperLabel(Colors, 11, 0.6),
    fieldGroup: { gap: 4 },
    imageFieldGroup: { gap: 6 },
  }) as const;

export const createSheetInlineStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...inlineSheetStyles(Colors),
    ...inlineSectionStyles(Colors),
  });

export const createImagePickerStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    row: { ...rowCentered, gap: 8, paddingTop: 4 },
    addBtn: {
      width: 76,
      height: 76,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: Colors.primary,
      borderStyle: "dashed",
      ...centered,
      backgroundColor: Colors.primaryLight + "15",
    },
    addText: {
      fontSize: 10,
      color: Colors.primary,
      fontWeight: "600",
      marginTop: 2,
    },
    imgWrap: { position: "relative" },
    thumb: {
      width: 76,
      height: 76,
      borderRadius: 10,
      backgroundColor: Colors.border,
    },
    remove: { position: "absolute", top: -6, right: -6 },
  });
