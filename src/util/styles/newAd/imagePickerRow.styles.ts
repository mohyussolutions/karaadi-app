import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrap: { marginBottom: 16 },
    labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
    req: { color: Colors.error },
    counter: { fontSize: 12, fontWeight: '700' },
    minHint: { fontSize: 11, fontWeight: '400', color: Colors.error },
    uploader: {
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: Colors.border,
      borderRadius: 20,
      backgroundColor: Colors.surface,
      padding: 12,
    },
    uploaderError: { borderColor: Colors.error },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    actionRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 10,
    },
    actionBtn: {
      flex: 1,
      height: 44,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: Colors.primary,
      borderStyle: 'solid',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: Colors.primaryGhost,
    },
    actionText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
    imgWrap: { position: 'relative' },
    thumb: { width: 84, height: 84, borderRadius: 14, backgroundColor: Colors.border },
    remove: { position: 'absolute', top: -6, right: -6 },
    limitBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: Colors.primaryLight + '20',
      borderRadius: 8,
    },
    limitText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
    errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
  });
}
