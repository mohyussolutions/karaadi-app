import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../../hooks/useTheme';
import { shadow } from '../../shadow';

export function createStyles(Colors: ColorPalette, width = 390) {
  const CARD_W = width * 0.42;
  const CARD_H = CARD_W * 0.75;
  return StyleSheet.create({
    wrap: {
      marginTop: 24,
      marginBottom: 8,
    },
    heading: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.textPrimary,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    list: {
      paddingHorizontal: 16,
      gap: 10,
    },
    card: {
      width: CARD_W,
      backgroundColor: Colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      ...shadow({ color: Colors.shadow, offset: { width: 0, height: 2 }, opacity: 0.08, radius: 6, elevation: 3 }),
      borderWidth: 1,
      borderColor: Colors.gray100,
    },
    img: {
      width: CARD_W,
      height: CARD_H,
      backgroundColor: Colors.gray100,
    },
    info: {
      padding: 8,
      gap: 2,
    },
    cardTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.textPrimary,
      lineHeight: 16,
    },
    price: {
      fontSize: 13,
      fontWeight: '800',
      color: Colors.primary,
      marginTop: 2,
    },
    loc: {
      fontSize: 10,
      color: Colors.textMuted,
      marginTop: 1,
    },
  });
}
