import { useResponsive } from './useResponsive';
import {
  PLAN_COMPACT_MAX_WIDTH,
  PLAN_GRID_GAP,
  PLAN_SCROLL_PADDING,
  PLAN_WIDE_MAX_WIDTH,
} from '../util/styles/newAd/stepPlan.styles';

export function usePlanLayout() {
  const { width, mainWidth, isTablet, isMobileLandscape } = useResponsive();
  const wide = isTablet || isMobileLandscape;
  const compact = !wide && width < PLAN_COMPACT_MAX_WIDTH;
  const gridCardWidth = wide
    ? Math.floor(
        (Math.min(mainWidth - PLAN_SCROLL_PADDING * 2, PLAN_WIDE_MAX_WIDTH) - PLAN_GRID_GAP) / 2,
      )
    : undefined;
  return { wide, compact, gridCardWidth };
}
