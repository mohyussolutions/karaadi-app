import { Platform, type ViewStyle } from 'react-native';
import type { ShadowParams } from './types/shadow.types';

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((ch) => ch + ch).join('');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function shadow({ color, offset = { width: 0, height: 0 }, opacity, radius, elevation }: ShadowParams): ViewStyle {
  if (Platform.OS === 'web') {
    return { boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${hexToRgba(color, opacity)}` };
  }
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
