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
      backgroundColor: Colors.card, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
      marginBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.border, marginBottom: 8 },
    username: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 2 },
    email: { fontSize: 13, color: Colors.textSecondary },
    phone: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
    menuGrid: {
      paddingHorizontal: 16, paddingVertical: 4,
    },
    card: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 12, gap: 14,
      borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    cardIconBg: {
      width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
      backgroundColor: Colors.primary + '15',
    },
    cardContent: { flex: 1 },
    cardLabel: { fontSize: 14, fontWeight: '500', color: Colors.text },
    cardDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 16 },
    cardChevron: { opacity: 0.3 },
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
