import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { shadow } from "../../helpers/shadow";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const pillButton = {
  ...rowCentered,
  justifyContent: "center",
  alignSelf: "center",
} as const;

const planFrameStyles = (Colors: ColorPalette) =>
  ({
    card: {
      backgroundColor: Colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 2 },
        opacity: 0.06,
        radius: 6,
        elevation: 2,
      }),
    },
    cardRecommended: { borderColor: Colors.primary, borderWidth: 1.5 },
    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      ...rowCentered,
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderBottomLeftRadius: 10,
    },
    badgeText: {
      fontSize: 8.5,
      fontWeight: "800",
      color: Colors.white,
      letterSpacing: 0.3,
    },
  }) as const;

const planContentStyles = (Colors: ColorPalette) =>
  ({
    inner: { padding: 10 },
    topRow: { ...rowCentered, gap: 8, marginBottom: 8 },
    iconBox: { width: 32, height: 32, borderRadius: 9, ...centered },
    meta: { flex: 1 },
    name: { fontSize: 14, fontWeight: "800" },
    dur: { fontSize: 10.5, color: Colors.textMuted, marginTop: 1 },
    priceBox: { alignItems: "flex-end" },
    price: { fontSize: 17, fontWeight: "900", lineHeight: 19 },
    priceSub: { fontSize: 8.5, color: Colors.textMuted, fontWeight: "600" },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: Colors.border,
      ...centered,
      marginLeft: 8,
    },
  }) as const;

const planFeatureStyles = (Colors: ColorPalette) =>
  ({
    features: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 5,
      columnGap: 10,
    },
    featureItem: { ...rowCentered, gap: 5, width: "47%" },
    featureText: { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  }) as const;

export const createPlanCardStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...planFrameStyles(Colors),
    ...planContentStyles(Colors),
    ...planFeatureStyles(Colors),
  });

const screenStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    root: safeBase,
    topBar: { ...rowCentered, paddingHorizontal: 16, paddingVertical: 8 },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.gray100,
      ...centered,
    },
    scroll: { padding: 16, flexGrow: 1 },
    header: { alignItems: "center", marginBottom: 14, gap: 4 },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: Colors.primaryGhost,
      ...centered,
      marginBottom: 2,
    },
    title: { fontSize: 19, fontWeight: "800", color: Colors.textPrimary },
    sub: { fontSize: 12.5, color: Colors.textMuted, textAlign: "center" },
    cardsCol: { gap: 8 },
  } as const;
};

const footerStyles = (Colors: ColorPalette) =>
  ({
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 16,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: Colors.border,
      borderBottomWidth: 0,
      ...shadow({
        color: Colors.black,
        offset: { width: 0, height: -4 },
        opacity: 0.08,
        radius: 16,
        elevation: 8,
      }),
    },
    footerHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.border,
      alignSelf: "center",
      marginBottom: 12,
    },
    continueBtn: {
      ...pillButton,
      gap: 6,
      backgroundColor: Colors.primary,
      borderRadius: 999,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    continueBtnText: { color: Colors.white, fontSize: 14, fontWeight: "600" },
    continueBtnOff: {
      ...pillButton,
      gap: 6,
      borderRadius: 999,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Colors.gray100,
    },
    continueBtnOffText: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.textMuted,
    },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...screenStyles(Colors),
    ...footerStyles(Colors),
  });
