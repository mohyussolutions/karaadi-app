import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { shadow } from "../../helpers/shadow";
import { createCommonStyles } from "../common/common.styles";

export const PLAN_WIDE_MAX_WIDTH = 760;
export const PLAN_GRID_GAP = 14;
export const PLAN_COMPACT_MAX_WIDTH = 360;

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
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: "hidden",
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 2 },
        opacity: 0.08,
        radius: 10,
        elevation: 3,
      }),
    },
    cardRecommended: { borderColor: Colors.primary, borderWidth: 1.5 },
    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      ...rowCentered,
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderBottomLeftRadius: 12,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "800",
      color: Colors.white,
      letterSpacing: 0.3,
    },
  }) as const;

// `compact` scales the card down for narrow phones (< 360pt wide).
const planContentStyles = (Colors: ColorPalette, compact: boolean) =>
  ({
    inner: compact
      ? { paddingHorizontal: 12, paddingTop: 18, paddingBottom: 12 }
      : { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 16 },
    topRow: { ...rowCentered, gap: compact ? 8 : 12 },
    iconBox: {
      width: compact ? 38 : 46,
      height: compact ? 38 : 46,
      borderRadius: compact ? 11 : 14,
      ...centered,
    },
    meta: { flex: 1 },
    name: { fontSize: compact ? 15 : 17, fontWeight: "800" },
    dur: { fontSize: compact ? 11 : 12.5, color: Colors.textMuted, marginTop: 3 },
    priceBox: { alignItems: "flex-end" },
    price: {
      fontSize: compact ? 20 : 24,
      fontWeight: "900",
      lineHeight: compact ? 24 : 28,
    },
    priceSub: {
      fontSize: compact ? 9.5 : 10.5,
      color: Colors.textMuted,
      fontWeight: "600",
      marginTop: 2,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.border,
      ...centered,
      marginLeft: 8,
    },
  }) as const;

const planFeatureStyles = (Colors: ColorPalette, compact: boolean) =>
  ({
    features: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 10,
      columnGap: 12,
      marginTop: compact ? 10 : 14,
      paddingTop: compact ? 10 : 14,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    featureItem: { ...rowCentered, gap: 6, width: compact ? "100%" : "47%" },
    featureText: {
      fontSize: compact ? 12 : 13,
      color: Colors.textSecondary,
      flex: 1,
    },
  }) as const;

export const createPlanCardStyles = (Colors: ColorPalette, compact: boolean) =>
  StyleSheet.create({
    ...planFrameStyles(Colors),
    ...planContentStyles(Colors, compact),
    ...planFeatureStyles(Colors, compact),
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
    cardsCol: { gap: 14 },
    // Tablets / landscape phones: two cards per row inside a centered column.
    wideContent: { alignSelf: "center", width: "100%", maxWidth: PLAN_WIDE_MAX_WIDTH },
    cardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: PLAN_GRID_GAP },
    footerWide: { alignSelf: "center", width: "100%", maxWidth: 460 },
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
