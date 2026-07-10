import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createPlanCardStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card, borderRadius: 20,
      borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
    },
    stripe: { height: 5 },
    badge: {
      position: 'absolute', top: 14, right: 0,
      flexDirection: 'row', alignItems: 'center', gap: 3,
      paddingHorizontal: 10, paddingVertical: 4,
      borderTopLeftRadius: 8, borderBottomLeftRadius: 8,
    },
    badgeText: { fontSize: 10, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
    inner: { padding: 16 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
    iconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    meta: { flex: 1 },
    name: { fontSize: 17, fontWeight: '800' },
    dur: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    exp: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    priceBox: { alignItems: 'flex-end' },
    price: { fontSize: 28, fontWeight: '900', lineHeight: 30 },
    priceSub: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray100, marginBottom: 14 },
    features: { gap: 10, marginBottom: 16 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    checkCircle: {
      width: 20, height: 20, borderRadius: 10,
      backgroundColor: Colors.success + '15', alignItems: 'center', justifyContent: 'center',
    },
    featureText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
    btn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 13, borderRadius: 12,
    },
    btnText: { fontSize: 13, fontWeight: '800', color: Colors.white, letterSpacing: 0.4 },
  });
}

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },

    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 12, paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
      backgroundColor: Colors.card,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 10,
      backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
    },
    topBarTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    topBarSpacer: { width: 36 },

    scroll: { padding: 16, flexGrow: 1 },
    loadingIndicator: { marginTop: 48 },
    bottomSpacer: { height: 100 },

    header: { alignItems: 'center', marginBottom: 20, gap: 6 },
    headerIcon: {
      width: 52, height: 52, borderRadius: 16,
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
    sub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

    cards: { gap: 14 },

    footer: {
      position: 'absolute', left: 0, right: 0,
      padding: 16, backgroundColor: Colors.card,
      borderTopWidth: 1, borderTopColor: Colors.border,
      ...shadow({ color: Colors.black, offset: { width: 0, height: -2 }, opacity: 0.06, radius: 8, elevation: 4 }),
    },
    continueBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16,
      ...shadow({ color: Colors.primary, offset: { width: 0, height: 4 }, opacity: 0.3, radius: 8, elevation: 5 }),
    },
    continueBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
    continueBtnOff: {
      borderRadius: 14, paddingVertical: 16,
      backgroundColor: Colors.gray100, alignItems: 'center',
    },
    continueBtnOffText: { fontSize: 15, fontWeight: '600', color: Colors.textMuted },
  });
}
