import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette, width = 390, imgH = 320) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.card },
    imgPlaceholder: { width, height: imgH, backgroundColor: Colors.border },
    body: { flex: 1, padding: 16, gap: 10 },
    gap: { height: 4 },
    actions: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: 16, paddingVertical: 14,
      borderTopWidth: 1, borderTopColor: Colors.border,
      backgroundColor: Colors.card,
    },
    iconBone: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.border },
    callBone: { width: 110, height: 44, borderRadius: 14, backgroundColor: Colors.border },
    msgBone: { flex: 1, height: 44, borderRadius: 14, backgroundColor: Colors.border },
  });
}
