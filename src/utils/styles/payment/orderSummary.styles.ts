import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

const PAGE_PAD = 20;

export const createStyles = (Colors: ColorPalette, width = 390) => {
  const imageHeight = Math.round((width - PAGE_PAD * 2) * 0.62);
  return StyleSheet.create({
    gallery: { height: imageHeight, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surface, marginBottom: 20 },
    galleryImage: { width: '100%', height: '100%' },
    galleryEmpty: { height: imageHeight, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'flex-end', padding: 16, marginBottom: 20 },
    galleryEmptyText: { fontSize: 13, color: Colors.textMuted },
    arrow: {
      position: 'absolute',
      top: '50%',
      marginTop: -18,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.shadow45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowLeft: { left: 10 },
    arrowRight: { right: 10 },
    counter: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      backgroundColor: Colors.shadow45,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    counterText: { fontSize: 12, fontWeight: '700', color: Colors.white, fontVariant: ['tabular-nums'] },
    listingTitle: { fontSize: 22, lineHeight: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
    listingMeta: { fontSize: 14, color: Colors.textMuted, marginTop: 6, marginBottom: 28 },
    description: { fontSize: 15, lineHeight: 23, color: Colors.textSecondary, marginTop: 10 },
  });
};
