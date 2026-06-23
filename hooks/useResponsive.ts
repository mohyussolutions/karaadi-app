import { useGlobal } from './useGlobal';
import type { ResponsiveInfo } from '../util/types';

export function useResponsive(): ResponsiveInfo {
  const g = useGlobal();

  return {
    width:             g.width,
    height:            g.height,
    isLandscape:       g.isLandscape,
    isTablet:          g.isTablet,
    isMobileLandscape: g.isMobileLandscape,
    isTabletLandscape: g.isTabletLandscape,
    sidebarWidth:      g.sidebarWidth,
    mainWidth:         g.mainWidth,
    numColumns:        g.numColumns,
    cardWidth:         (cw, cols, hPad, gap) => g.cardWInContainer(cw ?? g.mainWidth, cols, hPad, gap),
    iconCols:          3,
    gridCellWidth:     (cols = 3, hPad = 12, gap = 6) =>
      Math.floor((g.width - hPad * 2 - gap * (cols - 1)) / cols),
  };
}
