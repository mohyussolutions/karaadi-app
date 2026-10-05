import { useCallback } from 'react';
import { Appearance, Platform, StyleSheet } from 'react-native';

import { MAX_STYLE_VARIANTS } from '../../actions/constants';
import { selectThemeMode, setThemeMode } from '../../store/slices/themeSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { COLORS, DARK_COLORS } from '../../utils/colors/colors';
import type { StyleFactory, ThemeMode } from '../../utils/types';

export const useThemeMode = () => {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeMode(newMode));
      if (Platform.OS !== 'web') {
        Appearance.setColorScheme(newMode);
      }
    },
    [dispatch],
  );

  return { mode, resolved: mode, setMode };
};

export const useThemeColors = () => (useThemeMode().resolved === 'dark' ? DARK_COLORS : COLORS);

const styleCache = new WeakMap<object, Map<string, unknown>>();

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>, A extends unknown[]>(
  factory: StyleFactory<T, A>,
  ...args: A
): T => {
  const colors = useThemeColors();
  const key = `${colors === DARK_COLORS ? 'd' : 'l'}|${args.join('|')}`;

  let variants = styleCache.get(factory);
  if (!variants) {
    variants = new Map();
    styleCache.set(factory, variants);
  }

  let styles = variants.get(key) as T | undefined;
  if (!styles) {
    if (variants.size >= MAX_STYLE_VARIANTS) variants.clear();
    styles = factory(colors, ...args);
    variants.set(key, styles);
  }
  return styles;
};
