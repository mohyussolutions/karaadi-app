import type { ColorPalette } from "../types";

const SHARED_COLORS = {
  primary: "#0063FB",
  primaryLight: "#60A5FA",
  primaryDark: "#0047B3",

  secondary: "#10B981",
  secondaryLight: "#6EE7B7",
  secondaryDark: "#065F46",

  success: "#22C55E",
  successDark: "#15803D",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  white: "#FFFFFF",
  black: "#000000",

  providerWaafi: "#1A6FB0",
  providerEvc: "#E53935",
  providerZaad: "#1976D2",
  providerSahal: "#388E3C",
  brandWhatsapp: "#25D366",
  brandFacebook: "#1877F2",
  brandInstagram: "#E1306C",
  overlay: "rgba(0,0,0,0.5)",

  textOnPrimary: "#FFFFFF",
  transparent: "transparent",

  premium: "#F59E0B",
  standard: "#3B82F6",

  blue600: "#2563EB",
  amber: "#FBBF24",
  errorTint: "rgba(239,68,68,0.18)",

  shadow: "#000000",
  shadow28: "rgba(0,0,0,0.28)",
  shadow32: "rgba(0,0,0,0.32)",
  shadow35: "rgba(0,0,0,0.35)",
  shadow40: "rgba(0,0,0,0.4)",
  shadow42: "rgba(0,0,0,0.42)",
  shadow45: "rgba(0,0,0,0.45)",
  shadow52: "rgba(0,0,0,0.52)",
  shadow55: "rgba(0,0,0,0.55)",
  shadow60: "rgba(0,0,0,0.6)",
  shadow80: "rgba(0,0,0,0.8)",
  shadow85: "rgba(0,0,0,0.85)",

  whiteAlpha15: "rgba(255,255,255,0.15)",
  whiteAlpha35: "rgba(255,255,255,0.35)",
  whiteAlpha50: "rgba(255,255,255,0.5)",
  whiteAlpha60: "rgba(255,255,255,0.6)",
  whiteAlpha80: "rgba(255,255,255,0.8)",

  favorite: "#FF3B5C",
  favoriteTint: "rgba(255,59,92,0.18)",
} as const;

export const COLORS = {
  ...SHARED_COLORS,

  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  background: "#FFFFFF",
  surface: "#F9FAFB",
  card: "#FFFFFF",
  brandTiktok: "#010101",

  text: "#111827",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#6B7280",
  textDisabled: "#9CA3AF",

  border: "#E5E7EB",
  inputBg: "#F9FAFB",
  placeholder: "#9CA3AF",

  basic: "#6B7280",

  catMarketplace: "#0063FB",
  catRealEstate: "#2563EB",
  catCars: "#B4232C",
  catMotorcycles: "#EA580C",
  catBoats: "#0891B2",
  catFarmEquipment: "#16A34A",
  catJobs: "#4B5563",

  primaryGhost: "#EFF6FF",
  blueTint: "#DBEAFE",

  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate500: "#64748B",
  slate900: "#0F172A",

  errorGhost: "#FEF2F2",
  successGhost: "#DCFCE7",
  warningGhost: "#FEF3C7",

  overlaySlate: "rgba(15,23,42,0.60)",

  toastBg: "#1E293B",
  toastText: "#F8FAFC",
  galleryBg: "#111111",

  tabBarSolid: "rgba(255,255,255,0.94)",
} as const;

export const DARK_COLORS = {
  ...SHARED_COLORS,

  gray50: "#131A2A",
  gray100: "#1F293D",
  gray200: "#2A3550",
  gray300: "#3A4763",
  gray400: "#6B7891",
  gray500: "#97A3B8",
  gray600: "#CBD3E1",
  gray700: "#E5E7EB",
  gray800: "#F3F4F6",
  gray900: "#F9FAFB",

  background: "#0D1220",
  surface: "#0D1220",
  card: "#182133",
  brandTiktok: "#F5F7FB",

  text: "#F5F7FB",
  textPrimary: "#F5F7FB",
  textSecondary: "#CBD3E1",
  textMuted: "#97A3B8",
  textDisabled: "#6B7891",

  border: "#2A3550",
  inputBg: "#1F293D",
  placeholder: "#6B7891",

  basic: "#9CA3AF",

  catMarketplace: "#4D94FF",
  catRealEstate: "#60A5FA",
  catCars: "#F0626B",
  catMotorcycles: "#FB923C",
  catBoats: "#22D3EE",
  catFarmEquipment: "#4ADE80",
  catJobs: "#9CA3AF",

  primaryGhost: "#1F293D",
  blueTint: "#2A3550",

  slate50: "#131A2A",
  slate100: "#1F293D",
  slate200: "#2A3550",
  slate300: "#3A4763",
  slate500: "#97A3B8",
  slate900: "#F1F5F9",

  errorGhost: "rgba(248,113,113,0.16)",
  successGhost: "rgba(34,197,94,0.16)",
  warningGhost: "rgba(245,158,11,0.16)",

  overlaySlate: "rgba(13,18,32,0.60)",

  toastBg: "#1F293D",
  toastText: "#F5F7FB",
  galleryBg: "#0D1220",

  tabBarSolid: "rgba(24,33,51,0.96)",
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

export const RADII = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 999,
} as const;

export const TYPOGRAPHY = {
  caption: { fontSize: 11, fontWeight: "500", lineHeight: 14 },
  body: { fontSize: 13, fontWeight: "500", lineHeight: 18 },
  bodyLarge: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  label: { fontSize: 12, fontWeight: "600", lineHeight: 16 },
  title: { fontSize: 16, fontWeight: "700", lineHeight: 22 },
  heading: { fontSize: 20, fontWeight: "700", lineHeight: 26 },
  display: { fontSize: 26, fontWeight: "800", lineHeight: 32 },
} as const;
