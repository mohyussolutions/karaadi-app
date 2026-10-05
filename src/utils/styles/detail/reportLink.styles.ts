import { StyleSheet } from 'react-native';
import type { ColorPalette } from '../../types';

export const createStyles = (Colors: ColorPalette) => StyleSheet.create({
  wrapper: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderColor: Colors.error + '40',
    backgroundColor: Colors.error + '0D',
  },
  btnPrimary: {
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primary + '0D',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  labelPrimary: { color: Colors.primary },
});
