import type { ColorPalette } from '../../../../components/hooks/useTheme';
import { REGEX_DIGITS } from '../../../../constants';

export function getPlanCardColors(Colors: ColorPalette) {
  return {
    popularBadge: Colors.gray700,
    unselectedBtn: Colors.gray900,
  } as const;
}

export function getPlanStyle(Colors: ColorPalette): Record<string, { color: string; icon: string; bg: string }> {
  return {
    basic:    { color: Colors.gray500, icon: 'shield-outline',  bg: Colors.gray100 },
    standard: { color: Colors.primary, icon: 'lightning-bolt', bg: Colors.primaryGhost },
    premium:  { color: Colors.premium, icon: 'star',           bg: Colors.premium + '15' },
  };
}

export function planStyle(plan: { key?: string }, Colors: ColorPalette) {
  const raw = plan.key || '';
  const k = raw.replace(REGEX_DIGITS, '').toLowerCase();
  const styles = getPlanStyle(Colors);
  return styles[k] || styles.basic;
}
