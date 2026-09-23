import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { createCommonStyles } from "../common/common.styles";
import { FAVORITES_H_PAD } from '../../../constants';

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
