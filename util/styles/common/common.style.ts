import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../colors/theme";

export const BP_SMALL = 400;
export const BP_TABLET = 768;

export const BOTTOM_PAD = 120;
export const TAB_SIDE_SM = 12;
export const TAB_SIDE_MD = 24;

export function createCommonStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    flex1: { flex: 1 },
    safeBase: { flex: 1, backgroundColor: Colors.background },
    safeCard: { flex: 1, backgroundColor: Colors.card },
    scrollPad: { paddingBottom: BOTTOM_PAD },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    row: { flexDirection: "row", alignItems: "center" },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    card: {
      backgroundColor: Colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: Colors.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyBody: {
      fontSize: 14,
      color: Colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
  });
}
