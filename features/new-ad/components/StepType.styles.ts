import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    scroll: { padding: 16, flexGrow: 1 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
    cards: { gap: 12 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: Colors.border },
    icon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    cardSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  });
}
