export const COLORS = {
  primary: '#0063FB',
  primaryLight: '#60A5FA',
  primaryDark: '#0047B3',

  secondary: '#10B981',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#065F46',

  success: '#22C55E',
  successDark: '#15803D',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  white: '#FFFFFF',
  black: '#000000',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',

  text: '#111827',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  textDisabled: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  border: '#E5E7EB',
  inputBg: '#F9FAFB',
  placeholder: '#9CA3AF',
  transparent: 'transparent',

  premium: '#F59E0B',
  standard: '#3B82F6',
  basic: '#6B7280',

  hage: '#06069C',

  catMarketplace: '#9333EA',
  catRealEstate: '#2563EB',
  catCars: '#4F46E5',
  catMotorcycles: '#EA580C',
  catBoats: '#0891B2',
  catFarmEquipment: '#16A34A',
  catJobs: '#4B5563',

  primaryGhost: '#EFF6FF',
  blueTint: '#DBEAFE',
  blue600: '#2563EB',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate500: '#64748B',
  slate900: '#0F172A',

  amber: '#FBBF24',
  errorGhost: '#FEF2F2',

  shadow: '#000000',
  shadow28: 'rgba(0,0,0,0.28)',
  shadow32: 'rgba(0,0,0,0.32)',
  shadow35: 'rgba(0,0,0,0.35)',
  shadow45: 'rgba(0,0,0,0.45)',
  shadow52: 'rgba(0,0,0,0.52)',
  shadow55: 'rgba(0,0,0,0.55)',
  shadow80: 'rgba(0,0,0,0.8)',
  overlaySlate: 'rgba(15,23,42,0.60)',

  toastBg: '#1E293B',
  toastText: '#F8FAFC',
  galleryBg: '#111111',

  whiteAlpha15: 'rgba(255,255,255,0.15)',
  whiteAlpha35: 'rgba(255,255,255,0.35)',
  tabBarSolid: 'rgba(255,255,255,0.94)',

  favorite: '#FF3B5C',
  favoriteTint: 'rgba(255,59,92,0.18)',
} as const;

export type ColorKey = keyof typeof COLORS;
export type ColorPalette = { [K in keyof typeof COLORS]: string };
export type ThemeMode = 'light' | 'dark';

export const Colors = COLORS;

export const LIGHT_COLORS = COLORS;

export const DARK_COLORS = {
  primary: '#0063FB',
  primaryLight: '#60A5FA',
  primaryDark: '#0047B3',

  secondary: '#10B981',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#065F46',

  success: '#22C55E',
  successDark: '#15803D',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  white: '#FFFFFF',
  black: '#000000',

  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',

  background: '#0B0F19',
  surface: '#111827',
  card: '#1E293B',
  overlay: 'rgba(0,0,0,0.5)',

  text: '#F9FAFB',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textDisabled: '#6B7280',
  textOnPrimary: '#FFFFFF',

  border: '#2D3748',
  inputBg: '#1F2937',
  placeholder: '#6B7280',
  transparent: 'transparent',

  premium: '#F59E0B',
  standard: '#3B82F6',
  basic: '#9CA3AF',

  hage: '#4338CA',

  catMarketplace: '#C084FC',
  catRealEstate: '#60A5FA',
  catCars: '#818CF8',
  catMotorcycles: '#FB923C',
  catBoats: '#22D3EE',
  catFarmEquipment: '#4ADE80',
  catJobs: '#9CA3AF',

  primaryGhost: 'rgba(59,130,246,0.16)',
  blueTint: 'rgba(96,165,250,0.20)',
  blue600: '#2563EB',

  slate50: '#0F172A',
  slate100: '#1E293B',
  slate200: '#334155',
  slate300: '#475569',
  slate500: '#94A3B8',
  slate900: '#F1F5F9',

  amber: '#FBBF24',
  errorGhost: 'rgba(248,113,113,0.16)',

  shadow: '#000000',
  shadow28: 'rgba(0,0,0,0.28)',
  shadow32: 'rgba(0,0,0,0.32)',
  shadow35: 'rgba(0,0,0,0.35)',
  shadow45: 'rgba(0,0,0,0.45)',
  shadow52: 'rgba(0,0,0,0.52)',
  shadow55: 'rgba(0,0,0,0.55)',
  shadow80: 'rgba(0,0,0,0.8)',
  overlaySlate: 'rgba(15,23,42,0.60)',

  toastBg: '#1E293B',
  toastText: '#F8FAFC',
  galleryBg: '#111111',

  whiteAlpha15: 'rgba(255,255,255,0.15)',
  whiteAlpha35: 'rgba(255,255,255,0.35)',
  tabBarSolid: 'rgba(30,41,59,0.94)',

  favorite: '#FF3B5C',
  favoriteTint: 'rgba(255,59,92,0.18)',
} as const satisfies ColorPalette;

export const CAT_COLORS = {
  marketplace: COLORS.catMarketplace,
  realEstate: COLORS.catRealEstate,
  cars: COLORS.catCars,
  motorcycles: COLORS.catMotorcycles,
  boats: COLORS.catBoats,
  farmEquipment: COLORS.catFarmEquipment,
  jobs: COLORS.catJobs,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export type SpacingKey = keyof typeof SPACING;

export const RADII = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof RADII;

export const TYPOGRAPHY = {
  caption: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
  body: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  bodyLarge: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  title: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  heading: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  display: { fontSize: 26, fontWeight: '800', lineHeight: 32 },
} as const;

export type TypographyKey = keyof typeof TYPOGRAPHY;

export const THEME = {
  colors: COLORS,
  catColors: CAT_COLORS,
  spacing: SPACING,
  radii: RADII,
  typography: TYPOGRAPHY,
} as const;

export type Theme = typeof THEME;

export default THEME;
