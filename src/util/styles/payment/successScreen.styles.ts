import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { shadow } from '../../helpers/shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    scroll: { padding: 20, flexGrow: 1, alignItems: 'center' },
    bottomSpacer: { height: 40 },
    iconCircle: {
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: Colors.success + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
    sub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 22 },
    bold: { fontWeight: '700', color: Colors.textPrimary },
    checkCard: {
      width: '100%', backgroundColor: Colors.card, borderRadius: 14,
      padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 10, marginBottom: 24,
    },
    checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    checkDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.success + '15', alignItems: 'center', justifyContent: 'center' },
    checkLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
    doneBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, width: '100%', backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.3, radius: 8, elevation: 5 }),
    },
    doneBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  });
}
