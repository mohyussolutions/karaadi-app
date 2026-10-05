import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';
import { H_PAD } from '../../../actions/constants';

export function createStyles(Colors: ColorPalette) {
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginHorizontal: H_PAD,
      marginTop: 4,
      marginBottom: 8,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
    },
    text: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  });
}
