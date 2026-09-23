import type { COLORS } from '../colors/colors';
export type ColorPalette = { [K in keyof typeof COLORS]: string };
export type ThemeMode = 'light' | 'dark';
