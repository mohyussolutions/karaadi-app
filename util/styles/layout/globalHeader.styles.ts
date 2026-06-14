import { Platform, StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrapper: {
      backgroundColor: Colors.card,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backSlot: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
    logo: { width: 110, height: 40, borderRadius: 16, overflow: 'hidden' },
    langBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 3,
      backgroundColor: Colors.hage, borderRadius: 8,
      paddingHorizontal: 10, paddingVertical: 5, minWidth: 44,
    },
    langText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      marginHorizontal: 12, marginBottom: 10,
      paddingHorizontal: 12, paddingVertical: 10,
      backgroundColor: Colors.inputBg, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
    },
    searchInput: { fontSize: 13, color: Colors.textPrimary, flex: 1, padding: 0 },

    rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    themeSwitch: { transform: [{ scale: Platform.OS === 'android' ? 1.2 : 0.85 }] },
    notifBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: Colors.primaryGhost, alignItems: 'center', justifyContent: 'center',
      marginLeft: 8,
    },
    notifBadge: {
      position: 'absolute', top: 2, right: 2,
      minWidth: 18, height: 18, borderRadius: 9,
      backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 3, borderWidth: 2, borderColor: Colors.card,
    },
    notifBadgeText: { color: Colors.white, fontSize: 10, fontWeight: '800' },

    langOverlay: { flex: 1 },
    langDropdown: {
      position: 'absolute', right: 12,
      backgroundColor: Colors.card, borderRadius: 10,
      borderWidth: 1, borderColor: Colors.border,
      shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12, shadowRadius: 8, elevation: 8,
      minWidth: 140, overflow: 'hidden',
    },
    langOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 14, paddingVertical: 12, gap: 8,
    },
    langOptionActive: { backgroundColor: Colors.primaryGhost },
    langOptionText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
    langOptionTextActive: { color: Colors.primary, fontWeight: '700' },

  });
}
