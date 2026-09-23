import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { createCommonStyles } from '../common/common.styles';

export function createSubscriptionListStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { padding: 12, paddingBottom: 36 },
    row: { gap: 12, marginBottom: 12 },
  });
}
