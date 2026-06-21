import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/theme";

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: RADII.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.gray100,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    imgWrap: {
      position: "relative",
      width: "100%",
      aspectRatio: 1,
      backgroundColor: Colors.slate100,
    },
    img: { width: "100%", height: "100%" },
    badge: {
      position: "absolute",
      top: 8,
      left: 8,
      borderRadius: 5,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    badgeSold: { backgroundColor: Colors.error },
    badgeWanted: { backgroundColor: Colors.primary },
    badgeText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    heartBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: Colors.shadow35,
      borderRadius: 14,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    heartBtnActive: {
      backgroundColor: Colors.favoriteTint,
    },
    body: { padding: 10, gap: 4 },
    title: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.slate900,
      lineHeight: 17,
    },
    description: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
    locRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      flexShrink: 1,
    },
    locText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "600" },
    price: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.textPrimary,
      letterSpacing: -0.2,
      flexShrink: 0,
    },
  });
}
