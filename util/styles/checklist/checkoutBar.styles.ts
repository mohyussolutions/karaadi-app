import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.card,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 10,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    connector: { flex: 1, height: 2, backgroundColor: Colors.gray200, marginBottom: 18, borderRadius: 1 },
    connectorDone: { backgroundColor: Colors.primary },
    stepCol: { alignItems: 'center', gap: 4 },
    circle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    circleDone: { backgroundColor: Colors.success },
    circlePending: { backgroundColor: Colors.gray100, borderWidth: 1.5, borderColor: Colors.gray300 },
    circleActive: {
      backgroundColor: Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.45,
      shadowRadius: 5,
      elevation: 5,
    },
    activeRing: {
      width: 36, height: 36, borderRadius: 18,
      borderWidth: 2, borderColor: Colors.primary + '35',
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center',
    },
    numActive: { fontSize: 12, fontWeight: '800', color: Colors.white },
    numPending: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
    label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.1 },
    labelDone: { color: Colors.success },
    labelActive: { color: Colors.primary, fontWeight: '700' },
  });
}
