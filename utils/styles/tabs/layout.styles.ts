import { StyleSheet } from 'react-native';
import { RADII, SPACING, type ColorPalette } from '../../theme';

export const createLayoutStyles = (Colors: ColorPalette) => StyleSheet.create({
  wrapper: { backgroundColor: Colors.background },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tabBarOverlay,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.xs,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    height: 40,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
