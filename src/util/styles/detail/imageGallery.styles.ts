import { StyleSheet, Platform } from "react-native";
import { RADII } from "../../colors/colors";
import type { ColorPalette } from "../../../hooks/useTheme";
import { IMG_H } from "../../../constants/constants";
import { shadow } from "../../helpers/shadow";

const centered = { alignItems: "center", justifyContent: "center" } as const;

const roundBox = (size: number) =>
  ({ width: size, height: size, borderRadius: size / 2 }) as const;

const galleryFrameStyles = (Colors: ColorPalette, width: number, imgH: number) =>
  ({
    wrapper: { backgroundColor: Colors.galleryBg },
    image: { width, height: imgH },
  }) as const;

const arrowStyles = (Colors: ColorPalette, imgH: number) =>
  ({
    arrow: {
      position: "absolute",
      top: imgH / 2 - 22,
      ...roundBox(40),
      backgroundColor: Colors.shadow32,
      ...centered,
    },
    arrowL: { left: 10 },
    arrowR: { right: 10 },
    arrowText: {
      color: Colors.white,
      fontSize: 28,
      lineHeight: 32,
      marginTop: -2,
    },
  }) as const;

const overlayStyles = (Colors: ColorPalette) =>
  ({
    topLeft: {
      position: "absolute",
      left: 12,
      gap: 8,
      alignItems: "flex-start",
    },
    counter: {
      backgroundColor: Colors.shadow45,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    counterText: { color: Colors.white, fontSize: 12, fontWeight: "600" },
    badge: {
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      color: Colors.white,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    rightActions: { position: "absolute", right: 12, gap: 10 },
    actionBtn: {
      ...roundBox(44),
      backgroundColor: Colors.overlay,
      ...centered,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 2 },
        opacity: 0.3,
        radius: 4,
        elevation: 5,
      }),
    },
    soldOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.shadow45,
      ...centered,
    },
    soldText: {
      color: Colors.white,
      fontSize: 24,
      fontWeight: "900",
      letterSpacing: 2,
    },
  }) as const;

const dotStyles = (Colors: ColorPalette) =>
  ({
    dotsOverlay: {
      position: "absolute",
      bottom: 56,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: Colors.shadow32,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    dot: {
      ...roundBox(6),
      backgroundColor: Colors.whiteAlpha35,
    },
    dotActive: { width: 18, backgroundColor: Colors.white, borderRadius: 3 },
  }) as const;

const thumbStyles = (Colors: ColorPalette) =>
  ({
    thumbStrip: {
      paddingHorizontal: 10,
      paddingBottom: 10,
      paddingTop: 6,
      gap: 6,
      backgroundColor: Colors.galleryBg,
    },
    thumb: {
      width: 60,
      height: 60,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "transparent",
      opacity: 0.6,
    },
    thumbActive: { borderColor: Colors.info, opacity: 1 },
  }) as const;

export const createStyles = (Colors: ColorPalette, width = 390, imgH = IMG_H) =>
  StyleSheet.create({
    ...galleryFrameStyles(Colors, width, imgH),
    ...arrowStyles(Colors, imgH),
    ...overlayStyles(Colors),
    ...dotStyles(Colors),
    ...thumbStyles(Colors),
  });

const sheetLayoutStyles = (Colors: ColorPalette) =>
  ({
    overlay: {
      flex: 1,
      backgroundColor: Colors.shadow45,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: Colors.card,
      borderTopLeftRadius: RADII.xxl,
      borderTopRightRadius: RADII.xxl,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: Platform.OS === "ios" ? 32 : 20,
      gap: 8,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.border,
      alignSelf: "center",
      marginBottom: 6,
    },
  }) as const;

const sheetContentStyles = (Colors: ColorPalette) =>
  ({
    iconRow: { alignItems: "center" },
    iconBadge: {
      ...roundBox(48),
      backgroundColor: Colors.primary + "18",
      ...centered,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: Colors.textPrimary,
      textAlign: "center",
    },
    sub: {
      fontSize: 13,
      color: Colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
  }) as const;

const sheetButtonStyles = (Colors: ColorPalette) =>
  ({
    confirmBtn: {
      flexDirection: "row",
      ...centered,
      gap: 8,
      backgroundColor: Colors.primary,
      borderRadius: RADII.pill,
      paddingVertical: 12,
      marginTop: 6,
    },
    confirmText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
    cancelBtn: {
      ...centered,
      borderWidth: 1.5,
      borderColor: Colors.border,
      borderRadius: RADII.pill,
      paddingVertical: 11,
    },
    cancelText: {
      fontSize: 14,
      color: Colors.textSecondary,
      fontWeight: "600",
    },
  }) as const;

export const createSheetStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...sheetLayoutStyles(Colors),
    ...sheetContentStyles(Colors),
    ...sheetButtonStyles(Colors),
  });
