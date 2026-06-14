import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";

export const H_PAD = 12;
export const GAP = 8;

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    safe: { flex: 1, backgroundColor: Colors.background },
    outerRow: { flex: 1, flexDirection: "row" },
    flexFull: { flex: 1 },

    pageHeader: {
      flexDirection: "row", alignItems: "center", gap: 8,
      paddingHorizontal: H_PAD, paddingVertical: 12,
      backgroundColor: Colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    pageTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: Colors.textPrimary },
    pageBreadcrumb: { fontSize: 12, color: Colors.textMuted, fontWeight: "500" },

    filterIconBtn: {
      width: 30, height: 30, borderRadius: 8,
      alignItems: "center", justifyContent: "center",
      backgroundColor: Colors.primaryGhost,
      borderWidth: 1, borderColor: Colors.blueTint,
    },
    filterIconBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },

    chipsScroll: {
      backgroundColor: Colors.card,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    chipsRow: { flexDirection: "row", paddingHorizontal: H_PAD, paddingVertical: 10, gap: 8, alignItems: "center" },
    chip: {
      flexDirection: "row", alignItems: "center", gap: 5,
      paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
      borderWidth: 1, borderColor: Colors.gray200, backgroundColor: Colors.background,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipLabel: { fontSize: 13, fontWeight: "500", color: Colors.textSecondary },
    chipLabelActive: { color: Colors.white, fontWeight: "600" },

    activeFilterRow: {
      flexDirection: "row", alignItems: "center", gap: 6,
      marginHorizontal: H_PAD, marginBottom: 4,
      paddingVertical: 6, paddingHorizontal: 10,
      backgroundColor: Colors.primaryGhost, borderRadius: 8,
      borderWidth: 1, borderColor: Colors.blueTint,
    },
    activeFilterText: { flex: 1, fontSize: 12, fontWeight: "600", color: Colors.primary },

    sidebar: {
      borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Colors.gray200,
      backgroundColor: Colors.surface, paddingTop: 8,
    },
    sidebarHeader: {
      flexDirection: "row", alignItems: "flex-start", gap: 8,
      paddingHorizontal: 12, paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    sidebarTitle: { flex: 1, fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
    clearRow: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 12, paddingVertical: 8,
      backgroundColor: Colors.primaryGhost,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.blueTint,
    },
    clearText: { fontSize: 12, fontWeight: "600", color: Colors.primary },
    nestedItem: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: 12, paddingVertical: 10, gap: 10,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    nestedItemActive: { backgroundColor: Colors.primaryGhost },
    nestedIconWrap: {
      width: 34, height: 34, borderRadius: 9,
      backgroundColor: Colors.gray100, alignItems: "center", justifyContent: "center",
    },
    nestedIconActive: { backgroundColor: Colors.blueTint },
    nestedLabel: { flex: 1, fontSize: 13, fontWeight: "500", color: Colors.textPrimary },
    nestedLabelActive: { color: Colors.primary, fontWeight: "600" },
    nestedCount: {
      fontSize: 11, fontWeight: "700", color: Colors.textMuted,
      backgroundColor: Colors.gray100, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
    },
    nestedCountActive: { color: Colors.primary, backgroundColor: Colors.blueTint },

    postBtn: {
      flexDirection: "row", alignItems: "center",
      backgroundColor: Colors.primary, marginHorizontal: H_PAD, marginTop: 8,
      borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, gap: 8,
    },
    postBtnSpaced: { marginHorizontal: H_PAD, marginBottom: 8 },
    postBtnText: { flex: 1, color: Colors.white, fontWeight: "700", fontSize: 14, letterSpacing: 0.3 },

    countRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: H_PAD, paddingTop: 8, paddingBottom: 6, gap: 6 },
    countLabel: { fontSize: 13, color: Colors.textSecondary },
    countValue: { fontSize: 13, fontWeight: "700", color: Colors.primary },

    colWrapper: { paddingHorizontal: H_PAD, gap: GAP, marginBottom: GAP },
    listContent: { paddingBottom: 32 },
    emptyContainer: { flex: 1, paddingTop: 40 },

    filterBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: Colors.shadow45 },
    filterSheet: {
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: "92%",
      backgroundColor: Colors.card,
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      paddingHorizontal: H_PAD,
      shadowColor: Colors.shadow, shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12, shadowRadius: 12, elevation: 20,
    },
    filterSheetHandle: {
      alignSelf: "center", width: 40, height: 4,
      borderRadius: 2, backgroundColor: Colors.gray200, marginTop: 10, marginBottom: 4,
    },
    filterSheetHeader: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingVertical: 12, marginBottom: 4,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    filterSheetTitle: { fontSize: 16, fontWeight: "800", color: Colors.textPrimary },

    filterSearchBox: {
      flexDirection: "row", alignItems: "center", gap: 8,
      marginVertical: 10,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      paddingHorizontal: 12, paddingVertical: 10,
    },
    filterSearchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },

    filterList: { flex: 1 },
    filterListContent: { paddingBottom: 8 },
    filterOption: {
      flexDirection: "row", alignItems: "center", gap: 10,
      paddingHorizontal: 4, paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray100,
    },
    filterOptionCity: { paddingLeft: 28 },
    filterOptionActive: { backgroundColor: Colors.primaryGhost },
    filterOptionText: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: "500" },
    filterOptionTextActive: { color: Colors.primary, fontWeight: "700" },
    filterOptionCount: {
      fontSize: 11, fontWeight: "700", color: Colors.textMuted,
      backgroundColor: Colors.gray100, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    },
    filterOptionCountActive: { color: Colors.primary, backgroundColor: Colors.blueTint },

    filterEmpty: { alignItems: "center", paddingVertical: 24 },
    filterEmptyText: { fontSize: 14, color: Colors.textMuted, textAlign: "center", paddingHorizontal: 16 },

    filterFooter: {
      flexDirection: "row", gap: 10, paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.gray100,
    },
    filterClearBtn: {
      flex: 1, alignItems: "center", justifyContent: "center",
      paddingVertical: 12, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.gray200,
    },
    filterClearText: { fontSize: 14, fontWeight: "700", color: Colors.textSecondary },
    filterApplyBtn: {
      flex: 1, alignItems: "center", justifyContent: "center",
      paddingVertical: 12, borderRadius: 10, backgroundColor: Colors.primary,
    },
    filterApplyText: { fontSize: 14, fontWeight: "700", color: Colors.white },
  });
}
