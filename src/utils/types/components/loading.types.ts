import type { DimensionValue } from 'react-native';

export interface BoneProps {
  w: DimensionValue;
  h: number;
  r?: number;
}

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}
