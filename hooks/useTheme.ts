import { useCallback, useMemo } from 'react';
import { Appearance, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setThemeMode } from '../store/slices/themeSlice';
import { LIGHT_COLORS, DARK_COLORS, type ColorPalette, type ThemeMode } from '../utils/colors';

export type { ThemeMode, ColorPalette };

export function useThemeMode() {
  const mode = useAppSelector((s) => s.theme.mode);
  const dispatch = useAppDispatch();

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeMode(newMode));
      Appearance.setColorScheme(newMode);
    },
    [dispatch],
  );

  return { mode, resolved: mode, setMode };
}

export function useThemeColors(): ColorPalette {
  const { resolved } = useThemeMode();
  return resolved === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ColorPalette) => T,
): T {
  const colors = useThemeColors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(colors), [colors]);
}
