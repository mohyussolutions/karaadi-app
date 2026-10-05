import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createModalBase } from './modalBase.styles';

export const createStyles = (Colors: ColorPalette) => {
  const base = createModalBase(Colors);
  return StyleSheet.create({
    backdrop: base.backdrop,
    card: base.card,
    iconWrap: base.iconCircle,
    title: base.title,
    body: base.message,
    link: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.primary,
      marginTop: 12,
      textDecorationLine: 'underline',
    },
    actions: base.actions,
    acceptBtn: base.primaryBtn,
    acceptText: base.primaryBtnText,
    declineBtn: base.secondaryBtn,
    declineText: base.secondaryBtnText,
  });
};
