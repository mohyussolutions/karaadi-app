import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { H_PAD, GRID_GAP } from "../../../constants";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const iconWrap = (size: number, radius: number) =>
  ({
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor: "transparent",
    ...centered,
  }) as const;

const bottomHairline = (color: string) =>
  ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color,
  }) as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    root: safeBase,
    outerRow: { flex: 1, flexDirection: "row" },
    flexFull: { flex: 1 },
    listContent: { paddingBottom: 32 },
    emptyContainer: { flex: 1, paddingTop: 40 },
  } as const;
};

const headerStyles = (Colors: ColorPalette) =>
  ({
    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: Colors.gray200,
      backgroundColor: Colors.surface,
      paddingTop: 8,
    },
    pageHeader: {
      ...rowCentered,
      gap: 8,
      paddingHorizontal: H_PAD,
      paddingVertical: 12,
      backgroundColor: Colors.card,
      ...bottomHairline(Colors.gray100),
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.textPrimary,
      flex: 1,
    },
  }) as const;

const subItemStyles = (Colors: ColorPalette) =>
  ({
    subItem: {
      ...rowCentered,
      paddingHorizontal: 12,
      paddingVertical: 11,
      gap: 10,
      ...bottomHairline(Colors.gray100),
    },
    subItemActive: { backgroundColor: Colors.primaryGhost },
    subIconWrap: iconWrap(36, 10),
    subIconActive: { backgroundColor: Colors.primary },
    subLabel: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      color: Colors.textPrimary,
    },
    subLabelActive: { color: Colors.primary, fontWeight: "600" },
  }) as const;

const gridStyles = (Colors: ColorPalette) =>
  ({
    gridWrap: { paddingHorizontal: H_PAD, paddingVertical: 8, gap: GRID_GAP },
    gridRow: { flexDirection: "row", gap: GRID_GAP },
    gridCell: {
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: "center",
      gap: 6,
    },
    gridIconWrap: iconWrap(44, 12),
    gridIconWrapPressed: { backgroundColor: Colors.primary },
    gridLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors.gray700,
      textAlign: "center",
      lineHeight: 16,
      paddingHorizontal: 3,
    },
    gridLabelPressed: { color: Colors.primary },
  }) as const;

const postButtonStyles = (Colors: ColorPalette) =>
  ({
    postBtn: {
      flexDirection: "row",
      ...centered,
      backgroundColor: Colors.primary,
      margin: 12,
      borderRadius: 10,
      paddingVertical: 11,
      paddingHorizontal: 14,
      gap: 6,
    },
    postBtnSpaced: { marginHorizontal: H_PAD, marginBottom: 8 },
    postBtnText: { color: Colors.white, fontWeight: "700", fontSize: 13 },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...headerStyles(Colors),
    ...subItemStyles(Colors),
    ...gridStyles(Colors),
    ...postButtonStyles(Colors),
  });
