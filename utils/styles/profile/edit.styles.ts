import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 24, alignItems: 'center', gap: 12 },
    avatarSection: { alignItems: 'center', marginBottom: 8 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.border },
    editPhotoBtn: {
      position: 'absolute', bottom: 24, right: -2,
      backgroundColor: Colors.primary, borderRadius: 15, padding: 6,
      borderWidth: 2, borderColor: Colors.background,
    },
    avatarHint: { fontSize: 12, color: Colors.textMuted, marginTop: 28 },
    card: {
      backgroundColor: Colors.card, borderRadius: 12, width: '100%',
      padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 8,
    },
    label: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    staticValue: { fontSize: 15, fontWeight: '500', color: Colors.text },
    input: {
      backgroundColor: Colors.inputBg, borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 10,
      fontSize: 15, color: Colors.text,
      borderWidth: 1, borderColor: Colors.border,
    },
    saveBtn: {
      backgroundColor: Colors.primary, borderRadius: 10,
      paddingVertical: 11, alignItems: 'center',
    },
    saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
    disabled: { opacity: 0.6 },
    dangerCard: { borderColor: Colors.error + '40' },
    dangerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dangerTitle: { fontSize: 15, fontWeight: '800', color: Colors.error },
    dangerWarning: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    deleteBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: Colors.error + '14', borderRadius: 10,
      paddingVertical: 11, borderWidth: 1, borderColor: Colors.error,
    },
    deleteBtnText: { color: Colors.error, fontWeight: '700', fontSize: 14 },
  });
}
