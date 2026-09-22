import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/colors";
import { shadow } from "../../helpers/shadow";

const centered = { alignItems: "center", justifyContent: "center" } as const;

const cardFrameStyles = (Colors: ColorPalette) =>
  ({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: RADII.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.gray100,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 1 },
        opacity: 0.06,
        radius: 4,
        elevation: 2,
      }),
    },
    cardRemoving: { opacity: 0.4 },
    imgWrap: {
      position: "relative",
      width: "100%",
      aspectRatio: 1,
      backgroundColor: Colors.slate100,
    },
    img: { width: "100%", height: "100%" },
    wantedPlaceholder: {
      ...centered,
      backgroundColor: Colors.primaryGhost,
      paddingHorizontal: 12,
    },
    wantedPlaceholderText: {
      color: Colors.primary,
      fontSize: 13,
      fontWeight: "700",
      textAlign: "center",
      lineHeight: 18,
    },
  }) as const;

const overlayStyles = (Colors: ColorPalette) =>
  ({
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
      ...centered,
    },
    heartBtnActive: { backgroundColor: Colors.favoriteTint },
  }) as const;

const bodyStyles = (Colors: ColorPalette) =>
  ({
    body: { padding: 10, gap: 4 },
    title: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.slate900,
      lineHeight: 17,
      minHeight: 34,
    },
    description: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 16,
      minHeight: 16,
    },
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
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...cardFrameStyles(Colors),
    ...overlayStyles(Colors),
    ...bodyStyles(Colors),
  });
