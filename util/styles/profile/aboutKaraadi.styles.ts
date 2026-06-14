import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16 },
    header: { marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 6 },
    subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    iconBg: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary + '18',
    },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    cardHint: { fontSize: 12, color: Colors.textMuted },
  });
}

export function createDetailStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 16, paddingBottom: 32 },
    title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8 },
    lead: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
    sectionHeading: {
      fontSize: 16, fontWeight: '700', color: Colors.text,
      marginTop: 16, marginBottom: 8,
    },
    body: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
    bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    bulletDot: {
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: Colors.primary, marginTop: 7,
    },
    bulletText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
    contactRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: Colors.card, borderRadius: 12, padding: 16,
      marginTop: 12, borderWidth: 1, borderColor: Colors.border,
    },
    contactIconBg: {
      width: 44, height: 44, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary + '18',
    },
    contactBody: { flex: 1 },
    contactLabel: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    contactValue: { fontSize: 13, color: Colors.textMuted },
  });
}
