import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { createCommonStyles } from '../common/common.styles';

const centered = { alignItems: 'center', justifyContent: 'center' } as const;
const rowCentered = { flexDirection: 'row', alignItems: 'center' } as const;

const bordered = (Colors: ColorPalette) =>
  ({ borderWidth: 1, borderColor: Colors.border }) as const;

const infoCard = (Colors: ColorPalette, marginKey: 'marginBottom' | 'marginTop') =>
  ({
    ...rowCentered,
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    [marginKey]: 12,
    ...bordered(Colors),
  }) as const;

const iconBg = (Colors: ColorPalette) =>
  ({
    width: 44,
    height: 44,
    borderRadius: 12,
    ...centered,
    backgroundColor: Colors.primary + '18',
  }) as const;

const boldLabel = (Colors: ColorPalette) =>
  ({ fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 }) as const;

const primaryButton = (Colors: ColorPalette) =>
  ({
    backgroundColor: Colors.primary,
    borderRadius: 12,
    ...centered,
  }) as const;

const aboutHeaderStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    content: { padding: 16 },
    header: { marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
    subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  } as const;
};

const aboutCardStyles = (Colors: ColorPalette) =>
  ({
    card: {
      ...infoCard(Colors, 'marginBottom'),
    },
    iconBg: iconBg(Colors),
    cardBody: { flex: 1 },
    cardTitle: boldLabel(Colors),
    cardHint: { fontSize: 12, color: Colors.textMuted },
  }) as const;

const aboutFooterStyles = (Colors: ColorPalette) =>
  ({
    footer: { alignItems: 'center', paddingTop: 24, paddingBottom: 8 },
    followUsLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.text,
      marginBottom: 12,
    },
    socialRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    socialIconBg: { width: 44, height: 44, borderRadius: 22, ...centered },
    rightsText: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
    developedByText: { fontSize: 11, color: Colors.textMuted },
    developedByLink: { color: Colors.primary, fontWeight: '700' },
  }) as const;

export const createStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...aboutHeaderStyles(Colors),
    ...aboutCardStyles(Colors),
    ...aboutFooterStyles(Colors),
  });

const detailTextStyles = (Colors: ColorPalette) => {
  const { safeBase } = createCommonStyles(Colors);
  return {
    safe: safeBase,
    content: { padding: 16, paddingBottom: 32 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    submittingRow: { ...rowCentered, gap: 8 },
    lead: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
    sectionHeading: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    body: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  } as const;
};

const detailBulletStyles = (Colors: ColorPalette) =>
  ({
    bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    bulletDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.primary,
      marginTop: 7,
    },
    bulletText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  }) as const;

const detailContactStyles = (Colors: ColorPalette) =>
  ({
    contactRow: infoCard(Colors, 'marginTop'),
    contactIconBg: iconBg(Colors),
    contactBody: { flex: 1 },
    contactLabel: boldLabel(Colors),
    contactValue: { fontSize: 13, color: Colors.textMuted },
  }) as const;

const detailHistoryStyles = (Colors: ColorPalette) =>
  ({
    headerRow: {
      ...rowCentered,
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 8,
    },
    headerBody: { flex: 1 },
    historyButton: {
      ...rowCentered,
      gap: 6,
      backgroundColor: Colors.primary + '16',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.primary + '2a',
    },
    historyButtonText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  }) as const;

const detailLoginStyles = (Colors: ColorPalette) =>
  ({
    loginPrompt: {
      fontSize: 14,
      color: Colors.textSecondary,
      lineHeight: 20,
      marginTop: 8,
      marginBottom: 16,
    },
    loginButton: {
      ...primaryButton(Colors),
      height: 46,
      marginBottom: 8,
    },
    loginButtonText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  }) as const;

const detailFormStyles = (Colors: ColorPalette) =>
  ({
    input: {
      backgroundColor: Colors.card,
      borderRadius: 12,
      ...bordered(Colors),
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: Colors.text,
      marginBottom: 12,
    },
    textarea: { minHeight: 160, textAlignVertical: 'top' },
    submitButton: {
      ...primaryButton(Colors),
      marginTop: 2,
      minHeight: 48,
      paddingHorizontal: 16,
    },
    submitButtonDisabled: { opacity: 0.6 },
    submitButtonText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  }) as const;

export const createDetailStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    ...detailTextStyles(Colors),
    ...detailBulletStyles(Colors),
    ...detailContactStyles(Colors),
    ...detailHistoryStyles(Colors),
    ...detailLoginStyles(Colors),
    ...detailFormStyles(Colors),
  });
