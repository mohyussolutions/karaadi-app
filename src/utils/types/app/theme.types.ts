import type { COLORS } from '../../colors/colors';

export interface ShadowParams {
  color: string;
  offset?: { width: number; height: number };
  opacity: number;
  radius: number;
  elevation: number;
}

export type ColorPalette = { [K in keyof typeof COLORS]: string };

export type ThemeMode = 'light' | 'dark';

export type ColorKey = keyof typeof COLORS;

export type ColorKeyMap = Record<string, ColorKey>;
export type StatusColorKey = 'success' | 'primary' | 'error' | 'textMuted';
export type StatusColorMap = Record<string, StatusColorKey>;
export type VerticalMarginKey = 'marginBottom' | 'marginTop';
export type HeavyFontWeight = '700' | '800';
export type StyleFactory<T, A extends unknown[]> = (c: ColorPalette, ...args: A) => T;
