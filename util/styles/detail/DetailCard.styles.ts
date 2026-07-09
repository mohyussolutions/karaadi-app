import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card, borderRadius: 16, padding: 16,
      marginBottom: 14, borderWidth: 1, borderColor: Colors.border,
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 1 }, opacity: 0.05, radius: 4, elevation: 1 }),
    },
    cardTitle: {
      fontSize: 12, fontWeight: '700', color: Colors.gray500,
      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12,
    },
    row: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    rowLast: { borderBottomWidth: 0 },
    key: { fontSize: 14, color: Colors.gray500 },
    val: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    gridCell: {
      width: '47.5%',
      backgroundColor: Colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.gray100,
    },
    gridLabel: { fontSize: 9, fontWeight: '800', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, textAlign: 'center' },
    gridValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  });
}
