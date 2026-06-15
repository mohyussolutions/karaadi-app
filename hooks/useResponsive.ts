import { useWindowDimensions } from 'react-native';
import type { ResponsiveInfo } from '../util/types';

const TABLET_BREAKPOINT = 768;
const SIDEBAR_RATIO = 0.30;
const MAIN_RATIO = 0.70;
const ICON_GRID_COLS = 3;

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= TABLET_BREAKPOINT;
  const isMobileLandscape = !isTablet && isLandscape;
  const isTabletLandscape = isTablet && isLandscape;

  const sidebarWidth = isTabletLandscape ? Math.floor(width * SIDEBAR_RATIO) : 0;
  const mainWidth = isTabletLandscape ? Math.floor(width * MAIN_RATIO) : width;

  const numColumns = isTablet || isLandscape ? 3 : 2;
  const iconCols = ICON_GRID_COLS;

  function cardWidth(
    containerWidth = mainWidth,
    cols = numColumns,
    hPad = 12,
    gap = 8,
  ): number {
    return Math.floor((containerWidth - hPad * 2 - gap * (cols - 1)) / cols);
  }

  function gridCellWidth(cols = iconCols, hPad = 12, gap = 6): number {
    return Math.floor((width - hPad * 2 - gap * (cols - 1)) / cols);
  }

  return {
    width,
    height,
    isLandscape,
    isTablet,
    isMobileLandscape,
    isTabletLandscape,
    sidebarWidth,
    mainWidth,
    numColumns,
    cardWidth,
    iconCols,
    gridCellWidth,
  };
}
