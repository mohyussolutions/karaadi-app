import { StyleSheet, type ViewStyle } from "react-native";
import { RADII, SPACING, type ColorPalette } from "../../colors/theme";
import { shadow } from "../../shadow";

export const GLASS_LIGHT: ViewStyle = {
  backgroundColor: "rgba(255,255,255,0.82)",
  borderColor: "rgba(0,0,0,0.08)",
};

export const GLASS_DARK: ViewStyle = {
  backgroundColor: "rgba(15,22,42,0.90)",
  borderColor: "rgba(255,255,255,0.10)",
};

export const createLayoutStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: 0,
      left: SPACING.xl,
      right: SPACING.xl,
      backgroundColor: "transparent",
      paddingTop: SPACING.xl,
    },
    glass: {
      backgroundColor: Colors.tabBarGlass,
      borderRadius: RADII.pill,
      borderWidth: 1,
      borderColor: Colors.border,
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 4 }, opacity: 0.1, radius: 16, elevation: 12 }),
      paddingHorizontal: SPACING.xs,
      paddingVertical: SPACING.xs,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    item: {
      flex: 1,
      height: 54,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      fontSize: 10,
      fontWeight: "500",
      marginTop: 2,
      textAlign: "center",
    },
  });
