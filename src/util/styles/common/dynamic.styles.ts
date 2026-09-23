import type { Animated } from 'react-native';
import type { PlanStyle } from '../../types/new-ad.types';

export const bgColor = (backgroundColor: string) => ({ backgroundColor });
export const textColor = (color: string) => ({ color });
export const tint = (color: string) => ({ backgroundColor: color + '18' });
export const bottomOffset = (bottom: number) => ({ bottom });
export const spacerHeight = (height: number) => ({ height });
export const fixedWidth = (width: number) => ({ width });
export const scaleTransform = (scale: Animated.Value | Animated.AnimatedInterpolation<number>) => ({
  transform: [{ scale }],
});
export const progressWidth = (ratio: number) => ({
  width: `${Math.min(ratio * 100, 100)}%` as `${number}%`,
});
export const planCardSelected = (ps: PlanStyle) => ({ borderColor: ps.color, borderWidth: 2, backgroundColor: ps.bg });
export const planRadioSelected = (ps: PlanStyle) => ({ borderColor: ps.color, backgroundColor: ps.color });
