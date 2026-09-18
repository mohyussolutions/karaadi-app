import { StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { createCommonStyles } from '../common/common.styles';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;

const outline = (color: string, width = 1) =>
  ({ borderWidth: width, borderColor: color }) as const;

const layoutStyles = (Colors: ColorPalette) => {
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
    flexFull: { flex: 1 },
  } as const;
};

const fieldStyles = (Colors: ColorPalette) =>
  ({
    fieldWrap: { marginBottom: 14 },
    fieldLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
      marginBottom: 6,
    },
    mainCatBadge: {
      ...rowCentered,
      gap: 8,
      backgroundColor: Colors.primaryGhost,
      borderRadius: 18,
      paddingHorizontal: 16,
      minHeight: 56,
      ...outline(Colors.primary + '30', 1.5),
    },
    mainCatText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
  }) as const;

const nestedStyles = (Colors: ColorPalette) =>
  ({
    nestedWrap: { marginTop: -6, marginBottom: 14 },
    nestedLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.textSecondary,
      marginBottom: 8,
    },
    nestedSearchBox: {
      ...rowCentered,
      gap: 8,
      backgroundColor: Colors.inputBg,
      borderRadius: 10,
      ...outline(Colors.border),
      paddingHorizontal: 12,
      paddingVertical: Platform.OS === 'ios' ? 9 : 7,
      marginBottom: 10,
    },
    nestedSearchInput: { flex: 1, fontSize: 13, color: Colors.textPrimary, padding: 0 },
    nestedEmptyText: { fontSize: 12, color: Colors.textMuted, paddingVertical: 6 },
  }) as const;

const chipStyles = (Colors: ColorPalette) =>
  ({
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: {
      ...rowCentered,
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      ...outline(Colors.border),
      backgroundColor: Colors.surface,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
    chipTextActive: { color: Colors.white },
  }) as const;

const feedbackStyles = (Colors: ColorPalette) =>
  ({
    errorBanner: {
      ...rowCentered,
      gap: 8,
      backgroundColor: Colors.errorGhost,
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      ...outline(Colors.error + '30'),
    },
    errorBannerText: { fontSize: 13, color: Colors.error, flex: 1 },
    btn: {
      flexDirection: 'row',
      ...centered,
      gap: 8,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      marginTop: 8,
      marginBottom: 4,
    },
    btnDisabled: { opacity: 0.65 },
    btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...fieldStyles(Colors),
    ...nestedStyles(Colors),
    ...chipStyles(Colors),
    ...feedbackStyles(Colors),
  });
