import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BP_SMALL, BP_TABLET, TAB_BAR_HEIGHT, NEW_AD_ROUTES } from '../../actions/constants';

import type { ResponsiveInfo } from '../../utils/types';

export const useGlobal = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isSmall = width < BP_SMALL;
    const isTablet = width >= BP_TABLET;
    const isLandscape = width > height;
    const isTabletLandscape = isTablet && isLandscape;
    const isMobileLandscape = !isTablet && isLandscape;
    const sidebarWidth = isTabletLandscape ? Math.floor(width * 0.3) : 0;
    const mainWidth = isTabletLandscape ? Math.floor(width * 0.7) : width;
    const numColumns = isTablet || isLandscape ? 3 : 2;
    const logoDimensions = {
      width: isTablet ? 150 : isSmall ? 86 : 110,
      height: isTablet ? 54 : 40,
    };

    return {
      width,
      height,
      isTablet,
      isLandscape,
      isTabletLandscape,
      isMobileLandscape,
      sidebarWidth,
      mainWidth,
      numColumns,
      imgH: () => Math.round(width * 0.88),
      twoColCardW: (hPad = 14, gap = 10) => Math.floor((width - hPad * 2 - gap) / 2),
      cardWInContainer: (containerWidth: number, cols = numColumns, hPad = 12, gap = 8) =>
        Math.floor((containerWidth - hPad * 2 - gap * (cols - 1)) / cols),
      tabBarSide: () => (isSmall ? 12 : 24),
      logoSize: () => logoDimensions,
    };
  }, [width, height]);
};

export const useResponsive = (): ResponsiveInfo => {
  const layout = useGlobal();

  return useMemo(
    () => ({
      width: layout.width,
      height: layout.height,
      isLandscape: layout.isLandscape,
      isTablet: layout.isTablet,
      isMobileLandscape: layout.isMobileLandscape,
      isTabletLandscape: layout.isTabletLandscape,
      sidebarWidth: layout.sidebarWidth,
      mainWidth: layout.mainWidth,
      numColumns: layout.numColumns,
      cardWidth: (containerWidth, cols, hPad, gap) =>
        layout.cardWInContainer(containerWidth ?? layout.mainWidth, cols, hPad, gap),
      iconCols: 3,
      gridCellWidth: (cols = 3, hPad = 12, gap = 6) => Math.floor((layout.width - hPad * 2 - gap * (cols - 1)) / cols),
    }),
    [layout],
  );
};

export const useTabBarClearance = (extra = 0): number => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isNewAdFlow = NEW_AD_ROUTES.some((route) => pathname.startsWith(route));
  if (isNewAdFlow) return insets.bottom + extra;
  return insets.bottom + TAB_BAR_HEIGHT + extra;
};
