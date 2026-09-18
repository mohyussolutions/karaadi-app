import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../helpers/shadow';
import { FAB_SIZE } from '../../../constants/constants';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;

const roundBox = (size: number) =>
  ({ width: size, height: size, borderRadius: size / 2 }) as const;

const sheetStyles = (Colors: ColorPalette) =>
  ({
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      zIndex: 99,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: -4 },
        opacity: 0.18,
        radius: 16,
        elevation: 20,
      }),
      overflow: 'hidden',
    },
    handleBar: {
      backgroundColor: Colors.hage,
      paddingTop: 10,
      paddingBottom: 14,
      paddingHorizontal: 16,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.whiteAlpha35,
      alignSelf: 'center',
      marginBottom: 12,
    },
  }) as const;

const sheetHeaderStyles = (Colors: ColorPalette) =>
  ({
    sheetHeader: { ...rowCentered, justifyContent: 'space-between' },
    sheetTitleRow: { ...rowCentered, gap: 8 },
    sheetTitle: { fontSize: 17, fontWeight: '700', color: Colors.white },
    sheetActions: { ...rowCentered, gap: 8 },
    headerBtn: {
      ...roundBox(36),
      ...centered,
      backgroundColor: Colors.whiteAlpha15,
    },
  }) as const;

const messageStyles = (Colors: ColorPalette) =>
  ({
    messageListWrap: { flex: 1 },
    messageList: { padding: 16, gap: 10 },
    emptyWrap: { ...centered, paddingVertical: 64, gap: 12 },
    emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
    bubble: {
      maxWidth: '80%',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 18,
    },
    bubbleAI: {
      alignSelf: 'flex-start',
      backgroundColor: Colors.gray100,
      borderBottomLeftRadius: 4,
    },
    bubbleUser: {
      alignSelf: 'flex-end',
      backgroundColor: Colors.primary,
      borderBottomRightRadius: 4,
    },
    bubbleText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
    bubbleTextUser: { color: Colors.white },
    bubbleLink: {
      color: Colors.primary,
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
  }) as const;

const listingChipStyles = (Colors: ColorPalette) =>
  ({
    listingsWrap: { marginTop: 6, marginLeft: 4, gap: 6 },
    chip: {
      ...rowCentered,
      backgroundColor: Colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.gray200,
      overflow: 'hidden',
      maxWidth: '85%',
      gap: 8,
    },
    chipImg: { width: 56, height: 56 },
    chipImgPlaceholder: { backgroundColor: Colors.gray100, ...centered },
    chipInfo: { flex: 1, paddingVertical: 8, gap: 2 },
    chipTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
      lineHeight: 18,
    },
    chipPrice: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  }) as const;

const thinkingStyles = (Colors: ColorPalette) =>
  ({
    thinkingRow: {
      ...rowCentered,
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    thinkingDots: { flexDirection: 'row', gap: 4 },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary },
    thinkingText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
  }) as const;

const inputStyles = (Colors: ColorPalette) =>
  ({
    inputRow: {
      ...rowCentered,
      gap: 10,
      paddingHorizontal: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      backgroundColor: Colors.card,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      color: Colors.textPrimary,
      borderWidth: 1,
      borderColor: Colors.border,
      maxHeight: 100,
    },
    sendBtn: {
      ...roundBox(42),
      backgroundColor: Colors.primary,
      ...centered,
    },
    sendBtnDisabled: { backgroundColor: Colors.gray200 },
  }) as const;

const fabStyles = (Colors: ColorPalette) =>
  ({
    fabWrap: { position: 'absolute', zIndex: 100 },
    fab: {
      ...roundBox(FAB_SIZE),
      backgroundColor: Colors.hage,
      ...centered,
      ...shadow({
        color: Colors.shadow,
        offset: { width: 0, height: 4 },
        opacity: 0.3,
        radius: 8,
        elevation: 8,
      }),
    },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...sheetStyles(Colors),
    ...sheetHeaderStyles(Colors),
    ...messageStyles(Colors),
    ...listingChipStyles(Colors),
    ...thinkingStyles(Colors),
    ...inputStyles(Colors),
    ...fabStyles(Colors),
  });
