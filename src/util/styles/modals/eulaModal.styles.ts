import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root:          { flex: 1, backgroundColor: Colors.background },
    header:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
    title:         { fontSize: 20, fontWeight: '700', marginBottom: 4, color: Colors.text },
    subtitle:      { fontSize: 13, lineHeight: 18, color: Colors.textSecondary },
    scroll:        { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    heading:       { fontSize: 22, fontWeight: '800', marginBottom: 8, color: Colors.text },
    sectionTitle:  { fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 6, color: Colors.text },
    body:          { fontSize: 14, lineHeight: 22, color: Colors.textSecondary },
    linkRow:       { marginTop: 16 },
    link:          { fontSize: 14, fontWeight: '600', color: Colors.primary },
    footer:        { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.background },
    acceptBtn:     { borderRadius: 14, paddingVertical: 16, alignItems: 'center', backgroundColor: Colors.primary },
    acceptText:    { fontSize: 16, fontWeight: '700', color: Colors.white },
  });
}
