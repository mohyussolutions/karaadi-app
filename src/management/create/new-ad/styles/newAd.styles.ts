import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../../components/hooks/useTheme';
import { createCommonStyles } from '../../../../util/styles/common/common.style';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
  });
}
