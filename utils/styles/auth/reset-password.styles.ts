import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.surface },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 40 },
    scrollLandscape: { paddingVertical: 20 },
    card: {
      backgroundColor: Colors.card, borderRadius: 24, padding: 28,
      borderWidth: 1, borderColor: Colors.border,
      shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
    },
    cardTablet: { alignSelf: 'center', width: '100%', maxWidth: 460 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
    emailHighlight: { color: Colors.primary, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
    codeInput: {
      backgroundColor: Colors.inputBg, borderRadius: 12, paddingVertical: 16,
      fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
      borderWidth: 2, borderColor: Colors.primary, letterSpacing: 10,
    },
    passwordWrapper: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
      borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingRight: 12,
    },
    passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: Colors.textPrimary },
    eyeBtn: { padding: 4 },
    errorBox: {
      backgroundColor: Colors.errorGhost, borderWidth: 1, borderColor: Colors.error,
      borderRadius: 10, padding: 12, marginBottom: 12,
    },
    errorText: { color: Colors.error, fontSize: 13, textAlign: 'center', fontWeight: '500' },
    btn: {
      backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15,
      alignItems: 'center', marginTop: 4, marginBottom: 12,
    },
    btnDisabled: { opacity: 0.65 },
    btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
    resendBtn: { alignItems: 'center', paddingVertical: 10 },
    resendText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  });
}
