import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderRadius: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors.gray100,
    },
    img: { width: '100%', aspectRatio: 1, backgroundColor: Colors.gray100 },
    body: { padding: 10, gap: 4 },
    line: { backgroundColor: Colors.gray100, borderRadius: 6 },
    lineTitle: { width: '90%', height: 13 },
    lineSubtitle: { width: '60%', height: 13, marginTop: 4 },
    linePrice: { width: 60, height: 13 },
    lineMeta: { width: 70, height: 11 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  });
}
