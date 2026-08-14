import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { createCommonStyles } from '../common/common.style';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    list: { flexGrow: 1 },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 14,
    },
    query: { flex: 1, fontSize: 15, color: Colors.text },
    separator: { height: 1, backgroundColor: Colors.border },
  });
}
