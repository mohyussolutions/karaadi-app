import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 40, flexGrow: 1 },

    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backBtn: { marginRight: 8, padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },

    intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 20 },

    errorBox: {
      backgroundColor: Colors.errorGhost, borderWidth: 1, borderColor: Colors.error + '40',
      borderRadius: 12, padding: 12, marginBottom: 16,
    },
    errorText: { color: Colors.error, fontSize: 13, fontWeight: '600' },

    label: {
      fontSize: 11, fontWeight: '800', color: Colors.textMuted,
      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
    },

    reasonList: { gap: 10, marginBottom: 24 },
    reasonRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: Colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border,
      paddingVertical: 14, paddingHorizontal: 14,
    },
    reasonRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryGhost },
    radio: {
      width: 20, height: 20, borderRadius: 10,
      borderWidth: 2, borderColor: Colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    radioActive: { borderColor: Colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
    reasonText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },

    textarea: {
      backgroundColor: Colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: Colors.border,
      padding: 14, fontSize: 14, color: Colors.text,
      height: 120, textAlignVertical: 'top', marginBottom: 24,
    },

    submitBtn: {
      backgroundColor: Colors.error, borderRadius: 14,
      paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitText: { color: Colors.white, fontSize: 15, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },

    successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    successIconWrap: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: Colors.success + '20',
      alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    successHeading: { fontSize: 19, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 8 },
    successBody: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
    successHint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
  });
}
