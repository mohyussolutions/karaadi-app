import { StyleSheet } from "react-native";
import { SPACING, RADII, TYPOGRAPHY } from "../../theme";
import type { ColorPalette } from "../../../hooks/useTheme";

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    content: { padding: SPACING.lg, flexGrow: 1 },
    title: {
      ...TYPOGRAPHY.display,
      color: Colors.textPrimary,
      marginBottom: SPACING.lg,
    },
    cell: { flex: 1, padding: SPACING.xs },
    card: {
      alignItems: "center",
      padding: SPACING.md,
      borderRadius: RADII.xl,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      gap: SPACING.xs + 2,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: RADII.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      ...TYPOGRAPHY.label,
      color: Colors.textSecondary,
      textAlign: "center",
      lineHeight: 14,
    },
    check: { position: "absolute", top: 6, right: 6 },
    btn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      backgroundColor: Colors.primary,
      borderRadius: RADII.lg,
      paddingVertical: 15,
      marginTop: SPACING.sm,
      marginBottom: SPACING.xs,
    },
    btnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
    back: { alignItems: "center", paddingVertical: SPACING.md - 2 },
    backText: { fontSize: 13, color: Colors.textMuted },
  });
}
