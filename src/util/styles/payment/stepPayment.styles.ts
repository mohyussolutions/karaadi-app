import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    activatingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: Colors.background },
    activatingText: { fontSize: 14, color: Colors.textMuted },
    iosPaymentRoot: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    iosPaymentTitle: { marginTop: 16, textAlign: 'center', fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
    iosPaymentBody: { color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
    iosPaymentBtn: { marginTop: 24, alignSelf: 'stretch' },
  });
}
