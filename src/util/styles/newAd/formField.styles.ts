import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { marginBottom: 16 },
    field: {
      position: 'relative',
      backgroundColor: Colors.surface,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: Colors.border,
      paddingHorizontal: 16,
      justifyContent: 'center',
      minHeight: 56,
      overflow: 'visible',
    },
    fieldTextarea: { minHeight: 120, justifyContent: 'flex-start', paddingTop: 6 },
    fieldFocused: { borderColor: Colors.primary },
    fieldError: { borderColor: Colors.error },
    floatingLabel: {
      position: 'absolute',
      left: 12,
      paddingHorizontal: 4,
      color: Colors.textMuted,
      backgroundColor: Colors.surface,
      fontWeight: '600',
    },
    floatingLabelActive: { color: Colors.primary },
    input: {
      fontSize: 15,
      color: Colors.text,
      paddingTop: 20,
      paddingBottom: 6,
      padding: 0,
    },
    inputTextarea: { minHeight: 108, paddingTop: 22, textAlignVertical: 'top' },
    req: { color: Colors.error },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 6, marginLeft: 4 },
    multiselectLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textMuted,
      marginBottom: 8,
      marginLeft: 4,
    },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
    },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    chipTextActive: { color: Colors.white },
  });
}
