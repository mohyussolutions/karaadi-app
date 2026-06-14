import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";

export const H_PAD = 12;
export const GAP = 8;
export const GRID_GAP = 6;
export const GRID_COLS = 3;

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    root: { flex: 1, backgroundColor: Colors.background },
    outerRow: { flex: 1, flexDirection: "row" },
    flexFull: { flex: 1 },
    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: Colors.gray200,
      backgroundColor: Colors.surface,
      paddingTop: 8,
    },
    pageHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: H_PAD,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.gray100,
      backgroundColor: Colors.card,
    },
    headerTitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, flex: 1 },
    subItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 11,
      gap: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.gray100,
    },
    subItemActive: { backgroundColor: Colors.primaryGhost },
    subIconWrap: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: "transparent", alignItems: "center", justifyContent: "center",
    },
    subIconActive: { backgroundColor: Colors.primary },
    subLabel: { flex: 1, fontSize: 13, fontWeight: "500", color: Colors.textPrimary },
    subLabelActive: { color: Colors.primary, fontWeight: "600" },
    gridWrap: { paddingHorizontal: H_PAD, paddingVertical: 8, gap: GRID_GAP },
    gridRow: { flexDirection: "row", gap: GRID_GAP },
    gridCell: { borderRadius: 12, paddingVertical: 10, alignItems: "center", gap: 6 },
    gridIconWrap: {
      width: 44, height: 44, borderRadius: 12,
      backgroundColor: "transparent", alignItems: "center", justifyContent: "center",
    },
    gridIconWrapPressed: { backgroundColor: Colors.primary },
    gridLabel: { fontSize: 12, fontWeight: "600", color: Colors.gray700, textAlign: "center", lineHeight: 16, paddingHorizontal: 3 },
    gridLabelPressed: { color: Colors.primary },
    postBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      backgroundColor: Colors.primary, margin: 12, borderRadius: 10,
      paddingVertical: 11, paddingHorizontal: 14, gap: 6,
    },
    postBtnSpaced: { marginHorizontal: H_PAD, marginBottom: 8 },
    postBtnText: { color: Colors.white, fontWeight: "700", fontSize: 13 },
    colWrapper: { paddingHorizontal: H_PAD, gap: GAP, marginBottom: GAP },
    listContent: { paddingBottom: 32 },
    emptyContainer: { flex: 1, paddingTop: 40 },
    countRow: { paddingHorizontal: H_PAD, paddingVertical: 6 },
    countText: { fontSize: 12, color: Colors.textMuted, fontWeight: "500" },
  });
}
