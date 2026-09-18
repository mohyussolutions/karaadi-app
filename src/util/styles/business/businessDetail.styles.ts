import { StyleSheet } from "react-native";
import type { ColorPalette } from "../../../hooks/useTheme";
import { createCommonStyles } from "../common/common.styles";

const centered = { alignItems: "center", justifyContent: "center" } as const;
const rowCentered = { flexDirection: "row", alignItems: "center" } as const;

const tintedChip = (
  Colors: ColorPalette,
  fill: string,
  border: string,
  radius: number,
) =>
  ({
    ...rowCentered,
    gap: 6,
    backgroundColor: Colors.primary + fill,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: Colors.primary + border,
  }) as const;

const errorStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    errorWrap: { flex: 1, ...centered, gap: 12, padding: 24 },
    errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: "600" },
    errorBack: {
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginTop: 8,
    },
    errorBackText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  } as const;
};

const heroStyles = (Colors: ColorPalette) =>
  ({
    hero: {
      backgroundColor: Colors.card,
      alignItems: "center",
      padding: 24,
      gap: 6,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    logo: {
      width: 88,
      height: 88,
      borderRadius: 20,
      backgroundColor: Colors.border,
      marginBottom: 6,
    },
    nameRow: { ...rowCentered, justifyContent: "center", gap: 6 },
    name: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.text,
      textAlign: "center",
    },
    typeBadge: {
      ...rowCentered,
      gap: 5,
      backgroundColor: Colors.primary + "18",
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 5,
    },
    typeText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
    locRow: { ...rowCentered, gap: 4 },
    locText: { fontSize: 13, color: Colors.textMuted },
  }) as const;

const sectionStyles = (Colors: ColorPalette) =>
  ({
    section: { backgroundColor: Colors.card, marginTop: 8, padding: 16 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 12,
    },
    desc: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  }) as const;

const categoryStyles = (Colors: ColorPalette) =>
  ({
    categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    categoryItem: {
      ...tintedChip(Colors, "10", "20", 12),
      width: "47%",
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    categoryLabel: { fontSize: 13, fontWeight: "600", color: Colors.text, flexShrink: 1 },
  }) as const;

const mediaStyles = (Colors: ColorPalette) =>
  ({
    photoRow: { gap: 10 },
    photo: {
      width: 130,
      height: 96,
      borderRadius: 12,
      backgroundColor: Colors.border,
    },
  }) as const;

const socialStyles = (Colors: ColorPalette) =>
  ({
    socialGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    socialBtn: {
      ...tintedChip(Colors, "10", "30", 20),
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    socialLabel: { fontSize: 13, fontWeight: "600", color: Colors.primary },
    flexFull: { flex: 1 },
    bottomSpacer: { height: 24 },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...errorStyles(Colors),
    ...heroStyles(Colors),
    ...sectionStyles(Colors),
    ...categoryStyles(Colors),
    ...mediaStyles(Colors),
    ...socialStyles(Colors),
  });
