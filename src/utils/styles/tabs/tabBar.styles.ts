import { StyleSheet } from "react-native";
import { RADII, SPACING } from "../../colors/colors";
import { shadow } from "../../../lib/helpers/style/shadow";
import type { ColorPalette } from '../../types';

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
    bar: {
      backgroundColor: Colors.background,
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
