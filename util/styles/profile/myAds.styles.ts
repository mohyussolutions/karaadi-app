import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/theme";
import { shadow } from "../../shadow";

export const COL_GAP = 8;
export const H_PAD = 12;

export function createStyles(Colors: ColorPalette, width = 390) {
  const CARD_W = (width - H_PAD * 2 - COL_GAP) / 2;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    center: {
      flex: 1,
      backgroundColor: Colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 12,
    },
    list: { padding: H_PAD, paddingBottom: 90 },
    row: { gap: COL_GAP, marginBottom: COL_GAP },
    cardWrap: { width: CARD_W },

    btn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 40,
    },
    btnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },

    listHeader: { paddingHorizontal: 2, paddingBottom: 10 },
    countText: { fontSize: 13, color: Colors.textMuted, fontWeight: "600" },

    header: { paddingHorizontal: 2, paddingBottom: 14 },
    headerTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
    headerSub: {
      fontSize: 13,
      color: Colors.textMuted,
      marginTop: 2,
      fontWeight: "600",
    },

    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      gap: 6,
    },
    cardMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
      flexWrap: "wrap",
    },
    tierPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: RADII.sm,
    },
    tierPillText: {
      fontSize: 10,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    expiryText: { fontSize: 11, fontWeight: "600" },
    deleteIconBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.errorGhost,
    },

    guestWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 12,
    },
    guestIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.gray100,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    guestTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.textPrimary,
      textAlign: "center",
    },
    guestSub: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: 20,
    },
    signInBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 40,
    },
    signInText: { color: Colors.white, fontWeight: "600", fontSize: 16 },

    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 12,
    },
    emptyIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.gray100,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.textPrimary,
      textAlign: "center",
    },
    emptySub: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: 21,
    },
    emptyBtn: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 28,
    },
    emptyBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },

    postBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      margin: 16,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.25, radius: 8, elevation: 4 }),
    },
    postBtnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  });
}
