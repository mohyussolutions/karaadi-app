import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../components/hooks/useTheme";
import { RADII } from "../../colors/theme";
import { createCommonStyles } from "../common/common.style";

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    scroll: { padding: 16, paddingBottom: 48, gap: 16 },
    guestWrap: {
      flex: 1,
      backgroundColor: Colors.background,
      alignItems: "center",
      justifyContent: "center",
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
    signInBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 48,
    },
    signInText: { color: Colors.white, fontWeight: "600", fontSize: 16 },
    retryBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 36,
    },

    banner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 14,
      borderRadius: RADII.lg,
      backgroundColor: Colors.gray100,
    },
    bannerRequired: { backgroundColor: "#FEF3C7" },
    bannerSubmitted: { backgroundColor: "#DCFCE7" },
    bannerTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
    bannerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2, lineHeight: 18 },

    sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginTop: 4 },
    sectionHint: { fontSize: 13, color: Colors.textMuted, lineHeight: 18, marginTop: -8 },

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
    slotEmpty: {
      height: 140,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 16,
    },
    slotLabel: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
    slotActionRow: { flexDirection: "row", gap: 10, padding: 10 },
    slotActionBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: Colors.gray100,
    },
    slotActionText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
    retakeBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      backgroundColor: Colors.gray100,
    },
    retakeText: { fontSize: 13, fontWeight: "600", color: Colors.primary },

    submitBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    submitBtnDisabled: { backgroundColor: Colors.gray300 },
    submitBtnText: { color: Colors.white, fontWeight: "700", fontSize: 16 },

    resubmitBtn: {
      marginTop: 4,
      alignSelf: "flex-start",
      paddingVertical: 8,
    },
    resubmitText: { color: Colors.primary, fontWeight: "600", fontSize: 14 },

    errorText: {
      marginTop: 4,
      fontSize: 13,
      color: Colors.error,
      textAlign: "center",
    },

    previewRoot: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    previewBtnSecondary: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    previewBtnSecondaryText: { color: Colors.white, fontWeight: "600", fontSize: 15 },
    previewBtnPrimary: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: Colors.primary,
    },
    previewBtnPrimaryText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  });
}
