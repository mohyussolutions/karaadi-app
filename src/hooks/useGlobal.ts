import { useWindowDimensions } from 'react-native';
import { BP_SMALL, BP_TABLET } from '../util/styles/common/common.style';

export function useGlobal() {
  const { width, height } = useWindowDimensions();

  const isSmall           = width < BP_SMALL;
  const isTablet          = width >= BP_TABLET;
  const isLandscape       = width > height;
  const isTabletLandscape = isTablet && isLandscape;
  const isMobileLandscape = !isTablet && isLandscape;

  const sidebarWidth = isTabletLandscape ? Math.floor(width * 0.30) : 0;
  const mainWidth    = isTabletLandscape ? Math.floor(width * 0.70) : width;
  const numColumns   = isTablet || isLandscape ? 3 : 2;

  function pick<T>(small: T, normal: T): T {
    return isSmall ? small : normal;
  }

  function imgH(): number {
    return Math.round(width * 0.88);
  }

  function cardW(cols = numColumns, hPad = 12, gap = 8): number {
    return Math.floor((width - hPad * 2 - gap * (cols - 1)) / cols);
  }

  function twoColCardW(hPad = 14, gap = 10): number {
    return Math.floor((width - hPad * 2 - gap) / 2);
  }

  function cardWInContainer(containerWidth: number, cols = numColumns, hPad = 12, gap = 8): number {
    return Math.floor((containerWidth - hPad * 2 - gap * (cols - 1)) / cols);
  }

  function tabBarSide(): number {
    return isSmall ? 12 : 24;
  }

  function logoW(): number {
    return isTablet ? 150 : isSmall ? 86 : 110;
  }

  function fontSize(base: number): number {
    if (isSmall)  return Math.max(base - 2, 10);
    if (isTablet) return base + 2;
    return base;
  }

  return {
    width,
    height,
    isSmall,
    isTablet,
    isLandscape,
    isTabletLandscape,
    isMobileLandscape,
    sidebarWidth,
    mainWidth,
    numColumns,
    pick,
    imgH,
    cardW,
    twoColCardW,
    cardWInContainer,
    tabBarSide,
    logoW,
    fontSize,
  };
}
