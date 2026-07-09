import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.surface },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 40 },
    scrollLandscape: { paddingVertical: 20 },
    card: {
      backgroundColor: Colors.card, borderRadius: 24, padding: 28,
      borderWidth: 1, borderColor: Colors.border,
      ...shadow({ color: Colors.black, offset: { width: 0, height: 4 }, opacity: 0.1, radius: 16, elevation: 6 }),
    },
    cardTablet: { alignSelf: 'center', width: '100%', maxWidth: 460 },
    title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
    input: {
      backgroundColor: Colors.inputBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
      fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
    },
    errorBox: {
      backgroundColor: Colors.errorGhost, borderWidth: 1, borderColor: Colors.error,
      borderRadius: 10, padding: 12, marginBottom: 12,
    },
    errorText: { color: Colors.error, fontSize: 13, textAlign: 'center', fontWeight: '500' },
    btn: {
      backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15,
      alignItems: 'center', marginBottom: 12,
    },
    btnDisabled: { opacity: 0.65 },
    btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
    backBtn: { alignItems: 'center', paddingVertical: 10 },
    backText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  });
}
