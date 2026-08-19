import { StyleSheet } from "react-native";
import { SPACING, RADII, TYPOGRAPHY } from "../../colors/theme";
import type { ColorPalette } from "../../../components/hooks/useTheme";
import { createCommonStyles } from "../common/common.style";

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    root: common.safeBase,
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.gray100,
      alignItems: "center",
      justifyContent: "center",
    },
    list: { flex: 1 },
    content: { padding: SPACING.lg, flexGrow: 1 },
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
  });
}
