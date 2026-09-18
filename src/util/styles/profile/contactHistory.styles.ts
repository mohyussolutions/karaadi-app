import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { createCommonStyles } from '../common/common.styles';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;

const outline = (color: string) =>
  ({ borderWidth: 1, borderColor: color }) as const;

const topLine = (color: string) =>
  ({ borderTopWidth: 1, borderTopColor: color }) as const;

const smallCaps = (color: string, fontSize: number, fontWeight: '700' | '800') =>
  ({ fontSize, fontWeight, color, textTransform: 'uppercase' }) as const;

const layoutStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    center: { flex: 1, justifyContent: 'center' },
    content: { padding: 16, paddingBottom: 32 },
    loadingBox: { paddingVertical: 40, alignItems: 'center' },
  } as const;
};

const cardStyles = (Colors: ColorPalette) =>
  ({
    card: {
      borderRadius: 14,
      ...outline(Colors.border),
      backgroundColor: Colors.card,
      marginBottom: 12,
      overflow: 'hidden',
    },
    cardDone: {
      borderColor: Colors.success + '55',
      backgroundColor: Colors.success + '0d',
    },
    cardHeader: { padding: 14 },
    cardHeaderTop: {
      ...rowCentered,
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },
    cardTitleRow: { ...rowCentered, gap: 8, flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, flexShrink: 1 },
    cardTitleDone: { color: Colors.successDark },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.white, textTransform: 'uppercase' },
    cardBodyPreview: { fontSize: 12, color: Colors.textMuted, fontStyle: 'italic' },
  }) as const;

const cardFooterStyles = (Colors: ColorPalette) =>
  ({
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      paddingTop: 8,
      ...topLine(Colors.border),
    },
    cardFooterId: smallCaps(Colors.textMuted, 10, '700'),
    cardFooterToggle: { ...rowCentered, gap: 4 },
    cardFooterToggleText: smallCaps(Colors.primary, 10, '800'),
    expanded: {
      padding: 14,
      ...topLine(Colors.border),
      backgroundColor: Colors.background,
    },
  }) as const;

const bubbleStyles = (Colors: ColorPalette) =>
  ({
    messageBubbleRow: { marginBottom: 10 },
    messageBubbleRowUser: { alignItems: 'flex-start' },
    messageBubbleRowSupport: { alignItems: 'flex-end' },
    bubble: {
      maxWidth: '90%',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    bubbleUser: {
      backgroundColor: Colors.card,
      ...outline(Colors.border),
      borderTopLeftRadius: 2,
    },
    bubbleSupport: {
      backgroundColor: Colors.primary,
      borderTopRightRadius: 2,
    },
    bubbleText: { fontSize: 12 },
    bubbleTextUser: { color: Colors.text },
    bubbleTextSupport: { color: Colors.white },
    bubbleMeta: {
      ...smallCaps(Colors.textMuted, 9, '700'),
      marginTop: 4,
      paddingHorizontal: 2,
    },
  }) as const;

const resolvedStyles = (Colors: ColorPalette) =>
  ({
    resolvedBanner: {
      marginTop: 4,
      marginBottom: 10,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: Colors.success + '18',
    },
    resolvedBannerText: {
      textAlign: 'center',
      ...smallCaps(Colors.successDark, 10, '800'),
    },
  }) as const;

const replyStyles = (Colors: ColorPalette) =>
  ({
    replyRow: {
      ...rowCentered,
      gap: 8,
      marginTop: 4,
      paddingTop: 10,
      ...topLine(Colors.border),
    },
    replyInput: {
      flex: 1,
      backgroundColor: Colors.card,
      ...outline(Colors.border),
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 13,
      color: Colors.text,
    },
    replySendButton: {
      width: 38,
      height: 38,
      borderRadius: 10,
      ...centered,
      backgroundColor: Colors.primary,
    },
    replySendButtonDisabled: { opacity: 0.5 },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...layoutStyles(Colors),
    ...cardStyles(Colors),
    ...cardFooterStyles(Colors),
    ...bubbleStyles(Colors),
    ...resolvedStyles(Colors),
    ...replyStyles(Colors),
  });
