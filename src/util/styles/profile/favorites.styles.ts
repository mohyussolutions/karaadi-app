import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/colors";
import { shadow } from "../../helpers/shadow";
import { createCommonStyles } from "../common/common.styles";
import { FAVORITES_H_PAD } from '../../../constants/constants';

const centered = { alignItems: "center", justifyContent: "center" } as const;

const primaryButton = (Colors: ColorPalette, paddingHorizontal: number) =>
  ({
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal,
  }) as const;

const guestStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    guestWrap: {
      flex: 1,
      backgroundColor: Colors.background,
      ...centered,
      padding: 32,
      gap: 14,
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
    signInBtn: primaryButton(Colors, 48),
    signInText: { color: Colors.white, fontWeight: "600", fontSize: 16 },
  } as const;
};

const listStyles = (Colors: ColorPalette) =>
  ({
    list: { paddingTop: FAVORITES_H_PAD, paddingBottom: 32 },
    listHeader: { paddingBottom: 10, paddingHorizontal: FAVORITES_H_PAD },
    countText: { fontSize: 14, color: Colors.textMuted, fontWeight: "600" },
  }) as const;

const emptyStyles = (Colors: ColorPalette) =>
  ({
    emptyWrap: { flex: 1, ...centered, padding: 32, gap: 12 },
    emptyIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.gray100,
      ...centered,
      marginBottom: 4,
    },
    emptyTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
    emptySub: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: 21,
    },
    browseBtn: primaryButton(Colors, 36),
    browseBtnText: { color: Colors.white, fontWeight: "600", fontSize: 15 },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...guestStyles(Colors),
    ...listStyles(Colors),
    ...emptyStyles(Colors),
  });

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
  }) as const;

const cardImageStyles = (Colors: ColorPalette) =>
  ({
    imgWrap: {
      position: "relative",
      width: "100%",
      aspectRatio: 1,
      backgroundColor: Colors.slate100,
    },
    img: { width: "100%", height: "100%" },
    catBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      borderRadius: 5,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    catLabel: {
      fontSize: 10,
      fontWeight: "800",
      color: Colors.white,
      textTransform: "uppercase",
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
  }) as const;

const cardBodyStyles = (Colors: ColorPalette) =>
  ({
    body: { padding: 10, gap: 6 },
    title: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.textPrimary,
      lineHeight: 17,
    },
    description: { fontSize: 11, color: Colors.textMuted, lineHeight: 14 },
    price: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.white,
      backgroundColor: Colors.primary,
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: RADII.pill,
    },
  }) as const;

export const createCardStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...cardFrameStyles(Colors),
    ...cardImageStyles(Colors),
    ...cardBodyStyles(Colors),
  });
