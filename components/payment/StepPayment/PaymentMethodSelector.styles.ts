import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { marginBottom: 16 },
    title: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
    list: { gap: 10 },
    card: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card,
    },
    iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    textCol: { flex: 1 },
    label: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
    sub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center' },
    radioDot: { width: 10, height: 10, borderRadius: 5 },
  });
}
