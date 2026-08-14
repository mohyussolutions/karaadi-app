import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { createCommonStyles } from '../common/common.style';

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    safe: common.safeBase,
    content: { padding: 16 },
    heading: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 10 },
    intro: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
    card: {
      backgroundColor: Colors.card, borderRadius: 12, padding: 16,
      marginBottom: 12, borderWidth: 1, borderColor: Colors.border,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 6 },
    cardBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
    footer: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
    bottomSpacer: { height: 32 },
  });
}
