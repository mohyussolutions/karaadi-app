import type { ColorPalette, PlanKeyRef, PlanStyleMap } from '../../../../../../utils/types';
import { REGEX_DIGITS } from '../../../../../../actions/constants';

export function getPlanCardColors(Colors: ColorPalette) {
  return {
    popularBadge: Colors.gray700,
  } as const;
}

function getPlanStyle(Colors: ColorPalette): PlanStyleMap {
  return {
    basic:    { color: Colors.gray500, icon: 'shield-outline',  bg: Colors.gray100 },
    standard: { color: Colors.primary, icon: 'lightning-bolt', bg: Colors.primaryGhost },
    premium:  { color: Colors.premium, icon: 'star',           bg: Colors.premium + '15' },
  };
}

export function planStyle(plan: PlanKeyRef, Colors: ColorPalette) {
  const raw = plan.key || '';
  const k = raw.replace(REGEX_DIGITS, '').toLowerCase();
  const styles = getPlanStyle(Colors);
  return styles[k] || styles.basic;
}
