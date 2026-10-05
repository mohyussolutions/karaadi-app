import { StyleSheet, Platform, type TextStyle } from 'react-native';
import type { ColorPalette } from '../../types';
import { shadow } from '../../../lib/helpers/style/shadow';
import { createCommonStyles } from '../common/common.styles';

const PAGE_PAD = 20;
const SECTION_GAP = 28;
const row = { flexDirection: 'row', alignItems: 'center' } as const;
const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  const hairline = { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border } as const;

  return StyleSheet.create({
    root: common.safeBase,
    scroll: { paddingHorizontal: PAGE_PAD, paddingTop: 8, paddingBottom: 16, flexGrow: 1 },
    bottomSpacer: { height: 140 },

    topBar: { ...row, gap: 12, paddingHorizontal: PAGE_PAD, paddingVertical: 8 },
    backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
    topTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.textSecondary },

    heading: { marginBottom: SECTION_GAP },
    headingTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 },
    headingSub: { fontSize: 15, lineHeight: 22, color: Colors.textMuted, marginTop: 6 },

    amountBlock: {
      marginHorizontal: -PAGE_PAD,
      paddingHorizontal: PAGE_PAD,
      paddingVertical: 24,
      marginBottom: SECTION_GAP,
      backgroundColor: Colors.primary,
    },
    amountBlockFree: { backgroundColor: Colors.successDark },
    amountLabel: { fontSize: 13, fontWeight: '700', color: Colors.whiteAlpha80 },
    amountValue: { ...tabular, fontSize: 34, lineHeight: 40, fontWeight: '800', color: Colors.textOnPrimary, marginTop: 4, letterSpacing: -0.5 },
    amountMeta: { fontSize: 13, color: Colors.whiteAlpha80, marginTop: 6 },

    section: { marginBottom: SECTION_GAP },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginBottom: 4 },

    ledgerRow: { ...row, justifyContent: 'space-between', gap: 16, paddingVertical: 14, ...hairline },
    ledgerLabel: { flex: 1, fontSize: 15, lineHeight: 20, color: Colors.textSecondary },
    ledgerValue: { ...tabular, fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
    ledgerValueFree: { color: Colors.success },

    methodRow: { ...row, gap: 14, paddingVertical: 18, ...hairline },
    methodSwatch: { width: 12, height: 12, borderRadius: 6 },
    methodText: { flex: 1 },
    methodLabel: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
    methodLabelActive: { color: Colors.primary },
    methodSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: Colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
    changeLink: { fontSize: 15, fontWeight: '700', color: Colors.primary },

    fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, marginBottom: 10 },
    inputRow: {
      ...row,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: Colors.border,
      backgroundColor: Colors.inputBg,
      overflow: 'hidden',
    },
    inputRowFocused: { borderColor: Colors.primary },
    inputRowError: { borderColor: Colors.error },
    dialCode: { paddingLeft: 16, paddingRight: 12, alignSelf: 'stretch', justifyContent: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
    dialCodeText: { ...tabular, fontSize: 20, fontWeight: '700', color: Colors.textSecondary },
    input: {
      ...tabular,
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 18 : 14,
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: 1,
      color: Colors.textPrimary,
    },
    inputLock: { paddingHorizontal: 14 },
    errRow: { ...row, gap: 6, marginTop: 10 },
    errText: { flex: 1, fontSize: 13, color: Colors.error },
    notes: { marginTop: 20, gap: 12 },
    noteRow: { ...row, alignItems: 'flex-start', gap: 10 },
    noteText: { flex: 1, fontSize: 14, lineHeight: 20, color: Colors.textSecondary },

    errBanner: { ...row, gap: 10, paddingVertical: 14, marginBottom: SECTION_GAP, borderTopWidth: 2, borderTopColor: Colors.error },
    errBannerText: { flex: 1, fontSize: 14, lineHeight: 20, color: Colors.error },

    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      gap: 10,
      paddingHorizontal: PAGE_PAD,
      paddingTop: 14,
      paddingBottom: 12,
      backgroundColor: Colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
    },
    primaryBtn: {
      ...row,
      justifyContent: 'space-between',
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 20,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.25, radius: 8, elevation: 4 }),
    },
    primaryBtnDisabled: { opacity: 0.6 },
    primaryBtnText: { fontSize: 16, fontWeight: '800', color: Colors.textOnPrimary },
    secRow: { ...row, gap: 6 },
    secText: { fontSize: 12, color: Colors.textMuted },
  });
}
