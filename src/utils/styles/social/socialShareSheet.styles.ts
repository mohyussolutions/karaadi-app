import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { createModalBase } from '../modals/modalBase.styles';

export function createStyles(Colors: ColorPalette) {
  const base = createModalBase(Colors);
  return StyleSheet.create({
    backdrop: base.sheetBackdrop,
    sheet: { ...base.sheet, paddingHorizontal: 24, paddingBottom: 8 },
    handle: { ...base.handle, marginBottom: 16 },
    heading: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.textPrimary,
      textAlign: 'center',
      marginBottom: 4,
    },
    sub: {
      fontSize: 12,
      color: Colors.textMuted,
      textAlign: 'center',
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    item: {
      alignItems: 'center',
      gap: 8,
      minWidth: 56,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 11,
      color: Colors.textPrimary,
      fontWeight: '500',
    },
    cancelBtn: {
      backgroundColor: Colors.gray100,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 8,
    },
    cancelText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.textPrimary,
    },
  });
}
