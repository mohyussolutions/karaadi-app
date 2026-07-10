import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.card,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 6,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    connector: { flex: 1, height: 2, backgroundColor: Colors.gray200, marginBottom: 14, borderRadius: 1 },
    connectorDone: { backgroundColor: Colors.primary },
    stepCol: { alignItems: 'center', gap: 3 },
    circle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    circleDone: { backgroundColor: Colors.success },
    circlePending: { backgroundColor: Colors.gray100, borderWidth: 1.5, borderColor: Colors.gray300 },
    circleActive: {
      backgroundColor: Colors.primary,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 2 }, opacity: 0.45, radius: 5, elevation: 5 }),
    },
    activeRing: {
      width: 28, height: 28, borderRadius: 14,
      borderWidth: 2, borderColor: Colors.primary + '35',
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center',
    },
    numActive: { fontSize: 11, fontWeight: '800', color: Colors.white },
    numPending: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
    label: { fontSize: 9, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.1 },
    labelDone: { color: Colors.success },
    labelActive: { color: Colors.primary, fontWeight: '700' },
  });
}
