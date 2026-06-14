import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    header: { marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
    subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    iconBg: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary + '18',
    },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    cardHint: { fontSize: 12, color: Colors.textMuted },
  });
}
