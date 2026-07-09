import { Platform, StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { shadow } from "../../shadow";

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: {
      position: "absolute",
      left: 12,
      right: 12,
      zIndex: 9999,
      elevation: 999,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: Colors.card,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 12,
      ...shadow({ color: Colors.black, offset: { width: 0, height: 8 }, opacity: 0.18, radius: 20, elevation: 14 }),
      borderWidth: Platform.OS === "android" ? 1 : 0,
      borderColor: Colors.border,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: Colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: Colors.white, fontWeight: "800", fontSize: 17 },
    body: { flex: 1 },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    name: { fontSize: 14, fontWeight: "700", color: Colors.text, flex: 1 },
    appLabel: {
      fontSize: 11,
      color: Colors.textMuted,
      fontWeight: "500",
      marginLeft: 6,
    },
    preview: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.gray100,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
