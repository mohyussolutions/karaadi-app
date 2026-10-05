import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { RADII } from '../../colors/colors';
import { createModalBase } from './modalBase.styles';

export const createStyles = (Colors: ColorPalette) => {
  const base = createModalBase(Colors);
  return StyleSheet.create({
    backdrop: base.backdrop,
    card: base.card,
    closeBtn: base.closeBtn,
    iconWrap: base.iconCircle,
    title: base.title,
    versionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: RADII.pill,
      marginBottom: 12,
      backgroundColor: Colors.primaryGhost,
    },
    versionOld: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
    versionNew: { fontSize: 13, fontWeight: '700', color: Colors.primary },
    message: base.message,
    actions: base.actions,
    updateBtn: base.primaryBtn,
    updateBtnDisabled: base.btnDisabled,
    updateBtnText: base.primaryBtnText,
  });
};
