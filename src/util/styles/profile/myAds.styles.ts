import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/colors";
import { H_PAD, COL_GAP } from "../../../constants";
import { shadow } from "../../helpers/shadow";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;

const fillCenter = {
  flex: 1,
  ...centered,
  padding: 32,
  gap: 12,
} as const;

const primaryButton = (Colors: ColorPalette, paddingHorizontal: number) =>
  ({
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal,
  }) as const;

const iconCircle = (Colors: ColorPalette) =>
  ({
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.gray100,
    ...centered,
    marginBottom: 4,
  }) as const;

const stateTitle = (Colors: ColorPalette) =>
  ({
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  }) as const;

const stateSub = (Colors: ColorPalette, lineHeight: number) =>
  ({
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight,
  }) as const;

const listStyles = (Colors: ColorPalette, width: number) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    center: { ...fillCenter, backgroundColor: Colors.background },
    list: { padding: H_PAD, paddingBottom: 90 },
    row: { gap: COL_GAP, marginBottom: COL_GAP },
    cardWrap: { width: (width - H_PAD * 2 - COL_GAP) / 2 },
    btn: primaryButton(Colors, 40),
    btnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
    listHeader: { paddingHorizontal: 2, paddingBottom: 10 },
    countText: { fontSize: 13, color: Colors.textMuted, fontWeight: "600" },
  } as const;
};

const headerStyles = (Colors: ColorPalette) =>
  ({
    header: { paddingHorizontal: 2, paddingBottom: 14 },
    headerTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
    headerSub: {
      fontSize: 13,
      color: Colors.textMuted,
      marginTop: 2,
      fontWeight: "600",
    },
  }) as const;

const cardStyles = (Colors: ColorPalette) =>
  ({
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
      ...centered,
      backgroundColor: Colors.errorGhost,
    },
  }) as const;

const guestStyles = (Colors: ColorPalette) =>
  ({
    guestWrap: fillCenter,
    guestIconCircle: iconCircle(Colors),
    guestTitle: stateTitle(Colors),
    guestSub: stateSub(Colors, 20),
    signInBtn: primaryButton(Colors, 40),
    signInText: { color: Colors.white, fontWeight: "600", fontSize: 16 },
  }) as const;

const emptyStyles = (Colors: ColorPalette) =>
  ({
    emptyWrap: fillCenter,
    emptyIconCircle: iconCircle(Colors),
    emptyTitle: stateTitle(Colors),
    emptySub: stateSub(Colors, 21),
    emptyBtn: {
      ...primaryButton(Colors, 28),
      flexDirection: "row",
      ...centered,
      gap: 8,
    },
    emptyBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  }) as const;

const postButtonStyles = (Colors: ColorPalette) =>
  ({
    postBtn: {
      flexDirection: "row",
      ...centered,
      gap: 8,
      margin: 16,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      ...shadow({
        color: Colors.primary,
        offset: { width: 0, height: 4 },
        opacity: 0.25,
        radius: 8,
        elevation: 4,
      }),
    },
    postBtnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  }) as const;

export const createStyles = (Colors: ColorPalette, width = 390) =>
  StyleSheet.create({
    ...listStyles(Colors, width),
    ...headerStyles(Colors),
    ...cardStyles(Colors),
    ...guestStyles(Colors),
    ...emptyStyles(Colors),
    ...postButtonStyles(Colors),
  });
