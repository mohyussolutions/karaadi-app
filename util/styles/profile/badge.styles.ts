import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    heading: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 10 },
    intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
    statRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: Colors.card, borderRadius: 12, padding: 16,
      marginBottom: 12, borderWidth: 1, borderColor: Colors.border,
    },
    statLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statIconBg: {
      width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary + '18',
    },
    statLabel: { fontSize: 14, color: Colors.text, fontWeight: '600' },
    statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
    bottomSpacer: { height: 32 },
  });
}
