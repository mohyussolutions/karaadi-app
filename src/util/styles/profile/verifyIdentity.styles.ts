import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { RADII } from "../../colors/colors";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const primaryButton = (Colors: ColorPalette, paddingHorizontal: number) =>
  ({
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal,
  }) as const;

const previewButton = (backgroundColor: string) =>
  ({
    flex: 1,
    flexDirection: "row",
    ...centered,
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor,
  }) as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    scroll: { padding: 16, paddingBottom: 48, gap: 16 },
    flexFull: { flex: 1 },
  } as const;
};

const guestStyles = (Colors: ColorPalette) =>
  ({
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
    retryBtn: primaryButton(Colors, 36),
  }) as const;

const bannerStyles = (Colors: ColorPalette) =>
  ({
    banner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: RADII.lg,
      backgroundColor: Colors.gray100,
    },
    bannerRequired: { backgroundColor: Colors.warningGhost },
    bannerSubmitted: { backgroundColor: Colors.successGhost },
    bannerTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
    bannerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2, lineHeight: 18 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginTop: 4 },
    sectionHint: { fontSize: 13, color: Colors.textMuted, lineHeight: 18, marginTop: -8 },
  }) as const;

const slotStyles = (Colors: ColorPalette) =>
  ({
    slot: {
      borderRadius: RADII.lg,
      borderWidth: 1,
      borderColor: Colors.gray200,
      borderStyle: "dashed",
      overflow: "hidden",
      backgroundColor: Colors.surface,
    },
    slotFilled: { borderStyle: "solid" },
    slotImage: { width: "100%", height: 180 },
    slotEmpty: { height: 140, ...centered, gap: 8, padding: 16 },
    slotLabel: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
    slotActionRow: { flexDirection: "row", gap: 10, padding: 10 },
    slotActionBtn: {
      flex: 1,
      flexDirection: "row",
      ...centered,
      gap: 6,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: Colors.gray100,
    },
    slotActionText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
    retakeBar: {
      flexDirection: "row",
      ...centered,
      gap: 6,
      paddingVertical: 10,
      backgroundColor: Colors.gray100,
    },
    retakeText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
  }) as const;

const submitStyles = (Colors: ColorPalette) =>
  ({
    submitBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      ...centered,
    },
    submitBtnDisabled: { backgroundColor: Colors.gray300 },
    submitBtnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
    resubmitBtn: { marginTop: 4, alignSelf: "flex-start", paddingVertical: 8 },
    resubmitText: { color: Colors.primary, fontWeight: "600", fontSize: 14 },
    errorText: {
      marginTop: 4,
      fontSize: 13,
      color: Colors.error,
      textAlign: "center",
    },
  }) as const;

const previewStyles = (Colors: ColorPalette) =>
  ({
    previewRoot: { flex: 1, ...centered },
    previewImage: { width: "100%", height: "78%" },
    previewActions: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    previewBtnSecondary: previewButton(Colors.whiteAlpha15),
    previewBtnSecondaryText: { color: Colors.white, fontWeight: "600", fontSize: 15 },
    previewBtnPrimary: previewButton(Colors.primary),
    previewBtnPrimaryText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...guestStyles(Colors),
    ...bannerStyles(Colors),
    ...slotStyles(Colors),
    ...submitStyles(Colors),
    ...previewStyles(Colors),
  });
