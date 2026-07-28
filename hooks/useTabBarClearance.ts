import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { SPACING } from '../util/colors/theme';

export const TAB_BAR_ITEM_HEIGHT = 54;
export const TAB_BAR_GLASS_VERTICAL_PADDING = SPACING.xs * 2;
export const TAB_BAR_TOP_GAP = SPACING.xl;
export const TAB_BAR_HEIGHT = TAB_BAR_TOP_GAP + TAB_BAR_GLASS_VERTICAL_PADDING + TAB_BAR_ITEM_HEIGHT;

export function useTabBarClearance(extra = 0): number {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isNewAdFlow = pathname.startsWith('/(tabs)/new-ad') || pathname.startsWith('/new-ad');
  if (isNewAdFlow) return insets.bottom + extra;
  return insets.bottom + TAB_BAR_HEIGHT + extra;
}
