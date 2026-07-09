import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { marginBottom: 14 },
    label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
    req: { color: Colors.error },
    input: {
      backgroundColor: Colors.inputBg, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: 12,
      fontSize: 15, color: Colors.text,
      borderWidth: 1, borderColor: Colors.border,
    },
    inputError: { borderColor: Colors.error },
    textarea: { height: 110, textAlignVertical: 'top' },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
  });
}
