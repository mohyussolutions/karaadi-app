import { StyleSheet, Platform } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const outline = (color: string) =>
  ({ borderWidth: 1, borderColor: color }) as const;

const iosPad = (ios: number, android: number) =>
  Platform.OS === "ios" ? ios : android;

const inputBox = (Colors: ColorPalette, backgroundColor: string, borderColor: string, paddingVertical: number) =>
  ({
    ...rowCentered,
    gap: 8,
    backgroundColor,
    borderRadius: 10,
    ...outline(borderColor),
    paddingHorizontal: 12,
    paddingVertical,
  }) as const;

const roundIconBtn = (Colors: ColorPalette, size: number) =>
  ({
    width: size,
    height: size,
    borderRadius: 10,
    ...centered,
    backgroundColor: Colors.gray100,
  }) as const;

const fieldStyles = (Colors: ColorPalette) =>
  ({
    wrapper: { marginBottom: 14 },
    row: { flexDirection: "row", gap: 10 },
    fieldBlock: { flex: 1 },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.textPrimary,
      marginBottom: 6,
    },
  }) as const;

const pickerStyles = (Colors: ColorPalette) =>
  ({
    picker: inputBox(Colors, Colors.inputBg, Colors.border, iosPad(13, 11)),
    pickerEmpty: { borderColor: Colors.border },
    pickerDisabled: { opacity: 0.55 },
    pickerActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryGhost,
    },
    pickerError: { borderColor: Colors.error },
    pickerText: {
      flex: 1,
      fontSize: 14,
      color: Colors.textPrimary,
      fontWeight: "500",
    },
    pickerTextActive: { color: Colors.primary, fontWeight: "700" },
    pickerPlaceholder: { color: Colors.placeholder, fontWeight: "400" },
    loadingIcon: { marginRight: 6 },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 6 },
  }) as const;

const panelStyles = (Colors: ColorPalette) =>
  ({
    panel: {
      marginTop: 8,
      backgroundColor: Colors.card,
      borderRadius: 12,
      ...outline(Colors.border),
      overflow: "hidden",
    },
    panelHeader: {
      ...rowCentered,
      gap: 8,
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    panelHeaderEnd: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    panelCloseBtn: roundIconBtn(Colors, 36),
    panelList: { maxHeight: 260, marginTop: 4 },
    searchBox: {
      flex: 1,
      ...inputBox(Colors, Colors.inputBg, Colors.border, iosPad(10, 8)),
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: Colors.textPrimary,
      padding: 0,
    },
  }) as const;

const optionStyles = (Colors: ColorPalette) =>
  ({
    listContent: { paddingBottom: 8, paddingHorizontal: 4 },
    option: {
      ...rowCentered,
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    optionActive: { backgroundColor: Colors.primaryGhost, borderRadius: 10 },
    optionText: {
      flex: 1,
      fontSize: 15,
      color: Colors.textPrimary,
      fontWeight: "500",
    },
    optionTextActive: { color: Colors.primary, fontWeight: "700" },
    emptyRow: { alignItems: "center", paddingVertical: 24 },
    emptyText: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      paddingHorizontal: 16,
    },
  }) as const;

const footerStyles = (Colors: ColorPalette) =>
  ({
    panelFooter: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      padding: 8,
    },
    useTypedRow: {
      ...rowCentered,
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: Colors.primaryGhost,
    },
    useTypedIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: Colors.card,
      ...outline(Colors.primary),
      ...centered,
    },
    useTypedText: { fontSize: 15, color: Colors.primary, fontWeight: "700" },
  }) as const;

const addCityStyles = (Colors: ColorPalette) =>
  ({
    addCityRow: { ...rowCentered, gap: 8 },
    addCityInput: {
      flex: 1,
      fontSize: 14,
      color: Colors.textPrimary,
      backgroundColor: Colors.primaryGhost,
      borderRadius: 10,
      ...outline(Colors.primary),
      paddingHorizontal: 12,
      paddingVertical: iosPad(10, 8),
    },
    addCitySaveBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: Colors.primary,
      ...centered,
    },
    addCitySaveBtnDisabled: { opacity: 0.4 },
    addCitySaveText: { fontSize: 13, fontWeight: "700", color: Colors.white },
    addCityCancelBtn: roundIconBtn(Colors, 38),
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...fieldStyles(Colors),
    ...pickerStyles(Colors),
    ...panelStyles(Colors),
    ...optionStyles(Colors),
    ...footerStyles(Colors),
    ...addCityStyles(Colors),
  });
