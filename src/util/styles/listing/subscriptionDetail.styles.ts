import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../helpers/shadow';
import { createCommonStyles } from '../common/common.styles';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;

const ghostPill = (Colors: ColorPalette, gap: number, paddingHorizontal: number, paddingVertical: number) =>
  ({
    ...rowCentered,
    gap,
    backgroundColor: Colors.primaryGhost,
    borderRadius: 20,
    paddingHorizontal,
    paddingVertical,
  }) as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    scroll: { paddingBottom: 16 },
    bottomSpacer: { height: 24 },
  } as const;
};

const heroStyles = (Colors: ColorPalette) =>
  ({
    hero: {
      height: 280,
      backgroundColor: Colors.primaryGhost,
      ...centered,
      gap: 16,
    },
    heroIcon: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors.card,
      ...centered,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 6 },
        opacity: 0.12,
        radius: 16,
        elevation: 6,
      }),
    },
    categoryBadge: {
      backgroundColor: Colors.primary,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 7,
    },
    categoryBadgeText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  }) as const;

const statusStyles = (Colors: ColorPalette) =>
  ({
    statusRow: { ...rowCentered, gap: 8 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    statusBadgeActive: { backgroundColor: Colors.success + '22' },
    statusBadgeInactive: { backgroundColor: Colors.border },
    statusBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    statusBadgeTextActive: { color: Colors.success },
    statusBadgeTextInactive: { color: Colors.textMuted },
  }) as const;

const headlineStyles = (Colors: ColorPalette) =>
  ({
    body: { padding: 20 },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.textPrimary,
      lineHeight: 32,
      marginBottom: 8,
    },
    price: {
      fontSize: 28,
      fontWeight: '800',
      color: Colors.primary,
      marginBottom: 12,
    },
    locRow: { ...rowCentered, gap: 6, marginBottom: 20 },
    locPill: ghostPill(Colors, 4, 10, 5),
    locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  }) as const;

const infoCardStyles = (Colors: ColorPalette) =>
  ({
    card: {
      backgroundColor: Colors.card,
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: Colors.gray500,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 14,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    infoRowLast: { borderBottomWidth: 0 },
    infoLeft: { ...rowCentered, gap: 10 },
    infoLabel: { fontSize: 14, color: Colors.gray500 },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.textPrimary,
      textAlign: 'right',
      flex: 1,
      marginLeft: 16,
    },
  }) as const;

const pillStyles = (Colors: ColorPalette) =>
  ({
    pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    pill: ghostPill(Colors, 4, 12, 6),
    pillText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    description: { fontSize: 15, color: Colors.gray700, lineHeight: 26 },
    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      ...centered,
      borderWidth: 1.5,
      borderColor: Colors.border,
    },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...heroStyles(Colors),
    ...statusStyles(Colors),
    ...headlineStyles(Colors),
    ...infoCardStyles(Colors),
    ...pillStyles(Colors),
  });
