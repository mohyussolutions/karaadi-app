import { StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../helpers/shadow';
import { createCommonStyles } from '../common/common.styles';

const row = { flexDirection: 'row', alignItems: 'center' } as const;
const centered = { alignItems: 'center', justifyContent: 'center' } as const;

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  const cardBase = {
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  } as const;

  return StyleSheet.create({
    root: common.safeBase,
    scroll: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16, flexGrow: 1 },
    bottomSpacer: { height: 140 },

    topBar: { ...row, gap: 10, paddingHorizontal: 16, paddingVertical: 6 },
    backBtn: {
      width: 34, height: 34, borderRadius: 17, ...centered,
      backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    },
    topTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: Colors.textPrimary },

    header: { ...cardBase, ...row, gap: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
    headerIcon: { width: 32, height: 32, borderRadius: 10, ...centered, backgroundColor: Colors.primary },
    headerText: { flex: 1 },
    headerTitle: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
    headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

    card: { ...cardBase, padding: 16, marginBottom: 12 },
    list: { gap: 10 },
    option: { ...cardBase, ...row, gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
    optionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    selectedOption: { marginBottom: 12 },
    optionIcon: { width: 42, height: 42, borderRadius: 12, ...centered },
    optionText: { flex: 1 },
    optionLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    optionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.gray300, ...centered },
    radioActive: { borderColor: Colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
    changeBtn: {
      paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
      backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    },
    changeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

    fieldLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
    inputRow: {
      ...row, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
      backgroundColor: Colors.background, overflow: 'hidden',
    },
    inputRowFocused: { borderColor: Colors.primary },
    inputRowError: { borderColor: Colors.error },
    dialCode: {
      paddingHorizontal: 14, alignSelf: 'stretch', ...centered,
      backgroundColor: Colors.surface, borderRightWidth: 1, borderRightColor: Colors.border,
    },
    dialCodeText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    input: {
      flex: 1, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 15 : 12,
      fontSize: 17, letterSpacing: 1, color: Colors.textPrimary,
    },
    inputLock: { paddingHorizontal: 12 },
    errRow: { ...row, gap: 6, marginTop: 8 },
    errText: { flex: 1, fontSize: 12, color: Colors.error },
    note: { ...row, alignItems: 'flex-start', gap: 8, marginTop: 12 },
    noteText: { flex: 1, fontSize: 12, lineHeight: 17, color: Colors.textSecondary },

    errBanner: {
      ...row, gap: 8, padding: 12, marginBottom: 12, borderRadius: 14,
      backgroundColor: Colors.errorGhost, borderWidth: 1, borderColor: Colors.error,
    },
    errBannerText: { flex: 1, fontSize: 13, color: Colors.error },

    footer: {
      position: 'absolute', left: 0, right: 0, gap: 8,
      paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 22, borderTopRightRadius: 22,
      borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.border,
      ...shadow({ color: Colors.black, offset: { width: 0, height: -4 }, opacity: 0.08, radius: 14, elevation: 7 }),
    },
    primaryBtn: {
      ...row, justifyContent: 'center', gap: 8,
      backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 17,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.3, radius: 8, elevation: 5 }),
    },
    primaryBtnDisabled: { opacity: 0.6 },
    primaryBtnText: { color: Colors.textOnPrimary, fontSize: 16, fontWeight: '700' },
    secRow: { ...row, justifyContent: 'center', gap: 5 },
    secText: { fontSize: 11, color: Colors.textMuted },
  });
}
