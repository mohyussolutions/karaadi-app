import type { Animated, DimensionValue } from 'react-native';
import type { AnimatedNumber, AnimatedOrNumber, AnimatedScale, PlanStyle } from '../../types';

export const bgColor = (backgroundColor: string) => ({ backgroundColor });
export const textColor = (color: string) => ({ color });
export const tint = (color: string) => ({ backgroundColor: color + '18' });
export const bottomOffset = (bottom: number) => ({ bottom });
export const spacerHeight = (height: number) => ({ height });
export const fixedWidth = (width: number) => ({ width });
export const scaleTransform = (scale: AnimatedScale) => ({
  transform: [{ scale }],
});
export const progressWidth = (ratio: number) => ({
  width: `${Math.min(ratio * 100, 100)}%` as `${number}%`,
});
export const planCardSelected = (ps: PlanStyle) => ({ borderColor: ps.color, borderWidth: 2, backgroundColor: ps.bg });
export const planRadioSelected = (ps: PlanStyle) => ({ borderColor: ps.color, backgroundColor: ps.color });
export const paddingTopOf = (paddingTop: number) => ({ paddingTop });
export const paddingBottomOf = (paddingBottom: number) => ({ paddingBottom });
export const marginBottomOf = (marginBottom: number) => ({ marginBottom });
export const topOf = (top: number) => ({ top });
export const fixedSize = (width: DimensionValue, height: DimensionValue) => ({ width, height });
export const opacityOf = (opacity: AnimatedOrNumber) => ({ opacity });
export const aspectRatioOf = (aspectRatio: number) => ({ aspectRatio });
export const edgeInset = (side: number) => ({ left: side, right: side });
export const translateXY = (x: Animated.Value, y: Animated.Value) => ({ transform: [{ translateX: x }, { translateY: y }] });
export const gridCellPadding = (index: number, columns: number, edgePadding: number, gap: number) => ({
  paddingLeft: index % columns === 0 ? edgePadding : gap / 2,
  paddingRight: (index + 1) % columns === 0 ? edgePadding : gap / 2,
  paddingBottom: gap,
});
export const translateYOf = (translateY: Animated.Value) => ({ transform: [{ translateY }] });
export const radiusOf = (borderRadius: number) => ({ borderRadius });
export const outlinedTint = (color: string) => ({ backgroundColor: color + '20', borderColor: color });
export const animatedLabelPosition = (
  top: AnimatedNumber,
  fontSize: AnimatedNumber,
) => ({ top, fontSize });
export const fill = { flex: 1 } as const;
