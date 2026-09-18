import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { shadow } from "../../helpers/shadow";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const outline = (color: string, width = 1) =>
  ({ borderWidth: width, borderColor: color }) as const;

const bottomLine = (color: string) =>
  ({ borderBottomWidth: 1, borderBottomColor: color }) as const;

const badge = { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 } as const;
const badgeText = { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 } as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    spacer40: { height: 40 },
    scroll: { padding: 16, flexGrow: 1 },
    flexFull: { flex: 1 },
    bottomSpacer: { height: 40 },
  } as const;
};

const logoStyles = (Colors: ColorPalette) =>
  ({
    logoSection: {
      ...rowCentered,
      gap: 16,
      marginBottom: 24,
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 16,
      ...outline(Colors.border),
    },
    logoImg: { width: 80, height: 80, borderRadius: 12 },
    logoPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: Colors.primaryGhost,
      ...outline(Colors.primary, 2),
      borderStyle: "dashed",
      ...centered,
      gap: 4,
    },
    logoHint: { fontSize: 10, color: Colors.primary, fontWeight: "600" },
    logoInfo: { flex: 1 },
    logoTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
    logoSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    logoRemove: {
      fontSize: 12,
      color: Colors.error,
      fontWeight: "600",
      marginTop: 6,
    },
  }) as const;

const sectionStyles = (Colors: ColorPalette) =>
  ({
    sectionHeader: {
      ...rowCentered,
      gap: 6,
      marginBottom: 12,
      marginTop: 8,
      paddingBottom: 8,
      ...bottomLine(Colors.border),
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.textPrimary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    heading: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 6,
    },
  }) as const;

const fieldStyles = (Colors: ColorPalette) =>
  ({
    fieldWrap: { marginBottom: 14 },
    fieldRow: { flexDirection: "row", gap: 12 },
    fieldRowItem: { flex: 1 },
    fieldLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.textPrimary,
      marginBottom: 6,
    },
    req: { color: Colors.error },
    input: {
      backgroundColor: Colors.card,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: Colors.text,
      ...outline(Colors.border),
    },
    inputError: { borderColor: Colors.error },
    inputLocked: { backgroundColor: Colors.gray100, color: Colors.textMuted },
    textarea: { height: 110, textAlignVertical: "top" },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
    fieldHint: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  }) as const;

const actionStyles = (Colors: ColorPalette) =>
  ({
    submitBtn: {
      flexDirection: "row",
      ...centered,
      gap: 8,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      marginTop: 16,
      marginBottom: 4,
      ...shadow({
        color: Colors.primary,
        offset: { width: 0, height: 4 },
        opacity: 0.28,
        radius: 8,
        elevation: 5,
      }),
    },
    submitBtnDisabled: { opacity: 0.65 },
    submitText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
    cancelBtn: { alignItems: "center", paddingVertical: 10 },
    cancelText: { fontSize: 13, color: Colors.textMuted },
    refreshBtn: {
      flexDirection: "row",
      ...centered,
      gap: 6,
      paddingVertical: 14,
      marginTop: 8,
    },
    refreshText: { fontSize: 13, color: Colors.primary, fontWeight: "700" },
  }) as const;

const statusStyles = (Colors: ColorPalette) =>
  ({
    statusScroll: { padding: 24, alignItems: "center", flexGrow: 1 },
    statusIconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      ...centered,
      marginBottom: 16,
      marginTop: 24,
    },
    statusTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: Colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    statusMessage: {
      fontSize: 14,
      color: Colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 20,
    },
    statusCard: {
      width: "100%",
      backgroundColor: Colors.card,
      borderRadius: 14,
      ...outline(Colors.border),
      padding: 14,
      gap: 10,
    },
    statusRow: {
      ...rowCentered,
      justifyContent: "space-between",
      paddingBottom: 10,
      ...bottomLine(Colors.border),
    },
    statusRowLast: { paddingBottom: 0, borderBottomWidth: 0 },
    statusLabel: {
      fontSize: 13,
      color: Colors.textSecondary,
      fontWeight: "600",
    },
    statusValue: { fontSize: 14, color: Colors.text, fontWeight: "700" },
    statusBadge: badge,
    statusBadgeText: badgeText,
  }) as const;

const planStyles = (Colors: ColorPalette) =>
  ({
    planCard: {
      width: "100%",
      backgroundColor: Colors.card,
      borderRadius: 14,
      ...outline(Colors.border, 1.5),
      padding: 16,
      marginBottom: 12,
      gap: 6,
    },
    planCardActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryGhost,
    },
    planHeader: { ...rowCentered, justifyContent: "space-between" },
    planName: { fontSize: 16, fontWeight: "800", color: Colors.text },
    tierBadge: badge,
    tierBadgeText: badgeText,
    planPrice: { fontSize: 22, fontWeight: "800", color: Colors.primary },
    planDuration: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.textSecondary,
    },
    planMeta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
    featureRow: { ...rowCentered, gap: 6 },
    featureText: { fontSize: 13, color: Colors.textPrimary },
  }) as const;

const categoryGridStyles = (Colors: ColorPalette) =>
  ({
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 8,
    },
    categoryGridItem: {
      width: "47%",
      backgroundColor: Colors.card,
      borderRadius: 14,
      ...outline(Colors.border),
      padding: 18,
      alignItems: "center",
      gap: 10,
    },
    categoryGridIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: Colors.primaryGhost,
      ...centered,
    },
    categoryGridLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.text,
      textAlign: "center",
    },
    categoryGridItemActive: {
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryGhost,
    },
    categoryGridIconWrapActive: { backgroundColor: Colors.primary },
  }) as const;

const planBannerStyles = (Colors: ColorPalette) =>
  ({
    planBanner: {
      ...rowCentered,
      justifyContent: "space-between",
      backgroundColor: Colors.primaryGhost,
      borderRadius: 16,
      ...outline(Colors.primary),
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    planBannerLabel: {
      fontSize: 10,
      fontWeight: "800",
      color: Colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    planBannerName: { fontSize: 14, fontWeight: "800", color: Colors.text },
    planBannerPrice: { fontSize: 14, fontWeight: "800", color: Colors.primary },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...logoStyles(Colors),
    ...sectionStyles(Colors),
    ...fieldStyles(Colors),
    ...actionStyles(Colors),
    ...statusStyles(Colors),
    ...planStyles(Colors),
    ...categoryGridStyles(Colors),
    ...planBannerStyles(Colors),
  });
