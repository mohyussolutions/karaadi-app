import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    center: { flex: 1 },
    header: {
      backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    tabletHeader: { alignSelf: 'center', width: '100%', maxWidth: 700 },
    tabletList: { alignSelf: 'center', width: '100%', maxWidth: 700 },
    title: { fontSize: 20, fontWeight: '800', color: Colors.text },
    convoItem: {
      flexDirection: 'row', alignItems: 'center', padding: 16,
      backgroundColor: Colors.card, gap: 12,
    },
    convoUnread: { backgroundColor: Colors.primaryLight + '40' },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border },
    convoInfo: { flex: 1 },
    convoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    convoName: { fontSize: 15, color: Colors.text, fontWeight: '500' },
    convoTime: { fontSize: 12, color: Colors.textMuted },
    convoMsg: { fontSize: 13, color: Colors.textSecondary },
    bold: { fontWeight: '700', color: Colors.text },
    badge: {
      backgroundColor: Colors.primary, borderRadius: 10,
      paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
    separator: { height: 1, backgroundColor: Colors.border },
    listFlex: { flex: 1 },
    listPadded: { paddingBottom: 120 },
  });
}
