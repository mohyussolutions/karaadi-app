import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../components/hooks/useTheme';
import { shadow } from '../../shadow';
import { createCommonStyles } from '../common/common.style';

export function createPlanCardStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: Colors.card, borderRadius: 16,
      borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 4 }, opacity: 0.08, radius: 10, elevation: 3 }),
    },
    cardRecommended: {
      borderColor: Colors.primary, borderWidth: 1.5,
    },
    stripe: { height: 4 },
    badge: {
      position: 'absolute', top: 10, right: 0,
      flexDirection: 'row', alignItems: 'center', gap: 3,
      paddingHorizontal: 8, paddingVertical: 3,
      borderTopLeftRadius: 8, borderBottomLeftRadius: 8,
    },
    badgeText: { fontSize: 9, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
    inner: { padding: 12 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    meta: { flex: 1 },
    name: { fontSize: 16, fontWeight: '800' },
    dur: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    exp: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
    priceBox: { alignItems: 'flex-end' },
    price: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
    priceSub: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray100, marginBottom: 10 },
    features: { gap: 7, marginBottom: 10 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkCircle: {
      width: 16, height: 16, borderRadius: 8,
      backgroundColor: Colors.success + '15', alignItems: 'center', justifyContent: 'center',
    },
    featureText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
    btn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 10, borderRadius: 10,
    },
    btnText: { fontSize: 12, fontWeight: '800', color: Colors.white, letterSpacing: 0.3 },
  });
}

export function createStyles(Colors: ColorPalette) {
  const common = createCommonStyles(Colors);
  return StyleSheet.create({
    root: common.safeBase,

    topBar: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 8,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
    },

    scroll: { padding: 16, flexGrow: 1 },

    header: { alignItems: 'center', marginBottom: 20, gap: 6 },
    headerIcon: {
      width: 52, height: 52, borderRadius: 16,
      backgroundColor: Colors.primaryGhost,
      alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
    sub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

    cardsCol: { gap: 10 },

    footer: {
      position: 'absolute', left: 0, right: 0,
      paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16,
      backgroundColor: Colors.card,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      borderWidth: 1, borderColor: Colors.border, borderBottomWidth: 0,
      ...shadow({ color: Colors.black, offset: { width: 0, height: -4 }, opacity: 0.08, radius: 16, elevation: 8 }),
    },
    footerHandle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 12,
    },
    continueBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
      gap: 6, backgroundColor: Colors.primary, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20,
    },
    continueBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
    continueBtnOff: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', gap: 6,
      borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20,
      backgroundColor: Colors.gray100,
    },
    continueBtnOffText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  });
}
