import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root:          { flex: 1 },
  header:        { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1 },
  title:         { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle:      { fontSize: 13, lineHeight: 18 },
  scroll:        { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  heading:       { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sectionTitle:  { fontSize: 15, fontWeight: '700', marginTop: 24, marginBottom: 6 },
  body:          { fontSize: 14, lineHeight: 22 },
  linkRow:       { marginTop: 16 },
  link:          { fontSize: 14, fontWeight: '600' },
  footer:        { padding: 20, borderTopWidth: 1 },
  acceptBtn:     { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  acceptText:    { fontSize: 16, fontWeight: '700' },
});
