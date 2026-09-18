import { useCallback } from "react";
import { Appearance, Platform, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setThemeMode } from "../store/slices/themeSlice";
import {
  LIGHT_COLORS,
  DARK_COLORS,
  type ColorPalette,
  type ThemeMode,
} from "../util/colors/colors";

export type { ThemeMode, ColorPalette };

export function useThemeMode() {
  const mode = useAppSelector((s) => s.theme.mode);
  const dispatch = useAppDispatch();

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      dispatch(setThemeMode(newMode));
      if (Platform.OS !== "web") {
        Appearance.setColorScheme(newMode);
      }
    },
    [dispatch],
  );

  return { mode, resolved: mode, setMode };
}

export function useThemeColors() {
  return useThemeMode().resolved === "dark" ? DARK_COLORS : LIGHT_COLORS;
}

const styleCache = new WeakMap<object, Map<string, unknown>>();
const MAX_STYLE_VARIANTS = 24;

export function useThemedStyles<
  T extends StyleSheet.NamedStyles<T>,
  A extends unknown[],
>(factory: (c: ColorPalette, ...args: A) => T, ...args: A): T {
  const colors = useThemeColors();
  const key = `${colors === DARK_COLORS ? "d" : "l"}|${args.join("|")}`;

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
}
