import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    markAllBtn: {
      backgroundColor: Colors.card, padding: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    markAllText: { color: Colors.primary, fontWeight: '600', fontSize: 14, textAlign: 'right' },
    list: { flexGrow: 1 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card, padding: 16 },
    unread: { backgroundColor: Colors.primaryLight + '25' },
    iconBg: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
    iconBgUnread: { backgroundColor: Colors.primaryLight },
    itemContent: { flex: 1 },
    itemTitle: { fontSize: 14, color: Colors.text, fontWeight: '500', marginBottom: 2 },
    itemTitleBold: { fontWeight: '700' },
    itemBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
    itemDate: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
    dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary },
    separator: { height: 1, backgroundColor: Colors.border },
  });
}
