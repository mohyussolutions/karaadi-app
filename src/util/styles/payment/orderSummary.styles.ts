import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../helpers/shadow';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;
const spaceBetween = { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as const;
const dashedBottom = (Colors: ColorPalette) =>
  ({ borderBottomWidth: 1.5, borderStyle: 'dashed', borderBottomColor: Colors.gray200 }) as const;

const microLabel = (Colors: ColorPalette, marginBottom: number) =>
  ({
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom,
  }) as const;

const imageStyles = (Colors: ColorPalette, imgH: number) =>
  ({
    imgBox: { borderRadius: 18, overflow: 'hidden', marginBottom: 12, height: imgH },
    img: { width: '100%', height: '100%' },
    arrow: {
      position: 'absolute',
      top: '50%',
      marginTop: -18,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.shadow45,
      ...centered,
    },
    arrowL: { left: 8 },
    arrowR: { right: 8 },
    dots: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.whiteAlpha50 },
    dotActive: { backgroundColor: Colors.white, width: 16 },
    emptyImage: {
      height: imgH,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.gray50,
      ...centered,
      marginBottom: 14,
      gap: 8,
    },
    emptyImageIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: Colors.gray100,
      ...centered,
    },
    emptyImageText: {
      fontSize: 12,
      color: Colors.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  }) as const;

const listingCardStyles = (Colors: ColorPalette) =>
  ({
    wrap: { marginBottom: 20 },
    card: {
      backgroundColor: Colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: 'hidden',
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 6 },
        opacity: 0.06,
        radius: 16,
        elevation: 3,
      }),
    },
    titleSection: { padding: 18, ...dashedBottom(Colors) },
    listingTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: {
      ...rowCentered,
      gap: 4,
      backgroundColor: Colors.primaryGhost,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    chipText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
    chipTextMuted: { color: Colors.textMuted },
  }) as const;

const detailStyles = (Colors: ColorPalette) =>
  ({
    attrsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      padding: 18,
      ...dashedBottom(Colors),
    },
    attrCell: {
      backgroundColor: Colors.gray50,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 9,
      minWidth: '28%',
      flex: 1,
    },
    attrLabel: microLabel(Colors, 2),
    attrValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
    descBox: { padding: 18, ...dashedBottom(Colors) },
    descLabel: microLabel(Colors, 4),
    descText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    divider: dashedBottom(Colors),
  }) as const;

const breakdownStyles = (Colors: ColorPalette) =>
  ({
    breakdown: { padding: 18 },
    breakdownLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: Colors.textMuted,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    bRow: {
      ...spaceBetween,
      backgroundColor: Colors.gray50,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    planBadge: {
      ...rowCentered,
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    bKey: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
    bDays: { fontSize: 12, color: Colors.textMuted },
    bVal: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
    green: { color: Colors.successDark },
  }) as const;

const totalStyles = (Colors: ColorPalette) =>
  ({
    totalBox: {
      ...spaceBetween,
      paddingHorizontal: 14,
      paddingVertical: 12,
      margin: 14,
      marginTop: 4,
      borderRadius: 14,
      borderWidth: 1,
    },
    totalBoxFree: { backgroundColor: Colors.success + '15' },
    totalBoxPaid: { backgroundColor: Colors.primaryGhost, borderColor: Colors.blueTint },
    totalLeft: { ...rowCentered, gap: 8 },
    totalLabel: { fontSize: 14, fontWeight: '800' },
    totalLabelPaid: { color: Colors.primary },
    totalAmt: { fontSize: 22, fontWeight: '900' },
    totalAmtPaid: { color: Colors.primary },
    textWhite: { color: Colors.white },
  }) as const;

export const createStyles = (Colors: ColorPalette, width = 390) => {
  const imgH = Math.round((width - 32) * 0.56);
  return StyleSheet.create({
    ...imageStyles(Colors, imgH),
    ...listingCardStyles(Colors),
    ...detailStyles(Colors),
    ...breakdownStyles(Colors),
    ...totalStyles(Colors),
  });
};
