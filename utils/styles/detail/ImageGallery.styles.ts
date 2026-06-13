import { Dimensions, StyleSheet, Platform } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';

const { width } = Dimensions.get('window');

export const IMG_H = Math.round(width * 0.88);

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    wrapper: { backgroundColor: Colors.galleryBg },
    image: { width, height: IMG_H },
    arrow: {
      position: 'absolute',
      top: IMG_H / 2 - 22,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: Colors.shadow32,
      alignItems: 'center', justifyContent: 'center',
    },
    arrowL: { left: 10 },
    arrowR: { right: 10 },
    arrowText: { color: Colors.white, fontSize: 28, lineHeight: 32, marginTop: -2 },
    topLeft: {
      position: 'absolute', left: 12,
      gap: 8, alignItems: 'flex-start',
    },
    counter: {
      backgroundColor: Colors.shadow45,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    },
    counterText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
    badge: {
      borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    },
    badgeText: { color: Colors.white, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    rightActions: {
      position: 'absolute', right: 12,
      gap: 10,
    },
    actionBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: Colors.overlay,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: Colors.shadow, shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
    },
    soldOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.shadow45,
      alignItems: 'center', justifyContent: 'center',
    },
    soldText: { color: Colors.white, fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    dotsOverlay: {
      position: 'absolute', bottom: 56, alignSelf: 'center',
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: Colors.shadow32,
      borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.whiteAlpha35 },
    dotActive: { width: 18, backgroundColor: Colors.white, borderRadius: 3 },
    thumbStrip: { paddingHorizontal: 10, paddingBottom: 10, paddingTop: 6, gap: 6, backgroundColor: Colors.galleryBg },
    thumb: {
      width: 60, height: 60, borderRadius: 8,
      borderWidth: 2, borderColor: 'transparent', opacity: 0.6,
    },
    thumbActive: { borderColor: Colors.info, opacity: 1 },
  });
}

export function createSheetStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Colors.shadow45,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: Colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: Platform.OS === 'ios' ? 36 : 24,
      gap: 10,
    },
    handle: {
      width: 40, height: 4, borderRadius: 2,
      backgroundColor: Colors.border,
      alignSelf: 'center',
      marginBottom: 8,
    },
    iconRow: { alignItems: 'center', paddingTop: 4 },
    title: {
      fontSize: 20, fontWeight: '800', color: Colors.textPrimary,
      textAlign: 'center',
    },
    sub: {
      fontSize: 14, color: Colors.textSecondary,
      textAlign: 'center', lineHeight: 20,
    },
    confirmBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: Colors.primary,
      borderRadius: 14, paddingVertical: 15, marginTop: 6,
    },
    confirmText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
    cancelBtn: {
      alignItems: 'center', paddingVertical: 12,
    },
    cancelText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  });
}
