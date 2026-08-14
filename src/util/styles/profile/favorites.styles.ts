import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../components/hooks/useTheme";
import { RADII } from "../../colors/theme";
import { shadow } from "../../shadow";
import { createCommonStyles } from "../common/common.style";

export const H_PAD = 16;
export const COL_GAP = 12;

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
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
    list: { paddingTop: H_PAD, paddingBottom: 32 },
    listHeader: { paddingBottom: 10, paddingHorizontal: H_PAD },
    countText: { fontSize: 14, color: Colors.textMuted, fontWeight: "600" },
    emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      gap: 12,
    },
    emptyIconCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.gray100,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    emptyTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
    emptySub: {
      fontSize: 14,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: 21,
    },
    browseBtn: {
      marginTop: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 36,
    },
    browseBtnText: { color: Colors.white, fontWeight: "600", fontSize: 15 },
  });
}

export function createCardStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: RADII.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.gray100,
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 1 }, opacity: 0.06, radius: 4, elevation: 2 }),
    },
    cardRemoving: { opacity: 0.4 },
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
      alignItems: "center",
      justifyContent: "center",
    },
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
  });
}
