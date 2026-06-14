import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    list: { padding: 16, gap: 10 },
    listEmpty: { flex: 1 },
    createBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: Colors.primary, borderRadius: 12,
      paddingVertical: 14, paddingHorizontal: 16,
      marginBottom: 16,
    },
    createBtnText: { flex: 1, color: Colors.white, fontWeight: '700', fontSize: 15 },
    card: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: Colors.card, borderRadius: 14, padding: 14,
      borderWidth: 1, borderColor: Colors.gray100,
    },
    logo: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.border },
    info: { flex: 1, gap: 3 },
    name: { fontSize: 15, fontWeight: '700', color: Colors.text },
    typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: Colors.primaryLight + '20', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
    typeText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
    location: { fontSize: 12, color: Colors.textMuted },
    deleteBtn: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 4, gap: 3 },
    deleteText: { fontSize: 12, color: Colors.error, fontWeight: '600' },
  });
}
