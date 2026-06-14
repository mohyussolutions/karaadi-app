import { StyleSheet } from 'react-native';
import { RADII, SPACING, type ColorPalette } from '../../theme';

export const createLayoutStyles = (Colors: ColorPalette) => StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  barClip: {
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.tabBarOverlay,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  item: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});
