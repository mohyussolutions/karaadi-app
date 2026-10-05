import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createModalBase } from './modalBase.styles';

export const createStyles = (Colors: ColorPalette) => {
  const base = createModalBase(Colors);
  return StyleSheet.create({
    backdrop: base.backdrop,
    card: base.card,
    title: base.title,
    message: base.message,
    actions: base.actions,
    actionBtn: base.secondaryBtn,
    actionBtnPrimary: base.primaryBtn,
    actionBtnDestructive: base.destructiveBtn,
    actionText: base.secondaryBtnText,
    actionTextFilled: base.primaryBtnText,
  });
};
