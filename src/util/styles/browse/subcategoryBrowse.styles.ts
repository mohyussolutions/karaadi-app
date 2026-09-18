import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { shadow } from "../../helpers/shadow";
import { H_PAD } from "../../../constants/constants";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const outline = (color: string) =>
  ({ borderWidth: 1, borderColor: color }) as const;

const bottomHairline = (color: string) =>
  ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color,
  }) as const;

const topHairline = (color: string) =>
  ({
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color,
  }) as const;

const countBadge = (
  Colors: ColorPalette,
  paddingHorizontal: number,
  borderRadius: number,
) =>
  ({
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textMuted,
    backgroundColor: Colors.gray100,
    paddingHorizontal,
    paddingVertical: 2,
    borderRadius,
  }) as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    root: safeBase,
    safe: safeBase,
    outerRow: { flex: 1, flexDirection: "row" },
    flexFull: { flex: 1 },
    listContent: { paddingBottom: 32 },
    emptyContainer: { flex: 1, paddingTop: 40 },
  } as const;
};

const headerStyles = (Colors: ColorPalette) =>
  ({
    pageHeader: {
      ...rowCentered,
      gap: 8,
      paddingHorizontal: H_PAD,
      paddingVertical: 12,
      backgroundColor: Colors.card,
      ...bottomHairline(Colors.gray100),
    },
    pageTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: Colors.textPrimary,
    },
    pageBreadcrumb: {
      fontSize: 12,
      color: Colors.textMuted,
      fontWeight: "500",
    },
    filterIconBtn: {
      width: 30,
      height: 30,
      borderRadius: 8,
      ...centered,
      backgroundColor: Colors.primaryGhost,
      ...outline(Colors.blueTint),
    },
    filterIconBtnActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
  }) as const;

const chipStyles = (Colors: ColorPalette) =>
  ({
    chipsScroll: {
      backgroundColor: Colors.card,
      ...bottomHairline(Colors.gray100),
    },
    chipsRow: {
      ...rowCentered,
      paddingHorizontal: H_PAD,
      paddingVertical: 10,
      gap: 8,
    },
    chip: {
      ...rowCentered,
      gap: 5,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: Colors.background,
      ...outline(Colors.gray200),
    },
    chipActive: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    chipLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: Colors.textSecondary,
    },
    chipLabelActive: { color: Colors.white, fontWeight: "600" },
    activeFilterRow: {
      ...rowCentered,
      gap: 6,
      marginHorizontal: H_PAD,
      marginBottom: 4,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: Colors.primaryGhost,
      borderRadius: 8,
      ...outline(Colors.blueTint),
    },
    activeFilterText: {
      flex: 1,
      fontSize: 12,
      fontWeight: "600",
      color: Colors.primary,
    },
  }) as const;

const sidebarStyles = (Colors: ColorPalette) =>
  ({
    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: Colors.gray200,
      backgroundColor: Colors.surface,
      paddingTop: 8,
    },
    sidebarHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      ...bottomHairline(Colors.gray100),
    },
    sidebarTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: "700",
      color: Colors.textPrimary,
    },
    clearRow: {
      ...rowCentered,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: Colors.primaryGhost,
      ...bottomHairline(Colors.blueTint),
    },
    clearText: { fontSize: 12, fontWeight: "600", color: Colors.primary },
  }) as const;

const nestedStyles = (Colors: ColorPalette) =>
  ({
    nestedItem: {
      ...rowCentered,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 10,
      ...bottomHairline(Colors.gray100),
    },
    nestedItemActive: { backgroundColor: Colors.primaryGhost },
    nestedIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: Colors.gray100,
      ...centered,
    },
    nestedIconActive: { backgroundColor: Colors.blueTint },
    nestedLabel: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      color: Colors.textPrimary,
    },
    nestedLabelActive: { color: Colors.primary, fontWeight: "600" },
    nestedCount: countBadge(Colors, 6, 8),
    nestedCountActive: {
      color: Colors.primary,
      backgroundColor: Colors.blueTint,
    },
  }) as const;

const postButtonStyles = (Colors: ColorPalette) =>
  ({
    postBtn: {
      ...rowCentered,
      backgroundColor: Colors.primary,
      marginHorizontal: H_PAD,
      marginTop: 8,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 8,
    },
    postBtnSpaced: { marginHorizontal: H_PAD, marginBottom: 8 },
    postBtnText: {
      flex: 1,
      color: Colors.white,
      fontWeight: "700",
      fontSize: 14,
      letterSpacing: 0.3,
    },
  }) as const;

const filterSheetStyles = (Colors: ColorPalette) =>
  ({
    filterBackdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.shadow45,
    },
    filterSheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: "92%",
      backgroundColor: Colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: H_PAD,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: -4 },
        opacity: 0.12,
        radius: 12,
        elevation: 20,
      }),
    },
    filterSheetHandle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.gray200,
      marginTop: 10,
      marginBottom: 4,
    },
    filterSheetHeader: {
      ...rowCentered,
      justifyContent: "space-between",
      paddingVertical: 12,
      marginBottom: 4,
      ...bottomHairline(Colors.gray100),
    },
    filterSheetTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: Colors.textPrimary,
    },
  }) as const;

const filterSearchStyles = (Colors: ColorPalette) =>
  ({
    filterSearchBox: {
      ...rowCentered,
      gap: 8,
      marginVertical: 10,
      backgroundColor: Colors.inputBg,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      ...outline(Colors.border),
    },
    filterSearchInput: {
      flex: 1,
      fontSize: 14,
      color: Colors.textPrimary,
      padding: 0,
    },
  }) as const;

const filterOptionStyles = (Colors: ColorPalette) =>
  ({
    filterList: { flex: 1 },
    filterListContent: { paddingBottom: 8 },
    filterOption: {
      ...rowCentered,
      gap: 10,
      paddingHorizontal: 4,
      paddingVertical: 14,
      ...bottomHairline(Colors.gray100),
    },
    filterOptionCity: { paddingLeft: 28 },
    filterOptionActive: { backgroundColor: Colors.primaryGhost },
    filterOptionText: {
      flex: 1,
      fontSize: 15,
      color: Colors.textPrimary,
      fontWeight: "500",
    },
    filterOptionTextActive: { color: Colors.primary, fontWeight: "700" },
    filterOptionCount: countBadge(Colors, 8, 10),
    filterOptionCountActive: {
      color: Colors.primary,
      backgroundColor: Colors.blueTint,
    },
    filterEmpty: { alignItems: "center", paddingVertical: 24 },
    filterEmptyText: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      paddingHorizontal: 16,
    },
  }) as const;

const filterFooterStyles = (Colors: ColorPalette) =>
  ({
    filterFooter: {
      flexDirection: "row",
      gap: 10,
      paddingTop: 12,
      ...topHairline(Colors.gray100),
    },
    filterClearBtn: {
      flex: 1,
      ...centered,
      paddingVertical: 12,
      borderRadius: 10,
      ...outline(Colors.gray200),
    },
    filterClearText: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.textSecondary,
    },
    filterApplyBtn: {
      flex: 1,
      ...centered,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: Colors.primary,
    },
    filterApplyText: { fontSize: 14, fontWeight: "700", color: Colors.white },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...headerStyles(Colors),
    ...chipStyles(Colors),
    ...sidebarStyles(Colors),
    ...nestedStyles(Colors),
    ...postButtonStyles(Colors),
    ...filterSheetStyles(Colors),
    ...filterSearchStyles(Colors),
    ...filterOptionStyles(Colors),
    ...filterFooterStyles(Colors),
  });
