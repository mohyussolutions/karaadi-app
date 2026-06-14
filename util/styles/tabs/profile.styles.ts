import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    tabletInner: { alignSelf: 'center', width: '100%', maxWidth: 600 },
    header: {
      backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
    profileCard: {
      backgroundColor: Colors.card, alignItems: 'center', padding: 24,
      marginBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.border, marginBottom: 12 },
    username: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 4 },
    email: { fontSize: 14, color: Colors.textSecondary },
    phone: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
    menuGrid: {
      flexDirection: 'row', flexWrap: 'wrap', gap: 10,
      paddingHorizontal: 12, paddingBottom: 12,
    },
    card: {
      width: '31%', backgroundColor: Colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: Colors.border, padding: 12, gap: 6,
      minHeight: 112,
    },
    cardIconBg: {
      width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary + '18',
    },
    cardLabel: { fontSize: 13, fontWeight: '700', color: Colors.text },
    cardDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 14 },
    logoutBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.card, paddingVertical: 15, gap: 8, marginBottom: 8,
    },
    logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
    guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
    guestTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
    guestSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
    signInBtn: {
      backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
      paddingHorizontal: 48, marginTop: 8,
    },
    signInText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
    registerBtn: {
      borderWidth: 2, borderColor: Colors.primary, borderRadius: 12,
      paddingVertical: 12, paddingHorizontal: 48,
    },
    registerText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
    bottomSpacer: { height: 32 },
  });
}
