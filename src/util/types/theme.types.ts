import type { COLORS, SPACING, RADII, TYPOGRAPHY, THEME } from '../colors/colors';

export type ColorKey = keyof typeof COLORS;
export type ColorPalette = { [K in keyof typeof COLORS]: string };
export type ThemeMode = 'light' | 'dark';
export type SpacingKey = keyof typeof SPACING;
export type RadiusKey = keyof typeof RADII;
export type TypographyKey = keyof typeof TYPOGRAPHY;
export type Theme = typeof THEME;
