import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    heading: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 10 },
    intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
    card: {
      backgroundColor: Colors.card, borderRadius: 12, padding: 16,
      marginBottom: 12, borderWidth: 1, borderColor: Colors.border,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    cardBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
    footer: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
    bottomSpacer: { height: 32 },
  });
}
